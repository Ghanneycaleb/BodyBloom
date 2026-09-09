import { Link, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { navigationItems } from './navigation'
import { Button } from '../ui/Button'

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-70 flex-col bg-inverse-surface text-inverse-on-surface shadow-sm lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
          <Leaf size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-bold tracking-tight text-white">BodyBloom</p>
          <p className="text-xs font-medium text-surface-variant">Premium Performance</p>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path || (path === '/history' && location.pathname.startsWith('/history/'))
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed ${isActive ? 'bg-white/10 text-primary-fixed before:absolute before:left-0 before:h-8 before:w-1 before:rounded-full before:bg-primary-fixed' : 'text-surface-variant hover:bg-white/5 hover:text-white'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-6">
        <Button className="mb-3 w-full" type="button">Upgrade to Pro</Button>
        <p className="text-center text-xs text-surface-variant">Your progress, in one place.</p>
      </div>
    </aside>
  )
}
