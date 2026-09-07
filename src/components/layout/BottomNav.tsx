import { Link, useLocation } from 'react-router-dom'
import { navigationItems } from './navigation'

export function BottomNav() {
  const location = useLocation()
  const mobileItems = navigationItems.filter((item) => ['/', '/log-workout', '/history', '/progress'].includes(item.path))

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-outline-variant/40 bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur lg:hidden">
      {mobileItems.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname === path
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
    </nav>
  )
}
