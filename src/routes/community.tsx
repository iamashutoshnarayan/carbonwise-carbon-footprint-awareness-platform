import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe2, Leaf, TrendingUp, Trophy } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Impact — CarbonWise" },
      {
        name: "description",
        content:
          "See how the CarbonWise community is reducing emissions together. Leaderboards and global metrics.",
      },
    ],
  }),
  component: CommunityPage,
});

const leaderboard = [
  { name: "Aisha N.", saved: 2840, score: 91 },
  { name: "Diego M.", saved: 2510, score: 88 },
  { name: "Yuki T.", saved: 2305, score: 86 },
  { name: "Liam O.", saved: 2110, score: 84 },
  { name: "Fatima H.", saved: 1985, score: 82 },
  { name: "Noah S.", saved: 1820, score: 80 },
  { name: "Priya R.", saved: 1690, score: 78 },
  { name: "Ana B.", saved: 1502, score: 76 },
];

const metrics = [
  { label: "Total CO₂ avoided", value: "12,480 t", icon: Leaf },
  { label: "Active members", value: "48,210", icon: Globe2 },
  { label: "Trees-equivalent", value: "594k", icon: TrendingUp },
  { label: "Challenges completed", value: "112,304", icon: Trophy },
];

const facts = [
  "A single mature tree absorbs about 21 kg of CO₂ per year.",
  "Switching one round-trip flight for rail can save 200–400 kg CO₂.",
  "Composting halves the climate impact of household food waste.",
  "Heat pumps move 3–4× more energy than they consume.",
];

function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Together we’re bigger"
        title="Community impact"
        description="Live (mock) view of what CarbonWise members are achieving collectively."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-eco text-primary-foreground">
                <m.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top reducers this month</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {leaderboard.map((u, i) => (
                <li
                  key={u.name}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-secondary/50 p-3"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                      i === 0
                        ? "gradient-eco text-primary-foreground"
                        : "bg-card text-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate font-medium">{u.name}</span>
                  <Badge variant="outline">Score {u.score}</Badge>
                  <span className="font-display text-sm font-bold text-primary">
                    −{u.saved.toLocaleString()} kg
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Did you know?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {facts.map((f) => (
                <li
                  key={f}
                  className="flex gap-2 rounded-lg bg-secondary/50 p-3 text-sm"
                >
                  <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
