import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { Dialog } from '../../../components/ui/Dialog'
import { Button } from '../../../components/ui/Button'
import { ExerciseSearch } from '../../exercises/components/ExerciseSearch'
import { emptyExerciseQuery, useExerciseExplorer } from '../../exercises/useExerciseExplorer'
import { selectionFromExercise, type ExerciseSelection } from '../workout.external'

export function ExercisePickerDialog({ onClose, onSelect, onManual }: {
  onClose: () => void; onSelect: (selection: ExerciseSelection) => void; onManual: () => void
}) {
  const { results, applyQuery, retry, loadMore } = useExerciseExplorer()
  const [search, setSearch] = useState('')
  return <Dialog open title="Choose an exercise" description="Search WGER or use your own exercise. Your sets stay in place." size="wide" onClose={onClose}>
    <div className="space-y-4 pt-3">
      <Button type="button" variant="secondary" onClick={onManual}>Enter manually</Button>
      <ExerciseSearch value={search} onChange={setSearch} onSearch={() => applyQuery({ ...emptyExerciseQuery, search: search.trim() })}
        onClear={() => { setSearch(''); applyQuery(emptyExerciseQuery) }} />
      <p role="status" className="text-sm text-secondary">{results.loading ? 'Finding exercises…' : results.error ? 'Search is unavailable. You can still enter an exercise manually.' : `${results.exercises.length} exercises shown`}</p>
      {results.error && <div className="space-y-3"><p role="alert" className="text-sm text-error">{results.error}</p><Button type="button" onClick={retry}>Retry search</Button></div>}
      {!results.loading && !results.error && !results.exercises.length && <p className="text-sm text-secondary">No matches. Try another name or enter your own exercise.</p>}
      <ul className="space-y-2">
        {results.exercises.map((exercise) => <li key={exercise.sourceId}>
          <button type="button" onClick={() => onSelect(selectionFromExercise(exercise))} className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low p-3 text-left hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Dumbbell size={24} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 break-words"><span className="block font-semibold">{exercise.name}</span><span className="mt-1 block text-sm text-secondary">{exercise.category} · {exercise.muscles.join(', ') || 'Muscles not specified'}</span></span>
          </button>
        </li>)}
      </ul>
      {results.next && !results.error && <Button type="button" variant="secondary" disabled={results.loading} onClick={loadMore}>Load more exercises</Button>}
      <p className="text-xs text-secondary">Exercise names and muscle information from WGER.</p>
    </div>
  </Dialog>
}
