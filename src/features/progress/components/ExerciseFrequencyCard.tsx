import { Dumbbell } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { formatProgressNumber } from '../progress.calculations'
import type { ProgressAnalytics } from '../progress.types'

export function ExerciseFrequencyCard({ exercises }: { exercises: ProgressAnalytics['topExercises'] }) {
  return (
    <Card className="min-w-0 p-4 md:p-6">
      <h2 className="text-xl font-bold tracking-tight">Most Performed Exercises</h2>
      <p className="mt-2 text-xs leading-5 text-secondary">Top five by logged exercise entries in this range, not by number of sets.</p>
      <ol className="mt-5 space-y-3">
        {exercises.map((exercise, index) => (
          <li key={exercise.exerciseName} className="flex min-w-0 items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low/60 p-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
            <div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{exercise.exerciseName}</p><p className="mt-1 text-xs text-secondary">{formatProgressNumber(exercise.count)} {exercise.count === 1 ? 'entry' : 'entries'}</p></div>
            <Dumbbell size={18} className="shrink-0 text-primary" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs leading-5 text-secondary">Names match exactly. Different spellings or capitalization are counted separately.</p>
    </Card>
  )
}
