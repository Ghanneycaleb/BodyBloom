import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkouts } from '../workouts/useWorkouts'
import { getCurrentStreak, getMostPerformedExercise, getTotalVolume, getRecentWorkouts } from '../workouts/workout.calculations'
import { DashboardEmptyState } from './components/DashboardEmptyState'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { RecentWorkouts } from './components/RecentWorkouts'
import { WorkoutActivityChart } from './components/WorkoutActivityChart'

export function DashboardPage() {
  const { workouts } = useWorkouts()
  const location = useLocation()
  const navigate = useNavigate()
  const state: unknown = location.state
  const saved = typeof state === 'object' && state !== null && 'workoutSaved' in state && state.workoutSaved === true
  useEffect(() => {
    if (!saved) return
    const timeout = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null })
    }, 5000)
    return () => window.clearTimeout(timeout)
  }, [saved, location.pathname, navigate])
  const confirmation = saved ? <p role="status" className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-primary">Workout saved successfully.</p> : null

  const totalWorkouts = workouts.length
  const currentStreak = getCurrentStreak(workouts)
  const totalVolume = getTotalVolume(workouts)
  const mostPerformedExercise = getMostPerformedExercise(workouts)
  const recentWorkouts = getRecentWorkouts(workouts, 4)

  if (totalWorkouts === 0) {
    return (
      <div className="space-y-6">
        {confirmation}
        <DashboardHeader workoutCount={0} />
        <DashboardEmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {confirmation}
      <DashboardHeader workoutCount={totalWorkouts} />

      <DashboardStats
        totalWorkouts={totalWorkouts}
        currentStreak={currentStreak}
        totalVolume={totalVolume}
        mostPerformedExercise={mostPerformedExercise.exerciseName}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
        <WorkoutActivityChart workouts={workouts} />
        <RecentWorkouts workouts={recentWorkouts} />
      </div>
    </div>
  )
}
