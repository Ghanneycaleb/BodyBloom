import type { Workout, WorkoutExercise } from './workout.types'
import { isWorkoutDate } from './workout.dates'

const STORAGE_KEY = 'bodybloom.workouts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeWorkoutRecord(value: unknown): Workout | null {
  if (!isRecord(value) || typeof value.date !== 'string' || !isWorkoutDate(value.date) ||
      typeof value.duration !== 'number' || !Number.isFinite(value.duration) || value.duration <= 0 ||
      !Array.isArray(value.exercises) || value.exercises.length === 0) return null
  if (value.id != null && (typeof value.id !== 'string' || !value.id.trim())) return null
  const exercises: WorkoutExercise[] = []
  for (const exercise of value.exercises) {
    if (!isRecord(exercise) || typeof exercise.exerciseId !== 'string' || !exercise.exerciseId.trim() ||
        typeof exercise.exerciseName !== 'string' || !exercise.exerciseName.trim() ||
        typeof exercise.muscleGroup !== 'string' || !Array.isArray(exercise.sets) || exercise.sets.length === 0) return null
    const sets = []
    for (const set of exercise.sets) {
      if (!isRecord(set) || typeof set.reps !== 'number' || !Number.isSafeInteger(set.reps) || set.reps <= 0 ||
          typeof set.weight !== 'number' || !Number.isFinite(set.weight) || set.weight < 0 ||
          !Number.isFinite(set.reps * set.weight)) return null
      sets.push({ reps: set.reps, weight: set.weight })
    }
    exercises.push({ exerciseId: exercise.exerciseId, exerciseName: exercise.exerciseName, muscleGroup: exercise.muscleGroup, sets })
  }
  // Legacy records may lack identity/timestamps; never invent exercise content.
  const now = new Date().toISOString()
  for (const key of ['createdAt', 'updatedAt']) {
    if (value[key] !== undefined && (typeof value[key] !== 'string' || !Number.isFinite(Date.parse(value[key])))) return null
  }
  return {
    id: typeof value.id === 'string' ? value.id : crypto.randomUUID(),
    date: value.date, duration: value.duration, exercises,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : now,
  }
}

export function getWorkouts(): Workout[] {
  if (typeof window === 'undefined') return []
  let storedValue: string | null
  try {
    storedValue = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    throw new Error('Saved workouts could not be read. Allow browser storage and try again.')
  }
  if (!storedValue) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(storedValue)
  } catch {
    throw new Error('Saved workout data is unreadable. Back up or repair browser storage before saving again.')
  }
  if (!Array.isArray(parsed)) throw new Error('Saved workout data is not a list. Back up or repair browser storage before saving again.')
  const seen = new Set<string>()
  return parsed.map(normalizeWorkoutRecord).filter((item): item is Workout => {
    if (!item || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

export function saveWorkouts(workouts: Workout[]): void {
  if (workouts.some((workout) => !normalizeWorkoutRecord(workout))) {
    throw new Error('This workout contains invalid data and could not be saved.')
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
  } catch {
    throw new Error('Workout could not be saved. Browser storage may be full or unavailable. Your edits are still here; please try again.')
  }
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
