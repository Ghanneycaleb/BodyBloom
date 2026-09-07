import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

type SaveWorkoutBarProps = {
  isValid: boolean
  onCancel: () => void
  onSave: () => void
}

export function SaveWorkoutBar({ isValid, onCancel, onSave }: SaveWorkoutBarProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/95 p-3 shadow-soft backdrop-blur-sm md:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Cancel
        </Button>

        <Button type="button" onClick={onSave} disabled={!isValid} className="w-full sm:w-auto">
          <Save className="size-4" aria-hidden="true" />
          Save Workout
        </Button>
      </div>
    </div>
  )
}
