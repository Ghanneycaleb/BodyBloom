import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

type SaveWorkoutBarProps = {
  isSubmitting: boolean
  submitLabel?: string
  onCancel: () => void
}

export function SaveWorkoutBar({ isSubmitting, onCancel, submitLabel = 'Save Workout' }: SaveWorkoutBarProps) {
  return (
    <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-4 z-10 mt-6 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/95 p-3 shadow-soft backdrop-blur-sm md:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          <Save className="size-4" aria-hidden="true" />
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </div>
  )
}
