import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const styles = variant === 'primary'
    ? 'bg-primary text-on-primary hover:bg-primary/90'
    : 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant hover:bg-primary-fixed-dim/50'

  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${styles} ${className}`}
      {...props}
    />
  )
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />
}
