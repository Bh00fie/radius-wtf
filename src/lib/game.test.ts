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
    expect(a.radius).toBe(b.radius);
  });

  it("produces a different radius for a different date", () => {
    const a = generatePuzzle("2026-08-01");
    const b = generatePuzzle("2026-08-02");
    expect(a.radius).not.toBe(b.radius);
  });

  it("computes dayIndex relative to the launch date", () => {
    expect(dayIndexFor("2026-08-01")).toBe(1);
    expect(dayIndexFor("2026-08-02")).toBe(2);
  });
});

describe("buildDailyResult", () => {
  it("wins if any guess exactly matches the radius", () => {
    const puzzle = generatePuzzle("2026-08-01");
    const result = buildDailyResult("2026-08-01", puzzle, [10, 20, puzzle.radius]);
    expect(result.won).toBe(true);
  });

  it("loses if no guess matches within the allotted guesses", () => {
    const puzzle = generatePuzzle("2026-08-01");
    const wrongGuesses = [1, 2, 3, 4].map((n) => (puzzle.radius + n > 85 ? puzzle.radius - n : puzzle.radius + n));
    const result = buildDailyResult("2026-08-01", puzzle, wrongGuesses);
    expect(result.won).toBe(false);
  });
});

describe("applyDailyResult streak logic", () => {
  it("starts a streak at 1 on a win", () => {
    const stats = createInitialStats();
    const puzzle = generatePuzzle("2026-08-01");
    const result = buildDailyResult("2026-08-01", puzzle, [puzzle.radius]);
    const next = applyDailyResult(stats, result);
    expect(next.currentStreak).toBe(1);
    expect(next.maxStreak).toBe(1);
  });

  it("does not start a streak on a loss", () => {
    const stats = createInitialStats();
    const puzzle = generatePuzzle("2026-08-01");
    const result = buildDailyResult("2026-08-01", puzzle, [1, 2, 3, 4]);
    const next = applyDailyResult(stats, result);
    expect(next.currentStreak).toBe(0);
    expect(next.maxStreak).toBe(0);
  });

  it("increments the streak on consecutive winning days", () => {
    let stats = createInitialStats();
    const puzzle1 = generatePuzzle("2026-08-01");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-01", puzzle1, [puzzle1.radius]));
    const puzzle2 = generatePuzzle("2026-08-02");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-02", puzzle2, [puzzle2.radius]));
    expect(stats.currentStreak).toBe(2);
    expect(stats.maxStreak).toBe(2);
  });

  it("resets the streak after a loss", () => {
    let stats = createInitialStats();
    const puzzle1 = generatePuzzle("2026-08-01");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-01", puzzle1, [puzzle1.radius]));
    const puzzle2 = generatePuzzle("2026-08-02");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-02", puzzle2, [1, 2, 3, 4]));
    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(1);
  });

  it("resets the streak after a skipped day even if won", () => {
    let stats = createInitialStats();
    const puzzle1 = generatePuzzle("2026-08-01");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-01", puzzle1, [puzzle1.radius]));
    const puzzle3 = generatePuzzle("2026-08-03");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-03", puzzle3, [puzzle3.radius]));
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
  });

  it("recording the same day twice overwrites that day's entry", () => {
    let stats = createInitialStats();
    const puzzle = generatePuzzle("2026-08-01");
    stats = applyDailyResult(stats, buildDailyResult("2026-08-01", puzzle, [puzzle.radius]));
    stats = applyDailyResult(stats, buildDailyResult("2026-08-01", puzzle, [1, 2, 3, 4]));
    expect(stats.history["2026-08-01"].won).toBe(false);
    expect(stats.currentStreak).toBe(0);
  });
});
