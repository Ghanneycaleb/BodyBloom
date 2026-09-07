/** Workout dates are local calendar days, not UTC instants. */
export function parseWorkoutDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1) return null
  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(12, 0, 0, 0)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null
}

export function isWorkoutDate(value: string): boolean {
  return parseWorkoutDate(value) !== null
}

export function getTodayDateString(date = new Date()): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function previousWorkoutDate(value: string): string {
  const date = parseWorkoutDate(value)
  if (!date) return ''
  date.setDate(date.getDate() - 1)
  return getTodayDateString(date)
}

export function compareWorkoutDates(left: string, right: string): number {
  return left.localeCompare(right)
}

export function formatWorkoutDate(value: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  const date = parseWorkoutDate(value)
  return date ? new Intl.DateTimeFormat('en-US', options).format(date) : 'Invalid date'
}
