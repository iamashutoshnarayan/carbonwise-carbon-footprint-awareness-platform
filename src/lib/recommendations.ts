import type { CarbonInput, CarbonResult } from "./carbon-engine";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "transport" | "home" | "food" | "lifestyle";
  impact: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Moderate" | "Hard";
  estimatedSavingsKg: number; // annual
}

export function generateRecommendations(
  input: CarbonInput,
  result: CarbonResult,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const { byCategory } = result;

  if (input.carKmPerDay > 15) {
    recs.push({
      id: "rec-car",
      title: "Cut solo car trips by 30%",
      description:
        "Combine errands, carpool, or shift short trips to walking and cycling.",
      category: "transport",
      impact: "High",
      difficulty: "Moderate",
      estimatedSavingsKg: Math.round(byCategory.transport * 0.18),
    });
  }
  if (input.fuelType === "petrol" || input.fuelType === "diesel") {
    recs.push({
      id: "rec-fuel",
      title: "Plan your next vehicle as hybrid or electric",
      description:
        "Switching fuel type can cut your transport emissions by up to 60%.",
      category: "transport",
      impact: "High",
      difficulty: "Hard",
      estimatedSavingsKg: Math.round(byCategory.transport * 0.4),
    });
  }
  if (input.flightsPerYear >= 2) {
    recs.push({
      id: "rec-flights",
      title: "Replace one flight with a train trip",
      description:
        "A single short-haul flight emits ~250 kg CO₂ — trains are 5–10× lower.",
      category: "transport",
      impact: "Medium",
      difficulty: "Easy",
      estimatedSavingsKg: 220,
    });
  }
  if (input.renewableSharePct < 50) {
    recs.push({
      id: "rec-renew",
      title: "Enroll in a green energy tariff",
      description:
        "Most utilities offer 100% renewable plans at a small premium.",
      category: "home",
      impact: "High",
      difficulty: "Easy",
      estimatedSavingsKg: Math.round(byCategory.home * 0.5),
    });
  }
  if (input.electricityKwhPerMonth > 250) {
    recs.push({
      id: "rec-elec",
      title: "Upgrade to LED bulbs and efficient appliances",
      description:
        "Energy-efficient hardware can trim 15–25% off your monthly bill.",
      category: "home",
      impact: "Medium",
      difficulty: "Easy",
      estimatedSavingsKg: Math.round(byCategory.home * 0.2),
    });
  }
  if (input.diet === "meat_heavy" || input.diet === "mixed") {
    recs.push({
      id: "rec-diet",
      title: "Try two plant-based days per week",
      description:
        "Beef has the highest footprint of any food — small swaps add up fast.",
      category: "food",
      impact: "High",
      difficulty: "Moderate",
      estimatedSavingsKg: Math.round(byCategory.food * 0.25),
    });
  }
  if (input.recyclingHabit !== "high") {
    recs.push({
      id: "rec-recycle",
      title: "Set up a 3-bin sorting system at home",
      description:
        "Consistent recycling reduces landfill methane and saves raw materials.",
      category: "lifestyle",
      impact: "Medium",
      difficulty: "Easy",
      estimatedSavingsKg: 120,
    });
  }
  if (input.shoppingFrequency === "high") {
    recs.push({
      id: "rec-shop",
      title: "Adopt a 24-hour rule for online purchases",
      description:
        "Pausing before checkout cuts impulse orders and packaging waste.",
      category: "lifestyle",
      impact: "Medium",
      difficulty: "Easy",
      estimatedSavingsKg: 150,
    });
  }

  return recs.sort((a, b) => b.estimatedSavingsKg - a.estimatedSavingsKg);
}
