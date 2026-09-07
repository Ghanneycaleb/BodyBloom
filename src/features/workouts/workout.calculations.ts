import type { Workout, WorkoutExercise, WorkoutSet } from './workout.types'

export function getWorkoutVolume(workout: Workout): number {
  return workout.exercises.reduce((exerciseTotal, exercise) => {
    return exerciseTotal + exercise.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0)
  }, 0)
}

export function getTotalVolume(workouts: Workout[]): number {
  return workouts.reduce((total, workout) => total + getWorkoutVolume(workout), 0)
}

export function getMostPerformedExercise(workouts: Workout[]): { exerciseName: string; count: number } {
  const counts = new Map<string, number>()

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      counts.set(exercise.exerciseName, (counts.get(exercise.exerciseName) ?? 0) + 1)
    })
  })

  const mostPerformed = [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1]
    }

    return left[0].localeCompare(right[0])
  })[0]

  if (!mostPerformed) {
    return { exerciseName: 'No exercises logged', count: 0 }
  }

  return {
    exerciseName: mostPerformed[0],
    count: mostPerformed[1],
  }
}

export function getCurrentStreak(workouts: Workout[]): number {
  if (workouts.length === 0) {
    return 0
  }

  const uniqueDates = new Set(
    workouts
      .map((workout) => new Date(workout.date).toISOString().slice(0, 10))
      .filter((entry) => entry !== 'Invalid Date'),
  )

  if (uniqueDates.size === 0) {
    return 0
  }

  const sortedDates = [...uniqueDates].sort((left, right) => new Date(right).getTime() - new Date(left).getTime())
  const currentDate = new Date(sortedDates[0])
  let streak = 0

  while (uniqueDates.has(currentDate.toISOString().slice(0, 10))) {
    streak += 1
    currentDate.setUTCDate(currentDate.getUTCDate() - 1)
  }

  return streak
}

export function getWorkoutActivity(workouts: Workout[]) {
  const totalsByDate = new Map<string, { date: string; count: number; volume: number }>()

  workouts.forEach((workout) => {
    const dateKey = new Date(workout.date).toISOString().slice(0, 10)
    const current = totalsByDate.get(dateKey) ?? { date: dateKey, count: 0, volume: 0 }

    current.count += 1
    current.volume += getWorkoutVolume(workout)
    totalsByDate.set(dateKey, current)
  })

  return [...totalsByDate.values()]
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((entry) => ({
      date: entry.date,
      count: entry.count,
      volume: entry.volume,
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(entry.date)),
    }))
}

export function sortWorkoutsByDateDesc(workouts: Workout[]): Workout[] {
  return [...workouts].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
}

export function getRecentWorkouts(workouts: Workout[], limit = 4): Workout[] {
  return sortWorkoutsByDateDesc(workouts).slice(0, limit)
}

export function formatDuration(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

export function countExercises(workout: Workout): number {
  return workout.exercises.length
}

export function getWorkoutTotalSets(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
}

export function getDisplayWorkoutVolume(workout: Workout): number {
  return getWorkoutVolume(workout)
}

export function getExerciseSummary(exercise: WorkoutExercise): string {
  const setSummary = exercise.sets.reduce((summary, set: WorkoutSet) => summary + `${set.reps}×${set.weight}kg, `, '')
  return setSummary.replace(/, $/, '')
}
