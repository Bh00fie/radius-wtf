import type { DailyResult, Puzzle } from "@/lib/types";
import { scoreBand } from "@/lib/game";
import { ShareButton } from "./ShareButton";

interface DailySummaryProps {
  puzzle: Puzzle;
  result: DailyResult;
  streak: number;
}

export function DailySummary({ puzzle, result, streak }: DailySummaryProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-lg font-semibold">Radius #{puzzle.dayIndex} complete</h2>
      <p className="text-4xl font-bold">{result.averageScore}/100</p>
      <div className="flex gap-1 text-2xl">
        {result.scores.map((s, i) => (
          <span key={i}>{scoreBand(s).emoji}</span>
        ))}
      </div>
      <p className="text-sm text-neutral-500">🔥 Streak: {streak}</p>
      <ShareButton puzzle={puzzle} result={result} streak={streak} />
    </div>
  );
}
