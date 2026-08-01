"use client";

import { useGamePuzzle } from "@/hooks/useGamePuzzle";
import { StreakBadge } from "@/components/StreakBadge";
import { RoundHUD } from "@/components/RoundHUD";
import { AlreadyPlayedView } from "@/components/AlreadyPlayedView";
import { AdSlot } from "@/components/AdSlot";
import { ROUNDS_PER_DAY } from "@/lib/constants";

export default function Home() {
  const { loading, puzzle, stats, alreadyPlayed, currentRoundIndex, dailyResult, submitGuess } =
    useGamePuzzle();

  if (loading || !puzzle || !stats) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center gap-6 px-4 py-10">
      <header className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">radius.wtf</h1>
        <StreakBadge stats={stats} />
      </header>

      {alreadyPlayed && dailyResult ? (
        <AlreadyPlayedView puzzle={puzzle} result={dailyResult} stats={stats} />
      ) : (
        <>
          <p className="text-center text-sm text-neutral-500">
            Drag the dashed circle&rsquo;s handle (or type a number) to match the hidden
            circle&rsquo;s radius, using the ruler as your reference.
          </p>
          <RoundHUD
            key={currentRoundIndex}
            roundIndex={currentRoundIndex}
            totalRounds={ROUNDS_PER_DAY}
            trueRadius={puzzle.rounds[currentRoundIndex].radius}
            onSubmit={submitGuess}
          />
        </>
      )}

      <AdSlot />
    </main>
  );
}
