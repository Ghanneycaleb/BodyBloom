import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { navigationItems } from './navigation'

export function AppShell() {
  const location = useLocation()
  const currentPage = navigationItems.find((item) => item.path === location.pathname)?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar />
      <div className="lg:pl-70">
        <TopBar title={currentPage} />
        <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-container-max px-4 py-6 pb-24 md:px-6 md:py-8 lg:px-10 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
