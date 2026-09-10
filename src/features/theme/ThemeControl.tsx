import { useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { Dialog } from '../../components/ui/Dialog'
import { IconButton } from '../../components/ui/IconButton'
import { useTheme } from './useTheme'
import type { ThemePreference } from './theme.types'

const choices = [
  { value: 'system', label: 'System', detail: 'Follow your device appearance', icon: Monitor },
  { value: 'light', label: 'Light', detail: 'Pale surfaces and emerald accents', icon: Sun },
  { value: 'dark', label: 'Dark', detail: 'Deep surfaces and softer contrast', icon: Moon },
] satisfies { value: ThemePreference; label: string; detail: string; icon: typeof Sun }[]

export function ThemeControl() {
  const { preference, theme, selectTheme, storageNotice } = useTheme()
  const [open, setOpen] = useState(false)
  const Icon = preference === 'system' ? Monitor : theme === 'dark' ? Moon : Sun
  return <>
    <IconButton label={`Change color theme (${preference}, currently ${theme})`} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Icon size={20} aria-hidden="true" /></IconButton>
    <Dialog open={open} title="Color theme" description="Choose the appearance that feels right for you." cancelText="Done" onClose={() => setOpen(false)}>
      <div role="group" aria-label="Theme preference" className="space-y-2 pt-3">
        {choices.map(({ value, label, detail, icon: ChoiceIcon }) => <button key={value} type="button" aria-pressed={preference === value} onClick={() => selectTheme(value)} className={`flex min-h-16 w-full items-center gap-3 rounded-xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${preference === value ? 'border-primary bg-primary/10' : 'border-outline-variant/50 bg-surface-container-low'}`}>
          <ChoiceIcon size={21} className="shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs text-secondary">{detail}</span></span>
          {preference === value && <Check size={20} className="shrink-0 text-primary" aria-hidden="true" />}
        </button>)}
      </div>
      {storageNotice && <p role="status" className="pt-3 text-sm text-secondary">{storageNotice}</p>}
    </Dialog>
  </>
}
