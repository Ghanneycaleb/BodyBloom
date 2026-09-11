import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function DashboardEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center shadow-soft">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Plus size={28} aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-on-surface">Your dashboard is ready for your first workout.</h2>
      <p className="mx-auto mt-3 max-w-xl text-base text-secondary">
        Start logging training sessions to unlock streaks, total volume, recent activity, and progress insights.
      </p>
      <Link to="/log-workout" aria-label="Log your first workout" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        Log Your First Workout
      </Link>
    </section>
  )
}
