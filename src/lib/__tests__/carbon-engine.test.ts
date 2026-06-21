/**
 * Example unit tests for the carbon calculation engine.
 * Run with: bunx vitest run
 */
import { describe, it, expect } from "vitest";
import { calculateCarbon, defaultInput } from "../carbon-engine";

describe("calculateCarbon", () => {
  it("returns zero-ish values for a zero-impact lifestyle", () => {
    const r = calculateCarbon({
      ...defaultInput,
      carKmPerDay: 0,
      fuelType: "none",
      publicTransportKmPerDay: 0,
      flightsPerYear: 0,
      electricityKwhPerMonth: 0,
      renewableSharePct: 100,
      cookingFuel: "induction",
      diet: "vegan",
      shoppingFrequency: "never",
      wasteLevel: "never",
      recyclingHabit: "high",
    });
    expect(r.annualKg).toBeLessThan(1600);
    expect(r.ecoScore).toBeGreaterThan(80);
    expect(r.rating).toMatch(/Excellent|Good/);
  });

  it("scales transport with daily distance", () => {
    const low = calculateCarbon({ ...defaultInput, carKmPerDay: 5 });
    const high = calculateCarbon({ ...defaultInput, carKmPerDay: 100 });
    expect(high.byCategory.transport).toBeGreaterThan(
      low.byCategory.transport,
    );
  });

  it("rewards renewable energy share", () => {
    const dirty = calculateCarbon({ ...defaultInput, renewableSharePct: 0 });
    const clean = calculateCarbon({ ...defaultInput, renewableSharePct: 100 });
    expect(clean.byCategory.home).toBeLessThan(dirty.byCategory.home);
  });

  it("clamps eco score between 0 and 100", () => {
    const extreme = calculateCarbon({
      ...defaultInput,
      carKmPerDay: 500,
      flightsPerYear: 50,
      electricityKwhPerMonth: 5000,
      diet: "meat_heavy",
    });
    expect(extreme.ecoScore).toBeGreaterThanOrEqual(0);
    expect(extreme.ecoScore).toBeLessThanOrEqual(100);
  });

  it("produces consistent monthly = annual / 12", () => {
    const r = calculateCarbon(defaultInput);
    expect(Math.abs(r.monthlyKg - r.annualKg / 12)).toBeLessThan(2);
  });
});
