import { getTodayDateString, isWorkoutDate } from './workout.dates'
import type { Workout, WorkoutExercise, WorkoutSet } from './workout.types'

export type WorkoutSetForm = {
  id: string
  reps: string
  weight: string
}

export type WorkoutExerciseForm = {
  id: string
  exerciseId?: string
  exerciseName: string
  muscleGroup: string
  sets: WorkoutSetForm[]
}

export type WorkoutFormValues = {
  date: string
  duration: string
  exercises: WorkoutExerciseForm[]
}

export type WorkoutFormExerciseErrors = {
  name?: string
  sets?: Record<string, string>
}

export type WorkoutFormErrors = {
  date?: string
  duration?: string
  exercises?: string
  exerciseErrors?: Record<string, WorkoutFormExerciseErrors>
}

export type WorkoutSummary = {
  exerciseCount: number
  totalSets: number
  totalVolume: number
}

export function createEmptySet(): WorkoutSetForm {
  return {
    id: crypto.randomUUID(),
    reps: '10',
    weight: '0',
  }
}

export function createEmptyExercise(): WorkoutExerciseForm {
  return {
    id: crypto.randomUUID(),
    exerciseName: '',
    muscleGroup: '',
    sets: [createEmptySet()],
  }
}

export function createDefaultWorkoutForm(): WorkoutFormValues {
  return {
    date: getTodayDateString(),
    duration: '45',
    exercises: [createEmptyExercise()],
  }
}

export function calculateWorkoutSummary(form: WorkoutFormValues): WorkoutSummary {
  const exerciseCount = form.exercises.length
  const totalSets = form.exercises.reduce((count, exercise) => count + exercise.sets.length, 0)
  const totalVolume = form.exercises.reduce((volume, exercise) => {
    return volume + exercise.sets.reduce((exerciseVolume, set) => {
      const reps = Number(set.reps)
      const weight = Number(set.weight)

      if (!Number.isSafeInteger(reps) || reps <= 0 || !set.weight.trim() || !Number.isFinite(weight) || weight < 0 || !Number.isFinite(reps * weight)) {
        return exerciseVolume
      }

      return exerciseVolume + reps * weight
    }, 0)
  }, 0)

  return {
    exerciseCount,
    totalSets,
    totalVolume,
  }
}

export function validateWorkoutForm(form: WorkoutFormValues): WorkoutFormErrors {
  const errors: WorkoutFormErrors = {}

  if (!isWorkoutDate(form.date)) {
    errors.date = 'Please pick a valid workout date.'
  }

  const durationValue = Number(form.duration)
  if (!Number.isSafeInteger(durationValue) || durationValue <= 0) {
    errors.duration = 'Duration must be a positive whole number of minutes.'
  }

  if (form.exercises.length === 0) {
    errors.exercises = 'Add at least one exercise to save your workout.'
  }

  const exerciseErrors: Record<string, WorkoutFormExerciseErrors> = {}

  form.exercises.forEach((exercise) => {
    const currentErrors: WorkoutFormExerciseErrors = {}

    if (!exercise.exerciseName.trim()) {
      currentErrors.name = 'Exercise name is required.'
    }

    if (exercise.sets.length === 0) {
      currentErrors.sets = {
        all: 'Add at least one set for this exercise.',
      }
    } else {
      const setErrors: Record<string, string> = {}

      exercise.sets.forEach((set) => {
        const reps = Number(set.reps)
        const weight = Number(set.weight)
        const messages: string[] = []

        if (!Number.isSafeInteger(reps) || reps <= 0) {
          messages.push('Reps must be a positive whole number.')
        }

        if (!set.weight.trim() || !Number.isFinite(weight) || weight < 0 || !Number.isFinite(reps * weight)) {
          messages.push('Enter a valid weight of 0 or greater.')
        }

        if (messages.length > 0) {
          setErrors[set.id] = messages.join(' ')
        }
      })

      if (Object.keys(setErrors).length > 0) {
        currentErrors.sets = setErrors
      }
    }

    if (Object.keys(currentErrors).length > 0) {
      exerciseErrors[exercise.id] = currentErrors
    }
  })

  if (Object.keys(exerciseErrors).length > 0) {
    errors.exerciseErrors = exerciseErrors
  }

  return errors
}

export function buildWorkoutFromForm(form: WorkoutFormValues, existing?: Workout): Workout {
  if (Object.keys(validateWorkoutForm(form)).length) throw new Error('Please correct the workout fields before saving.')
  const now = new Date().toISOString()

  const exercises: WorkoutExercise[] = form.exercises.map((exercise) => {
    const sets: WorkoutSet[] = exercise.sets.map((set) => ({
      reps: Number(set.reps),
      weight: Number(set.weight),
    }))

    return {
      exerciseId: exercise.exerciseId ?? crypto.randomUUID(),
      exerciseName: exercise.exerciseName.trim() || 'Exercise',
      muscleGroup: exercise.muscleGroup.trim() || 'General',
      sets,
    }
  })

  return {
    id: existing?.id ?? crypto.randomUUID(),
    date: form.date,
    duration: Number(form.duration),
    exercises,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}

export function isWorkoutFormDirty(form: WorkoutFormValues, initial: WorkoutFormValues): boolean {
  const content = (value: WorkoutFormValues) => JSON.stringify({
    date: value.date, duration: value.duration,
    exercises: value.exercises.map((exercise) => ({
      exerciseName: exercise.exerciseName, muscleGroup: exercise.muscleGroup,
      sets: exercise.sets.map((set) => ({ reps: set.reps, weight: set.weight })),
    })),
  })
  return content(form) !== content(initial)
}

/** UI row IDs stay separate from persisted exercise identity. */
export function workoutToFormValues(workout: Workout): WorkoutFormValues {
  return {
    date: workout.date,
    duration: String(workout.duration),
    exercises: workout.exercises.map((exercise) => ({
      id: crypto.randomUUID(),
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      muscleGroup: exercise.muscleGroup,
      sets: exercise.sets.map((set) => ({ id: crypto.randomUUID(), reps: String(set.reps), weight: String(set.weight) })),
    })),
  }
}
