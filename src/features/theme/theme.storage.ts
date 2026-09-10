import type { ThemePreference } from './theme.types'

// Keep the early public/theme-init.js bootstrap aligned with this key and validation.
export const THEME_STORAGE_KEY = 'bodybloom.theme'

export function readThemePreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch { return 'system' }
}

export function saveThemePreference(preference: ThemePreference): boolean {
  try {
    if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    return true
  } catch { return false }
}
