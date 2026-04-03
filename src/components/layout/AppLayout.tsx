import { Outlet } from 'react-router-dom'
import Sidebar, { TopBar } from './Sidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const { collapsed } = useSidebar()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        'flex flex-1 flex-col transition-all duration-200',
        collapsed ? 'ml-[56px]' : 'ml-[200px]'
      )}>
        <TopBar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
