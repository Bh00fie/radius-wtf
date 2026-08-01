import type { ReactNode } from "react";
import { SCALE_BAR_UNITS, VIEWBOX_SIZE } from "@/lib/constants";

const CENTER = VIEWBOX_SIZE / 2;
const LEGEND_X = 20;
const LEGEND_Y = VIEWBOX_SIZE - 15;

interface RadiusVisualProps {
  revealed?: boolean;
  trueRadius?: number;
  children?: ReactNode;
}

/**
 * Renders the fixed-viewBox SVG stage: a scale-bar legend that is identical
 * every round (the player's absolute unit reference), plus the true circle
 * once revealed. The interactive guess circle is passed in as `children` so
 * it shares this same coordinate system without prop-drilling the geometry.
 */
export function RadiusVisual({ revealed, trueRadius, children }: RadiusVisualProps) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      className="mx-auto w-full max-w-sm touch-none select-none"
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
      <text x={LEGEND_X} y={LEGEND_Y + 13} fontSize={7} className="fill-neutral-400">
        {SCALE_BAR_UNITS} units
      </text>

      {revealed && trueRadius != null && (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={trueRadius}
          fill="none"
          stroke="currentColor"
          className="text-emerald-500"
          strokeWidth={2}
        />
      )}

      {children}
    </svg>
  );
}
