import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Globe2,
  Leaf,
  Sparkles,
  Target,
  TreePine,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarbonWise — Personal carbon footprint, made simple" },
      {
        name: "description",
        content:
          "Calculate, visualize, and reduce your carbon footprint with personalized insights and challenges.",
      },
    ],
  }),
  component: Landing,
});

const stats = [
  { label: "Global CO₂ emitted per year", value: "37 Gt" },
  { label: "Avg. footprint per person", value: "4.8 t" },
  { label: "Reduction needed by 2030", value: "45%" },
  { label: "Trees to offset 1 ton", value: "~48" },
];

const benefits = [
  {
    icon: Calculator,
    title: "Science-backed calculator",
    body: "Weighted model using EPA & IPCC factors across transport, home, food, and lifestyle.",
  },
  {
    icon: BarChart3,
    title: "Beautiful dashboard",
    body: "Track trends, compare weeks, and see exactly where your emissions come from.",
  },
  {
    icon: Sparkles,
    title: "Personalized insights",
    body: "Smart recommendations ranked by impact, difficulty, and projected savings.",
  },
  {
    icon: Target,
    title: "Goals & challenges",
    body: "Set reduction targets, build streaks, and earn badges for sustainable habits.",
  },
];

const steps = [
  {
    n: "01",
    title: "Estimate",
    body: "Answer a 2-minute questionnaire about your daily life.",
  },
  {
    n: "02",
    title: "Understand",
    body: "Get a clear breakdown of your annual CO₂ and eco score.",
  },
  {
    n: "03",
    title: "Act",
    body: "Follow tailored recommendations and track your progress.",
  },
];

const testimonials = [
  {
    quote:
      "Finally a tool that doesn’t guilt-trip you. CarbonWise gave me a clear plan and I’ve cut 1.2 tons already.",
    name: "Maya R.",
    role: "Product designer",
  },
  {
    quote:
      "The dashboard is gorgeous. I check my eco score the way I used to check my step count.",
    name: "Jordan K.",
    role: "Software engineer",
  },
  {
    quote:
      "Our family did the plant-based week challenge together. Easiest behavior change we’ve made.",
    name: "Priya S.",
    role: "Teacher",
  },
];

function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Leaf className="h-3.5 w-3.5" /> Climate action, made personal
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Know your <span className="text-gradient-eco">carbon footprint</span>.
              Then shrink it.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              CarbonWise turns your daily habits into a clear emissions
              picture — and gives you the smallest, most powerful steps to cut
              them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/calculator">
                  Calculate my footprint <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/education">How it works</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero illustration */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] gradient-eco opacity-90" />
              <div className="absolute inset-2 rounded-[2.2rem] bg-card/95 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg gradient-eco text-primary-foreground">
                      <Leaf className="h-4 w-4" />
                    </span>
                    <span className="font-display font-semibold">Your impact</span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    Live
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Annual CO₂
                  </p>
                  <p className="font-display text-5xl font-bold text-gradient-eco">
                    4.2 t
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    13% below average · Eco score 72
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { l: "Transport", v: 38, c: "var(--leaf)" },
                    { l: "Home", v: 24, c: "var(--ocean)" },
                    { l: "Food", v: 28, c: "var(--sand)" },
                    { l: "Lifestyle", v: 10, c: "var(--accent)" },
                  ].map((b) => (
                    <div key={b.l}>
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>{b.l}</span>
                        <span>{b.v}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${b.v}%`, background: b.c }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-float absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl bg-card p-3 shadow-xl ring-1 ring-border">
                <TreePine className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <p className="font-semibold">+12 trees saved</p>
                  <p className="text-muted-foreground">this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to a lower footprint
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="font-display text-3xl font-bold text-gradient-eco">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-end gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Built for real change
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to act on climate
              </h2>
            </div>
            <p className="text-muted-foreground">
              We combine clean data, calm design, and behavioral science so
              sustainability stops feeling overwhelming.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-eco text-primary-foreground">
                  <b.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Trusted by climate-curious people
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Real changes, real numbers
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <blockquote className="text-sm leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full gradient-eco text-sm font-bold text-primary-foreground">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl gradient-eco p-10 text-primary-foreground sm:p-14">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to see your impact?
              </h2>
              <p className="mt-3 max-w-md opacity-90">
                Two minutes to estimate. A lifetime to reduce. Start your
                CarbonWise journey today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link to="/calculator">
                  <Zap className="mr-2 h-4 w-4" /> Start calculator
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/community">
                  <Globe2 className="mr-2 h-4 w-4" /> See community impact
                </Link>
              </Button>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
            {["No signup needed", "100% private", "Science-backed"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
