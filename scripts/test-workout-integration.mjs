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
const form = load(resolve(root, 'workout.form.ts'))
const external = load(resolve(root, 'workout.external.ts'))
const storage = load(resolve(root, 'workout.storage.ts'))
const selection = { source: 'wger', sourceId: 73, name: 'Bench Press', muscleGroup: 'Chest' }
const plain = value => JSON.parse(JSON.stringify(value))
function selectedForm() {
  const value = form.createDefaultWorkoutForm()
  value.exercises[0] = external.applyExerciseSelection(value.exercises[0], selection)
  return value
}

test('WGER round trip preserves independent local identity and edit timestamps', () => {
  const workout = form.buildWorkoutFromForm(selectedForm())
  assert.notEqual(workout.exercises[0].exerciseId, String(selection.sourceId))
  storage.saveWorkouts([workout])
  const loaded = storage.getWorkouts()[0]
  assert.deepEqual(plain(loaded), plain(workout))
  const edited = form.buildWorkoutFromForm(form.workoutToFormValues(loaded), loaded)
  assert.equal(edited.id, workout.id)
  assert.equal(edited.createdAt, workout.createdAt)
  assert.equal(edited.exercises[0].exerciseId, workout.exercises[0].exerciseId)
  assert.deepEqual(plain(edited.exercises[0].externalExercise), { source: 'wger', sourceId: 73 })
})

test('historical/manual records load unchanged and omit external metadata', () => {
  const value = form.createDefaultWorkoutForm()
  value.exercises[0].exerciseName = 'My exercise'
  const workout = form.buildWorkoutFromForm(value)
  assert.equal('externalExercise' in workout.exercises[0], false)
  storage.saveWorkouts([workout])
  const original = data.get(storage.STORAGE_KEY)
  assert.deepEqual(plain(storage.getWorkouts()[0]), plain(workout))
  assert.equal(data.get(storage.STORAGE_KEY), original, 'loading never rewrites stored records')
})

test('invalid optional metadata drops only the reference, never the workout', () => {
  for (const invalid of [null, 'wger', {}, { source: 'other', sourceId: 73 }, { source: 'wger', sourceId: '73' },
    { source: 'wger', sourceId: 0 }, { source: 'wger', sourceId: -1 }, { source: 'wger', sourceId: 1.2 }, { source: 'wger', sourceId: 1e30 }]) {
    const workout = form.buildWorkoutFromForm(selectedForm())
    workout.exercises[0].externalExercise = invalid
    const original = JSON.stringify([workout])
    data.set(storage.STORAGE_KEY, original)
    const loaded = storage.getWorkouts()
    assert.equal(loaded.length, 1)
    assert.equal(loaded[0].exercises[0].exerciseId, workout.exercises[0].exerciseId)
    assert.equal('externalExercise' in loaded[0].exercises[0], false)
    assert.equal(data.get(storage.STORAGE_KEY), original)
  }
})

test('selection/reselection retain rows and sets; manual rename clears identity', () => {
  const row = { ...form.createEmptyExercise(), exerciseId: 'existing-local-id' }
  row.sets[0].weight = '42'
  const selected = external.applyExerciseSelection(row, selection)
  assert.equal(selected.id, row.id)
  assert.equal(selected.exerciseId, row.exerciseId)
  assert.equal(selected.sets, row.sets)
  assert.equal(external.renameWorkoutExercise(selected, ' Bench Press ').externalExercise.sourceId, 73)
  const custom = external.renameWorkoutExercise(selected, 'Custom press')
  assert.equal('externalExercise' in custom, false)
  const replaced = external.applyExerciseSelection(custom, { ...selection, sourceId: 99 })
  assert.equal(replaced.externalExercise.sourceId, 99)
  assert.equal(replaced.exerciseId, row.exerciseId)
})

test('route normalization rejects malformed state and extracts only supported fields', () => {
  for (const state of [null, undefined, 5, {}, { exerciseSelection: null }, { exerciseSelection: { ...selection, name: ' ' } },
    { exerciseSelection: { ...selection, source: 'other' } }, { exerciseSelection: { ...selection, sourceId: -5 } },
    { exerciseSelection: { ...selection, muscleGroup: [] } }]) assert.equal(external.normalizeExerciseRouteState(state), null)
  assert.deepEqual(plain(external.normalizeExerciseRouteState({ exerciseSelection: { ...selection, extra: 'discard' } })), selection)
})

test('selection dirties the form, including same-name source changes, without changing defaults', () => {
  const initial = form.createDefaultWorkoutForm()
  assert.equal(form.isWorkoutFormDirty(initial, initial), false)
  const selected = { ...initial, exercises: [external.applyExerciseSelection(initial.exercises[0], selection)] }
  assert.equal(form.isWorkoutFormDirty(selected, initial), true)
  assert.equal(selected.date, initial.date)
  assert.equal(selected.duration, initial.duration)
  assert.equal(selected.exercises[0].sets, initial.exercises[0].sets)
  const replaced = { ...selected, exercises: [external.applyExerciseSelection(selected.exercises[0], { ...selection, sourceId: 99 })] }
  assert.equal(form.isWorkoutFormDirty(replaced, selected), true)
})

test('WGER normalized muscles take precedence over category with safe fallback', () => {
  assert.equal(external.selectionFromExercise({ ...selection, muscles: ['Chest', 'Triceps'], category: 'Arms' }).muscleGroup, 'Chest, Triceps')
  assert.equal(external.selectionFromExercise({ ...selection, muscles: [], category: 'Arms' }).muscleGroup, 'Arms')
  assert.equal(external.selectionFromExercise({ ...selection, muscles: [], category: '' }).muscleGroup, 'General')
})
