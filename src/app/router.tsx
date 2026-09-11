import { WorkoutHistoryPage, ExerciseExplorerPage, ProgressPage, MotivationPage, EditWorkoutPage, LogWorkoutPage } from './lazyRoutes'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'

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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
