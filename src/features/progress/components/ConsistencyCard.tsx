import { Card } from '../../../components/ui/Card'
import { formatWorkoutDate } from '../../workouts/workout.dates'
import { formatProgressNumber, formatProgressPeriod } from '../progress.calculations'
import type { ProgressAnalytics } from '../progress.types'

export function ConsistencyCard({ data }: { data: ProgressAnalytics }) {
  return (
    <Card className="min-w-0 p-4 md:p-6">
      <h2 className="text-xl font-bold tracking-tight">Consistency Map</h2>
      <p className="mt-2 text-xs leading-5 text-secondary">Most recent {data.calendar.length} days within your range. Each number is the workouts logged that day.</p>
      <p className="mt-3 text-xs font-semibold text-primary">{formatProgressPeriod(data.calendarStart, data.end)}</p>
      <div className="mt-4 grid grid-cols-7 gap-1.5" role="list" aria-label="Daily workout counts, Monday through Sunday">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day} aria-hidden="true" className="pb-1 text-center text-[10px] text-secondary">{day}</span>)}
        {Array.from({ length: data.calendarPadding }, (_, index) => <span key={`padding-${index}`} aria-hidden="true" />)}
        {data.calendar.map((day) => {
          const label = `${formatWorkoutDate(day.date)}: ${day.count} ${day.count === 1 ? 'workout' : 'workouts'}`
          return <span key={day.date} role="listitem" aria-label={label} title={label} className={`flex min-h-9 min-w-0 items-center justify-center rounded-md text-xs font-semibold ${day.count > 1 ? 'bg-primary text-on-primary' : day.count === 1 ? 'bg-primary-fixed-dim/60 text-on-primary-fixed' : 'bg-surface-container text-secondary'}`}><span aria-hidden="true">{day.count || '–'}</span></span>
        })}
      </div>
      <p className="mt-3 text-xs text-secondary">– No workouts · 1 One workout · 2+ Multiple workouts</p>
      <div className="mt-5 rounded-xl bg-primary p-4 text-on-primary">
        <p className="text-sm font-semibold">Active on {formatProgressNumber(data.activeDays)} of {formatProgressNumber(data.days)} days</p>
        <p className="mt-1 text-xs leading-5">{formatProgressNumber(data.activePercentage)}% of days in the full selected range. Rest days appear as inactive.</p>
      </div>
    </Card>
  )
}
