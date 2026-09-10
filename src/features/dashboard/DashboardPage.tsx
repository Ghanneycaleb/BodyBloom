import { lazy, Suspense, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkouts } from '../workouts/useWorkouts'
import { getCurrentStreak, getMostPerformedExercise, getTotalVolume, getRecentWorkouts } from '../workouts/workout.calculations'
import { DashboardEmptyState } from './components/DashboardEmptyState'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { RecentWorkouts } from './components/RecentWorkouts'
import { Card } from '../../components/ui/Card'

const WorkoutActivityChart = lazy(() => import('./components/WorkoutActivityChart').then((module) => ({ default: module.WorkoutActivityChart })))

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
        <Suspense fallback={<Card className="p-4 md:p-5"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">Workout activity</p><h3 className="mt-1 text-xl font-bold text-on-surface">Training timeline</h3></div><div role="status" className="flex h-64 items-center justify-center text-sm text-secondary">Loading activity chart…</div></Card>}>
          <WorkoutActivityChart workouts={workouts} />
        </Suspense>
        <RecentWorkouts workouts={recentWorkouts} />
      </div>
    </div>
  )
}
