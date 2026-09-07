import { useEffect, useId, useRef, type ReactNode } from 'react'
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
    cancelRef.current?.focus()
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
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 text-on-surface shadow-soft backdrop:bg-[#151c27]/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-xl font-semibold text-on-surface">{title}</h2>
          {description ? <p id={descriptionId} className="text-sm leading-6 text-secondary">{description}</p> : null}
          {children}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelRef} type="button" variant="secondary" onClick={onClose} className="min-w-24">
            {cancelText}
          </Button>
          <Button type="button" onClick={onConfirm} className="min-w-24">
            {confirmText}
          </Button>
        </div>
      </dialog>
  )
}
