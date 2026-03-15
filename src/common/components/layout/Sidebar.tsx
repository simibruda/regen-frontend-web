import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Users, FolderOpen, Settings, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/_base/sidebar'

const navItems = [
  { title: 'Home', to: '/', icon: Home },
  { title: 'Projects', to: '/projects', icon: FolderOpen },
  { title: 'Users', to: '/users', icon: Users },
  { title: 'Settings', to: '/settings', icon: Settings },
]

export function AppSidebar() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <Link to="/" className="flex items-center gap-1">
          <p className="text-2xl uppercase tracking-tight text-accent">
            <span className="font-bold">Re</span>
            <span className="font-normal">Manage</span>
          </p>
        </Link>
      </SidebarHeader>


      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={currentPath === item.to}
                    tooltip={item.title}
                    render={<Link to={item.to} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              render={<Link to="/login" />}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
