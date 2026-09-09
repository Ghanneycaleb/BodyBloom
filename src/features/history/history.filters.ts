import type { Workout } from '../workouts/workout.types'
import { formatWorkoutDate, getTodayDateString, isWorkoutDate, parseWorkoutDate } from '../workouts/workout.dates'
import { sortWorkoutsByDateDesc } from '../workouts/workout.calculations'

export type HistoryFilter = 'all' | 'week' | 'month'

export const historyFilters: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

/** Monday through Sunday, using local calendar days and inclusive boundaries. */
export function filterHistoryWorkouts(workouts: Workout[], filter: HistoryFilter, today = getTodayDateString()): Workout[] {
  const sorted = sortWorkoutsByDateDesc(workouts)
  if (filter === 'all') return sorted
  const start = parseWorkoutDate(today)
  if (!start) return []
  const end = new Date(start)
  if (filter === 'week') {
    start.setDate(start.getDate() - (start.getDay() + 6) % 7)
    end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 6)
  } else {
    start.setDate(1)
    end.setMonth(end.getMonth() + 1, 0)
  }
  const firstDay = getTodayDateString(start)
  const lastDay = getTodayDateString(end)
  return sorted.filter(({ date }) => isWorkoutDate(date) && date >= firstDay && date <= lastDay)
}

export function groupHistoryByMonth(workouts: Workout[]): { month: string; label: string; workouts: Workout[] }[] {
  const groups = new Map<string, { month: string; label: string; workouts: Workout[] }>()
  for (const workout of sortWorkoutsByDateDesc(workouts)) {
    const month = workout.date.slice(0, 7)
    const group = groups.get(month) ?? {
      month,
      label: formatWorkoutDate(workout.date, { month: 'long', year: 'numeric' }),
      workouts: [],
    }
    group.workouts.push(workout)
    groups.set(month, group)
  }
  return [...groups.values()]
}
