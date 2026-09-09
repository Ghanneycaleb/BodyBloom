import { Link, useParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { useWorkouts } from './useWorkouts'
import { WorkoutFormPage } from './WorkoutFormPage'

export function EditWorkoutPage() {
  const { workoutId } = useParams()
  const { workouts } = useWorkouts()
  const workout = workouts.find((entry) => entry.id === workoutId)
  if (!workout) {
    return (
      <Card className="py-12 text-center">
        <h2 className="text-2xl font-bold text-on-surface">Workout not found</h2>
        <p className="mt-3 text-secondary">This workout may have been deleted, or the link is no longer valid.</p>
        <Link to="/history" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Back to History</Link>
      </Card>
    )
  }
  return <WorkoutFormPage key={workout.id} workout={workout} />
}
