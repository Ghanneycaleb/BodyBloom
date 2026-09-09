import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Clock3, Dumbbell, Layers3, Pencil, Trash2, Weight } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import type { Workout } from '../../workouts/workout.types'
import { formatWorkoutDate } from '../../workouts/workout.dates'
import { formatDuration, getWorkoutTotalSets, getWorkoutVolume } from '../../workouts/workout.calculations'
import { WorkoutDetails } from './WorkoutDetails'

type WorkoutHistoryCardProps = { workout: Workout; onDelete: (workout: Workout) => void }

export function WorkoutHistoryCard({ workout, onDelete }: WorkoutHistoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()
  const titleId = useId()
  const date = formatWorkoutDate(workout.date)
  const exerciseNames = workout.exercises.slice(0, 3).map((exercise) => `${exercise.exerciseName} (${exercise.sets.length} ${exercise.sets.length === 1 ? 'set' : 'sets'})`).join(' · ')
  const extraCount = Math.max(0, workout.exercises.length - 3)
  const stats = [
    { label: 'Duration', value: formatDuration(workout.duration), icon: Clock3 },
    { label: 'Exercises', value: String(workout.exercises.length), icon: Dumbbell },
    { label: 'Total sets', value: String(getWorkoutTotalSets(workout)), icon: Layers3 },
    { label: 'Volume', value: `${getWorkoutVolume(workout).toLocaleString()} kg x reps`, icon: Weight },
  ]

  return (
    <article className="min-w-0" aria-labelledby={titleId} data-workout-id={workout.id}>
      <Card className="relative min-w-0 space-y-4 rounded-2xl border-outline-variant/30 p-4 shadow-soft transition-shadow hover:shadow-md md:rounded-xl md:border-surface-container-highest md:p-5">
        <div className="pointer-events-none absolute right-0 top-0 size-24 rounded-bl-full rounded-tr-xl bg-primary/5" aria-hidden="true" />
        <h3 id={titleId} className="relative pr-4 text-xl font-semibold tracking-tight text-on-surface md:text-2xl"><time dateTime={workout.date}>{date}</time></h3>
        <dl className="relative flex flex-wrap gap-2 md:grid md:grid-cols-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex min-w-0 max-w-full items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 md:rounded-lg md:bg-surface-container-low md:p-3">
              <Icon size={17} className="shrink-0 text-primary" aria-hidden="true" />
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 md:block">
                <dt className="text-xs font-medium text-secondary">{label}</dt>
                <dd className="break-words text-xs font-medium tabular-nums text-on-surface md:mt-0.5 md:text-sm md:font-semibold">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="border-t border-surface-container-highest pt-3">
          <p className="line-clamp-2 break-words text-sm leading-6 text-secondary">{exerciseNames}</p>
          {extraCount > 0 && <p className="mt-1 text-xs text-secondary">+{extraCount} more exercise{extraCount === 1 ? '' : 's'} in details</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" aria-expanded={expanded} aria-controls={detailsId}
            aria-label={`${expanded ? 'Hide' : 'View'} details for workout on ${date}`} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide details' : 'View details'}<ChevronDown size={17} aria-hidden="true" className={expanded ? 'rotate-180' : ''} />
          </Button>
          <Link to={`/history/${encodeURIComponent(workout.id)}/edit`} aria-label={`Edit workout on ${date}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Pencil size={16} aria-hidden="true" />Edit
          </Link>
          <button type="button" aria-label={`Delete workout on ${date}`} onClick={() => onDelete(workout)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-error hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error">
            <Trash2 size={16} aria-hidden="true" />Delete
          </button>
        </div>
        <div id={detailsId} hidden={!expanded}>{expanded && <WorkoutDetails workout={workout} />}</div>
      </Card>
    </article>
  )
}
