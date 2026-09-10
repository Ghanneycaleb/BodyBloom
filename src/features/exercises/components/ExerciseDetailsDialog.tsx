import { Dialog } from '../../../components/ui/Dialog'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { selectionFromExercise } from '../../workouts/workout.external'
import { ExerciseImage } from './ExerciseImage'
import { WGER_API } from '../exercise.api'
import type { Exercise, ExerciseLicense } from '../exercise.types'

function Attribution({ label, author, licenseId, licenses }: { label: string; author: string; licenseId: number | null; licenses: ExerciseLicense[] }) {
  const license = licenses.find((item) => item.id === licenseId)
  return <p>{label}: {author || 'WGER contributors'}{license && <> · {license.url ? <a href={license.url} target="_blank" rel="noreferrer" className="underline focus-visible:outline-2 focus-visible:outline-primary">{license.name}</a> : license.name}</>}</p>
}
export function ExerciseDetailsDialog({ exercise, licenses, onClose }: { exercise: Exercise | null; licenses: ExerciseLicense[]; onClose: () => void }) {
  const navigate = useNavigate()
  return <Dialog open={exercise !== null} title={exercise?.name ?? 'Exercise details'} cancelText="Close" onClose={onClose} size="wide">
    {exercise && <div className="space-y-5 pt-3">
      <Button type="button" onClick={() => navigate('/log-workout', { state: { exerciseSelection: selectionFromExercise(exercise) } })}>Log this exercise</Button>
      <div className="mx-auto max-w-sm overflow-hidden rounded-xl"><ExerciseImage key={exercise.sourceId} exercise={exercise} eager /></div>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {[['Category', exercise.category], ['Primary muscles', exercise.muscles.join(', ') || 'Not specified'], ['Secondary muscles', exercise.secondaryMuscles.join(', ') || 'Not specified'], ['Equipment', exercise.equipment.join(', ') || 'Not specified']].map(([label, value]) => <div key={label} className="min-w-0"><dt className="font-semibold">{label}</dt><dd className="mt-1 break-words leading-6 text-secondary">{value}</dd></div>)}
      </dl>
      <section><h3 className="font-semibold">How to perform</h3><p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-secondary">{exercise.description}</p></section>
      <div className="space-y-1 border-t border-outline-variant/40 pt-4 text-xs leading-5 text-secondary">
        <Attribution label="Instructions" author={exercise.author} licenseId={exercise.licenseId} licenses={licenses} />
        {exercise.image && <Attribution label="Image" author={exercise.image.author} licenseId={exercise.image.licenseId} licenses={licenses} />}
        <p>Descriptions converted to plain text. <a href={`${WGER_API}exerciseinfo/${exercise.sourceId}/`} target="_blank" rel="noreferrer" className="text-primary underline focus-visible:outline-2 focus-visible:outline-primary">View WGER source record</a></p>
      </div>
    </div>}
  </Dialog>
}
