import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/PageHeader";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { generateRecommendations } from "@/lib/recommendations";
import { calculateCarbon } from "@/lib/carbon-engine";
import { Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations & Simulator — CarbonWise" },
      {
        name: "description",
        content:
          "Personalized actions to cut your carbon footprint plus a what-if simulator.",
      },
    ],
  }),
  component: RecsPage,
});

function RecsPage() {
  const { input, result } = useCarbonData();
  const recs = useMemo(
    () => (input && result ? generateRecommendations(input, result) : []),
    [input, result],
  );

  // Simulator
  const [carPct, setCarPct] = useState(0);
  const [renewPct, setRenewPct] = useState(0);
  const [diet, setDiet] = useState(0); // 0..2 shift

  const simResult = useMemo(() => {
    if (!input) return null;
    const next = { ...input };
    next.carKmPerDay = Math.max(0, input.carKmPerDay * (1 - carPct / 100));
    next.renewableSharePct = Math.min(100, input.renewableSharePct + renewPct);
    const diets = ["meat_heavy", "mixed", "vegetarian", "vegan"] as const;
    const currentIdx = diets.indexOf(input.diet);
    const newIdx = Math.min(diets.length - 1, currentIdx + diet);
    next.diet = diets[newIdx];
    return calculateCarbon(next);
  }, [input, carPct, renewPct, diet]);

  const totalSavings = recs.reduce((s, r) => s + r.estimatedSavingsKg, 0);

  if (!input || !result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <PageHeader
          title="No insights yet"
          description="Run the calculator first to receive personalized recommendations."
        />
        <Button asChild size="lg">
          <Link to="/calculator">Go to calculator</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Smart insights"
        title="Personalized recommendations"
        description="Ranked by climate impact. Start with one — small wins compound."
      >
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-primary">
          <p className="text-xs">Potential annual savings</p>
          <p className="font-display text-xl font-bold">
            {totalSavings.toLocaleString()} kg CO₂
          </p>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          {recs.map((r) => (
            <Card key={r.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{r.title}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {r.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {r.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge
                        className={
                          r.impact === "High"
                            ? "bg-primary text-primary-foreground"
                            : r.impact === "Medium"
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-secondary-foreground"
                        }
                      >
                        Impact: {r.impact}
                      </Badge>
                      <Badge variant="outline">
                        Difficulty: {r.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Save / yr</p>
                    <p className="font-display text-lg font-bold text-primary">
                      −{r.estimatedSavingsKg} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {recs.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                You’re already doing great. Keep your habits up!
              </CardContent>
            </Card>
          )}
        </div>

        {/* Simulator */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> What-if simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SliderRow
              label={`Reduce car distance by ${carPct}%`}
              value={carPct}
              onChange={setCarPct}
            />
            <SliderRow
              label={`Add ${renewPct}% renewable energy`}
              value={renewPct}
              onChange={setRenewPct}
            />
            <div>
              <p className="mb-2 text-sm">
                Shift diet by{" "}
                <span className="font-semibold">{diet} step{diet === 1 ? "" : "s"}</span>{" "}
                toward plant-based
              </p>
              <Slider
                value={[diet]}
                max={3}
                step={1}
                onValueChange={(v) => setDiet(v[0])}
                aria-label="Diet shift"
              />
            </div>
            <div className="rounded-xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Projected annual</p>
              <p className="font-display text-2xl font-bold">
                {simResult?.annualKg.toLocaleString()} kg
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                <TrendingDown className="h-3 w-3" />
                {Math.max(
                  0,
                  result.annualKg - (simResult?.annualKg ?? 0),
                ).toLocaleString()}{" "}
                kg saved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm">{label}</p>
      <Slider
        value={[value]}
        max={100}
        step={5}
        onValueChange={(v) => onChange(v[0])}
        aria-label={label}
      />
    </div>
  );
}
