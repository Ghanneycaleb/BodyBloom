import type { ExerciseMetadata, ExerciseQuery } from '../exercise.types'
import { useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

type Props = { metadata: ExerciseMetadata; query: ExerciseQuery; onChange: (query: ExerciseQuery) => void }
const selectClass = 'mt-2 min-h-12 w-full min-w-0 rounded-lg border border-outline bg-surface-container-lowest px-3 text-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary'
export function ExerciseFilters({ metadata, query, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)
  const advancedCount = Number(Boolean(query.muscle)) + Number(Boolean(query.equipment))
  return <div className="space-y-5">
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">Category</legend>
      <div className="flex gap-2 overflow-x-auto px-1 py-1 md:flex-wrap">
        {[{ id: '', name: 'All exercises' }, ...metadata.categories.map((item) => ({ ...item, id: String(item.id) }))].map((item) => <button key={item.id} type="button" aria-pressed={query.category === item.id} onClick={() => onChange({ ...query, category: item.id })} className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${query.category === item.id ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/50 bg-surface-container-lowest text-secondary hover:bg-surface-container-low'}`}>{item.name}</button>)}
      </div>
    </fieldset>
    <button type="button" aria-expanded={expanded} aria-controls="advanced-exercise-filters" onClick={() => setExpanded((value) => !value)} className="flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary md:hidden"><SlidersHorizontal size={17} aria-hidden="true" />More filters{advancedCount > 0 && ` (${advancedCount} active)`}<ChevronDown size={17} className={expanded ? 'rotate-180' : ''} aria-hidden="true" /></button>
    <div id="advanced-exercise-filters" className={`${expanded ? 'grid' : 'hidden'} gap-4 sm:grid-cols-2 md:grid`}>
      <label className="min-w-0 text-sm font-semibold">Primary muscle
        <select className={selectClass} value={query.muscle} onChange={(event) => onChange({ ...query, muscle: event.target.value })}>
          <option value="">All muscles</option>{metadata.muscles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="min-w-0 text-sm font-semibold">Equipment
        <select className={selectClass} value={query.equipment} onChange={(event) => onChange({ ...query, equipment: event.target.value })}>
          <option value="">Any equipment</option>{metadata.equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
    </div>
  </div>
}
