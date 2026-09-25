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
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="animate-rise flex flex-col items-center gap-1">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink/45">
          {practiceMode ? "Practice round" : `Radius #${puzzle.dayIndex}`}
        </p>
        <h2 className="font-serif text-lg">
          The answer was <span className="text-shu">{result.radius}</span> units
        </h2>
      </div>

      <RadiusVisual trueRadius={result.radius} revealed />

      <div className="scene">
        <div
          className="animate-card-turn preserve-3d flex flex-col items-center gap-4 rounded-sm border border-ink/10 px-10 py-6 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.3)]"
          style={{ animationDelay: "700ms" }}
        >
          <p className="font-serif text-5xl font-bold tabular-nums">
            {result.won ? result.guesses.length : "×"}
            <span className="text-2xl font-medium text-ink/35">/{MAX_GUESSES}</span>
          </p>
          <div className="flex gap-2.5">
            {result.guesses.map((g, i) => (
              <span
                key={i}
                className="animate-rise inline-flex"
                style={{ animationDelay: `${1300 + i * 120}ms` }}
              >
                <ScoreBandDot band={scoreBand(scoreGuess(g, result.radius))} className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {!practiceMode && (
        <p className="flex items-baseline gap-2 text-sm text-ink/55">
          <span className="font-serif text-shu">連</span>
          Streak {streak}
        </p>
      )}
    </div>
  );
}
