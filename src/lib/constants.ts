export const ROUNDS_PER_DAY = 5;

export const RADIUS_MIN = 15;
export const RADIUS_MAX = 85;

/** SVG viewBox is a fixed square of this size (game units == viewBox units). */
export const VIEWBOX_SIZE = 200;

/** Length, in game units, of the fixed scale-bar legend shown every round. */
export const SCALE_BAR_UNITS = 20;

/** A guess this far off (as a fraction of the true radius) scores 0. */
export const MAX_PERCENT_ERROR = 0.5;

/** Launch date (UTC) used to compute the daily puzzle number, Wordle-style. */
export const LAUNCH_DATE_UTC = "2026-08-01";

export interface ScoreBand {
  label: string;
  emoji: string;
  min: number;
}

export const SCORE_BANDS: ScoreBand[] = [
  { label: "Perfect", emoji: "🟩", min: 90 },
  { label: "Great", emoji: "🟢", min: 70 },
  { label: "Good", emoji: "🟡", min: 45 },
  { label: "Off", emoji: "🟠", min: 20 },
  { label: "Way Off", emoji: "🟥", min: 0 },
];
