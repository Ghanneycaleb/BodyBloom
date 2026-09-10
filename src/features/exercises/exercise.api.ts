import { exerciseFromDto, licenseFromDto, optionFromDto, pageFromDto } from './exercise.mappers'
import type { Exercise, ExerciseMetadata, ExercisePage, ExerciseQuery } from './exercise.types'

export const WGER_API = 'https://wger.de/api/v2/'
const PAGE_SIZE = 12

async function request(url: string, signal: AbortSignal) {
  // Let StrictMode's discarded effect abort before sending its request.
  await Promise.resolve()
  signal.throwIfAborted()
  const response = await fetch(url, { signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]), headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`WGER could not load this data (HTTP ${response.status}). Please retry.`)
  const data: unknown = await response.json()
  return pageFromDto(data)
}

function nextUrl(next: string | null, current: string): string | null {
  if (next === null) return null
  const url = new URL(next, WGER_API)
  const previous = new URL(current)
  const offset = Number(url.searchParams.get('offset'))
  const previousOffset = Number(previous.searchParams.get('offset') ?? 0)
  const sameFilters = [...previous.searchParams].every(([key, value]) => key === 'offset' || url.searchParams.get(key) === value)
  if (url.origin !== previous.origin || url.pathname !== previous.pathname || !sameFilters || !Number.isSafeInteger(offset) || offset <= previousOffset) {
    throw new Error('WGER returned unexpected pagination. Please retry.')
  }
  return url.href
}

export function exerciseUrl(query: ExerciseQuery): string {
  const url = new URL('exerciseinfo/', WGER_API)
  url.searchParams.set('language__code', 'en')
  url.searchParams.set('limit', String(PAGE_SIZE))
  url.searchParams.set('ordering', 'id')
  // Despite its name, WGER's name__exact filter performs substring matching.
  if (query.search) url.searchParams.set('name__exact', query.search)
  if (query.category) url.searchParams.set('category', query.category)
  if (query.muscle) url.searchParams.set('muscles', query.muscle)
  if (query.equipment) url.searchParams.set('equipment', query.equipment)
  return url.href
}

export async function fetchExercises(url: string, signal: AbortSignal): Promise<ExercisePage> {
  const page = await request(url, signal)
  const mapped = page.results.map(exerciseFromDto)
  const valid = mapped.filter((item): item is Exercise => item !== null)
  if (page.results.length && !valid.length) throw new Error('WGER returned exercise records we could not read. Please retry.')
  return { exercises: [...new Map(valid.map((item) => [item.sourceId, item])).values()], count: page.count, next: nextUrl(page.next, url), skipped: mapped.length - valid.length }
}

async function metadataRows(endpoint: string, signal: AbortSignal): Promise<unknown[]> {
  let url: string | null = `${WGER_API}${endpoint}/?limit=100`
  const rows: unknown[] = []
  while (url) {
    const page = await request(url, signal)
    rows.push(...page.results)
    url = nextUrl(page.next, url)
  }
  return rows
}

export async function fetchMetadata(signal: AbortSignal): Promise<ExerciseMetadata> {
  const [categories, muscles, equipment, licenses] = await Promise.all(
    ['exercisecategory', 'muscle', 'equipment', 'license'].map((endpoint) => metadataRows(endpoint, signal)),
  )
  const mapOptions = (rows: unknown[]) => {
    const mapped = rows.map(optionFromDto)
    if (mapped.some((item) => item === null) || !mapped.length) throw new Error('Some exercise filters could not be read. Please retry.')
    return [...new Map(mapped.flatMap((item) => item ? [[item.id, item] as const] : [])).values()]
  }
  const mappedLicenses = licenses.map(licenseFromDto)
  if (mappedLicenses.some((item) => item === null)) throw new Error('Exercise source information could not be read. Please retry.')
  return { categories: mapOptions(categories), muscles: mapOptions(muscles), equipment: mapOptions(equipment), licenses: mappedLicenses.filter((item) => item !== null) }
}

export function exerciseError(error: unknown): string {
  if (error instanceof DOMException && error.name === 'TimeoutError') return 'WGER took too long to respond. Please retry.'
  if (error instanceof TypeError) return 'Unable to reach WGER. Check your connection and retry.'
  if (error instanceof SyntaxError) return 'WGER returned an unreadable response. Please retry.'
  return error instanceof Error ? error.message : 'Exercises could not be loaded. Please retry.'
}
