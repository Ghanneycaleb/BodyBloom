import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import { today, workouts, workout, exercise } from './progress-fixtures.mjs'

// Compile just the pure helpers with the existing TypeScript dependency. No test package needed.
const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = mkdtempSync(join(tmpdir(), 'bodybloom-progress-tests-'))
after(() => rmSync(temporary, { recursive: true, force: true }))
for (const module of ['workouts/workout.dates', 'workouts/workout.calculations', 'progress/progress.calculations']) {
  const source = readFileSync(join(root, 'src/features', `${module}.ts`), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } }).outputText
    .replace(/from '(\.[^']+)'/g, "from '$1.mjs'")
  const target = join(temporary, `${module}.mjs`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, output)
}
const { calculateProgress, shiftProgressDate, inclusiveProgressDays } = await import(pathToFileURL(join(temporary, 'progress/progress.calculations.mjs')))
const { getCurrentStreak, getMostPerformedExercise, getExerciseFrequency } = await import(pathToFileURL(join(temporary, 'workouts/workout.calculations.mjs')))

test('4 weeks: precise volume, zero days, same-day counts, multiple exercises and sets', () => {
  const data = calculateProgress(workouts, '4w', today)
  assert.equal(data.start, '2026-08-13')
  assert.equal(data.totalWorkouts, 5)
  assert.equal(data.totalVolume, 1322.5)
  assert.equal(data.averagePerWeek, 1.25)
  assert.equal(data.activeDays, 4)
  assert.equal(data.periods.length, 28)
  assert.equal(data.periods.filter(day => day.count === 0).length, 24)
  assert.equal(data.periods.find(day => day.start === '2026-09-08').count, 2)
  assert.equal(data.periods.find(day => day.start === '2026-09-08').volume, 572.5)
  assert.equal(data.calendar.find(day => day.date === '2026-09-08').count, 2)
})
test('calendar month ranges, Monday-Sunday groups, and clipped edge periods', () => {
  const three = calculateProgress(workouts, '3m', today)
  assert.equal(three.start, '2026-07-01')
  assert.equal(three.days, 71)
  assert.equal(three.totalWorkouts, 6)
  assert.equal(three.totalVolume, 1422.5)
  assert.equal(three.averagePerWeek, 6 / (71 / 7))
  assert.equal(three.periods[0].end, '2026-07-05')
  assert.equal(three.periods[0].count, 0)
  assert.equal(three.periods.at(-1).start, '2026-09-07')
  assert.equal(three.periods.at(-1).end, today)
  assert.equal(three.periods.at(-1).count, 4)
  assert.equal(three.periods.at(-1).volume, 1022.5)
  const six = calculateProgress(workouts, '6m', today)
  assert.equal(six.start, '2026-04-01')
  assert.equal(six.days, 162)
  assert.equal(six.totalWorkouts, 7)
  assert.equal(six.totalVolume, 1432.5)
})
test('All Time uses actual inclusive history, monthly zero gaps and excludes future dates', () => {
  const data = calculateProgress(workouts, 'all', today)
  assert.equal(data.start, '2026-03-01')
  assert.equal(data.days, 193)
  assert.equal(data.totalWorkouts, 8)
  assert.equal(data.totalVolume, 1482.5)
  assert.equal(data.averagePerWeek, 8 / (193 / 7))
  assert.equal(data.grouping, 'monthly')
  assert.equal(data.periods.length, 7)
  assert.equal(data.periods[1].count, 0)
  assert.equal(data.periods.reduce((sum, p) => sum + p.volume, 0), data.totalVolume)
  assert.equal(data.calendar.length, 28)
})
test('streak reuses Dashboard, today/yesterday semantics and does not truncate at range boundary', () => {
  assert.equal(calculateProgress(workouts, '4w', today).currentStreak, getCurrentStreak(workouts, today))
  assert.equal(calculateProgress(workouts, '4w', today).currentStreak, 3)
  assert.equal(getCurrentStreak(workouts.filter(w => w.date !== today), today), 2)
  assert.equal(getCurrentStreak([workout('old', '2026-09-07')], today), 0)
  const long = Array.from({ length: 40 }, (_, i) => workout(String(i), shiftProgressDate(today, -i)))
  assert.equal(calculateProgress(long, '4w', today).currentStreak, 40)
  assert.equal(calculateProgress(long, '4w', today).totalWorkouts, 28)
})
test('exercise ranking preserves exact names, duplicate entries, ties and Dashboard behavior', () => {
  const entries = [workout('one', today, [exercise('Squat'), exercise('Squat'), exercise('squat'), exercise('Bench')])]
  assert.deepEqual(getExerciseFrequency(entries), [{ exerciseName: 'Squat', count: 2 }, { exerciseName: 'Bench', count: 1 }, { exerciseName: 'squat', count: 1 }])
  assert.deepEqual(getMostPerformedExercise(entries), { exerciseName: 'Squat', count: 2 })
  assert.deepEqual(calculateProgress(workouts, '4w', today).topExercises[0], { exerciseName: 'Bench Press', count: 3 })
  const many = [workout('many', today, ['A','B','C','D','E','F'].map(name => exercise(name)))]
  assert.equal(calculateProgress(many, 'all', today).topExercises.length, 5)
})
test('empty, out-of-range, single-workout and zero-weight states remain honest', () => {
  assert.equal(calculateProgress([], '4w', today).totalWorkouts, 0)
  assert.equal(calculateProgress([], 'all', today).averagePerWeek, 0)
  assert.equal(calculateProgress([workouts[7]], '4w', today).totalWorkouts, 0)
  const single = calculateProgress([workout('bodyweight', today, [exercise('Push Up', [{ reps: 20, weight: 0 }])])], 'all', today)
  assert.equal(single.averagePerWeek, 1)
  assert.equal(single.totalVolume, 0)
  assert.equal(single.periods.length, 1)
  assert.equal(single.periods[0].count, 1)
})
test('edits and deletes recompute from canonical arrays without mutating input', () => {
  const snapshot = JSON.stringify(workouts)
  const edited = workouts.map(w => w.id === 'today' ? { ...w, exercises: [exercise('Changed', [{ reps: 1, weight: 10 }])] } : w)
  assert.equal(calculateProgress(edited, '4w', today).totalVolume, 982.5)
  assert.equal(calculateProgress(workouts.filter(w => w.id !== 'today'), '4w', today).totalVolume, 972.5)
  assert.equal(JSON.stringify(workouts), snapshot)
})
test('calendar grouping is stable across DST and positive/negative UTC offsets', () => {
  const previous = process.env.TZ
  try {
    let baseline
    for (const zone of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Europe/London']) {
      process.env.TZ = zone
      const actual = JSON.stringify(calculateProgress(workouts, '3m', today))
      baseline ??= actual
      assert.equal(actual, baseline, zone)
      assert.equal(shiftProgressDate('2024-03-01', -1), '2024-02-29')
      assert.equal(inclusiveProgressDays('2026-03-01', '2026-03-31'), 31)
      assert.equal(inclusiveProgressDays('2026-11-01', '2026-11-30'), 30)
    }
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous }
})
