import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateCarbon,
  defaultInput,
  type CarbonInput,
  type CarbonResult,
} from "@/lib/carbon-engine";
import { storage, type HistoryEntry } from "@/lib/storage";

export function useCarbonData() {
  const [input, setInputState] = useState<CarbonInput | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setInputState(storage.getInput());
    setHistory(storage.getHistory());
  }, []);

  const result: CarbonResult | null = useMemo(
    () => (input ? calculateCarbon(input) : null),
    [input],
  );

  const saveInput = useCallback((next: CarbonInput) => {
    storage.setInput(next);
    setInputState(next);
    const r = calculateCarbon(next);
    const entry: HistoryEntry = {
      date: new Date().toISOString(),
      monthlyKg: r.monthlyKg,
      annualKg: r.annualKg,
      ecoScore: r.ecoScore,
      byCategory: r.byCategory,
    };
    storage.pushHistory(entry);
    setHistory(storage.getHistory());
  }, []);

  return { input, result, history, saveInput, defaultInput };
}
