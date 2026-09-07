import type { Workout, WorkoutExercise, WorkoutSet } from './workout.types'

export type WorkoutSetForm = {
  id: string
  reps: string
  weight: string
}

export type WorkoutExerciseForm = {
  id: string
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

export function getTodayDateString(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 10)
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

      if (!Number.isFinite(reps) || !Number.isFinite(weight)) {
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

  if (!form.date || Number.isNaN(new Date(form.date).getTime())) {
    errors.date = 'Please pick a valid workout date.'
  }

  const durationValue = Number(form.duration)
  if (!Number.isFinite(durationValue) || durationValue <= 0) {
    errors.duration = 'Duration must be greater than 0 minutes.'
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

        if (!Number.isFinite(reps) || reps <= 0) {
          messages.push('Reps must be greater than 0.')
        }

        if (!Number.isFinite(weight) || weight < 0) {
          messages.push('Weight must be 0 or greater.')
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

export function buildWorkoutFromForm(form: WorkoutFormValues): Workout {
  const now = new Date().toISOString()

  const exercises: WorkoutExercise[] = form.exercises.map((exercise) => {
    const sets: WorkoutSet[] = exercise.sets.map((set) => ({
      reps: Number(set.reps),
      weight: Number(set.weight),
    }))

    return {
      exerciseId: crypto.randomUUID(),
      exerciseName: exercise.exerciseName.trim() || 'Exercise',
      muscleGroup: exercise.muscleGroup.trim() || 'General',
      sets,
    }
  })

  return {
    id: crypto.randomUUID(),
    date: form.date,
    duration: Number(form.duration),
    exercises,
    createdAt: now,
    updatedAt: now,
  }
}
