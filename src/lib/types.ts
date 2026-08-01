export interface Puzzle {
  /** Local "YYYY-MM-DD" date string identifying this puzzle for the player. */
  date: string;
  /** Days since LAUNCH_DATE, shown as "Radius #N". */
  dayIndex: number;
  /** The single true radius for the day, in game units. */
  radius: number;
}

export interface DailyResult {
  date: string;
  radius: number;
  guesses: number[];
  won: boolean;
}

export interface PlayerStats {
  version: 2;
  lastPlayedDate: string | null;
  currentStreak: number;
  maxStreak: number;
  history: Record<string, DailyResult>;
}
