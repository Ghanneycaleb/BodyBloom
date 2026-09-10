import type { Exercise } from '../exercises/exercise.types'
import type { WorkoutExercise } from './workout.types'
import type { WorkoutExerciseForm } from './workout.form'

export type ExerciseSelection = { source: 'wger'; sourceId: number; name: string; muscleGroup: string }

export function normalizeExternalExercise(value: unknown): WorkoutExercise['externalExercise'] {
  if (typeof value !== 'object' || value === null || !('source' in value) || value.source !== 'wger' ||
      !('sourceId' in value) || typeof value.sourceId !== 'number' || !Number.isSafeInteger(value.sourceId) || value.sourceId <= 0) return undefined
  return { source: 'wger', sourceId: value.sourceId }
}

export function selectionFromExercise(exercise: Exercise): ExerciseSelection {
  return { source: exercise.source, sourceId: exercise.sourceId, name: exercise.name,
    muscleGroup: exercise.muscles.join(', ') || exercise.category || 'General' }
}

export function normalizeExerciseRouteState(state: unknown): ExerciseSelection | null {
  if (typeof state !== 'object' || state === null || !('exerciseSelection' in state)) return null
  const value = state.exerciseSelection
  const reference = normalizeExternalExercise(value)
  if (!reference || typeof value !== 'object' || value === null || !('name' in value) ||
      typeof value.name !== 'string' || !value.name.trim() || !('muscleGroup' in value) || typeof value.muscleGroup !== 'string') return null
  return { ...reference, name: value.name.trim(), muscleGroup: value.muscleGroup.trim() || 'General' }
}

export function applyExerciseSelection(row: WorkoutExerciseForm, selection: ExerciseSelection): WorkoutExerciseForm {
  return { ...row, exerciseName: selection.name, muscleGroup: selection.muscleGroup,
    externalExercise: { source: selection.source, sourceId: selection.sourceId } }
}

// Whitespace around a name is harmless. Any other rename makes the row manual.
export function renameWorkoutExercise(row: WorkoutExerciseForm, name: string): WorkoutExerciseForm {
  const next = { ...row, exerciseName: name }
  if (name.trim() !== row.exerciseName.trim()) delete next.externalExercise
  return next
}
