"use client";

import { useCallback, useEffect, useState } from "react";
import { buildDailyResult, generatePuzzle, scoreGuess, utcDateString } from "@/lib/game";
import { getStorageAdapter } from "@/lib/storage";
import type { DailyResult, PlayerStats, Puzzle } from "@/lib/types";

export interface RoundResult {
  guess: number;
  score: number;
}

interface GamePuzzleState {
  loading: boolean;
  puzzle: Puzzle | null;
  stats: PlayerStats | null;
  alreadyPlayed: boolean;
  currentRoundIndex: number;
  roundResults: RoundResult[];
  dailyResult: DailyResult | null;
  submitGuess: (guess: number) => void;
}

export function useGamePuzzle(): GamePuzzleState {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
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

    if (storage.hasPlayedToday(dateStr)) {
      setAlreadyPlayed(true);
      setDailyResult(currentStats.history[dateStr]);
    }
    setLoading(false);
  }, []);

  const submitGuess = useCallback(
    (guess: number) => {
      if (!puzzle) return;
      const round = puzzle.rounds[currentRoundIndex];
      const score = scoreGuess(guess, round.radius);
      const nextResults = [...roundResults, { guess, score }];
      setRoundResults(nextResults);

      if (nextResults.length === puzzle.rounds.length) {
        const storage = getStorageAdapter();
        const result = buildDailyResult(
          puzzle.date,
          puzzle,
          nextResults.map((r) => r.guess),
        );
        const nextStats = storage.saveDailyResult(result);
        setStats(nextStats);
        setDailyResult(result);
        setAlreadyPlayed(true);
      } else {
        setCurrentRoundIndex(currentRoundIndex + 1);
      }
    },
    [puzzle, currentRoundIndex, roundResults],
  );

  return {
    loading,
    puzzle,
    stats,
    alreadyPlayed,
    currentRoundIndex,
    roundResults,
    dailyResult,
    submitGuess,
  };
}
