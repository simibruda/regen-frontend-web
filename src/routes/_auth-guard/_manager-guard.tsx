import { CurrentUserResponseRole } from '@/common/api/_base/api-types.schemas'
import { authQueryOptions } from '@/common/api/auth/auth.queries'
import { queryClient } from '@/lib/tanstack-query'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard')({
  beforeLoad: async () => {
    try {
      const user = await queryClient.fetchQuery(authQueryOptions.getCurrentUser)

      if (!user) {
        throw new Error('No user found')
      }

      if (user.role !== CurrentUserResponseRole.ADMIN) {
        return redirect({ to: '/' })
      }

      return { user }
    } catch {
      return redirect({ to: '/login' })
    }
  },
  component: Outlet,
})
