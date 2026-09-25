"use client";

import { useGamePuzzle } from "@/hooks/useGamePuzzle";
import { StreakBadge } from "@/components/StreakBadge";
import { GuessPanel } from "@/components/GuessPanel";
import { AlreadyPlayedView } from "@/components/AlreadyPlayedView";
import { DebugPanel } from "@/components/DebugPanel";
import { Hanko } from "@/components/Hanko";
import { DEBUG_MODE, MAX_GUESSES } from "@/lib/constants";

const MAIN_CLASS =
  "mx-auto flex w-full max-w-lg flex-col items-center gap-5 px-5 py-5 sm:py-8";

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

  const header = (
    <header className="flex w-full items-center justify-between border-b border-ink/10 pb-3">
      <h1 className="flex items-center gap-3">
        <Hanko />
        <span className="font-serif text-xl font-bold tracking-wide">radiusgame</span>
      </h1>
      <StreakBadge stats={stats} />
    </header>
  );

  // The header needs no client state, so it's in the server HTML and paints
  // before the game (which reads the local date and localStorage) hydrates.
  if (loading || !puzzle || !stats) {
    return <main className={MAIN_CLASS}>{header}</main>;
  }

  return (
    <main className={MAIN_CLASS}>
      {header}

      {gameOver && dailyResult ? (
        <AlreadyPlayedView
          puzzle={puzzle}
          result={dailyResult}
          stats={stats}
          practiceMode={practiceMode}
        />
      ) : (
        <>
          <p className="animate-rise text-center text-sm text-ink/55">
            {practiceMode ? "Practice round — guess" : "Guess"} the radius in units, using the ruler.{" "}
            {MAX_GUESSES} tries.
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
