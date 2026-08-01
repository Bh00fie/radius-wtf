import type { ScoreBand } from "@/lib/constants";

interface ScoreBandDotProps {
  band: ScoreBand;
  className?: string;
}

/** Solid-color indicator dot for a score band — a designed UI element instead of emoji. */
export function ScoreBandDot({ band, className }: ScoreBandDotProps) {
  return (
    <span
      role="img"
      aria-label={band.label}
      title={band.label}
      className={`inline-block h-3 w-3 shrink-0 rounded-full ${band.color} ${className ?? ""}`}
    />
  );
}
