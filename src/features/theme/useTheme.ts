import { useEffect, useState } from 'react'
import { readThemePreference, saveThemePreference, THEME_STORAGE_KEY } from './theme.storage'
import type { Theme, ThemePreference } from './theme.types'

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [storageNotice, setStorageNotice] = useState('')
  const theme: Theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        setPreference(readThemePreference())
        setStorageNotice('')
      }
    }
    media.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorageChange)
    return () => {
      media.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  function selectTheme(value: ThemePreference) {
    setPreference(value)
    setStorageNotice(saveThemePreference(value) ? '' : 'Theme changed for this visit. Your browser could not save the preference.')
  }
  return { preference, theme, selectTheme, storageNotice }
}
