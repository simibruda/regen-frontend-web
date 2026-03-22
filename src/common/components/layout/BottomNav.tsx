import { apiOptions } from '@/common/api'
import { navigationList } from '@/common/config/navigation'
import { cn } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'

export function BottomNav() {
  const { data: user } = useSuspenseQuery(apiOptions.queries.getCurrentUser)
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-full bg-primary shadow-lg md:hidden">
      <ul className="flex items-center justify-around py-2">
        {navigationList[user.role].map((item) => {
          const isActive = currentPath === item.to
          return (
            <li key={item.title}>
              <Link to={item.to} className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-accent/20 text-accent' : 'text-white/60'
                  )}
                >
                  <item.icon className="size-5" />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
