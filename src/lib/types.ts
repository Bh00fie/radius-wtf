export interface Round {
  /** True radius for this round, in game units. */
  radius: number;
}

export interface Puzzle {
  /** UTC date string "YYYY-MM-DD" identifying this puzzle. */
  date: string;
  /** Days since LAUNCH_DATE_UTC, shown as "Radius #N". */
  dayIndex: number;
  rounds: Round[];
}

export interface DailyResult {
  date: string;
  guesses: number[];
  answers: number[];
  scores: number[];
  totalScore: number;
  averageScore: number;
}

export interface PlayerStats {
  version: 1;
  lastPlayedDate: string | null;
  currentStreak: number;
  maxStreak: number;
  history: Record<string, DailyResult>;
}
