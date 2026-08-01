"use client";

import { useState } from "react";
import { RadiusVisual } from "./RadiusVisual";
import { GuessCircle } from "./GuessCircle";
import { ScoreReveal } from "./ScoreReveal";
import { scoreGuess } from "@/lib/game";
import { RADIUS_MAX, RADIUS_MIN } from "@/lib/constants";

interface RoundHUDProps {
  roundIndex: number;
  totalRounds: number;
  trueRadius: number;
  onSubmit: (guess: number) => void;
}

export function RoundHUD({ roundIndex, totalRounds, trueRadius, onSubmit }: RoundHUDProps) {
  const [guess, setGuess] = useState(Math.round((RADIUS_MIN + RADIUS_MAX) / 2));
  const [submitted, setSubmitted] = useState(false);

  const score = submitted ? scoreGuess(guess, trueRadius) : null;

  const clampGuess = (raw: number) => {
    if (Number.isNaN(raw)) return guess;
    return Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, Math.round(raw)));
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-sm text-neutral-500">
        Round {roundIndex + 1} of {totalRounds}
      </p>

      <RadiusVisual revealed={submitted} trueRadius={submitted ? trueRadius : undefined}>
        <GuessCircle value={guess} onChange={setGuess} disabled={submitted} />
      </RadiusVisual>

      {!submitted ? (
        <>
          <label className="flex items-center gap-2 text-sm">
            Radius guess
            <input
              type="number"
              value={guess}
              min={RADIUS_MIN}
              max={RADIUS_MAX}
              onChange={(e) => setGuess(clampGuess(Number(e.target.value)))}
              className="w-20 rounded border border-neutral-300 px-2 py-1 text-center dark:border-neutral-700 dark:bg-neutral-900"
            />
            units
          </label>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Submit Guess
          </button>
        </>
      ) : (
        <>
          {score !== null && <ScoreReveal score={score} guess={guess} trueRadius={trueRadius} />}
          <button
            type="button"
            onClick={() => onSubmit(guess)}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {roundIndex + 1 === totalRounds ? "See Results" : "Next Round"}
          </button>
        </>
      )}
    </div>
  );
}
