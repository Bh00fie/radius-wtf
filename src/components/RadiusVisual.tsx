"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { SCALE_BAR_UNITS, VIEWBOX_SIZE } from "@/lib/constants";

const CENTER = VIEWBOX_SIZE / 2;
const LEGEND_X = 20;
const LEGEND_Y = VIEWBOX_SIZE - 15;
/** Max pointer-follow tilt, in degrees. Small enough not to hurt estimation. */
const MAX_TILT = 7;

interface RadiusVisualProps {
  trueRadius: number;
  /** Brushes the circle in shu once the day's puzzle is over (won or out of guesses). */
  revealed?: boolean;
}

/**
 * Renders the fixed-viewBox SVG stage: a scale-bar legend that is identical
 * every day (the player's absolute unit reference), plus the day's true
 * circle — visible from the first guess, since that's the thing being
 * estimated. There's no draggable overlay; the player states a number.
 *
 * The stage sits on a paper tile that settles in with a 3D tilt and follows a
 * mouse pointer slightly. The ruler and circle share one plane, so any tilt
 * preserves their ratio.
 */
export function RadiusVisual({ trueRadius, revealed }: RadiusVisualProps) {
  const tileRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const tile = tileRef.current;
    if (!tile || e.pointerType !== "mouse") return;
    const rect = tile.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tile.style.transform = `rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg)`;
  };

  const handleLeave = () => {
    if (tileRef.current) tileRef.current.style.transform = "";
  };

  const circumference = 2 * Math.PI * trueRadius;

  return (
    <div className="scene w-full max-w-sm" onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div className="animate-disc-settle preserve-3d">
        <div
          ref={tileRef}
          className="preserve-3d relative aspect-square w-full rounded-sm border border-ink/10 bg-paper shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-out"
        >
          <svg
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            className="block h-full w-full select-none"
            role="img"
            aria-label="Radius guessing canvas"
          >
            <g stroke="currentColor" className="text-ink/45" strokeWidth={1}>
              <line x1={LEGEND_X} y1={LEGEND_Y - 4} x2={LEGEND_X} y2={LEGEND_Y + 4} />
              <line x1={LEGEND_X} y1={LEGEND_Y} x2={LEGEND_X + SCALE_BAR_UNITS} y2={LEGEND_Y} />
              <line
                x1={LEGEND_X + SCALE_BAR_UNITS}
                y1={LEGEND_Y - 4}
                x2={LEGEND_X + SCALE_BAR_UNITS}
                y2={LEGEND_Y + 4}
              />
            </g>
            <text
              x={LEGEND_X}
              y={LEGEND_Y + 13}
              fontSize={7}
              letterSpacing={0.5}
              className="fill-ink/45"
            >
              {SCALE_BAR_UNITS} units
            </text>

            <circle
              key={revealed ? "revealed" : "open"}
              cx={CENTER}
              cy={CENTER}
              r={trueRadius}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              className={revealed ? "animate-brush text-shu" : "text-ink/70"}
              strokeWidth={revealed ? 2 : 1.25}
              strokeDasharray={revealed ? circumference : undefined}
              style={revealed ? ({ "--len": circumference } as CSSProperties) : undefined}
            />
            <circle cx={CENTER} cy={CENTER} r={1.75} className="fill-ink" />
          </svg>

          {/* Floats a little above the tile so it parallaxes on tilt. */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 font-serif text-xs text-ink/30 [transform:translateZ(30px)]"
          >
            円
          </span>
        </div>
      </div>
    </div>
  );
}
