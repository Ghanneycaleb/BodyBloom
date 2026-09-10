import { WorkoutHistoryPage } from '../features/history/WorkoutHistoryPage'
import { ExerciseExplorerPage } from '../features/exercises/ExerciseExplorerPage'
import { ProgressPage } from '../features/progress/ProgressPage'
import { MotivationPage } from '../features/motivation/MotivationPage'
import { EditWorkoutPage } from '../features/workouts/EditWorkoutPage'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { LogWorkoutPage } from '../features/workouts/LogWorkoutPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/log-workout', element: <LogWorkoutPage /> },
      { path: '/history', element: <WorkoutHistoryPage /> },
      { path: '/history/:workoutId/edit', element: <EditWorkoutPage /> },
      { path: '/exercises', element: <ExerciseExplorerPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/motivation', element: <MotivationPage /> },
    ],
  },
])
