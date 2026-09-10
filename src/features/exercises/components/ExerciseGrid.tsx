import { ExerciseCard } from './ExerciseCard'
import type { Exercise } from '../exercise.types'

export function ExerciseGrid({ exercises, loading, onSelect }: { exercises: Exercise[]; loading: boolean; onSelect: (exercise: Exercise) => void }) {
  return <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:gap-6 xl:grid-cols-3" aria-busy={loading}>
    {exercises.map((exercise) => <ExerciseCard key={exercise.sourceId} exercise={exercise} onSelect={onSelect} />)}
    {loading && !exercises.length && Array.from({ length: 6 }, (_, index) => <div key={index} aria-hidden="true" className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest motion-safe:animate-pulse">
      <div className="aspect-[4/3] bg-surface-container" /><div className="space-y-3 p-5"><div className="h-5 w-3/4 rounded bg-surface-container" /><div className="h-10 rounded bg-surface-container-low" /><div className="h-6 w-1/2 rounded bg-surface-container-low" /></div>
    </div>)}
  </div>
}
