import { formatWorkoutDate } from '../../workouts/workout.dates'
import { CalendarDays, Clock3, Dumbbell } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { getWorkoutVolume } from '../../workouts/workout.calculations'
import type { Workout } from '../../workouts/workout.types'

type RecentWorkoutsProps = {
  workouts: Workout[]
}

export function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  if (workouts.length === 0) {
    return null
  }

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">Recent workouts</p>
          <h3 className="mt-1 text-xl font-bold text-on-surface">Latest sessions</h3>
        </div>
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                <CalendarDays size={16} className="text-primary" aria-hidden="true" />
                {formatWorkoutDate(workout.date)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Dumbbell size={14} aria-hidden="true" />
                  {workout.exercises.length} exercise{workout.exercises.length === 1 ? '' : 's'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} aria-hidden="true" />
                  {workout.duration} min
                </span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs uppercase tracking-[0.12em] text-secondary">Volume</p>
              <p className="mt-1 text-lg font-bold text-on-surface">{getWorkoutVolume(workout).toLocaleString()} kg</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
