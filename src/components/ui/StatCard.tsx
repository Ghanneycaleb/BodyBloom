import type { ReactNode } from 'react'
import { Card } from './Card'

type StatCardProps = {
  label: string
  value: string
  detail?: string
  icon?: ReactNode
}

export function StatCard({ label, value, detail, icon }: StatCardProps) {
  return (
    <Card className="flex min-h-36 flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium text-secondary">{label}</span>
        {icon && <span className="text-primary" aria-hidden="true">{icon}</span>}
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-on-surface">{value}</p>
        {detail && <p className="mt-1 text-xs text-secondary">{detail}</p>}
      </div>
    </Card>
  )
}
