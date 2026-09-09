import { historyFilters, type HistoryFilter } from '../history.filters'

type HistoryFiltersProps = {
  value: HistoryFilter
  onChange: (filter: HistoryFilter) => void
}

export function HistoryFilters({ value, onChange }: HistoryFiltersProps) {
  return (
    <div role="group" aria-label="Filter workouts by date" className="flex flex-wrap gap-2">
      {historyFilters.map((filter) => (
        <button key={filter.value} type="button" aria-pressed={value === filter.value} onClick={() => onChange(filter.value)}
          className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${value === filter.value ? 'bg-primary-container text-on-primary-fixed md:border md:border-primary/20 md:bg-primary/10 md:text-primary' : 'border border-outline-variant/60 bg-transparent text-secondary hover:bg-surface-container-low md:border-transparent md:bg-surface-container'}`}>
          {filter.label}
        </button>
      ))}
    </div>
  )
}
