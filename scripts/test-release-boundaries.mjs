import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { webcrypto } from 'node:crypto'
import vm from 'node:vm'
import ts from 'typescript'

const root = fileURLToPath(new URL('../src/features/workouts/', import.meta.url))
const data = new Map()
const window = { localStorage: { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) } }
const cache = new Map()
function load(path) {
  if (cache.has(path)) return cache.get(path)
  const exports = {}
  cache.set(path, exports)
  const source = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 } }).outputText
  vm.runInNewContext(source, { exports, window, crypto: webcrypto, require: name => load(resolve(dirname(path), name + '.ts')) })
  return exports
}
const storage = load(resolve(root, 'workout.storage.ts'))

const dates = load(resolve(root, 'workout.dates.ts'))
const history = load(resolve(root, '../history/history.filters.ts'))
const sample = date => ({ id: date, date, duration: 30, exercises: [{ exerciseId: 'local', exerciseName: 'Manual', muscleGroup: '', sets: [{ reps: 10, weight: 0 }] }], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' })

test('local dates validate leap days and survive month/year boundaries', () => {
  assert.equal(dates.isWorkoutDate('2024-02-29'), true)
  for (const date of ['2025-02-29', '2026-02-30', '2026-13-01', '0000-01-01']) assert.equal(dates.isWorkoutDate(date), false)
  assert.equal(dates.previousWorkoutDate('2024-03-01'), '2024-02-29')
  assert.equal(dates.previousWorkoutDate('2026-01-01'), '2025-12-31')
  for (const date of ['2024-02-29', '2026-03-08', '2026-11-01']) assert.equal(dates.getTodayDateString(dates.parseWorkoutDate(date)), date)
})

test('History uses inclusive Monday-Sunday weeks across year and DST boundaries', () => {
  const previousZone = process.env.TZ
  try {
    for (const zone of ['UTC', 'America/New_York', 'Pacific/Auckland']) {
      process.env.TZ = zone
      const rows = ['2025-12-28', '2025-12-29', '2026-01-01', '2026-01-04', '2026-01-05'].map(sample)
      assert.equal(JSON.stringify(history.filterHistoryWorkouts(rows, 'week', '2026-01-01').map(row => row.date)), JSON.stringify(['2026-01-04', '2026-01-01', '2025-12-29']))
      const dst = ['2026-03-01', '2026-03-02', '2026-03-08', '2026-03-09'].map(sample)
      assert.equal(JSON.stringify(history.filterHistoryWorkouts(dst, 'week', '2026-03-08').map(row => row.date)), JSON.stringify(['2026-03-08', '2026-03-02']))
      const leap = ['2024-01-31', '2024-02-01', '2024-02-29', '2024-03-01'].map(sample)
      assert.equal(JSON.stringify(history.filterHistoryWorkouts(leap, 'month', '2024-02-29').map(row => row.date)), JSON.stringify(['2024-02-29', '2024-02-01']))
    }
  } finally {
    if (previousZone === undefined) delete process.env.TZ
    else process.env.TZ = previousZone
  }
})

test('malformed top-level storage refuses mutations without overwriting data', () => {
  for (const malformed of ['{', '{}', 'null', '42']) {
    data.set(storage.STORAGE_KEY, malformed)
    assert.throws(() => storage.getWorkouts())
    assert.throws(() => storage.addWorkout(sample('2026-09-10')))
    assert.equal(data.get(storage.STORAGE_KEY), malformed)
  }
})

test('partial invalid records are skipped and surviving records remain unchanged on read', () => {
  const good = sample('2026-09-10')
  const raw = JSON.stringify([null, { ...good, id: 'bad', duration: -1 }, good])
  data.set(storage.STORAGE_KEY, raw)
  assert.equal(storage.getWorkouts().length, 1)
  assert.equal(storage.getWorkouts()[0].id, good.id)
  assert.equal(data.get(storage.STORAGE_KEY), raw)
})

test('read/write failures throw understandable errors and retain existing data', () => {
  const original = window.localStorage
  const good = sample('2026-09-10')
  data.set(storage.STORAGE_KEY, JSON.stringify([good]))
  try {
    window.localStorage = { ...original, getItem() { throw new Error('read denied') } }
    assert.throws(() => storage.getWorkouts(), /could not be read/)
    window.localStorage = { ...original, setItem() { throw new Error('quota') } }
    assert.throws(() => storage.addWorkout(sample('2026-09-09')), /could not be saved/)
    assert.equal(JSON.parse(data.get(storage.STORAGE_KEY)).length, 1)
  } finally { window.localStorage = original }
})
