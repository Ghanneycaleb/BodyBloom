import { useEffect, useState } from 'react'
import { getTodayDateString } from '../workouts/workout.dates'

export function useMotivationDate(): string {
  const [date, setDate] = useState(() => getTodayDateString())
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function schedule() {
      clearTimeout(timer)
      const now = new Date()
      const nextDay = new Date(now)
      nextDay.setHours(24, 0, 0, 100)
      timer = setTimeout(update, nextDay.getTime() - now.getTime())
    }
    function update() {
      setDate(getTodayDateString())
      schedule()
    }
    function onVisible() { if (document.visibilityState === 'visible') update() }
    schedule()
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  return date
}
