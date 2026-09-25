"use client";

import { useEffect, useState } from "react";
import { DailySummary } from "./DailySummary";
import type { DailyResult, PlayerStats, Puzzle } from "@/lib/types";

interface AlreadyPlayedViewProps {
  puzzle: Puzzle;
  result: DailyResult;
  stats: PlayerStats;
  practiceMode?: boolean;
}

function msUntilNextLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AlreadyPlayedView({ puzzle, result, stats, practiceMode }: AlreadyPlayedViewProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (practiceMode) return;
    // Date-based countdown must start after mount to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(msUntilNextLocalMidnight());
    const id = setInterval(() => setRemaining(msUntilNextLocalMidnight()), 1000);
    return () => clearInterval(id);
  }, [practiceMode]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DailySummary
        puzzle={puzzle}
        result={result}
        streak={stats.currentStreak}
        practiceMode={practiceMode}
      />
      {remaining !== null && (
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink/40">
          Next circle in{" "}
          <span className="font-mono normal-case tracking-normal text-ink/70">
            {formatCountdown(remaining)}
          </span>
        </p>
      )}
    </div>
  );
}
