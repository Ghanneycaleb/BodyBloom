import { useId } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../../../components/ui/Card'
import { chartTheme } from '../../../components/ui/chartTheme'
import { formatProgressNumber } from '../progress.calculations'
import type { ProgressGrouping, ProgressPeriod } from '../progress.types'

type Props = { periods: ProgressPeriod[]; grouping: ProgressGrouping; metric: 'volume' | 'count' }

export function ProgressTrendChart({ periods, grouping, metric }: Props) {
  const id = useId()
  const volume = metric === 'volume'
  const title = volume ? 'Training Volume' : 'Workout Frequency'
  const units = volume ? 'kg × reps' : 'workouts'
  const description = `${grouping[0].toUpperCase()}${grouping.slice(1)} totals, including inactive periods. Edge periods include only dates in your range.`
  const axes = <>
    <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tick={{ fontSize: 11, fill: chartTheme.text }} />
    <YAxis width={44} allowDecimals={volume} tickLine={false} axisLine={false} tickFormatter={(value: number) => formatProgressNumber(value, true)} tick={{ fontSize: 11, fill: chartTheme.text }} domain={[0, 'auto']} />
    <Tooltip cursor={volume ? { stroke: chartTheme.grid } : { fill: chartTheme.cursor }} content={({ active, payload }) => {
      const point: unknown = payload?.[0]?.payload
      if (!active || typeof point !== 'object' || point === null ||
          !('fullLabel' in point) || typeof point.fullLabel !== 'string' ||
          !('volume' in point) || typeof point.volume !== 'number' ||
          !('count' in point) || typeof point.count !== 'number') return null
      return <div className="max-w-60 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-3 text-xs text-on-surface shadow-soft"><p className="font-semibold">{point.fullLabel}</p><p className="mt-1 text-primary">{formatProgressNumber(metric === 'volume' ? point.volume : point.count)} {units}</p></div>
    }} />
  </>

  return (
    <Card className="min-w-0 p-4 md:p-6">
      <h2 id={`${id}-title`} className="text-xl font-bold tracking-tight">{title}</h2>
      <p id={`${id}-description`} className="mt-2 text-xs leading-5 text-secondary">{description}</p>
      <p className="mt-3 text-xs font-semibold text-primary">{units}</p>
      <div className="mt-2 h-60 min-w-0 w-full md:h-72" role="group" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {volume ? (
            <AreaChart data={periods} accessibilityLayer margin={{ top: 12, right: 12, bottom: 8, left: 0 }}>
              <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartTheme.fill} stopOpacity={0.3} /><stop offset="100%" stopColor={chartTheme.fill} stopOpacity={0.02} /></linearGradient></defs>
              {axes}
              <Area type="linear" dataKey="volume" name="Training volume" stroke={chartTheme.primary} fill={`url(#${id})`} strokeWidth={2} dot={periods.length === 1 ? { r: 4 } : false} isAnimationActive={false} />
            </AreaChart>
          ) : (
            <BarChart data={periods} accessibilityLayer margin={{ top: 12, right: 12, bottom: 8, left: 0 }}>
              {axes}
              <Bar dataKey="count" name="Workouts" fill={chartTheme.primary} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <details className="mt-3 border-t border-outline-variant/30 pt-3">
        <summary className="cursor-pointer rounded text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary">View {volume ? 'volume' : 'frequency'} data</summary>
        <div className="mt-3 max-h-64 overflow-y-auto">
          <table className="w-full table-fixed text-left text-xs">
            <caption className="sr-only">{title} by period</caption>
            <thead><tr><th scope="col" className="w-2/3 py-2">Period</th><th scope="col" className="py-2 text-right">{units}</th></tr></thead>
            <tbody>{periods.map((period) => <tr key={period.start} className="border-t border-outline-variant/20"><th scope="row" className="break-words py-2 pr-2 font-normal">{period.fullLabel}</th><td className="break-words py-2 text-right tabular-nums">{formatProgressNumber(period[metric])}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </Card>
  )
}
