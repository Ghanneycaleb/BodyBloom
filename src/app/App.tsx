import { RouterProvider } from 'react-router-dom'
import { WorkoutProvider } from '../features/workouts/workout.context'
import { router } from './router'

export default function App() {
  return (
    <WorkoutProvider>
      <RouterProvider router={router} />
    </WorkoutProvider>
  )
}
