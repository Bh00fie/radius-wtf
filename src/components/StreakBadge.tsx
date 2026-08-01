import type { PlayerStats } from "@/lib/types";

interface StreakBadgeProps {
  stats: PlayerStats | null;
}

export function StreakBadge({ stats }: StreakBadgeProps) {
  if (!stats || stats.currentStreak === 0) return null;
  return (
    <div className="text-sm text-neutral-500">
      🔥 {stats.currentStreak} <span className="text-neutral-400">(best {stats.maxStreak})</span>
    </div>
  );
}
