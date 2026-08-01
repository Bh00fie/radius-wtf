import { SCALE_BAR_UNITS, VIEWBOX_SIZE } from "@/lib/constants";

const CENTER = VIEWBOX_SIZE / 2;
const LEGEND_X = 20;
const LEGEND_Y = VIEWBOX_SIZE - 22;

interface RadiusVisualProps {
  trueRadius: number;
  /** Recolors the circle green once the day's puzzle is over (won or out of guesses). */
  revealed?: boolean;
}

/**
 * Renders the fixed-viewBox SVG stage: a scale-bar legend that is identical
 * every day (the player's absolute unit reference), plus the day's true
 * circle — visible from the first guess, since that's the thing being
 * estimated. There's no draggable overlay; the player states a number.
 */
export function RadiusVisual({ trueRadius, revealed }: RadiusVisualProps) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      className="mx-auto w-full max-w-sm select-none"
      role="img"
      aria-label="Radius guessing canvas"
    >
      <g stroke="currentColor" className="text-neutral-400" strokeWidth={1}>
        <line x1={LEGEND_X} y1={LEGEND_Y - 4} x2={LEGEND_X} y2={LEGEND_Y + 4} />
        <line x1={LEGEND_X} y1={LEGEND_Y} x2={LEGEND_X + SCALE_BAR_UNITS} y2={LEGEND_Y} />
        <line
          x1={LEGEND_X + SCALE_BAR_UNITS}
          y1={LEGEND_Y - 4}
          x2={LEGEND_X + SCALE_BAR_UNITS}
          y2={LEGEND_Y + 4}
        />
      </g>
      <text x={LEGEND_X} y={LEGEND_Y + 17} fontSize={14} className="fill-neutral-400">
        {SCALE_BAR_UNITS} units
      </text>

      <circle
        cx={CENTER}
        cy={CENTER}
        r={trueRadius}
        fill="none"
        stroke="currentColor"
        className={revealed ? "text-emerald-500" : "text-neutral-500"}
        strokeWidth={revealed ? 2 : 1.5}
      />
      <circle cx={CENTER} cy={CENTER} r={2} className="fill-neutral-900 dark:fill-neutral-100" />
    </svg>
  );
}
