/** One circle per day; this many numeric guesses at it before the day is over. */
export const MAX_GUESSES = 4;

/**
 * Only true when NEXT_PUBLIC_DEBUG_MODE=true is set at build time — never set
 * in production. Reveals a practice-mode panel for generating unlimited
 * throwaway puzzles without touching real daily stats/streak.
 */
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

/**
 * Canonical production URL, used for metadata/sitemap/robots. Override with
 * NEXT_PUBLIC_SITE_URL in Netlify's env vars if a custom domain replaces this
 * default later.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://radiusgame.com";

export const RADIUS_MIN = 15;
export const RADIUS_MAX = 85;

/**
 * Bounds for the guess input itself — deliberately wider than
 * RADIUS_MIN/RADIUS_MAX so the input's min/max don't leak the true answer
 * range to anyone inspecting the page.
 */
export const GUESS_MIN = 1;
export const GUESS_MAX = 999;

/** SVG viewBox is a fixed square of this size (game units == viewBox units). */
export const VIEWBOX_SIZE = 200;

/** Length, in game units, of the fixed scale-bar legend shown every round. */
export const SCALE_BAR_UNITS = 20;

/** A guess this far off (as a fraction of the true radius) scores 0. */
export const MAX_PERCENT_ERROR = 0.5;

/** Launch date used to compute the daily puzzle number, Wordle-style. */
export const LAUNCH_DATE = "2026-08-01";

export interface ScoreBand {
  label: string;
  /** Tailwind background-color class for the band's indicator dot. */
  color: string;
  min: number;
}

export const SCORE_BANDS: ScoreBand[] = [
  { label: "Perfect", color: "bg-emerald-500", min: 90 },
  { label: "Great", color: "bg-lime-500", min: 70 },
  { label: "Good", color: "bg-amber-400", min: 45 },
  { label: "Off", color: "bg-orange-500", min: 20 },
  { label: "Way Off", color: "bg-red-500", min: 0 },
];
