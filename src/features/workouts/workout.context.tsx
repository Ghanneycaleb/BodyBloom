import { useMemo, useState, type ReactNode } from 'react'
import { addWorkout as addWorkoutToStorage, deleteWorkout as deleteWorkoutFromStorage, getWorkouts, updateWorkout as updateWorkoutInStorage } from './workout.storage'
import type { Workout } from './workout.types'
import { WorkoutContext, type WorkoutContextValue } from './workout.context-core'

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [initial] = useState<{ workouts: Workout[]; error: string }>(() => {
    try { return { workouts: getWorkouts(), error: '' } }
    catch (error) { return { workouts: [], error: error instanceof Error ? error.message : 'Saved workouts could not be loaded.' } }
  })
  const [workouts, setWorkouts] = useState<Workout[]>(initial.workouts)
  const [loadError, setLoadError] = useState(initial.error)

  const addWorkout = (workout: Workout) => {
    const next = addWorkoutToStorage(workout)
    setWorkouts(next)
    setLoadError('')
  }

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    const next = updateWorkoutInStorage(id, updates)
    setWorkouts(next)
    setLoadError('')
  }

  const deleteWorkout = (id: string) => {
    const next = deleteWorkoutFromStorage(id)
    setWorkouts(next)
    setLoadError('')
  }

  const refresh = () => {
    setWorkouts(getWorkouts())
    setLoadError('')
  }

  const value = useMemo<WorkoutContextValue>(
    () => ({
      workouts,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      refresh,
    }),
    [workouts],
  )

  return <WorkoutContext.Provider value={value}>
    {loadError && <p role="alert" className="relative z-50 bg-surface-container-lowest p-4 text-error">{loadError}</p>}
    {children}
  </WorkoutContext.Provider>
}

