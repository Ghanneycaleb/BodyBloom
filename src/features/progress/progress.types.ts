export type ProgressRange = '4w' | '3m' | '6m' | 'all'
export type ProgressGrouping = 'daily' | 'weekly' | 'monthly'
export type ProgressPeriod = {
  start: string
  end: string
  label: string
  fullLabel: string
  count: number
  volume: number
}
export type ConsistencyDay = { date: string; count: number }
export type ProgressAnalytics = {
  start: string
  end: string
  days: number
  grouping: ProgressGrouping
  totalWorkouts: number
  totalVolume: number
  currentStreak: number
  averagePerWeek: number
  activeDays: number
  activePercentage: number
  periods: ProgressPeriod[]
  topExercises: { exerciseName: string; count: number }[]
  calendarStart: string
  calendarPadding: number
  calendar: ConsistencyDay[]
}
