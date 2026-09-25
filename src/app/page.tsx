"use client";

import { useGamePuzzle } from "@/hooks/useGamePuzzle";
import { StreakBadge } from "@/components/StreakBadge";
import { GuessPanel } from "@/components/GuessPanel";
import { AlreadyPlayedView } from "@/components/AlreadyPlayedView";
import { DebugPanel } from "@/components/DebugPanel";
import { Hanko } from "@/components/Hanko";
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-8 px-5 py-10">
      <header className="flex w-full items-center justify-between border-b border-ink/10 pb-4">
        <h1 className="flex items-center gap-3">
          <Hanko />
          <span className="font-serif text-xl font-bold tracking-wide">radiusgame</span>
        </h1>
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
          <p className="animate-rise max-w-xs text-center text-sm leading-relaxed text-ink/55">
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
