import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

type DashboardHeaderProps = {
  workoutCount: number
}

export function DashboardHeader({ workoutCount }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-soft md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-primary">BodyBloom</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Good morning, athlete.
        </h2>
        <p className="mt-2 text-sm text-secondary md:text-base">
          {workoutCount === 0
            ? 'Start your training journey and build consistency.'
            : `You have ${workoutCount} logged workout${workoutCount === 1 ? '' : 's'} in your routine.`}
        </p>
      </div>

      <Link to="/log-workout" aria-label="Log a workout">
        <Button type="button" className="gap-2 px-5">
          <Dumbbell size={18} aria-hidden="true" />
          Log Workout
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Link>
    </header>
  )
}
