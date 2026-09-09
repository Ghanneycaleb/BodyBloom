// Deterministic verification data only. Never imported by the application.
export const today = '2026-09-09'
export const exercise = (name, sets = [{ reps: 10, weight: 10 }]) => ({ exerciseId: `test-${name}`, exerciseName: name, muscleGroup: 'General', sets })
export const workout = (id, date, exercises = [exercise('Row')]) => ({ id, date, duration: 30, exercises, createdAt: `${date}T12:00:00.000Z`, updatedAt: `${date}T12:00:00.000Z` })
export const workouts = [
  workout('today', today, [exercise('Bench Press', [{ reps: 10, weight: 20 }, { reps: 5, weight: 30 }]), exercise('Push Up', [{ reps: 20, weight: 0 }])]),
  workout('yesterday-a', '2026-09-08', [exercise('Bench Press', [{ reps: 8, weight: 40 }]), exercise('Squat', [{ reps: 5, weight: 50 }])]),
  workout('yesterday-b', '2026-09-08', [exercise('Bench Press', [{ reps: 1, weight: 2.5 }])]),
  workout('monday', '2026-09-07'),
  workout('last-week', '2026-09-01', [exercise('Squat', [{ reps: 10, weight: 30 }])]),
  workout('last-month', '2026-08-10', [exercise('Bench Press', [{ reps: 5, weight: 20 }])]),
  workout('june', '2026-06-01', [exercise('Row', [{ reps: 2, weight: 5 }])]),
  workout('march', '2026-03-01', [exercise('Deadlift', [{ reps: 5, weight: 10 }])]),
  workout('future', '2026-09-10', [exercise('Future entry', [{ reps: 1, weight: 999 }])]),
]
