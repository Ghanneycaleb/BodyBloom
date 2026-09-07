import type { Workout, WorkoutRecord } from './workout.types'

const STORAGE_KEY = 'bodybloom.workouts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isWorkoutCandidate(value: unknown): value is WorkoutRecord {
  if (!isRecord(value)) {
    return false
  }

  const idIsValid = typeof value.id === 'string' || value.id === undefined || value.id === null
  const hasRequiredFields =
    idIsValid &&
    typeof value.date === 'string' &&
    typeof value.duration === 'number' &&
    Array.isArray(value.exercises)

  return hasRequiredFields
}

function normalizeWorkoutRecord(value: WorkoutRecord): Workout | null {
  if (!isWorkoutCandidate(value)) {
    return null
  }

  const rawExercises = Array.isArray(value.exercises) ? value.exercises : []
  const normalizedExercises = rawExercises.map((exercise) => {
    const candidate = isRecord(exercise) ? (exercise as Record<string, unknown>) : undefined

    const rawSets = Array.isArray(candidate?.sets) ? (candidate.sets as unknown[]) : []
    const normalizedSets = rawSets.map((set) => {
      const setCandidate = isRecord(set) ? (set as Record<string, unknown>) : undefined

      return {
        reps: typeof setCandidate?.reps === 'number' ? setCandidate.reps : 0,
        weight: typeof setCandidate?.weight === 'number' ? setCandidate.weight : 0,
      }
    })

    return {
      exerciseId: typeof candidate?.exerciseId === 'string' ? candidate.exerciseId : crypto.randomUUID(),
      exerciseName: typeof candidate?.exerciseName === 'string' ? candidate.exerciseName : 'Unknown Exercise',
      muscleGroup: typeof candidate?.muscleGroup === 'string' ? candidate.muscleGroup : 'General',
      sets: normalizedSets,
    }
  })

  return {
    id: typeof value.id === 'string' ? value.id : crypto.randomUUID(),
    date: value.date,
    duration: value.duration,
    exercises: normalizedExercises,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
  }
}

export function getWorkouts(): Workout[] {
  if (typeof window === 'undefined') {
    return []
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return []
  }

  try {
    const parsed = JSON.parse(storedValue) as unknown

    if (!Array.isArray(parsed)) {
      return []
    }

    const normalized = parsed
      .map((item) => normalizeWorkoutRecord(item as WorkoutRecord))
      .filter((item): item is Workout => item !== null)

    return normalized
  } catch {
    return []
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
}

export function addWorkout(workout: Workout): Workout[] {
  const nextWorkouts = [...getWorkouts(), workout]
  saveWorkouts(nextWorkouts)
  return nextWorkouts
}

export function updateWorkout(id: string, updates: Partial<Workout>): Workout[] {
  const nextWorkouts = getWorkouts().map((workout) =>
    workout.id === id
      ? {
          ...workout,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : workout,
  )

  saveWorkouts(nextWorkouts)
  return nextWorkouts
}

export function deleteWorkout(id: string): Workout[] {
  const nextWorkouts = getWorkouts().filter((workout) => workout.id !== id)
  saveWorkouts(nextWorkouts)
  return nextWorkouts
}

export { STORAGE_KEY }
