import { Search, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

type Props = { value: string; onChange: (value: string) => void; onSearch: () => void; onClear: () => void }
export function ExerciseSearch({ value, onChange, onSearch, onClear }: Props) {
  return <form role="search" onSubmit={(event) => { event.preventDefault(); onSearch() }} className="flex gap-3">
    <div className="relative min-w-0 flex-1">
      <label htmlFor="exercise-search" className="sr-only">Search exercises by name</label>
      <Search size={20} className="pointer-events-none absolute left-4 top-4 text-secondary" aria-hidden="true" />
      <Input id="exercise-search" type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search exercises by name…" maxLength={200} className="pl-12 pr-12 [&::-webkit-search-cancel-button]:appearance-none" />
      {value && <button type="button" onClick={onClear} aria-label="Clear search" className="absolute right-1 top-1 flex size-12 items-center justify-center rounded-lg text-secondary focus-visible:outline-2 focus-visible:outline-primary"><X size={18} aria-hidden="true" /></button>}
    </div>
    <Button type="submit"><Search size={20} className="sm:hidden" aria-hidden="true" /><span className="sr-only sm:not-sr-only">Search</span></Button>
  </form>
}
