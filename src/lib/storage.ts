import { applyDailyResult, createInitialStats } from "./game";
import type { DailyResult, PlayerStats } from "./types";

const STORAGE_KEY = "radius-wtf:stats:v1";

/**
 * Persistence boundary for player stats. Today this is backed by localStorage
 * only (no login). A future SupabaseAdapter can implement this same interface
 * once accounts exist, selected by a factory based on auth state — game logic
 * in lib/game.ts never needs to change.
 */
export interface StatsStorage {
  getStats(): PlayerStats;
  hasPlayedToday(dateStr: string): boolean;
  saveDailyResult(result: DailyResult): PlayerStats;
}

export class LocalStorageAdapter implements StatsStorage {
  getStats(): PlayerStats {
    if (typeof window === "undefined") return createInitialStats();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialStats();
    try {
      const parsed = JSON.parse(raw) as PlayerStats;
      if (parsed.version !== 1) return createInitialStats();
      return parsed;
    } catch {
      return createInitialStats();
    }
  }

  hasPlayedToday(dateStr: string): boolean {
    return Boolean(this.getStats().history[dateStr]);
  }

  saveDailyResult(result: DailyResult): PlayerStats {
    const next = applyDailyResult(this.getStats(), result);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  }
}

export function getStorageAdapter(): StatsStorage {
  return new LocalStorageAdapter();
}
