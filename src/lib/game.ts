import {
  LAUNCH_DATE_UTC,
  MAX_PERCENT_ERROR,
  RADIUS_MAX,
  RADIUS_MIN,
  ROUNDS_PER_DAY,
  SCORE_BANDS,
  type ScoreBand,
} from "./constants";
import type { DailyResult, PlayerStats, Puzzle } from "./types";

const MS_PER_DAY = 86_400_000;

/** Formats a Date as a UTC "YYYY-MM-DD" string — the deterministic daily key. */
export function utcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Alias kept for call sites that think in terms of "today's puzzle seed". */
export function getDailySeed(date: Date): string {
  return utcDateString(date);
}

export function dayIndexFor(dateStr: string): number {
  const ms = Date.parse(`${dateStr}T00:00:00Z`) - Date.parse(`${LAUNCH_DATE_UTC}T00:00:00Z`);
  return Math.floor(ms / MS_PER_DAY) + 1;
}

export function previousDateString(dateStr: string): string {
  const ms = Date.parse(`${dateStr}T00:00:00Z`) - MS_PER_DAY;
  return new Date(ms).toISOString().slice(0, 10);
}

// -- Deterministic PRNG: hash the date string into a seed, then draw from it. --

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePuzzle(dateStr: string): Puzzle {
  const seed = cyrb53(dateStr) >>> 0;
  const rand = mulberry32(seed);
  const rounds = Array.from({ length: ROUNDS_PER_DAY }, () => ({
    radius: Math.round(RADIUS_MIN + rand() * (RADIUS_MAX - RADIUS_MIN)),
  }));
  return { date: dateStr, dayIndex: dayIndexFor(dateStr), rounds };
}

export function scoreGuess(guess: number, trueRadius: number): number {
  const percentError = Math.abs(guess - trueRadius) / trueRadius;
  const score = 100 * (1 - percentError / MAX_PERCENT_ERROR);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreBand(score: number): ScoreBand {
  return SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function buildDailyResult(
  date: string,
  puzzle: Puzzle,
  guesses: number[],
): DailyResult {
  const answers = puzzle.rounds.map((r) => r.radius);
  const scores = guesses.map((g, i) => scoreGuess(g, answers[i]));
  const totalScore = scores.reduce((a, b) => a + b, 0);
  return {
    date,
    guesses,
    answers,
    scores,
    totalScore,
    averageScore: Math.round(totalScore / scores.length),
  };
}

export function formatShareText(
  puzzle: Puzzle,
  result: DailyResult,
  streak: number,
  siteUrl = "https://radius-wtf.netlify.app",
): string {
  const grid = result.scores.map((s) => scoreBand(s).emoji).join("");
  const lines = [
    `Radius #${puzzle.dayIndex} — Avg Score: ${result.averageScore}/100`,
    grid,
    `🔥 Streak: ${streak}`,
    siteUrl,
  ];
  return lines.join("\n");
}

export function createInitialStats(): PlayerStats {
  return { version: 1, lastPlayedDate: null, currentStreak: 0, maxStreak: 0, history: {} };
}

export function applyDailyResult(stats: PlayerStats, result: DailyResult): PlayerStats {
  const yesterday = previousDateString(result.date);
  const nextStreak = stats.lastPlayedDate === yesterday ? stats.currentStreak + 1 : 1;
  return {
    ...stats,
    lastPlayedDate: result.date,
    currentStreak: nextStreak,
    maxStreak: Math.max(stats.maxStreak, nextStreak),
    history: { ...stats.history, [result.date]: result },
  };
}
