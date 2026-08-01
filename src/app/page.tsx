"use client";

import { useGamePuzzle } from "@/hooks/useGamePuzzle";
import { StreakBadge } from "@/components/StreakBadge";
import { GuessPanel } from "@/components/GuessPanel";
import { AlreadyPlayedView } from "@/components/AlreadyPlayedView";
import { DebugPanel } from "@/components/DebugPanel";
import { DEBUG_MODE, MAX_GUESSES } from "@/lib/constants";

export default function Home() {
  const {
    loading,
    puzzle,
    stats,
    guesses,
    gameOver,
    dailyResult,
    submitGuess,
    practiceMode,
    startPracticePuzzle,
    exitPracticeMode,
  } = useGamePuzzle();

  if (loading || !puzzle || !stats) {
    return <main className="min-h-dvh" />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-6 px-4 py-10">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">radiusgame</h1>
        <StreakBadge stats={stats} />
      </header>

      {gameOver && dailyResult ? (
        <AlreadyPlayedView
          puzzle={puzzle}
          result={dailyResult}
          stats={stats}
          practiceMode={practiceMode}
        />
      ) : (
        <>
          <p className="text-center text-sm text-neutral-500">
            {practiceMode
              ? "Practice round — guess the radius of this test circle."
              : `Guess the radius of today’s circle, in units, using the ruler as your reference.`}{" "}
            You have {MAX_GUESSES} guesses.
          </p>
          <GuessPanel trueRadius={puzzle.radius} guesses={guesses} onGuess={submitGuess} />
        </>
      )}

      {DEBUG_MODE && (
        <DebugPanel
          practiceMode={practiceMode}
          onNewPuzzle={startPracticePuzzle}
          onExit={exitPracticeMode}
        />
      )}
    </main>
  );
}
