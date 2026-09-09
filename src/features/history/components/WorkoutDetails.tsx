import type { Workout } from '../../workouts/workout.types'
import { getExerciseVolume, getWorkoutVolume } from '../../workouts/workout.calculations'

export function WorkoutDetails({ workout }: { workout: Workout }) {
  return (
    <div className="space-y-5 border-t border-outline-variant/40 pt-5">
      {workout.exercises.map((exercise, exerciseIndex) => (
        <section key={`${exercise.exerciseId}-${exerciseIndex}`} className="min-w-0 rounded-xl bg-surface-container-low p-3 md:p-4">
          <h4 className="break-words text-base font-semibold text-on-surface">{exercise.exerciseName}</h4>
          {exercise.muscleGroup && <p className="mt-1 break-words text-sm text-secondary">{exercise.muscleGroup}</p>}
          <table className="mt-3 w-full table-fixed text-left text-sm">
            <caption className="sr-only">Sets for {exercise.exerciseName}</caption>
            <thead className="border-b border-outline-variant/50 text-xs text-secondary">
              <tr><th scope="col" className="w-1/5 py-2">Set</th><th scope="col" className="py-2">Reps</th><th scope="col" className="py-2 text-right">Weight (kg)</th></tr>
            </thead>
            <tbody>
              {exercise.sets.map((set, index) => (
                <tr key={index} className="border-b border-outline-variant/25 last:border-0">
                  <th scope="row" className="py-2.5 font-medium">{index + 1}</th>
                  <td className="break-words py-2.5 tabular-nums">{set.reps}</td>
                  <td className="break-words py-2.5 text-right tabular-nums">{set.weight.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 break-words text-sm font-medium text-primary">Exercise volume: {getExerciseVolume(exercise).toLocaleString()} kg x reps</p>
        </section>
      ))}
      <p className="break-words text-sm font-semibold text-on-surface">Total workout volume: {getWorkoutVolume(workout).toLocaleString()} kg x reps</p>
    </div>
  )
}
