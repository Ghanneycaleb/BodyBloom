import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const bootstrap = readFileSync(new URL('../public/theme-init.js', import.meta.url), 'utf8')
const storageSource = ts.transpileModule(readFileSync(new URL('../src/features/theme/theme.storage.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
function storageApi(storage) {
  const exports = {}
  vm.runInNewContext(storageSource, { exports, window: { localStorage: storage } })
  return exports
}
function initialize(saved, systemDark, blocked = false) {
  const document = { documentElement: { dataset: {}, style: {} } }
  vm.runInNewContext(bootstrap, { document, window: {
    localStorage: { getItem() { if (blocked) throw new Error('blocked'); return saved } },
    matchMedia: () => ({ matches: systemDark }),
  } })
  return document.documentElement
}
test('bootstrap follows system without a valid explicit preference', () => {
  for (const saved of [null, 'system', 'invalid']) {
    assert.equal(initialize(saved, true).dataset.theme, 'dark')
    assert.equal(initialize(saved, false).dataset.theme, 'light')
  }
})
test('explicit themes override system and set native color-scheme', () => {
  for (const theme of ['light', 'dark']) for (const system of [true, false]) {
    const element = initialize(theme, system)
    assert.equal(element.dataset.theme, theme)
    assert.equal(element.style.colorScheme, theme)
  }
})
test('theme storage is isolated, supports reset to system, and fails safely', () => {
  const values = new Map([['bodybloom.workouts', 'untouched']])
  const api = storageApi({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) })
  assert.ok(bootstrap.includes(api.THEME_STORAGE_KEY))
  assert.equal(api.readThemePreference(), 'system')
  for (const theme of ['light', 'dark']) {
    assert.equal(api.saveThemePreference(theme), true)
    assert.equal(api.readThemePreference(), theme)
  }
  assert.equal(api.saveThemePreference('system'), true)
  assert.equal(values.has(api.THEME_STORAGE_KEY), false)
  assert.equal(values.get('bodybloom.workouts'), 'untouched')
  const blocked = storageApi({ getItem() { throw Error('blocked') }, setItem() { throw Error('blocked') }, removeItem() { throw Error('blocked') } })
  assert.equal(blocked.readThemePreference(), 'system')
  assert.equal(blocked.saveThemePreference('dark'), false)
  assert.equal(blocked.saveThemePreference('system'), false)
  assert.equal(initialize(null, true, true).dataset.theme, 'dark')
})

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const tokens = block => Object.fromEntries([...block.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6});/g)].map(match => [match[1], match[2]]))
const light = tokens(css.match(/:root \{([\s\S]*?)\}/)[1])
const dark = { ...light, ...tokens(css.match(/:root\[data-theme='dark'\] \{([\s\S]*?)\}/)[1]) }
const rgb = hex => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
const luminance = color => color.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0)
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)
test('both palettes meet 4.5:1 for text, controls, errors and chart labels', () => {
  for (const [name, palette] of [['light', light], ['dark', dark]]) {
    for (const surface of ['background', 'surface-container-lowest', 'surface-container-low', 'surface-container']) {
      for (const foreground of ['on-surface', 'secondary', 'primary', 'error']) {
        const ratio = contrast(rgb(palette[foreground]), rgb(palette[surface]))
        assert.ok(ratio >= 4.5, `${name} ${foreground} on ${surface}: ${ratio}`)
      }
    }
    assert.ok(contrast(rgb(palette['on-primary']), rgb(palette.primary)) >= 4.5)
    const secondaryButton = rgb(palette['primary-fixed-dim']).map((v, i) => v * .3 + rgb(palette['surface-container-lowest'])[i] * .7)
    assert.ok(contrast(rgb(palette['on-primary-fixed-variant']), secondaryButton) >= 4.5)
    assert.ok(contrast(rgb(palette['on-brand']), rgb(palette['brand-strong'])) >= 4.5)
  }
})
