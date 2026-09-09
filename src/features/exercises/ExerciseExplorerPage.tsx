import { useState } from 'react'
import { Dumbbell, LoaderCircle, SearchX } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ExerciseSearch } from './components/ExerciseSearch'
import { ExerciseFilters } from './components/ExerciseFilters'
import { ExerciseGrid } from './components/ExerciseGrid'
import { ExerciseDetailsDialog } from './components/ExerciseDetailsDialog'
import { emptyExerciseQuery, useExerciseExplorer } from './useExerciseExplorer'
import type { Exercise } from './exercise.types'

export function ExerciseExplorerPage() {
  const { query, applyQuery, results, metadata, metadataError, retryMetadata, loadMore, retry } = useExerciseExplorer()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const filtered = Object.values(query).some(Boolean)
  function reset() { setSearch(''); applyQuery(emptyExerciseQuery) }
  return <div className="space-y-6 md:space-y-8">
    <header className="border-b border-outline-variant/40 pb-6">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary"><Dumbbell size={16} aria-hidden="true" /> The exercise library</p>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Exercises</h1>
      <p className="mt-3 text-sm leading-6 text-secondary md:text-base">Discover exercises and train with confidence.</p>
    </header>
    <section aria-label="Search and filter exercises" className="space-y-5">
      <ExerciseSearch value={search} onChange={setSearch} onSearch={() => applyQuery({ ...query, search: search.trim() })} onClear={() => { setSearch(''); applyQuery({ ...query, search: '' }) }} />
      {metadata ? <ExerciseFilters metadata={metadata} query={query} onChange={applyQuery} /> : metadataError ? <Card><p role="alert" className="text-sm text-error">Filters and source information: {metadataError}</p><Button type="button" variant="secondary" onClick={retryMetadata} className="mt-3">Retry filters</Button></Card> : <p role="status" className="text-sm text-secondary">Loading exercise filters…</p>}
    </section>
    <section aria-label="Exercise results" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-secondary">{results.loading ? (results.exercises.length ? 'Loading more exercises…' : 'Finding exercises…') : results.error ? 'Exercises could not be loaded.' : `Showing ${results.exercises.length} of ${results.count} exercises`}{query.search && <span className="break-all"> for “{query.search}”</span>}</p>
        {filtered && <button type="button" onClick={reset} className="min-h-11 rounded-lg px-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">Reset filters & search</button>}
      </div>
      {results.skipped > 0 && <p role="status" className="text-sm text-secondary">{results.skipped} incomplete WGER records could not be displayed.</p>}
      <ExerciseGrid exercises={results.exercises} loading={results.loading} onSelect={setSelected} />
      {results.error && <Card><p role="alert" className="text-sm leading-6 text-error">{results.error}</p><Button type="button" onClick={retry} className="mt-4">Retry exercises</Button></Card>}
      {!results.loading && !results.error && !results.exercises.length && <Card className="flex flex-col items-center gap-3 py-12 text-center"><SearchX size={36} className="text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold">No exercises found</h2><p className="max-w-sm text-sm leading-6 text-secondary">Try a different exercise name or broaden your filters.</p>{filtered && <Button type="button" variant="secondary" onClick={reset}>Show all exercises</Button>}</Card>}
      {results.exercises.length > 0 && !results.error && results.next && <div className="flex justify-center pt-3"><Button type="button" variant="secondary" onClick={loadMore} disabled={results.loading}>{results.loading && <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />}{results.loading ? 'Loading more…' : 'Load more exercises'}</Button></div>}
    </section>
    <p className="text-center text-xs leading-5 text-secondary">Exercise library by <a href="https://wger.de" target="_blank" rel="noreferrer" className="text-primary underline focus-visible:outline-2 focus-visible:outline-primary">WGER</a>. Instructions and image credits are available in each exercise’s details.</p>
    <ExerciseDetailsDialog exercise={selected} licenses={metadata?.licenses ?? []} onClose={() => setSelected(null)} />
  </div>
}
