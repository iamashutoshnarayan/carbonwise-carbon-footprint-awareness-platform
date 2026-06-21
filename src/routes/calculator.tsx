import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/PageHeader";
import { EcoScoreGauge } from "@/components/EcoScoreGauge";
import {
  calculateCarbon,
  defaultInput,
  type CarbonInput,
} from "@/lib/carbon-engine";
import { useCarbonData } from "@/hooks/use-carbon-data";
import { Car, Flame, Leaf, Sparkles, Utensils } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Calculator — CarbonWise" },
      {
        name: "description",
        content:
          "Estimate your personal carbon footprint in two minutes with our science-backed calculator.",
      },
    ],
  }),
  component: CalculatorPage,
});

const schema = z.object({
  carKmPerDay: z.coerce.number().min(0).max(1000),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "none"]),
  publicTransportKmPerDay: z.coerce.number().min(0).max(500),
  flightsPerYear: z.coerce.number().min(0).max(200),
  electricityKwhPerMonth: z.coerce.number().min(0).max(10000),
  renewableSharePct: z.coerce.number().min(0).max(100),
  cookingFuel: z.enum(["gas", "electric", "induction", "wood"]),
  diet: z.enum(["vegan", "vegetarian", "mixed", "meat_heavy"]),
  shoppingFrequency: z.enum(["never", "low", "medium", "high"]),
  wasteLevel: z.enum(["never", "low", "medium", "high"]),
  recyclingHabit: z.enum(["never", "low", "medium", "high"]),
});

type FormValues = z.infer<typeof schema>;

function CalculatorPage() {
  const navigate = useNavigate();
  const { input, saveInput } = useCarbonData();
  const [live, setLive] = useState<CarbonInput>(input ?? defaultInput);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: input ?? defaultInput,
    mode: "onChange",
  });

  // live preview
  form.watch((vals) => {
    const parsed = schema.safeParse(vals);
    if (parsed.success) setLive(parsed.data);
  });

  const livePreview = useMemo(() => calculateCarbon(live), [live]);

  const onSubmit = (vals: FormValues) => {
    saveInput(vals);
    toast.success("Footprint saved", {
      description: `${vals && livePreview.annualKg} kg CO₂/year recorded.`,
    });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Your carbon footprint calculator"
        description="Answer a few quick questions. Results update live as you type."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <SectionCard
            icon={Car}
            title="Transportation"
            description="How you move around day to day."
          >
            <Field
              label="Daily car distance (km)"
              error={form.formState.errors.carKmPerDay?.message}
            >
              <Input
                type="number"
                min={0}
                {...form.register("carKmPerDay")}
                aria-invalid={!!form.formState.errors.carKmPerDay}
              />
            </Field>
            <Field label="Fuel type">
              <Controlled
                name="fuelType"
                form={form}
                options={[
                  ["petrol", "Petrol"],
                  ["diesel", "Diesel"],
                  ["hybrid", "Hybrid"],
                  ["electric", "Electric"],
                  ["none", "No car"],
                ]}
              />
            </Field>
            <Field label="Daily public transport (km)">
              <Input
                type="number"
                min={0}
                {...form.register("publicTransportKmPerDay")}
              />
            </Field>
            <Field label="Flights per year">
              <Input
                type="number"
                min={0}
                {...form.register("flightsPerYear")}
              />
            </Field>
          </SectionCard>

          <SectionCard
            icon={Flame}
            title="Home energy"
            description="Electricity and cooking habits at home."
          >
            <Field label="Monthly electricity (kWh)">
              <Input
                type="number"
                min={0}
                {...form.register("electricityKwhPerMonth")}
              />
            </Field>
            <Field
              label={`Renewable energy share: ${form.watch("renewableSharePct")}%`}
            >
              <Slider
                value={[Number(form.watch("renewableSharePct") ?? 0)]}
                max={100}
                step={5}
                onValueChange={(v) =>
                  form.setValue("renewableSharePct", v[0], {
                    shouldValidate: true,
                  })
                }
                aria-label="Renewable energy share percent"
              />
            </Field>
            <Field label="Cooking fuel">
              <Controlled
                name="cookingFuel"
                form={form}
                options={[
                  ["gas", "Natural gas"],
                  ["electric", "Electric"],
                  ["induction", "Induction"],
                  ["wood", "Wood / biomass"],
                ]}
              />
            </Field>
          </SectionCard>

          <SectionCard
            icon={Utensils}
            title="Food habits"
            description="Diet is one of the biggest levers."
          >
            <Field label="Diet type">
              <Controlled
                name="diet"
                form={form}
                options={[
                  ["vegan", "Vegan"],
                  ["vegetarian", "Vegetarian"],
                  ["mixed", "Mixed (occasional meat)"],
                  ["meat_heavy", "Meat-heavy"],
                ]}
              />
            </Field>
          </SectionCard>

          <SectionCard
            icon={Sparkles}
            title="Lifestyle"
            description="Shopping, waste, and recycling habits."
          >
            <Field label="Online shopping frequency">
              <Controlled
                name="shoppingFrequency"
                form={form}
                options={freqOptions}
              />
            </Field>
            <Field label="Waste generation">
              <Controlled
                name="wasteLevel"
                form={form}
                options={freqOptions}
              />
            </Field>
            <Field label="Recycling habits">
              <Controlled
                name="recyclingHabit"
                form={form}
                options={freqOptions}
              />
            </Field>
          </SectionCard>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Save & view dashboard
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => form.reset(defaultInput)}
            >
              Reset to defaults
            </Button>
          </div>
        </form>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" /> Live estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <EcoScoreGauge
                score={livePreview.ecoScore}
                label={livePreview.rating}
              />
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Annual" value={`${livePreview.annualKg} kg`} />
                <Stat label="Monthly" value={`${livePreview.monthlyKg} kg`} />
                <Stat
                  label="Trees needed"
                  value={`${livePreview.equivalents.treesNeeded}`}
                />
                <Stat
                  label="≈ km driven"
                  value={livePreview.equivalents.kmDriven.toLocaleString()}
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

const freqOptions: [string, string][] = [
  ["never", "Never"],
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
];

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-eco text-primary-foreground">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div id={id}>{children}</div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Controlled({
  name,
  form,
  options,
}: {
  name: keyof FormValues;
  form: ReturnType<typeof useForm<FormValues>>;
  options: [string, string][];
}) {
  const value = form.watch(name) as string;
  return (
    <Select
      value={value}
      onValueChange={(v) =>
        form.setValue(name, v as never, { shouldValidate: true })
      }
    >
      <SelectTrigger aria-label={String(name)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
