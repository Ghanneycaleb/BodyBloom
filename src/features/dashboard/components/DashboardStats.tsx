import { Activity, Flame, TrendingUp, Trophy } from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'

type DashboardStatsProps = {
  totalWorkouts: number
  currentStreak: number
  totalVolume: number
  mostPerformedExercise: string
}

export function DashboardStats({
  totalWorkouts,
  currentStreak,
  totalVolume,
  mostPerformedExercise,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Workouts"
        value={String(totalWorkouts)}
        detail={totalWorkouts === 1 ? 'session tracked' : 'sessions tracked'}
        icon={<Activity size={18} aria-hidden="true" />}
      />
      <StatCard
        label="Current Streak"
        value={`${currentStreak}d`}
        detail={currentStreak === 1 ? 'day active' : 'days active'}
        icon={<Flame size={18} aria-hidden="true" />}
      />
      <StatCard
        label="Total Volume"
        value={`${totalVolume.toLocaleString()}`}
        detail="kg x reps"
        icon={<TrendingUp size={18} aria-hidden="true" />}
      />
      <StatCard
        label="Most Performed"
        value={mostPerformedExercise}
        detail={mostPerformedExercise === 'No exercises logged' ? 'No data yet' : 'top exercise'}
        icon={<Trophy size={18} aria-hidden="true" />}
      />
    </section>
  )
}
