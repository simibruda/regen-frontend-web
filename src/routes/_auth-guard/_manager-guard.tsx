import { CurrentUserResponseRole } from '@/common/api/_base/api-types.schemas'
import { authQueryOptions } from '@/common/api/auth/auth.queries'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    try {
      const user = await queryClient.fetchQuery(authQueryOptions.getCurrentUser)

      if (!user) {
        throw new Error('No user found')
      }

      if (user.role !== CurrentUserResponseRole.ADMIN) {
        return redirect({ to: '/' })
      }

      return;
    } catch {
      return redirect({ to: '/login' })
    }
  },
  component: Outlet,
})
