"use client";

import { useState } from "react";
import { RadiusVisual } from "./RadiusVisual";
import { scoreBand, scoreGuess } from "@/lib/game";
import { GUESS_MAX, GUESS_MIN, MAX_GUESSES } from "@/lib/constants";

interface GuessPanelProps {
  trueRadius: number;
  guesses: number[];
  onGuess: (guess: number) => void;
}

export function GuessPanel({ trueRadius, guesses, onGuess }: GuessPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const guessesLeft = MAX_GUESSES - guesses.length;

  const handleChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "");
    if (digitsOnly === "") {
      setInputValue("");
      return;
    }
    setInputValue(String(Math.min(GUESS_MAX, Number(digitsOnly))));
  };

  const parsedValue = inputValue === "" ? null : Number(inputValue);
  const canSubmit = parsedValue !== null && parsedValue >= GUESS_MIN;

  const submit = () => {
    if (parsedValue === null || !canSubmit) return;
    onGuess(parsedValue);
    setInputValue("");
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-sm text-neutral-500">
        Guess {guesses.length + 1} of {MAX_GUESSES}
      </p>

      <RadiusVisual trueRadius={trueRadius} />

      {guesses.length > 0 && (
        <ul className="flex w-full max-w-xs flex-col gap-1">
          {guesses.map((g, i) => {
            const band = scoreBand(scoreGuess(g, trueRadius));
            const direction =
              g === trueRadius ? "🎯 Correct!" : g > trueRadius ? "Too high ⬇" : "Too low ⬆";
            return (
              <li key={i} className="flex items-center justify-between text-sm">
                <span>
                  {band.emoji} {g} units
                </span>
                <span className="text-neutral-500">{direction}</span>
              </li>
            );
          })}
        </ul>
      )}

      <label className="flex items-center gap-2 text-sm">
        Radius guess
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="w-20 rounded border border-neutral-300 px-2 py-1 text-center dark:border-neutral-700 dark:bg-neutral-900"
        />
        units
      </label>
      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Guess ({guessesLeft} left)
      </button>
    </div>
  );
}
