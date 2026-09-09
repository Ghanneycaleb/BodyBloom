import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dumbbell, Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useWorkouts } from '../workouts/useWorkouts'
import type { Workout } from '../workouts/workout.types'
import { filterHistoryWorkouts, groupHistoryByMonth, type HistoryFilter } from './history.filters'
import { HistoryFilters } from './components/HistoryFilters'
import { WorkoutHistoryCard } from './components/WorkoutHistoryCard'
import { DeleteWorkoutDialog } from './components/DeleteWorkoutDialog'

export function WorkoutHistoryPage() {
  const { workouts, deleteWorkout } = useWorkouts()
  const location = useLocation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [selected, setSelected] = useState<Workout | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleted, setDeleted] = useState<{ id: string; message: string } | null>(null)
  const deleting = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const state: unknown = location.state
  const updated = typeof state === 'object' && state !== null && 'workoutUpdated' in state && state.workoutUpdated === true
  const allWorkouts = filterHistoryWorkouts(workouts, 'all')
  const visibleWorkouts = filterHistoryWorkouts(workouts, filter)
  const monthGroups = groupHistoryByMonth(visibleWorkouts)

  useEffect(() => {
    if (!updated) return
    const timer = window.setTimeout(() => navigate('/history', { replace: true, state: null }), 5000)
    return () => window.clearTimeout(timer)
  }, [updated, navigate])

  useEffect(() => {
    if (!deleted) return
    const timer = window.setTimeout(() => setDeleted(null), 5000)
    return () => window.clearTimeout(timer)
  }, [deleted])

  const confirmDelete = () => {
    if (!selected || deleting.current) return
    deleting.current = true
    try {
      deleteWorkout(selected.id)
      setSelected(null)
      setDeleted({ id: crypto.randomUUID(), message: 'Workout deleted.' })
      // The triggering delete button is removed, so return focus to a stable heading.
      requestAnimationFrame(() => headingRef.current?.focus())
    } catch (error) {
      setDeleteError(error instanceof Error ? `Could not delete workout. ${error.message}` : 'Could not delete workout. Please try again.')
    } finally {
      deleting.current = false
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold tracking-tight lg:text-5xl text-on-surface focus-visible:outline-2 focus-visible:outline-primary">Workout History</h2>
          <p className="mt-2 text-base leading-7 text-secondary">Look back at the work you've put in.</p>
        </div>
        <Link to="/log-workout" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus size={18} aria-hidden="true" />Log Workout
        </Link>
      </header>

      {(updated || deleted) && <p role="status" className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary">{deleted?.message ?? 'Workout updated successfully.'}</p>}

      {allWorkouts.length === 0 ? (
        <Card className="py-12 text-center">
          <Dumbbell className="mx-auto size-12 text-primary" aria-hidden="true" />
          <h3 className="mt-5 text-xl font-bold text-on-surface">Your story starts with one workout.</h3>
          <p className="mx-auto mt-3 max-w-md text-secondary">Log your first session to build a training history you can revisit and refine.</p>
          <Link to="/log-workout" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Log your first workout</Link>
        </Card>
      ) : (
        <>
          <div className="space-y-3 border-b border-outline-variant/40 pb-5">
            <HistoryFilters value={filter} onChange={setFilter} />
            <p className="text-sm text-secondary" aria-live="polite">{visibleWorkouts.length} workout{visibleWorkouts.length === 1 ? '' : 's'}{filter === 'week' ? ' - Monday through Sunday' : ''}</p>
          </div>
          {visibleWorkouts.length === 0 ? (
            <Card className="py-8 text-center">
              <h3 className="text-lg font-semibold text-on-surface">No workouts in this period.</h3>
              <p className="mt-2 text-sm text-secondary">Your other sessions are still here. Try All Time to see them.</p>
              <Button type="button" variant="secondary" className="mt-4" onClick={() => setFilter('all')}>Show All Time</Button>
            </Card>
          ) : (
            <div className="space-y-8">
              {monthGroups.map((group) => (
                <section key={group.month} aria-labelledby={`history-month-${group.month}`} className="space-y-4">
                  <h3 id={`history-month-${group.month}`} className="text-sm font-medium text-secondary">{group.label}</h3>
                  <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6 2xl:grid-cols-3">
                    {group.workouts.map((workout) => <WorkoutHistoryCard key={workout.id} workout={workout} onDelete={(record) => { setDeleteError(''); setSelected(record) }} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
      <DeleteWorkoutDialog workout={selected} error={deleteError} onClose={() => setSelected(null)} onConfirm={confirmDelete} />
    </div>
  )
}
