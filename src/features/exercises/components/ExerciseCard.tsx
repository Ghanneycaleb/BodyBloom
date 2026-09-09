import { ArrowUpRight } from 'lucide-react'
import { ExerciseImage } from './ExerciseImage'
import type { Exercise } from '../exercise.types'

export function ExerciseCard({ exercise, onSelect }: { exercise: Exercise; onSelect: (exercise: Exercise) => void }) {
  return <button type="button" onClick={() => onSelect(exercise)} aria-label={`View ${exercise.name} details`} data-exercise-id={exercise.sourceId} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-white text-left shadow-soft transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
    <ExerciseImage exercise={exercise} />
    <span className="flex w-full min-w-0 flex-1 flex-col gap-3 p-3 sm:p-5">
      <span className="line-clamp-2 break-words text-base font-bold tracking-tight sm:text-lg">{exercise.name}</span>
      <span className="line-clamp-2 break-words text-xs leading-5 text-secondary sm:text-sm">{exercise.description}</span>
      <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
        <span className="max-w-full break-words rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{exercise.category}</span>
        {exercise.muscles[0] && exercise.muscles[0] !== exercise.category && <span className="max-w-full break-words rounded-full bg-surface-container-low px-2.5 py-1 text-xs text-secondary">{exercise.muscles[0]}</span>}
      </span>
      <span className="flex items-center justify-between border-t border-outline-variant/30 pt-3 text-xs font-semibold text-primary">View details <ArrowUpRight size={17} aria-hidden="true" /></span>
    </span>
  </button>
}
