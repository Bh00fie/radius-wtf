"use client";

import { useCallback, useEffect, useState } from "react";
import { buildDailyResult, generatePuzzle, utcDateString } from "@/lib/game";
import { getStorageAdapter } from "@/lib/storage";
import { MAX_GUESSES } from "@/lib/constants";
import type { DailyResult, PlayerStats, Puzzle } from "@/lib/types";

interface GamePuzzleState {
  loading: boolean;
  puzzle: Puzzle | null;
  stats: PlayerStats | null;
  guesses: number[];
  gameOver: boolean;
  dailyResult: DailyResult | null;
  submitGuess: (guess: number) => void;
}

export function useGamePuzzle(): GamePuzzleState {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [dailyResult, setDailyResult] = useState<DailyResult | null>(null);

  useEffect(() => {
    const storage = getStorageAdapter();
    const dateStr = utcDateString(new Date());
    const todaysPuzzle = generatePuzzle(dateStr);
    const currentStats = storage.getStats();

    // Hydrating from client-only APIs (Date, localStorage) after mount —
    // required to avoid an SSR crash/hydration mismatch, not a cascading update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPuzzle(todaysPuzzle);
    setStats(currentStats);

    const existing = currentStats.history[dateStr];
    if (existing) {
      setGuesses(existing.guesses);
      setDailyResult(existing);
    }
    setLoading(false);
  }, []);

  const submitGuess = useCallback(
    (guess: number) => {
      if (!puzzle || dailyResult) return;
      const nextGuesses = [...guesses, guess];
      setGuesses(nextGuesses);

      const won = guess === puzzle.radius;
      const outOfGuesses = nextGuesses.length >= MAX_GUESSES;

      if (won || outOfGuesses) {
        const storage = getStorageAdapter();
        const result = buildDailyResult(puzzle.date, puzzle, nextGuesses);
        const nextStats = storage.saveDailyResult(result);
        setStats(nextStats);
        setDailyResult(result);
      }
    },
    [puzzle, guesses, dailyResult],
  );

  return {
    loading,
    puzzle,
    stats,
    guesses,
    gameOver: dailyResult !== null,
    dailyResult,
    submitGuess,
  };
}
