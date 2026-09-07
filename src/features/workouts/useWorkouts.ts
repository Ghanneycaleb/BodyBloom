import { useContext } from 'react'
import { WorkoutContext } from './workout.context-core'

export function useWorkouts() {
  const context = useContext(WorkoutContext)

  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider')
  }

  return context
}
