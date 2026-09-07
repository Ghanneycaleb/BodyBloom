import type { HTMLAttributes } from 'react'

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  selected?: boolean
}

export function Chip({ className = '', selected = false, ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${selected ? 'bg-primary/10 text-primary' : 'bg-surface-container text-secondary'} ${className}`}
      {...props}
    />
  )
}
