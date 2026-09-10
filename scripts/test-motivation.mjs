import assert from 'node:assert/strict'
import { test, after } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = mkdtempSync(join(tmpdir(), 'bodybloom-motivation-tests-'))
after(() => rmSync(temporary, { recursive: true, force: true }))
for (const module of ['workouts/workout.dates', 'motivation/motivation.data', 'motivation/motivation.utils']) {
  const source = readFileSync(join(root, 'src/features', `${module}.ts`), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } }).outputText.replace(/from '(\.[^']+)'/g, "from '$1.mjs'")
  const target = join(temporary, `${module}.mjs`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, output)
}
const { getDailyQuote, normalizePlaylists, safeSpotifyUrl } = await import(pathToFileURL(join(temporary, 'motivation/motivation.utils.mjs')))
const { motivationQuotes, workoutPlaylists } = await import(pathToFileURL(join(temporary, 'motivation/motivation.data.mjs')))

test('daily selection is stable, advances daily, and cycles predictably', () => {
  const ids = new Set()
  for (let day = 1; day <= 12; day++) {
    const date = `2026-09-${String(day).padStart(2, '0')}`
    assert.deepEqual(getDailyQuote(date), getDailyQuote(date))
    ids.add(getDailyQuote(date).id)
  }
  assert.equal(ids.size, 12)
  assert.equal(getDailyQuote('2026-09-01').id, getDailyQuote('2026-09-13').id)
  assert.notEqual(getDailyQuote('2024-02-29').id, getDailyQuote('2024-03-01').id)
  assert.notEqual(getDailyQuote('2026-12-31').id, getDailyQuote('2027-01-01').id)
})
test('date selection is timezone independent for the same local key, including pre-epoch dates', () => {
  const before = process.env.TZ
  try {
    const expected = getDailyQuote('2026-09-10')
    for (const zone of ['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Europe/London']) {
      process.env.TZ = zone
      assert.deepEqual(getDailyQuote('2026-09-10'), expected)
      assert.ok(getDailyQuote('1960-01-01'))
      assert.ok(getDailyQuote('0010-01-01'))
    }
  } finally { if (before === undefined) delete process.env.TZ; else process.env.TZ = before }
})
test('local quotes have original attribution and empty/invalid-date fallbacks', () => {
  assert.ok(motivationQuotes.every(quote => quote.author === 'BodyBloom' && quote.text.length < 160))
  assert.equal(new Set(motivationQuotes.map(quote => quote.id)).size, motivationQuotes.length)
  assert.equal(getDailyQuote('invalid').id, motivationQuotes[0].id)
  assert.equal(getDailyQuote('2026-09-10', []).author, 'BodyBloom')
})
test('Spotify URLs allow only HTTPS public playlist destinations and remove tracking', () => {
  const valid = workoutPlaylists[0].spotifyUrl
  assert.equal(safeSpotifyUrl(`${valid}?si=tracking#fragment`), valid)
  assert.equal(safeSpotifyUrl(`${valid}/`), valid)
  for (const bad of [null, {}, '', 'javascript:alert(1)', valid.replace('https:', 'http:'), valid.replace('open.spotify.com', 'open.spotify.com.evil.test'), valid.replace('open.spotify.com', 'user:secret@open.spotify.com'), valid.replace('open.spotify.com', 'open.spotify.com:444'), 'https://open.spotify.com/playlist/not-an-id']) {
    assert.equal(safeSpotifyUrl(bad), undefined)
  }
  assert.ok(workoutPlaylists.every(item => safeSpotifyUrl(item.spotifyUrl)))
})
test('malformed entries are skipped and missing optional data does not manufacture values', () => {
  const minimal = { id: 'minimal', title: 'Minimal', phase: 'Focus' }
  assert.deepEqual(normalizePlaylists(null), [])
  const values = normalizePlaylists([null, {}, [], { ...minimal, id: '' }, { ...minimal, phase: 'Unknown' }, minimal, minimal, { ...minimal, id: 'invalid-optional', genre: {}, bpm: Infinity, spotifyUrl: 'javascript:void(0)' }])
  assert.equal(values.length, 2)
  for (const item of values) {
    assert.equal(item.genre, undefined)
    assert.equal(item.bpm, undefined)
    assert.equal(item.spotifyUrl, undefined)
  }
  assert.equal(normalizePlaylists(workoutPlaylists).length, 5)
  assert.ok(normalizePlaylists(workoutPlaylists).every(item => item.bpm === undefined))
})
