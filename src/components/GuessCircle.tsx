"use client";

import { useCallback, useRef } from "react";
import { RADIUS_MAX, RADIUS_MIN, VIEWBOX_SIZE } from "@/lib/constants";

const CENTER = VIEWBOX_SIZE / 2;

interface GuessCircleProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/** The interactive guess input: a dashed circle with a draggable resize handle. */
export function GuessCircle({ value, onChange, disabled }: GuessCircleProps) {
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback(
    (svg: SVGSVGElement, clientX: number, clientY: number) => {
      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const userPoint = point.matrixTransform(ctm.inverse());
      const distance = Math.hypot(userPoint.x - CENTER, userPoint.y - CENTER);
      const clamped = Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, Math.round(distance)));
      onChange(clamped);
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGCircleElement>) => {
      if (disabled) return;
      const svg = event.currentTarget.ownerSVGElement;
      if (!svg) return;
      draggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromPointer(svg, event.clientX, event.clientY);
    },
    [disabled, updateFromPointer],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGCircleElement>) => {
      if (!draggingRef.current || disabled) return;
      const svg = event.currentTarget.ownerSVGElement;
      if (!svg) return;
      updateFromPointer(svg, event.clientX, event.clientY);
    },
    [disabled, updateFromPointer],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent<SVGCircleElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <g>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={value}
        fill="none"
        stroke="currentColor"
        className="text-neutral-900 dark:text-neutral-100"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <circle
        cx={CENTER}
        cy={CENTER - value}
        r={8}
        className="fill-neutral-900 dark:fill-neutral-100"
        style={{ cursor: disabled ? "default" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </g>
  );
}
