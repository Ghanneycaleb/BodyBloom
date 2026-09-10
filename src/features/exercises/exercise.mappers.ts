import type { Exercise, ExerciseLicense, ExerciseOption, WgerExerciseDto, WgerPageDto } from './exercise.types'

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function list(value: unknown): unknown[] { return Array.isArray(value) ? value : [] }
function text(value: unknown): string { return typeof value === 'string' ? value.trim() : '' }
function id(value: unknown): number | null { return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null }

export function safeUrl(value: unknown): string | null {
  try {
    const url = new URL(text(value))
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch { return null }
}

// Parse into an inert document, discard non-content nodes, then render only text.
export function plainText(value: string): string {
  const document = new DOMParser().parseFromString(value, 'text/html')
  document.querySelectorAll('script,style,iframe,object,embed,template,noscript').forEach((node) => node.remove())
  document.querySelectorAll('p,div,li,br,h1,h2,h3,h4,section').forEach((node) => node.append('\n'))
  return (document.body.textContent ?? '').replace(/\\[nr]/g, '\n').replace(/[\t\r ]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function optionFromDto(value: unknown): ExerciseOption | null {
  const data = record(value)
  const optionId = id(data.id)
  const name = text(data.name_en) || text(data.name)
  return optionId && name ? { id: optionId, name } : null
}
function options(value: unknown): ExerciseOption[] {
  return list(value).map(optionFromDto).filter((option): option is ExerciseOption => option !== null)
}
export function licenseFromDto(value: unknown): ExerciseLicense | null {
  const data = record(value)
  const licenseId = id(data.id)
  const name = text(data.short_name)
  return licenseId && name ? { id: licenseId, name, url: safeUrl(data.url) } : null
}

export function pageFromDto(value: unknown): WgerPageDto {
  const data = record(value)
  if (!Array.isArray(data.results) || typeof data.count !== 'number' || !Number.isSafeInteger(data.count) || data.count < 0 || !(data.next === null || typeof data.next === 'string')) {
    throw new Error('WGER returned an unexpected response. Please retry.')
  }
  return { results: data.results, count: data.count, next: data.next }
}

function decodeExercise(value: unknown): WgerExerciseDto | null {
  const data = record(value)
  const exerciseId = id(data.id)
  if (!exerciseId) return null
  return {
    id: exerciseId,
    category: optionFromDto(data.category),
    muscles: options(data.muscles),
    muscles_secondary: options(data.muscles_secondary),
    equipment: options(data.equipment),
    translations: list(data.translations).map((value) => {
      const item = record(value)
      return { language: id(item.language) ?? 0, name: text(item.name), description: text(item.description), license: id(item.license), license_author: text(item.license_author) }
    }),
    images: list(data.images).map((value) => {
      const item = record(value)
      return { image: safeUrl(item.image) ?? '', is_main: item.is_main === true, license: id(item.license), license_author: text(item.license_author) }
    }),
  }
}

export function exerciseFromDto(value: unknown): Exercise | null {
  const data = decodeExercise(value)
  if (!data) return null
  // Verified against /language/: English is id 2. Never substitute another language.
  const english = data.translations.find((item) => item.language === 2 && item.name) ?? data.translations.find((item) => item.language === 2)
  const images = data.images.filter((item) => item.image)
  const image = images.find((item) => item.is_main) ?? images[0]
  return {
    source: 'wger', sourceId: data.id,
    name: plainText(english?.name ?? '') || `Exercise ${data.id} (English name unavailable)`,
    description: plainText(english?.description ?? '') || 'English instructions are not available for this exercise.',
    category: data.category?.name ?? 'Uncategorized',
    muscles: data.muscles.map((item) => item.name),
    secondaryMuscles: data.muscles_secondary.map((item) => item.name),
    equipment: data.equipment.map((item) => item.name),
    image: image ? { url: image.image, author: image.license_author, licenseId: image.license } : null,
    author: english?.license_author ?? '', licenseId: english?.license ?? null,
  }
}
