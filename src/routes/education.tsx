import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search } from "lucide-react";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Learn — CarbonWise" },
      {
        name: "description",
        content:
          "Climate basics, sustainable living tips, green energy, and waste reduction guides.",
      },
    ],
  }),
  component: EducationPage,
});

const topics = [
  {
    id: "what",
    title: "What is a carbon footprint?",
    summary:
      "The total greenhouse gases emitted by your activities, measured in kg CO₂ equivalent.",
    body: "A carbon footprint accounts for direct emissions (your car, your stove) and indirect emissions (the energy used to grow your food, ship your packages, and power the servers behind this page). It’s usually expressed in kilograms or tonnes of CO₂-equivalent (CO₂e) so different gases — methane, nitrous oxide — can be compared on a single scale.",
  },
  {
    id: "climate",
    title: "Climate change basics",
    summary:
      "Greenhouse gases trap heat. More gases = warmer planet = disrupted systems.",
    body: "Burning fossil fuels releases CO₂ that stays in the atmosphere for centuries. The resulting warming intensifies storms, raises sea levels, shifts agricultural zones, and stresses ecosystems. Limiting warming to 1.5 °C requires roughly halving global emissions by 2030.",
  },
  {
    id: "living",
    title: "Sustainable living tips",
    summary: "The four biggest household levers: transport, home, food, stuff.",
    body: "Choose lower-carbon transport (transit, cycling, EVs). Electrify your home and switch to renewable electricity. Eat more plants. Buy less, repair more. Each switch compounds; you do not need to do all of them at once.",
  },
  {
    id: "energy",
    title: "Green energy 101",
    summary: "Renewables now power the cheapest new electricity in most markets.",
    body: "Solar and wind have crossed below fossil generation on price in most regions. Look for green tariffs from your utility, community solar programs, or rooftop solar with battery storage. Heat pumps are 2–4× more efficient than gas furnaces and now work down to extreme cold.",
  },
  {
    id: "waste",
    title: "Waste reduction",
    summary: "Refuse, reduce, reuse — recycle is the last resort.",
    body: "Single-use plastics, fast fashion, and food waste are the biggest household waste streams. Composting food scraps cuts methane from landfills. Buying secondhand or durable goods extends product life. Sorting recyclables correctly avoids contamination that sends loads to landfill.",
  },
  {
    id: "diet",
    title: "Food & diet",
    summary: "Beef and lamb have ~10× the footprint of chicken or beans.",
    body: "Shifting even a few meals per week to plant-based meals meaningfully reduces emissions, land use, and water use. Local and seasonal helps, but the type of food matters far more than its travel distance.",
  },
];

function EducationPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q.toLowerCase()) ||
          t.body.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Education hub"
        title="Learn the climate basics"
        description="Bite-sized articles to build your sustainability fluency."
      />

      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics…"
          className="pl-9"
          aria-label="Search topics"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-eco text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.summary}
                  </p>
                </div>
              </div>
              <Accordion type="single" collapsible className="mt-3">
                <AccordionItem value="more" className="border-none">
                  <AccordionTrigger className="py-1 text-sm">
                    Read more
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {t.body}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No topics match “{q}”.
          </p>
        )}
      </div>
    </div>
  );
}
