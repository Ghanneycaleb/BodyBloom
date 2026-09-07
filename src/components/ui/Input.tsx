import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`min-h-14 min-w-0 w-full rounded-md border border-outline-variant bg-surface-container-low px-4 text-base text-on-surface outline-none transition-colors placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  )
}
