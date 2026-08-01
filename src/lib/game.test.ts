import { describe, expect, it } from "vitest";
import {
  applyDailyResult,
  buildDailyResult,
  createInitialStats,
  dayIndexFor,
  generatePuzzle,
  scoreBand,
  scoreGuess,
} from "./game";

describe("scoreGuess", () => {
  it("scores an exact guess as 100", () => {
    expect(scoreGuess(50, 50)).toBe(100);
  });

  it("scores a 20% miss as 60", () => {
    expect(scoreGuess(60, 50)).toBe(60);
  });

  it("scores a 50%+ miss as 0", () => {
    expect(scoreGuess(75, 50)).toBe(0);
    expect(scoreGuess(100, 50)).toBe(0);
  });

  it("never goes below 0 or above 100", () => {
    expect(scoreGuess(0, 50)).toBeGreaterThanOrEqual(0);
    expect(scoreGuess(50, 50)).toBeLessThanOrEqual(100);
  });
});

describe("scoreBand", () => {
  it("maps scores to the correct band", () => {
    expect(scoreBand(95).label).toBe("Perfect");
    expect(scoreBand(80).label).toBe("Great");
    expect(scoreBand(50).label).toBe("Good");
    expect(scoreBand(25).label).toBe("Off");
    expect(scoreBand(5).label).toBe("Way Off");
  });
});

describe("generatePuzzle", () => {
  it("is deterministic for the same date", () => {
    const a = generatePuzzle("2026-08-01");
    const b = generatePuzzle("2026-08-01");
    expect(a.rounds.map((r) => r.radius)).toEqual(b.rounds.map((r) => r.radius));
  });

  it("produces different puzzles for different dates", () => {
    const a = generatePuzzle("2026-08-01");
    const b = generatePuzzle("2026-08-02");
    expect(a.rounds.map((r) => r.radius)).not.toEqual(b.rounds.map((r) => r.radius));
  });

  it("computes dayIndex relative to the launch date", () => {
    expect(dayIndexFor("2026-08-01")).toBe(1);
    expect(dayIndexFor("2026-08-02")).toBe(2);
  });
});

describe("applyDailyResult streak logic", () => {
  it("starts a streak at 1 on the first play", () => {
    const stats = createInitialStats();
    const puzzle = generatePuzzle("2026-08-01");
    const result = buildDailyResult("2026-08-01", puzzle, [50, 50, 50, 50, 50]);
    const next = applyDailyResult(stats, result);
    expect(next.currentStreak).toBe(1);
    expect(next.maxStreak).toBe(1);
  });

  it("increments the streak on consecutive days", () => {
    let stats = createInitialStats();
    const day1 = buildDailyResult("2026-08-01", generatePuzzle("2026-08-01"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day1);
    const day2 = buildDailyResult("2026-08-02", generatePuzzle("2026-08-02"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day2);
    expect(stats.currentStreak).toBe(2);
    expect(stats.maxStreak).toBe(2);
  });

  it("resets the streak after a skipped day", () => {
    let stats = createInitialStats();
    const day1 = buildDailyResult("2026-08-01", generatePuzzle("2026-08-01"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day1);
    const day3 = buildDailyResult("2026-08-03", generatePuzzle("2026-08-03"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day3);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
  });

  it("keeps maxStreak after a later reset", () => {
    let stats = createInitialStats();
    const day1 = buildDailyResult("2026-08-01", generatePuzzle("2026-08-01"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day1);
    const day2 = buildDailyResult("2026-08-02", generatePuzzle("2026-08-02"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day2);
    expect(stats.maxStreak).toBe(2);
    const day5 = buildDailyResult("2026-08-05", generatePuzzle("2026-08-05"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day5);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(2);
  });

  it("recording the same day twice overwrites that day's entry without changing the streak twice", () => {
    let stats = createInitialStats();
    const day1 = buildDailyResult("2026-08-01", generatePuzzle("2026-08-01"), [50, 50, 50, 50, 50]);
    stats = applyDailyResult(stats, day1);
    const day1Replay = buildDailyResult("2026-08-01", generatePuzzle("2026-08-01"), [10, 10, 10, 10, 10]);
    stats = applyDailyResult(stats, day1Replay);
    expect(stats.currentStreak).toBe(1);
    expect(stats.history["2026-08-01"].guesses).toEqual([10, 10, 10, 10, 10]);
  });
});
