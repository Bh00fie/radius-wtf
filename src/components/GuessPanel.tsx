"use client";

import { useState } from "react";
import { RadiusVisual } from "./RadiusVisual";
import { GuessList } from "./GuessList";
import { GUESS_MAX, GUESS_MIN, MAX_GUESSES } from "@/lib/constants";

/**
 * Stage shrinks to leave room for the header, instructions and input row, so
 * the whole game fits on one screen without scrolling.
 */
export const STAGE_SIZE = "min-w-0 flex-1 max-w-[max(11rem,calc(100dvh_-_16rem))]";

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
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex w-full items-center justify-center gap-4 sm:gap-6">
        <RadiusVisual trueRadius={trueRadius} className={STAGE_SIZE} />
        <GuessList guesses={guesses} trueRadius={trueRadius} />
      </div>

      <div className="flex items-end gap-5">
        <label className="flex items-baseline gap-2 text-xs uppercase tracking-[0.2em] text-ink/45">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="—"
            aria-label="Radius guess in units"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="w-20 border-b border-ink/30 bg-transparent pb-1 text-center font-serif text-3xl normal-case tracking-normal text-ink outline-none transition-colors placeholder:text-ink/20 focus:border-shu"
          />
          units
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="rounded-[2px] bg-ink px-6 py-2.5 text-sm tracking-wide text-paper shadow-[0_4px_0_0_color-mix(in_srgb,var(--ink)_35%,transparent)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_color-mix(in_srgb,var(--ink)_35%,transparent)] active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-25 disabled:shadow-none"
        >
          Guess · {guessesLeft} left
        </button>
      </div>
    </div>
  );
}
