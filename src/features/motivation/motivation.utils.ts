import { getTodayDateString, isWorkoutDate } from '../workouts/workout.dates'
import { motivationQuotes } from './motivation.data'
import type { MotivationQuote, MusicPhase, WorkoutPlaylist } from './motivation.types'

const fallbackQuote: MotivationQuote = { id: 'fallback', text: 'Begin with a little room for growth.', author: 'BodyBloom', theme: 'Growth' }

export function getDailyQuote(date = getTodayDateString(), quotes: readonly MotivationQuote[] = motivationQuotes): MotivationQuote {
  if (!quotes.length) return fallbackQuote
  if (!isWorkoutDate(date)) return quotes[0]
  // Convert the already-local calendar key to an ordinal, never an instant back to a date.
  // This avoids DST-length days and preserves the same quote for the same calendar key.
  const ordinal = Math.floor(Date.parse(`${date}T00:00:00.000Z`) / 86400000)
  const index = ((ordinal % quotes.length) + quotes.length) % quotes.length
  return quotes[index]
}

export function safeSpotifyUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || url.port || url.username || url.password || !/^\/playlist\/[A-Za-z0-9]{22}\/?$/.test(url.pathname)) return undefined
    return `https://open.spotify.com${url.pathname.replace(/\/$/, '')}`
  } catch { return undefined }
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

const musicPhases: readonly MusicPhase[] = ['Warm Up', 'Strength', 'Cardio', 'Focus', 'Cool Down']

/** Validate curated items at the feature boundary; never trust an optional URL. */
export function normalizePlaylists(value: unknown): WorkoutPlaylist[] {
  if (!Array.isArray(value)) return []
  const result: WorkoutPlaylist[] = []
  const seen = new Set<string>()
  for (const item of value) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const data = item as Record<string, unknown>
    const id = optionalText(data.id)
    const title = optionalText(data.title)
    const phase = musicPhases.find((phase) => phase === data.phase)
    if (!id || !title || !phase || seen.has(id)) continue
    seen.add(id)
    result.push({
      id, title, phase,
      description: optionalText(data.description), genre: optionalText(data.genre),
      bpm: typeof data.bpm === 'number' && Number.isFinite(data.bpm) && data.bpm > 0 ? data.bpm : undefined,
      spotifyUrl: safeSpotifyUrl(data.spotifyUrl),
    })
  }
  return result
}
