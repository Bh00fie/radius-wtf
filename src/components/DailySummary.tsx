import type { DailyResult, Puzzle } from "@/lib/types";
import { scoreBand, scoreGuess } from "@/lib/game";
import { RadiusVisual } from "./RadiusVisual";
import { ScoreBandDot } from "./ScoreBandDot";
import { MAX_GUESSES } from "@/lib/constants";

interface DailySummaryProps {
  puzzle: Puzzle;
  result: DailyResult;
  streak: number;
  practiceMode?: boolean;
}

export function DailySummary({ puzzle, result, streak, practiceMode }: DailySummaryProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-lg font-semibold">
        {practiceMode ? "Practice round" : `Radius #${puzzle.dayIndex}`} — the answer was{" "}
        {result.radius} units
      </h2>

      <RadiusVisual trueRadius={result.radius} revealed />

      <p className="text-4xl font-bold">{result.won ? `${result.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`}</p>
      <div className="flex gap-2">
        {result.guesses.map((g, i) => (
          <ScoreBandDot key={i} band={scoreBand(scoreGuess(g, result.radius))} className="h-4 w-4" />
        ))}
      </div>
      {!practiceMode && <p className="text-sm text-neutral-500">🔥 Streak: {streak}</p>}
    </div>
  );
}
