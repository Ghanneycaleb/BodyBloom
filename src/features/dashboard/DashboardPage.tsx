import { useWorkouts } from '../workouts/useWorkouts'
import { getCurrentStreak, getMostPerformedExercise, getTotalVolume, getRecentWorkouts } from '../workouts/workout.calculations'
import { DashboardEmptyState } from './components/DashboardEmptyState'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { RecentWorkouts } from './components/RecentWorkouts'
import { WorkoutActivityChart } from './components/WorkoutActivityChart'

export function DashboardPage() {
  const { workouts } = useWorkouts()

  const totalWorkouts = workouts.length
  const currentStreak = getCurrentStreak(workouts)
  const totalVolume = getTotalVolume(workouts)
  const mostPerformedExercise = getMostPerformedExercise(workouts)
  const recentWorkouts = getRecentWorkouts(workouts, 4)

  if (totalWorkouts === 0) {
    return (
      <div className="space-y-6">
        <DashboardHeader workoutCount={0} />
        <DashboardEmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader workoutCount={totalWorkouts} />

      <DashboardStats
        totalWorkouts={totalWorkouts}
        currentStreak={currentStreak}
        totalVolume={totalVolume}
        mostPerformedExercise={mostPerformedExercise.exerciseName}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <WorkoutActivityChart workouts={workouts} />
        <RecentWorkouts workouts={recentWorkouts} />
      </div>
    </div>
  )
}
