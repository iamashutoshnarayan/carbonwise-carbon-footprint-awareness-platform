import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { EcoScoreGauge } from "@/components/EcoScoreGauge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { ArrowDownRight, ArrowUpRight, Leaf, Trees, Zap } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CarbonWise" },
      {
        name: "description",
        content:
          "Track your carbon footprint trends, category breakdown, and sustainability score over time.",
      },
    ],
  }),
  component: DashboardPage,
});

const COLORS = ["var(--leaf)", "var(--ocean)", "var(--sand)", "var(--accent)"];

function DashboardPage() {
  const { result, history } = useCarbonData();

  const trend = useMemo(
    () =>
      history.map((h, i) => ({
        idx: i + 1,
        date: new Date(h.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        monthly: h.monthlyKg,
        score: h.ecoScore,
      })),
    [history],
  );

  const previous = history[history.length - 2];
  const current = history[history.length - 1];
  const delta =
    previous && current
      ? ((current.monthlyKg - previous.monthlyKg) / previous.monthlyKg) * 100
      : 0;

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <PageHeader
          title="Your dashboard is waiting"
          description="Run the calculator to start tracking your carbon footprint."
        />
        <Button asChild size="lg">
          <Link to="/calculator">Start calculator</Link>
        </Button>
      </div>
    );
  }

  const pieData = [
    { name: "Transport", value: result.byCategory.transport },
    { name: "Home", value: result.byCategory.home },
    { name: "Food", value: result.byCategory.food },
    { name: "Lifestyle", value: result.byCategory.lifestyle },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Your impact"
        title="Carbon dashboard"
        description="A clear view of your emissions, trends, and progress."
      >
        <Button asChild variant="outline">
          <Link to="/calculator">Update inputs</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Annual CO₂"
          value={`${result.annualKg.toLocaleString()} kg`}
          icon={Leaf}
        />
        <KpiCard
          title="Monthly CO₂"
          value={`${result.monthlyKg.toLocaleString()} kg`}
          icon={Zap}
          trend={delta}
        />
        <KpiCard
          title="Trees needed"
          value={`${result.equivalents.treesNeeded}`}
          icon={Trees}
        />
        <KpiCard
          title="Eco score"
          value={`${result.ecoScore} / 100`}
          icon={Leaf}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Emissions trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend.length ? trend : []}>
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="monthly"
                  stroke="var(--leaf)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Monthly kg CO₂"
                />
              </LineChart>
            </ResponsiveContainer>
            {!trend.length && (
              <p className="-mt-40 text-center text-sm text-muted-foreground">
                Save more entries to see your trend build up.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <EcoScoreGauge score={result.ecoScore} label={result.rating} />
            <p className="text-center text-sm text-muted-foreground">
              You’re rated <strong>{result.rating}</strong>. Keep going — every
              kilogram counts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Emissions by category (annual kg)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={pieData}>
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Impact equivalents</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Equivalent
            label="Trees needed to offset"
            value={`${result.equivalents.treesNeeded} trees`}
          />
          <Equivalent
            label="Equivalent to driving"
            value={`${result.equivalents.kmDriven.toLocaleString()} km`}
          />
          <Equivalent
            label="Households powered for a year"
            value={`${result.equivalents.householdsPowered}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 font-display text-2xl font-bold">{value}</p>
        {trend !== undefined && trend !== 0 && (
          <p
            className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
              trend < 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {trend < 0 ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
            {Math.abs(trend).toFixed(1)}% vs previous
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Equivalent({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
    </div>
  );
}
