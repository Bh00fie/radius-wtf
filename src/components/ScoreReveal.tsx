import { scoreBand } from "@/lib/game";

interface ScoreRevealProps {
  score: number;
  guess: number;
  trueRadius: number;
}

export function ScoreReveal({ score, guess, trueRadius }: ScoreRevealProps) {
  const band = scoreBand(score);
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-2xl">
        {band.emoji} <span className="font-semibold">{band.label}</span>
      </p>
      <p className="text-sm text-neutral-500">
        You guessed {guess}, actual was {trueRadius} — {score}/100
      </p>
    </div>
  );
}
