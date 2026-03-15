import { Home, Users, Car, Settings, type LucideIcon } from 'lucide-react'

export type NavItem = {
  title: string
  to: string
  icon: LucideIcon
}

export const managerNavigation: NavItem[] = [
  { title: 'Home', to: '/', icon: Home },
  { title: 'Categories', to: '/categories', icon: Settings },
  { title: 'Cars', to: '/cars', icon: Car },
  { title: 'Users', to: '/users', icon: Users },
]

export const userNavigation: NavItem[] = [
  { title: 'Home', to: '/', icon: Home },
]
