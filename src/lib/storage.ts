import type { CarbonInput, CarbonResult } from "./carbon-engine";

const KEY_HISTORY = "carbonwise.history.v1";
const KEY_INPUT = "carbonwise.input.v1";
const KEY_GOALS = "carbonwise.goals.v1";
const KEY_CHALLENGES = "carbonwise.challenges.v1";

export interface HistoryEntry {
  date: string; // ISO
  monthlyKg: number;
  annualKg: number;
  ecoScore: number;
  byCategory: CarbonResult["byCategory"];
}

export interface Goal {
  id: string;
  title: string;
  targetReductionPct: number;
  baselineKg: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  streak: number;
  completed: boolean;
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — ignore */
  }
}

export const storage = {
  getInput: () => safeRead<CarbonInput | null>(KEY_INPUT, null),
  setInput: (v: CarbonInput) => safeWrite(KEY_INPUT, v),

  getHistory: () => safeRead<HistoryEntry[]>(KEY_HISTORY, []),
  pushHistory: (entry: HistoryEntry) => {
    const hist = safeRead<HistoryEntry[]>(KEY_HISTORY, []);
    hist.push(entry);
    safeWrite(KEY_HISTORY, hist.slice(-60));
  },
  clearHistory: () => safeWrite(KEY_HISTORY, []),

  getGoals: () => safeRead<Goal[]>(KEY_GOALS, []),
  setGoals: (g: Goal[]) => safeWrite(KEY_GOALS, g),

  getChallenges: () => safeRead<Challenge[]>(KEY_CHALLENGES, []),
  setChallenges: (c: Challenge[]) => safeWrite(KEY_CHALLENGES, c),
};
