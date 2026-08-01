"use client";

import { useGamePuzzle } from "@/hooks/useGamePuzzle";
import { StreakBadge } from "@/components/StreakBadge";
import { GuessPanel } from "@/components/GuessPanel";
import { AlreadyPlayedView } from "@/components/AlreadyPlayedView";
import { AdSlot } from "@/components/AdSlot";
import { MAX_GUESSES } from "@/lib/constants";

export default function Home() {
  const { loading, puzzle, stats, guesses, gameOver, dailyResult, submitGuess } = useGamePuzzle();

  if (loading || !puzzle || !stats) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center gap-6 px-4 py-10">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">radius.wtf</h1>
        <StreakBadge stats={stats} />
      </header>

      {gameOver && dailyResult ? (
        <AlreadyPlayedView puzzle={puzzle} result={dailyResult} stats={stats} />
      ) : (
        <>
          <p className="text-center text-sm text-neutral-500">
            Guess the radius of today&rsquo;s circle, in units, using the ruler as your
            reference. You have {MAX_GUESSES} guesses.
          </p>
          <GuessPanel trueRadius={puzzle.radius} guesses={guesses} onGuess={submitGuess} />
        </>
      )}

      <AdSlot />
    </main>
  );
}
