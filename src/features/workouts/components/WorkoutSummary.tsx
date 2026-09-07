import { Activity, Dumbbell, TimerReset } from 'lucide-react'
import type { WorkoutSummary as WorkoutSummaryData } from '../workout.form'

type WorkoutSummaryProps = {
  summary: WorkoutSummaryData
}

export function WorkoutSummary({ summary }: WorkoutSummaryProps) {
  return (
    <aside className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-soft md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-on-surface">Workout summary</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3">
          <div className="flex items-center gap-2 text-secondary">
            <Dumbbell className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">Exercises</span>
          </div>
          <span className="text-lg font-semibold text-on-surface">{summary.exerciseCount}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3">
          <div className="flex items-center gap-2 text-secondary">
            <TimerReset className="size-4" aria-hidden="true" />
            <span className="text-sm font-medium">Total sets</span>
          </div>
          <span className="text-lg font-semibold text-on-surface">{summary.totalSets}</span>
        </div>

        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-sm font-medium text-secondary">Total volume</p>
          <p className="mt-2 text-2xl font-bold text-on-surface">{summary.totalVolume.toLocaleString()} kg</p>
        </div>
      </div>
    </aside>
  )
}
