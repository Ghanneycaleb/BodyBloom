import { useMemo, useState, type ReactNode } from 'react'
import { addWorkout as addWorkoutToStorage, deleteWorkout as deleteWorkoutFromStorage, getWorkouts, updateWorkout as updateWorkoutInStorage } from './workout.storage'
import type { Workout } from './workout.types'
import { WorkoutContext, type WorkoutContextValue } from './workout.context-core'

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(() => getWorkouts())

  const addWorkout = (workout: Workout) => {
    const next = addWorkoutToStorage(workout)
    setWorkouts(next)
  }

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    const next = updateWorkoutInStorage(id, updates)
    setWorkouts(next)
  }

  const deleteWorkout = (id: string) => {
    const next = deleteWorkoutFromStorage(id)
    setWorkouts(next)
  }

  const refresh = () => {
    setWorkouts(getWorkouts())
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

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

