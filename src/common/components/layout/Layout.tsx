import { SidebarInset, SidebarProvider } from '@/common/components/_base/sidebar'
import { Outlet } from '@tanstack/react-router'
import { BottomNav } from './BottomNav'
import { AppSidebar } from './Sidebar'

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}
