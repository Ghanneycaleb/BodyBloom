import { lazy } from 'react'

export const WorkoutHistoryPage = lazy(() => import('../features/history/WorkoutHistoryPage').then((module) => ({ default: module.WorkoutHistoryPage })))
export const ExerciseExplorerPage = lazy(() => import('../features/exercises/ExerciseExplorerPage').then((module) => ({ default: module.ExerciseExplorerPage })))
export const ProgressPage = lazy(() => import('../features/progress/ProgressPage').then((module) => ({ default: module.ProgressPage })))
export const MotivationPage = lazy(() => import('../features/motivation/MotivationPage').then((module) => ({ default: module.MotivationPage })))
export const EditWorkoutPage = lazy(() => import('../features/workouts/EditWorkoutPage').then((module) => ({ default: module.EditWorkoutPage })))
export const LogWorkoutPage = lazy(() => import('../features/workouts/LogWorkoutPage').then((module) => ({ default: module.LogWorkoutPage })))
