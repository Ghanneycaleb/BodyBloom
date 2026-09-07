import { useEffect, type ReactNode } from 'react'
import { Button } from './Button'

type DialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onClose: () => void
  onConfirm: () => void
  children?: ReactNode
}

export function Dialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151c27]/40 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-md rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-soft"
      >
        <div className="space-y-2">
          <h2 id="dialog-title" className="text-xl font-semibold text-on-surface">{title}</h2>
          {description ? <p className="text-sm leading-6 text-secondary">{description}</p> : null}
          {children}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="min-w-24">
            {cancelText}
          </Button>
          <Button type="button" onClick={onConfirm} className="min-w-24">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
