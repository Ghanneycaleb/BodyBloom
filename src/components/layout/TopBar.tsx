import { Bell, Leaf } from 'lucide-react'
import { IconButton } from '../ui/IconButton'

type TopBarProps = {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-outline-variant/30 bg-surface/95 px-4 backdrop-blur md:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container lg:hidden">
          <Leaf size={19} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-secondary">BodyBloom</p>
          <h1 className="text-lg font-semibold text-on-surface">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label="View notifications" type="button"><Bell size={20} /></IconButton>
        <div className="hidden items-center gap-2 border-l border-outline-variant/40 pl-3 sm:flex">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-on-primary-fixed">BB</div>
          <span className="text-sm font-medium text-on-surface">BodyBloom member</span>
        </div>
      </div>
    </header>
  )
}
