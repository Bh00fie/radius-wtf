"use client";

import { useEffect } from "react";

/**
 * Publishes the visible height as `--app-height`. On iOS Safari the on-screen
 * keyboard shrinks only the visual viewport — `dvh` stays full height — so the
 * page would otherwise be panned up to reveal the input, exposing blank page
 * below it. Sizing the layout to the visible area and pinning it to the top
 * keeps the input sitting right above the keyboard.
 */
export function useAppHeight() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;

    const update = () => {
      root.style.setProperty("--app-height", `${vv.height}px`);
      if (document.activeElement instanceof HTMLInputElement) window.scrollTo(0, 0);
    };

    update();
    vv.addEventListener("resize", update);
    return () => {
      vv.removeEventListener("resize", update);
      root.style.removeProperty("--app-height");
    };
  }, []);
}
