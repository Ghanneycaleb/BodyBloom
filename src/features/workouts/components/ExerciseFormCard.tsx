import { Dumbbell, Trash2 } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { starterExercises } from '../workout.data'
import type { WorkoutExerciseForm, WorkoutFormExerciseErrors } from '../workout.form'
import { ExerciseSetTable } from './ExerciseSetTable'

type ExerciseFormCardProps = {
  exercise: WorkoutExerciseForm
  exerciseErrors?: WorkoutFormExerciseErrors
  onExerciseNameChange: (exerciseId: string, value: string) => void
  onMuscleGroupChange: (exerciseId: string, value: string) => void
  onSetChange: (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => void
  onAddSet: (exerciseId: string) => void
  onRemoveSet: (exerciseId: string, setId: string) => void
  onRemoveExercise: (exerciseId: string) => void
}

export function ExerciseFormCard({
  exercise,
  exerciseErrors,
  onExerciseNameChange,
  onMuscleGroupChange,
  onSetChange,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}: ExerciseFormCardProps) {
  const nameOptions = starterExercises.map((item) => item.value)

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Dumbbell className="size-4" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-on-surface">Exercise</h3>
        </div>

        <button
          type="button"
          aria-label="Remove exercise"
          onClick={() => onRemoveExercise(exercise.id)}
          className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-2.5 py-2 text-sm font-medium text-secondary transition-colors hover:border-error/40 hover:text-error"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Remove
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`exercise-name-${exercise.id}`} className="mb-2 block text-sm font-medium text-on-surface">
            Exercise name
          </label>
          <input
            id={`exercise-name-${exercise.id}`}
            list="starter-exercises"
            value={exercise.exerciseName}
            onChange={(event) => onExerciseNameChange(exercise.id, event.target.value)}
            placeholder="Select or type an exercise"
            className="min-h-14 w-full rounded-md border border-outline-variant bg-surface-container-low px-4 text-base text-on-surface outline-none transition-colors placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {exerciseErrors?.name ? <p className="mt-2 text-sm text-error">{exerciseErrors.name}</p> : null}
        </div>

        <div>
          <label htmlFor={`exercise-muscle-${exercise.id}`} className="mb-2 block text-sm font-medium text-on-surface">
            Muscle group
          </label>
          <Input
            id={`exercise-muscle-${exercise.id}`}
            value={exercise.muscleGroup}
            onChange={(event) => onMuscleGroupChange(exercise.id, event.target.value)}
            placeholder="e.g. Chest"
          />
        </div>
      </div>

      <div className="mt-5">
        <ExerciseSetTable
          exercise={exercise}
          exerciseErrors={exerciseErrors}
          onSetChange={(setId, field, value) => onSetChange(exercise.id, setId, field, value)}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
        />
      </div>

      <datalist id="starter-exercises">
        {nameOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </Card>
  )
}
