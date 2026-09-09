import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import type { Exercise } from '../exercise.types'

export function ExerciseImage({ exercise, eager = false }: { exercise: Exercise; eager?: boolean }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const url = exercise.image?.url
  return <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-surface-container-low">
    {url && failedUrl !== url ? <img src={url} alt={`${exercise.name} demonstration`} loading={eager ? 'eager' : 'lazy'} referrerPolicy="no-referrer" onError={() => setFailedUrl(url)} className="h-full w-full object-contain p-3" /> : <div className="flex flex-col items-center gap-3 px-3 py-4 text-center text-secondary">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"><Dumbbell size={30} strokeWidth={1.5} aria-hidden="true" /></span>
      <span className="text-xs">Image unavailable</span>
    </div>}
  </div>
}
