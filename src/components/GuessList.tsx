import { ScoreBandDot } from "./ScoreBandDot";
import { scoreBand, scoreGuess } from "@/lib/game";
import { MAX_GUESSES } from "@/lib/constants";

const SLOT_NUMERALS = ["一", "二", "三", "四", "五", "六"];

interface GuessListProps {
  guesses: number[];
  trueRadius: number;
}

/**
 * Side column beside the circle: one slot per allowed guess, filled in as the
 * player guesses. Empty slots are reserved up front so the circle never
 * resizes mid-game.
 */
export function GuessList({ guesses, trueRadius }: GuessListProps) {
  return (
    <ol className="scene flex w-[5.5rem] shrink-0 flex-col sm:w-32" aria-label="Your guesses">
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const numeral = (
          <span aria-hidden className="w-3 font-serif text-xs text-ink/30">
            {SLOT_NUMERALS[i] ?? i + 1}
          </span>
        );
        const g = guesses[i];

        if (g === undefined) {
          return (
            <li key={i} className="flex h-10 items-center gap-2 border-b border-ink/10 text-ink/20">
              {numeral}
              <span>—</span>
            </li>
          );
        }

        const correct = g === trueRadius;
        const tooHigh = g > trueRadius;
        return (
          <li
            key={i}
            className="animate-flip-down flex h-10 items-center gap-2 border-b border-ink/10 text-sm"
          >
            {numeral}
            <ScoreBandDot band={scoreBand(scoreGuess(g, trueRadius))} className="h-2.5 w-2.5" />
            <span className="font-serif text-lg leading-none tabular-nums">{g}</span>
            <span className={`ml-auto text-xs ${correct ? "text-shu" : "text-ink/45"}`}>
              {correct ? (
                "✓"
              ) : (
                <>
                  <span className="sr-only">{tooHigh ? "too high" : "too low"}</span>
                  <span aria-hidden>
                    <span className="hidden sm:inline">{tooHigh ? "lower " : "higher "}</span>
                    {tooHigh ? "↓" : "↑"}
                  </span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
