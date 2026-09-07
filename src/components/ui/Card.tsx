import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-soft ${className}`}
      {...props}
    />
  )
}
