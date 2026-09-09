import { progressRanges } from '../progress.calculations'
import type { ProgressRange } from '../progress.types'

export function ProgressFilters({ value, onChange }: { value: ProgressRange; onChange: (range: ProgressRange) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Progress date range</legend>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-container-low p-1 min-[380px]:grid-cols-4">
        {progressRanges.map((range) => (
          <button key={range.value} type="button" aria-pressed={range.value === value} onClick={() => onChange(range.value)} className={`min-h-11 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3 sm:text-sm ${range.value === value ? 'bg-white text-primary shadow-soft' : 'text-secondary hover:bg-white/60'}`}>
            {range.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
