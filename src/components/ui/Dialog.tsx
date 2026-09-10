import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'
import { X } from 'lucide-react'

type DialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onClose: () => void
  onConfirm?: () => void
  size?: 'default' | 'wide'
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
  size = 'default',
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    cancelRef.current?.focus({ preventScroll: true })
    if (dialog) dialog.scrollTop = 0
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus()
    }
  }, [open])

  return (
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onCancel={(event) => { event.preventDefault(); onClose() }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'))
          const first = elements[0]
          const last = elements[elements.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }}
        className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${size === 'wide' ? 'max-w-2xl' : 'max-w-md'} overflow-y-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 text-on-surface shadow-soft backdrop:bg-overlay backdrop:backdrop-blur-[2px]`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="min-w-0 break-words text-xl font-semibold text-on-surface">{title}</h2>
            {!onConfirm && <button ref={cancelRef} type="button" onClick={onClose} aria-label="Close dialog" className="flex size-11 shrink-0 items-center justify-center rounded-lg text-secondary hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-primary"><X size={20} aria-hidden="true" /></button>}
          </div>
          {description ? <p id={descriptionId} className="text-sm leading-6 text-secondary">{description}</p> : null}
          {children}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button ref={onConfirm ? cancelRef : undefined} type="button" variant="secondary" onClick={onClose} className="min-w-24">
            {cancelText}
          </Button>
          {onConfirm && <Button type="button" onClick={onConfirm} className="min-w-24">
            {confirmText}
          </Button>}
        </div>
      </dialog>
  )
}
