import { CurrentUserResponseRole } from '@/common/api/_base/api-types.schemas'
import { Car, Home, Settings, Users, type LucideIcon } from 'lucide-react'

export type NavItem = {
  title: string
  to: string
  icon: LucideIcon
}

export const managerNavigation: NavItem[] = [
  { title: 'Home', to: '/', icon: Home },
  { title: 'Categories', to: '/categories-config', icon: Settings },
  { title: 'Cars', to: '/cars', icon: Car },
  { title: 'Users', to: '/users', icon: Users },
]

export const userNavigation: NavItem[] = [{ title: 'Home', to: '/', icon: Home }]

export const navigationList = {
  [CurrentUserResponseRole.ADMIN]: managerNavigation,
  [CurrentUserResponseRole.USER]: userNavigation,
}
