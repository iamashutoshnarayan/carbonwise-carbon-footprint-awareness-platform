/**
 * Carbon footprint calculation engine.
 * All emission factors expressed in kg CO2e.
 * Sources: EPA, IPCC, OurWorldInData (approximate consensus values).
 */

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric" | "none";
export type CookingFuel = "gas" | "electric" | "induction" | "wood";
export type DietType = "vegan" | "vegetarian" | "mixed" | "meat_heavy";
export type Frequency = "never" | "low" | "medium" | "high";

export interface CarbonInput {
  // Transport (per day / per year)
  carKmPerDay: number;
  fuelType: FuelType;
  publicTransportKmPerDay: number;
  flightsPerYear: number;
  // Home (monthly)
  electricityKwhPerMonth: number;
  renewableSharePct: number; // 0-100
  cookingFuel: CookingFuel;
  // Food
  diet: DietType;
  // Lifestyle
  shoppingFrequency: Frequency;
  wasteLevel: Frequency;
  recyclingHabit: Frequency;
}

export interface CategoryEmissions {
  transport: number;
  home: number;
  food: number;
  lifestyle: number;
}

export interface CarbonResult {
  monthlyKg: number;
  annualKg: number;
  byCategory: CategoryEmissions; // annual
  ecoScore: number; // 0-100
  rating: "Excellent" | "Good" | "Average" | "High" | "Critical";
  equivalents: {
    treesNeeded: number;
    kmDriven: number;
    householdsPowered: number;
  };
}

const FUEL_FACTOR: Record<FuelType, number> = {
  petrol: 0.192,
  diesel: 0.171,
  hybrid: 0.11,
  electric: 0.05,
  none: 0,
};

const COOK_FACTOR: Record<CookingFuel, number> = {
  gas: 45,
  electric: 30,
  induction: 22,
  wood: 60,
};

const DIET_ANNUAL: Record<DietType, number> = {
  vegan: 1100,
  vegetarian: 1700,
  mixed: 2500,
  meat_heavy: 3600,
};

const FREQ_FACTOR: Record<Frequency, number> = {
  never: 0,
  low: 1,
  medium: 2.2,
  high: 3.6,
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function calculateCarbon(input: CarbonInput): CarbonResult {
  // Transport (annual)
  const carAnnual =
    input.carKmPerDay * 365 * FUEL_FACTOR[input.fuelType];
  const ptAnnual = input.publicTransportKmPerDay * 365 * 0.04;
  const flightAnnual = input.flightsPerYear * 250; // avg short-haul
  const transport = carAnnual + ptAnnual + flightAnnual;

  // Home (annual)
  const gridFactor = 0.42; // kg CO2 / kWh global average
  const renewable = clamp(input.renewableSharePct, 0, 100) / 100;
  const elecAnnual =
    input.electricityKwhPerMonth * 12 * gridFactor * (1 - renewable);
  const cookingAnnual = COOK_FACTOR[input.cookingFuel] * 12;
  const home = elecAnnual + cookingAnnual;

  // Food (annual)
  const food = DIET_ANNUAL[input.diet];

  // Lifestyle (annual): shopping + waste, reduced by recycling habits
  const shopping = FREQ_FACTOR[input.shoppingFrequency] * 180;
  const waste = FREQ_FACTOR[input.wasteLevel] * 140;
  const recyclingOffset = FREQ_FACTOR[input.recyclingHabit] * 60;
  const lifestyle = Math.max(0, shopping + waste - recyclingOffset);

  const annualKg = transport + home + food + lifestyle;
  const monthlyKg = annualKg / 12;

  // Eco score: 100 = ~1000kg/yr ideal, 0 = ~12000kg/yr
  const ecoScore = Math.round(
    clamp(100 - ((annualKg - 1000) / 110), 0, 100)
  );

  const rating: CarbonResult["rating"] =
    ecoScore >= 80
      ? "Excellent"
      : ecoScore >= 60
        ? "Good"
        : ecoScore >= 40
          ? "Average"
          : ecoScore >= 20
            ? "High"
            : "Critical";

  return {
    monthlyKg: Math.round(monthlyKg),
    annualKg: Math.round(annualKg),
    byCategory: {
      transport: Math.round(transport),
      home: Math.round(home),
      food: Math.round(food),
      lifestyle: Math.round(lifestyle),
    },
    ecoScore,
    rating,
    equivalents: {
      treesNeeded: Math.round(annualKg / 21), // ~21kg CO2/tree/yr
      kmDriven: Math.round(annualKg / 0.192),
      householdsPowered: +(annualKg / 4000).toFixed(2),
    },
  };
}

export const defaultInput: CarbonInput = {
  carKmPerDay: 20,
  fuelType: "petrol",
  publicTransportKmPerDay: 5,
  flightsPerYear: 2,
  electricityKwhPerMonth: 300,
  renewableSharePct: 10,
  cookingFuel: "gas",
  diet: "mixed",
  shoppingFrequency: "medium",
  wasteLevel: "medium",
  recyclingHabit: "low",
};
