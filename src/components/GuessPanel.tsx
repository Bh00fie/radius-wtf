"use client";

import { useState } from "react";
import { RadiusVisual } from "./RadiusVisual";
import { ScoreBandDot } from "./ScoreBandDot";
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
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-ink/45">
        <span>
          Guess {guesses.length + 1} / {MAX_GUESSES}
        </span>
        <span className="flex gap-1" aria-hidden>
          {Array.from({ length: MAX_GUESSES }, (_, i) => (
            <span
              key={i}
              className={`h-px w-4 transition-colors duration-500 ${i < guesses.length ? "bg-ink" : "bg-ink/20"}`}
            />
          ))}
        </span>
      </div>

      <RadiusVisual trueRadius={trueRadius} />

      {guesses.length > 0 && (
        <ul className="scene flex w-full max-w-xs flex-col">
          {guesses.map((g, i) => {
            const band = scoreBand(scoreGuess(g, trueRadius));
            const correct = g === trueRadius;
            const direction = correct ? "correct" : g > trueRadius ? "too high ↓" : "too low ↑";
            return (
              <li
                key={i}
                className="animate-flip-down flex items-center justify-between border-b border-ink/10 py-2.5 text-sm"
              >
                <span className="flex items-center gap-3">
                  <ScoreBandDot band={band} />
                  <span className="font-serif text-lg tabular-nums">{g}</span>
                  <span className="text-xs text-ink/40">units</span>
                </span>
                <span className={correct ? "font-medium text-shu" : "text-ink/50"}>{direction}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-col items-center gap-5">
        <label className="flex items-baseline gap-3 text-xs uppercase tracking-[0.2em] text-ink/45">
          <span className="sr-only">Radius guess</span>
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
            className="w-24 border-b border-ink/30 bg-transparent pb-1 text-center font-serif text-3xl normal-case tracking-normal text-ink outline-none transition-colors placeholder:text-ink/20 focus:border-shu"
          />
          units
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="rounded-[2px] bg-ink px-8 py-2.5 text-sm tracking-wide text-paper shadow-[0_4px_0_0_color-mix(in_srgb,var(--ink)_35%,transparent)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_color-mix(in_srgb,var(--ink)_35%,transparent)] active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-25 disabled:shadow-none"
        >
          Guess · {guessesLeft} left
        </button>
      </div>
    </div>
  );
}
