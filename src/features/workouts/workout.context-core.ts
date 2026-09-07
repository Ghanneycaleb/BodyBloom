import { createContext } from 'react'
import type { Workout } from './workout.types'

export type WorkoutContextValue = {
  workouts: Workout[]
  addWorkout: (workout: Workout) => void
  updateWorkout: (id: string, updates: Partial<Workout>) => void
  deleteWorkout: (id: string) => void
  refresh: () => void
}

export const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined)
