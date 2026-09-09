import { useEffect, useRef, useState } from 'react'
import { exerciseError, exerciseUrl, fetchExercises, fetchMetadata } from './exercise.api'
import type { ExerciseMetadata, ExercisePage, ExerciseQuery } from './exercise.types'

export const emptyExerciseQuery: ExerciseQuery = { search: '', category: '', muscle: '', equipment: '' }
type ResultsState = ExercisePage & { loading: boolean; error: string | null }
const initialResults: ResultsState = { exercises: [], count: 0, next: null, skipped: 0, loading: true, error: null }

export function useExerciseExplorer() {
  const [query, setQuery] = useState(emptyExerciseQuery)
  const [request, setRequest] = useState({ url: exerciseUrl(emptyExerciseQuery), append: false, attempt: 0 })
  const [results, setResults] = useState(initialResults)
  const [metadata, setMetadata] = useState<ExerciseMetadata | null>(null)
  const [metadataError, setMetadataError] = useState<string | null>(null)
  const [metadataAttempt, setMetadataAttempt] = useState(0)
  const busy = useRef(true)

  useEffect(() => {
    const controller = new AbortController()
    fetchExercises(request.url, controller.signal).then((page) => {
      if (controller.signal.aborted) return
      busy.current = false
      setResults((previous) => ({ ...page, loading: false, error: null,
        exercises: request.append ? [...new Map([...previous.exercises, ...page.exercises].map((item) => [item.sourceId, item])).values()] : page.exercises,
        skipped: page.skipped + (request.append ? previous.skipped : 0),
      }))
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return
      busy.current = false
      setResults((previous) => ({ ...previous, loading: false, error: exerciseError(error) }))
    })
    return () => controller.abort()
  }, [request])

  useEffect(() => {
    const controller = new AbortController()
    fetchMetadata(controller.signal).then((data) => {
      if (!controller.signal.aborted) setMetadata(data)
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setMetadataError(exerciseError(error))
    })
    return () => controller.abort()
  }, [metadataAttempt])

  function applyQuery(next: ExerciseQuery) {
    if (exerciseUrl(next) === exerciseUrl(query)) return
    busy.current = true
    setQuery(next)
    setResults(initialResults)
    setRequest({ url: exerciseUrl(next), append: false, attempt: 0 })
  }
  function loadMore() {
    if (busy.current || !results.next || results.error) return
    busy.current = true
    setResults((previous) => ({ ...previous, loading: true, error: null }))
    setRequest({ url: results.next, append: true, attempt: 0 })
  }
  function retry() {
    if (busy.current) return
    busy.current = true
    setResults((previous) => ({ ...previous, loading: true, error: null }))
    setRequest((previous) => ({ ...previous, attempt: previous.attempt + 1 }))
  }
  function retryMetadata() {
    setMetadataError(null)
    setMetadataAttempt((value) => value + 1)
  }
  return { query, applyQuery, results, metadata, metadataError, retryMetadata, loadMore, retry }
}
