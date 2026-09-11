import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { RouteLoading } from '../ui/RouteLoading'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { navigationItems } from './navigation'

export function AppShell() {
  const location = useLocation()
  const pathname = location.pathname.replace(/\/+$/, '') || '/'
  const currentPage = /^\/history\/[^/]+\/edit$/.test(pathname) ? 'Edit Workout' : navigationItems.find((item) => item.path === pathname)?.label ?? 'Page not found'

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <div className="lg:pl-70">
        <TopBar title={currentPage} />
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-container-max px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-6 md:pt-8 lg:px-10 lg:pb-10">
          <Suspense key={location.pathname} fallback={<RouteLoading />}><Outlet /></Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
