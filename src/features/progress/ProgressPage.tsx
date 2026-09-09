import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartNoAxesCombined, Plus } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useWorkouts } from '../workouts/useWorkouts'
import { getTodayDateString } from '../workouts/workout.dates'
import { calculateProgress, formatProgressPeriod } from './progress.calculations'
import type { ProgressRange } from './progress.types'
import { ProgressFilters } from './components/ProgressFilters'
import { ProgressStatGrid } from './components/ProgressStatGrid'
import { ProgressTrendChart } from './components/ProgressTrendChart'
import { ExerciseFrequencyCard } from './components/ExerciseFrequencyCard'
import { ConsistencyCard } from './components/ConsistencyCard'

export function ProgressPage() {
  const { workouts } = useWorkouts()
  const [range, setRange] = useState<ProgressRange>('4w')
  const today = getTodayDateString()
  const data = useMemo(() => calculateProgress(workouts, range, today), [workouts, range, today])

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div><h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your Progress</h1><p className="mt-2 text-sm leading-6 text-secondary md:text-base">See how consistency turns into progress.</p></div>
        <ProgressFilters value={range} onChange={setRange} />
      </header>
      {!workouts.length ? (
        <Card className="flex flex-col items-center gap-4 px-5 py-14 text-center">
          <span className="rounded-full bg-primary/10 p-5 text-primary"><ChartNoAxesCombined size={36} aria-hidden="true" /></span>
          <h2 className="text-2xl font-bold">Your progress starts with one workout</h2>
          <p className="max-w-md text-sm leading-6 text-secondary">Log your training to see your frequency, volume, and consistency grow over time.</p>
          <Link to="/log-workout" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Plus size={18} aria-hidden="true" />Log Workout</Link>
        </Card>
      ) : <>
        <p role="status" className="text-sm text-secondary">{formatProgressPeriod(data.start, data.end)} · {data.totalWorkouts} {data.totalWorkouts === 1 ? 'workout' : 'workouts'}</p>
        <ProgressStatGrid data={data} />
        {!data.totalWorkouts ? (
          <Card className="space-y-3 p-6 text-center"><h2 className="text-xl font-bold">No workouts in this date range</h2><p className="text-sm leading-6 text-secondary">Your saved history is still here. Choose a wider range to explore it. Future-dated workouts appear once their date arrives.</p>{range !== 'all' && <Button type="button" variant="secondary" onClick={() => setRange('all')}>View All Time</Button>}</Card>
        ) : <>
          {data.totalWorkouts === 1 && <p className="rounded-xl bg-primary/10 p-4 text-sm leading-6 text-primary">One workout is a starting point. Log more sessions before drawing conclusions about a trend.</p>}
          {data.totalVolume === 0 && <p className="text-sm leading-6 text-secondary">These workouts have no recorded weighted volume. Zero-weight sets still count toward workout and exercise frequency.</p>}
          <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ProgressTrendChart periods={data.periods} grouping={data.grouping} metric="volume" />
            <ProgressTrendChart periods={data.periods} grouping={data.grouping} metric="count" />
            <ConsistencyCard data={data} />
            <ExerciseFrequencyCard exercises={data.topExercises} />
          </div>
        </>}
        <p className="text-xs leading-5 text-secondary">Volume = weight × reps across recorded sets, in kg × reps. Weekly average = workouts ÷ (calendar days in range ÷ 7), with a minimum one-week denominator. All Time begins at your first workout. Current Streak uses all history and must include today or yesterday.</p>
      </>}
    </div>
  )
}
