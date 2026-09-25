import type { PlayerStats } from "@/lib/types";

interface StreakBadgeProps {
  stats: PlayerStats | null;
}

export function StreakBadge({ stats }: StreakBadgeProps) {
  if (!stats || stats.currentStreak === 0) return null;
  return (
    <div
      className="animate-rise flex items-baseline gap-2 text-sm"
      title={`Streak ${stats.currentStreak}, best ${stats.maxStreak}`}
    >
      <span className="font-serif text-shu">連</span>
      <span className="font-medium tabular-nums">{stats.currentStreak}</span>
      <span className="text-xs text-ink/40 tabular-nums">best {stats.maxStreak}</span>
    </div>
  );
}
