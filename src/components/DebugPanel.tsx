"use client";

interface DebugPanelProps {
  practiceMode: boolean;
  onNewPuzzle: () => void;
  onExit: () => void;
}

/** Only rendered when NEXT_PUBLIC_DEBUG_MODE=true — see src/lib/constants.ts. */
export function DebugPanel({ practiceMode, onNewPuzzle, onExit }: DebugPanelProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded border border-dashed border-amber-500 p-3 text-center text-xs text-amber-600 dark:text-amber-400">
      <p className="font-medium">Debug mode</p>
      <p>Practice puzzles are throwaway — they never touch your real streak/history.</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onNewPuzzle}
          className="rounded-full border border-amber-500 px-3 py-1 font-medium"
        >
          New practice puzzle
        </button>
        {practiceMode && (
          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-neutral-400 px-3 py-1 font-medium text-neutral-500"
          >
            Back to today&rsquo;s puzzle
          </button>
        )}
      </div>
    </div>
  );
}
