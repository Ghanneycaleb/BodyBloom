import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Ellipsis } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { navigationItems } from './navigation'

export function BottomNav() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const mobileItems = navigationItems.filter((item) => ['/', '/log-workout', '/history'].includes(item.path))
  const moreItems = navigationItems.filter((item) => !mobileItems.includes(item))
  const moreActive = moreItems.some((item) => item.path === location.pathname)

  return (
    <>
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-outline-variant/40 bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur lg:hidden">
      {mobileItems.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname === path || (path === '/history' && location.pathname.startsWith('/history/'))
        return (
          <Link
            key={path}
            to={path}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            {label === 'Workout History' ? 'History' : label.replace(' Workout', '')}
          </Link>
        )
      })}
      <button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog" aria-expanded={moreOpen} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-primary ${moreActive ? 'text-primary' : 'text-secondary'}`}><Ellipsis size={20} aria-hidden="true" />More</button>
    </nav>
    <Dialog open={moreOpen} title="Explore BodyBloom" cancelText="Close" onClose={() => setMoreOpen(false)}>
      <nav aria-label="More pages" className="space-y-2 pt-3">
        {moreItems.map(({ path, label, icon: Icon }) => <Link key={path} to={path} onClick={() => setMoreOpen(false)} aria-current={location.pathname === path ? 'page' : undefined} className="flex min-h-12 items-center gap-3 rounded-lg bg-surface-container-low p-3 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary"><Icon size={20} aria-hidden="true" />{label}</Link>)}
      </nav>
    </Dialog>
    </>
  )
}
