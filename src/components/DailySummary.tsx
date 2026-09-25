import type { DailyResult, Puzzle } from "@/lib/types";
import { RadiusVisual } from "./RadiusVisual";
import { GuessList } from "./GuessList";
import { STAGE_SIZE } from "./GuessPanel";
import { MAX_GUESSES } from "@/lib/constants";

interface DailySummaryProps {
  puzzle: Puzzle;
  result: DailyResult;
  streak: number;
  practiceMode?: boolean;
}

export function DailySummary({ puzzle, result, streak, practiceMode }: DailySummaryProps) {
  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <div className="animate-rise flex flex-col items-center gap-1">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink/45">
          {practiceMode ? "Practice round" : `Radius #${puzzle.dayIndex}`}
        </p>
        <h2 className="font-serif text-lg">
          The answer was <span className="text-shu">{result.radius}</span> units
        </h2>
      </div>

      <div className="flex w-full items-center justify-center gap-4 text-left sm:gap-6">
        <RadiusVisual trueRadius={result.radius} revealed className={STAGE_SIZE} />
        <GuessList guesses={result.guesses} trueRadius={result.radius} />
      </div>

      <div className="scene flex items-baseline gap-6">
        <p
          className="animate-card-turn font-serif text-5xl font-bold tabular-nums"
          style={{ animationDelay: "700ms" }}
        >
          {result.won ? result.guesses.length : "×"}
          <span className="text-2xl font-medium text-ink/35">/{MAX_GUESSES}</span>
        </p>
        {!practiceMode && (
          <p className="flex items-baseline gap-2 text-sm text-ink/55">
            <span className="font-serif text-shu">連</span>
            Streak {streak}
          </p>
        )}
      </div>
    </div>
  );
}
