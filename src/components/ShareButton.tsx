"use client";

import { useState } from "react";
import { formatShareText } from "@/lib/game";
import type { DailyResult, Puzzle } from "@/lib/types";

interface ShareButtonProps {
  puzzle: Puzzle;
  result: DailyResult;
  streak: number;
}

export function ShareButton({ puzzle, result, streak }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const text = formatShareText(puzzle, result, streak);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently no-op.
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
    >
      {copied ? "Copied!" : "Share Result"}
    </button>
  );
}
