import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { storage, type Challenge, type Goal } from "@/lib/storage";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { Award, Flame, Plus, Target, Trash2 } from "lucide-react";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Goals & Challenges — CarbonWise" },
      {
        name: "description",
        content:
          "Set carbon reduction goals, track progress, and complete sustainability challenges.",
      },
    ],
  }),
  component: GoalsPage,
});

const seedChallenges: Challenge[] = [
  {
    id: "ch-nocar",
    title: "No-car day",
    description: "Go a full day without using a personal car.",
    progress: 0,
    streak: 0,
    completed: false,
  },
  {
    id: "ch-plant",
    title: "Plant-based week",
    description: "Eat plant-based for 7 days straight.",
    progress: 0,
    streak: 0,
    completed: false,
  },
  {
    id: "ch-elec",
    title: "Cut 10% electricity",
    description: "Reduce monthly electricity use by 10%.",
    progress: 0,
    streak: 0,
    completed: false,
  },
  {
    id: "ch-recycle",
    title: "Recycle every day",
    description: "Sort and recycle waste every day for a week.",
    progress: 0,
    streak: 0,
    completed: false,
  },
];

function GoalsPage() {
  const { result } = useCarbonData();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(15);

  useEffect(() => {
    setGoals(storage.getGoals());
    const existing = storage.getChallenges();
    if (existing.length === 0) {
      storage.setChallenges(seedChallenges);
      setChallenges(seedChallenges);
    } else setChallenges(existing);
  }, []);

  const addGoal = () => {
    if (!title.trim() || !result) return;
    const g: Goal = {
      id: `g-${Date.now()}`,
      title: title.trim().slice(0, 80),
      targetReductionPct: Math.max(1, Math.min(90, Number(target) || 10)),
      baselineKg: result.annualKg,
      createdAt: new Date().toISOString(),
    };
    const next = [...goals, g];
    setGoals(next);
    storage.setGoals(next);
    setTitle("");
    toast.success("Goal added");
  };

  const removeGoal = (id: string) => {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    storage.setGoals(next);
  };

  const bump = (id: string) => {
    const next = challenges.map((c) =>
      c.id === id
        ? {
            ...c,
            progress: Math.min(100, c.progress + 20),
            streak: c.streak + 1,
            completed: c.progress + 20 >= 100,
          }
        : c,
    );
    setChallenges(next);
    storage.setChallenges(next);
    const found = next.find((c) => c.id === id);
    if (found?.completed) toast.success(`Challenge completed: ${found.title}!`);
  };

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Goals & gamification"
        title="Goals & challenges"
        description="Set targets, build streaks, and earn badges as you reduce your impact."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Create a goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="g-title">Goal title</Label>
              <Input
                id="g-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cut 20% by year-end"
                maxLength={80}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="g-target">Target reduction (%)</Label>
              <Input
                id="g-target"
                type="number"
                min={1}
                max={90}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </div>
            <Button onClick={addGoal} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Add goal
            </Button>
            {!result && (
              <p className="text-xs text-muted-foreground">
                Run the calculator first to anchor your baseline.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No goals yet. Add your first target on the left.
              </p>
            )}
            {goals.map((g) => {
              const targetKg = g.baselineKg * (1 - g.targetReductionPct / 100);
              const currentKg = result?.annualKg ?? g.baselineKg;
              const progress = Math.max(
                0,
                Math.min(
                  100,
                  ((g.baselineKg - currentKg) /
                    (g.baselineKg - targetKg || 1)) *
                    100,
                ),
              );
              return (
                <div key={g.id} className="rounded-xl border border-border p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{g.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Reduce from {g.baselineKg.toLocaleString()} →{" "}
                        {Math.round(targetKg).toLocaleString()} kg/yr (
                        {g.targetReductionPct}%)
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeGoal(g.id)}
                      aria-label="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3">
                    <Progress value={progress} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {progress.toFixed(0)}% to target
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
              <p className="font-display text-xl font-bold">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Total streak days</p>
              <p className="font-display text-xl font-bold">
                {challenges.reduce((s, c) => s + c.streak, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand/40 text-foreground">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Active goals</p>
              <p className="font-display text-xl font-bold">{goals.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">Sustainability challenges</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{c.title}</h3>
                    {c.completed && (
                      <Badge className="bg-primary text-primary-foreground">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  🔥 {c.streak}
                </Badge>
              </div>
              <div className="mt-4">
                <Progress value={c.progress} />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {c.progress}% complete
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => bump(c.id)}
                    disabled={c.completed}
                  >
                    Log a day
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
