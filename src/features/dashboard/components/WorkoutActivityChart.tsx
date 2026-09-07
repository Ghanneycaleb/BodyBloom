import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../../../components/ui/Card'
import type { Workout } from '../../workouts/workout.types'
import { getWorkoutActivity } from '../../workouts/workout.calculations'

type WorkoutActivityChartProps = {
  workouts: Workout[]
}

export function WorkoutActivityChart({ workouts }: WorkoutActivityChartProps) {
  const data = getWorkoutActivity(workouts)

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center">
          <p className="text-lg font-semibold text-on-surface">No workout activity yet</p>
          <p className="mt-2 max-w-sm text-sm text-secondary">
            Log your first workout to start building a training timeline.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">Workout activity</p>
          <h3 className="mt-1 text-xl font-bold text-on-surface">Training timeline</h3>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 8 }}>
            <defs>
              <linearGradient id="workoutFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#dce2f3" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#575e70' }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#575e70' }} />
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0)} workouts`, 'Sessions']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ borderRadius: 12, border: '1px solid #bbcabf' }}
            />
            <Area type="monotone" dataKey="count" stroke="#006c49" fill="url(#workoutFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
