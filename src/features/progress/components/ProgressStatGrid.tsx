import { Activity, Flame, Weight, CalendarDays } from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'
import { formatProgressNumber } from '../progress.calculations'
import type { ProgressAnalytics } from '../progress.types'

export function ProgressStatGrid({ data }: { data: ProgressAnalytics }) {
  return (
    <section aria-label="Progress statistics" className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      <StatCard label="Total Workouts" value={formatProgressNumber(data.totalWorkouts)} detail="in selected range" icon={<Activity size={18} />} />
      <StatCard label="Training Volume" value={formatProgressNumber(data.totalVolume, true)} detail={`${formatProgressNumber(data.totalVolume)} kg × reps`} icon={<Weight size={18} />} />
      <StatCard label="Current Streak" value={`${data.currentStreak}d`} detail="today/yesterday · all history" icon={<Flame size={18} />} />
      <StatCard label="Avg Workouts / Week" value={formatProgressNumber(data.averagePerWeek)} detail="in selected range" icon={<CalendarDays size={18} />} />
    </section>
  )
}
