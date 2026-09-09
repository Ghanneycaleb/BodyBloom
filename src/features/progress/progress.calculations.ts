import { getCurrentStreak, getExerciseFrequency, getWorkoutActivity } from '../workouts/workout.calculations'
import { formatWorkoutDate, getTodayDateString, isWorkoutDate, parseWorkoutDate } from '../workouts/workout.dates'
import type { Workout } from '../workouts/workout.types'
import type { ProgressAnalytics, ProgressGrouping, ProgressPeriod, ProgressRange } from './progress.types'

export const progressRanges: { value: ProgressRange; label: string }[] = [
  { value: '4w', label: '4 Weeks' }, { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' }, { value: 'all', label: 'All Time' },
]

function dateObject(value: string): Date {
  const date = parseWorkoutDate(value)
  if (!date) throw new Error('Progress requires a valid calendar date.')
  return date
}
export function shiftProgressDate(value: string, days: number): string {
  const date = dateObject(value)
  date.setDate(date.getDate() + days)
  return getTodayDateString(date)
}

/** Calendar ordinal only; no UTC timestamp is converted back into a workout date. */
function dayOrdinal(value: string): number {
  const local = dateObject(value)
  const utc = new Date(0)
  utc.setUTCFullYear(local.getFullYear(), local.getMonth(), local.getDate())
  utc.setUTCHours(0, 0, 0, 0)
  return utc.getTime() / 86400000
}
export function inclusiveProgressDays(start: string, end: string): number {
  return dayOrdinal(end) - dayOrdinal(start) + 1
}

function rangeStart(workouts: Workout[], range: ProgressRange, today: string): string {
  if (range === '4w') return shiftProgressDate(today, -27)
  if (range === 'all') return workouts.reduce((first, workout) => workout.date < first ? workout.date : first, today)
  const start = dateObject(today)
  start.setDate(1)
  start.setMonth(start.getMonth() - (range === '3m' ? 2 : 5))
  return getTodayDateString(start)
}
function periodEnd(start: string, grouping: ProgressGrouping): string {
  const date = dateObject(start)
  if (grouping === 'weekly') date.setDate(date.getDate() + (7 - date.getDay()) % 7)
  if (grouping === 'monthly') date.setMonth(date.getMonth() + 1, 0)
  return getTodayDateString(date)
}
export function formatProgressPeriod(start: string, end: string): string {
  return start === end ? formatWorkoutDate(start) : `${formatWorkoutDate(start)} – ${formatWorkoutDate(end)}`
}
export function formatProgressNumber(value: number, compact = false): string {
  return new Intl.NumberFormat('en-US', { notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 2 }).format(value)
}

export function calculateProgress(workouts: Workout[], range: ProgressRange, today = getTodayDateString()): ProgressAnalytics {
  dateObject(today)
  // Stored future dates are not completed activity; exclude them from historical metrics.
  const past = workouts.filter((workout) => isWorkoutDate(workout.date) && workout.date <= today)
  const start = rangeStart(past, range, today)
  const days = inclusiveProgressDays(start, today)
  const selected = past.filter((workout) => workout.date >= start)
  const activity = getWorkoutActivity(selected)
  const grouping: ProgressGrouping = range === '4w' || (range === 'all' && days <= 35) ? 'daily' : range === 'all' && days > 185 ? 'monthly' : 'weekly'
  const periods: ProgressPeriod[] = []
  let activityIndex = 0
  for (let cursor = start; cursor <= today;) {
    const end = periodEnd(cursor, grouping) < today ? periodEnd(cursor, grouping) : today
    const period: ProgressPeriod = {
      start: cursor, end,
      label: formatWorkoutDate(cursor, grouping === 'monthly' ? { month: 'short', year: '2-digit' } : { month: 'short', day: 'numeric' }),
      fullLabel: formatProgressPeriod(cursor, end), count: 0, volume: 0,
    }
    while (activityIndex < activity.length && activity[activityIndex].date <= end) {
      period.count += activity[activityIndex].count
      period.volume += activity[activityIndex].volume
      activityIndex += 1
    }
    periods.push(period)
    cursor = shiftProgressDate(end, 1)
  }
  const calendarStart = start > shiftProgressDate(today, -27) ? start : shiftProgressDate(today, -27)
  const byDate = new Map(activity.map((day) => [day.date, day.count]))
  const calendar = []
  for (let date = calendarStart; date <= today; date = shiftProgressDate(date, 1)) {
    calendar.push({ date, count: byDate.get(date) ?? 0 })
  }
  return {
    start, end: today, days, grouping,
    totalWorkouts: selected.length,
    totalVolume: activity.reduce((total, day) => total + day.volume, 0),
    currentStreak: getCurrentStreak(workouts, today),
    averagePerWeek: selected.length / Math.max(1, days / 7),
    activeDays: activity.length,
    activePercentage: activity.length / days * 100,
    periods, topExercises: getExerciseFrequency(selected).slice(0, 5),
    calendarStart, calendarPadding: (dateObject(calendarStart).getDay() + 6) % 7, calendar,
  }
}
