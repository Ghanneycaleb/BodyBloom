export type WorkoutSet = {
  reps: number
  weight: number
}

export type WorkoutExercise = {
  externalExercise?: { source: 'wger'; sourceId: number }
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  sets: WorkoutSet[]
}

export type Workout = {
  id: string
  date: string
  duration: number
  exercises: WorkoutExercise[]
  createdAt: string
  updatedAt: string
}

export type WorkoutRecord = Omit<Workout, 'id'> & {
  id?: string
}
