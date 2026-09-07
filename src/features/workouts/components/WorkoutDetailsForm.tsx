import { CalendarDays, Clock3 } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import type { WorkoutFormErrors } from '../workout.form'

type WorkoutDetailsFormProps = {
  date: string
  duration: string
  errors: WorkoutFormErrors
  onDateChange: (value: string) => void
  onDurationChange: (value: string) => void
}

export function WorkoutDetailsForm({
  date,
  duration,
  errors,
  onDateChange,
  onDurationChange,
}: WorkoutDetailsFormProps) {
  return (
    <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-soft md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-on-surface">Workout details</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="workout-date" className="mb-2 block text-sm font-medium text-on-surface">
            Workout date
          </label>
          <div className="relative">
            <Input
              id="workout-date"
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="pr-11"
            />
            <CalendarDays className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-secondary" aria-hidden="true" />
          </div>
          {errors.date ? <p className="mt-2 text-sm text-error">{errors.date}</p> : null}
        </div>

        <div>
          <label htmlFor="workout-duration" className="mb-2 block text-sm font-medium text-on-surface">
            Duration (minutes)
          </label>
          <div className="relative">
            <Input
              id="workout-duration"
              type="number"
              min="1"
              step="1"
              value={duration}
              onChange={(event) => onDurationChange(event.target.value)}
              className="pr-11"
            />
            <Clock3 className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-secondary" aria-hidden="true" />
          </div>
          {errors.duration ? <p className="mt-2 text-sm text-error">{errors.duration}</p> : null}
        </div>
      </div>
    </section>
  )
}
