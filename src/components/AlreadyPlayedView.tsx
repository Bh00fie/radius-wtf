"use client";

import { useEffect, useState } from "react";
import { DailySummary } from "./DailySummary";
import type { DailyResult, PlayerStats, Puzzle } from "@/lib/types";

interface AlreadyPlayedViewProps {
  puzzle: Puzzle;
  result: DailyResult;
  stats: PlayerStats;
}

function msUntilNextUtcMidnight(): number {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AlreadyPlayedView({ puzzle, result, stats }: AlreadyPlayedViewProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Date-based countdown must start after mount to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(msUntilNextUtcMidnight());
    const id = setInterval(() => setRemaining(msUntilNextUtcMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <DailySummary puzzle={puzzle} result={result} streak={stats.currentStreak} />
      {remaining !== null && (
        <p className="text-xs text-neutral-400">Next puzzle in {formatCountdown(remaining)}</p>
      )}
    </div>
  );
}
