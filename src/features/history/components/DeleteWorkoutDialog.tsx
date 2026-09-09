import { Dialog } from '../../../components/ui/Dialog'
import { formatWorkoutDate } from '../../workouts/workout.dates'
import type { Workout } from '../../workouts/workout.types'

type DeleteWorkoutDialogProps = {
  workout: Workout | null
  error: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteWorkoutDialog({ workout, error, onClose, onConfirm }: DeleteWorkoutDialogProps) {
  return (
    <Dialog open={Boolean(workout)} title="Delete workout?"
      description={workout ? `Delete your workout from ${formatWorkoutDate(workout.date)} and all of its sets? This cannot be undone.` : undefined}
      confirmText="Delete workout" cancelText="Keep workout" onClose={onClose} onConfirm={onConfirm}>
      {error && <p role="alert" className="mt-3 text-sm text-error">{error}</p>}
    </Dialog>
  )
}
