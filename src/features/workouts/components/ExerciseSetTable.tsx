import { Input } from '../../../components/ui/Input'
import type { WorkoutExerciseForm, WorkoutFormExerciseErrors } from '../workout.form'

type ExerciseSetTableProps = {
  exercise: WorkoutExerciseForm
  exerciseErrors?: WorkoutFormExerciseErrors
  onSetChange: (setId: string, field: 'reps' | 'weight', value: string) => void
  onAddSet: (exerciseId: string) => void
  onRemoveSet: (exerciseId: string, setId: string) => void
}

export function ExerciseSetTable({
  exercise,
  exerciseErrors,
  onSetChange,
  onAddSet,
  onRemoveSet,
}: ExerciseSetTableProps) {
  return (
    <div className="min-w-0">
      <div className="min-w-0">
        <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-2 border-b border-outline-variant/60 pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-secondary">
          <span>Set</span>
          <span>Reps</span>
          <span>Weight (kg)</span>
          <span className="text-right">Action</span>
        </div>

        <div className="mt-3 space-y-3">
          {exercise.sets.map((set, setIndex) => {
            return (
              <div key={set.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-end gap-2">
                <div className="text-sm font-medium text-secondary">{setIndex + 1}</div>

                <div>
                  <label className="sr-only" htmlFor={`exercise-${exercise.id}-set-${set.id}-reps`}>
                    Reps for set {setIndex + 1}
                  </label>
                  <Input
                    id={`exercise-${exercise.id}-set-${set.id}-reps`}
                    aria-invalid={Boolean(exerciseErrors?.sets?.[set.id])}
                    aria-describedby={exerciseErrors?.sets?.[set.id] ? `set-${exercise.id}-${set.id}-error` : undefined}
                    type="number"
                    min="1"
                    inputMode="numeric"
                    step="1"
                    value={set.reps}
                    onChange={(event) => onSetChange(set.id, 'reps', event.target.value)}
                    className="px-1 text-center"
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor={`exercise-${exercise.id}-set-${set.id}-weight`}>
                    Weight for set {setIndex + 1}
                  </label>
                  <div className="relative">
                    <Input
                      id={`exercise-${exercise.id}-set-${set.id}-weight`}
                      aria-invalid={Boolean(exerciseErrors?.sets?.[set.id])}
                      aria-describedby={exerciseErrors?.sets?.[set.id] ? `set-${exercise.id}-${set.id}-error` : undefined}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(event) => onSetChange(set.id, 'weight', event.target.value)}
                      className="px-1 text-center"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Remove set ${setIndex + 1}`}
                  onClick={() => onRemoveSet(exercise.id, set.id)}
                  disabled={exercise.sets.length === 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-outline-variant bg-surface-container-low text-sm font-medium text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-secondary"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>

        {exerciseErrors?.sets && Object.values(exerciseErrors.sets).length > 0 ? (
          <div className="mt-3 space-y-1">
            {Object.entries(exerciseErrors.sets).map(([setId, message]) => (
              <p key={setId} id={`set-${exercise.id}-${setId}-error`} className="text-sm text-error">
                {message}
              </p>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onAddSet(exercise.id)}
          className="mt-4 inline-flex items-center rounded-md bg-primary/8 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/12"
        >
          + Add set
        </button>
      </div>
    </div>
  )
}
