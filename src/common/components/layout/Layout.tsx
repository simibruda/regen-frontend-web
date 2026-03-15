import { Outlet } from '@tanstack/react-router'
import {
  SidebarInset,
  SidebarProvider,
} from '@/common/components/_base/sidebar'
import { AppSidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 p-6 pb-20 md:pb-6">
          <Outlet />
        </div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}
