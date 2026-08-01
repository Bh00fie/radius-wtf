"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildDailyResult,
  generatePracticePuzzle,
  generatePuzzle,
  localDateString,
} from "@/lib/game";
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
  /** True while playing a throwaway debug puzzle instead of today's real one. */
  practiceMode: boolean;
  /** Debug-only: starts (or restarts) a random practice puzzle. Doesn't touch real stats. */
  startPracticePuzzle: () => void;
  /** Debug-only: leaves practice mode and returns to today's real puzzle/progress. */
  exitPracticeMode: () => void;
}

export function useGamePuzzle(): GamePuzzleState {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [dailyResult, setDailyResult] = useState<DailyResult | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);

  const loadTodaysState = useCallback(() => {
    const storage = getStorageAdapter();
    const dateStr = localDateString(new Date());
    const todaysPuzzle = generatePuzzle(dateStr);
    const currentStats = storage.getStats();
    const existing = currentStats.history[dateStr];

    setPracticeMode(false);
    setPuzzle(todaysPuzzle);
    setStats(currentStats);
    setGuesses(existing ? existing.guesses : []);
    setDailyResult(existing ?? null);
  }, []);

  useEffect(() => {
    // Hydrating from client-only APIs (Date, localStorage) after mount —
    // required to avoid an SSR crash/hydration mismatch, not a cascading update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodaysState();
    setLoading(false);
  }, [loadTodaysState]);

  const submitGuess = useCallback(
    (guess: number) => {
      if (!puzzle || dailyResult) return;
      const nextGuesses = [...guesses, guess];
      setGuesses(nextGuesses);

      const won = guess === puzzle.radius;
      const outOfGuesses = nextGuesses.length >= MAX_GUESSES;

      if (won || outOfGuesses) {
        const result = buildDailyResult(puzzle.date, puzzle, nextGuesses);
        if (practiceMode) {
          // Practice puzzles are throwaway — never touch real stats/history.
          setDailyResult(result);
        } else {
          const storage = getStorageAdapter();
          const nextStats = storage.saveDailyResult(result);
          setStats(nextStats);
          setDailyResult(result);
        }
      }
    },
    [puzzle, guesses, dailyResult, practiceMode],
  );

  const startPracticePuzzle = useCallback(() => {
    const seed = `debug-${Date.now()}-${Math.random()}`;
    setPracticeMode(true);
    setPuzzle(generatePracticePuzzle(seed));
    setGuesses([]);
    setDailyResult(null);
  }, []);

  return {
    loading,
    puzzle,
    stats,
    guesses,
    gameOver: dailyResult !== null,
    dailyResult,
    submitGuess,
    practiceMode,
    startPracticePuzzle,
    exitPracticeMode: loadTodaysState,
  };
}
