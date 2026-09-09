import { WorkoutHistoryPage } from '../features/history/WorkoutHistoryPage'
import { ExerciseExplorerPage } from '../features/exercises/ExerciseExplorerPage'
import { EditWorkoutPage } from '../features/workouts/EditWorkoutPage'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { LogWorkoutPage } from '../features/workouts/LogWorkoutPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/log-workout', element: <LogWorkoutPage /> },
      { path: '/history', element: <WorkoutHistoryPage /> },
      { path: '/history/:workoutId/edit', element: <EditWorkoutPage /> },
      { path: '/exercises', element: <ExerciseExplorerPage /> },
      { path: '/progress', element: <PlaceholderPage title="Progress" description="Your progress insights will live here." /> },
      { path: '/motivation', element: <PlaceholderPage title="Motivation" description="Your motivation hub will live here." /> },
    ],
  },
])
