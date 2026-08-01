import type { DailyResult, Puzzle } from "@/lib/types";
import { scoreBand, scoreGuess } from "@/lib/game";
import { RadiusVisual } from "./RadiusVisual";
import { ShareButton } from "./ShareButton";
import { MAX_GUESSES } from "@/lib/constants";

interface DailySummaryProps {
  puzzle: Puzzle;
  result: DailyResult;
  streak: number;
}

export function DailySummary({ puzzle, result, streak }: DailySummaryProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-lg font-semibold">
        Radius #{puzzle.dayIndex} — the answer was {result.radius} units
      </h2>

      <RadiusVisual trueRadius={result.radius} revealed />

      <p className="text-4xl font-bold">{result.won ? `${result.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`}</p>
      <div className="flex gap-1 text-2xl">
        {result.guesses.map((g, i) => (
          <span key={i}>{scoreBand(scoreGuess(g, result.radius)).emoji}</span>
        ))}
      </div>
      <p className="text-sm text-neutral-500">🔥 Streak: {streak}</p>
      <ShareButton puzzle={puzzle} result={result} streak={streak} />
    </div>
  );
}
