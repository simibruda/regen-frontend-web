import { authQueryOptions } from '@/common/api/auth/auth.queries'
import { Layout } from '@/common/components/layout/Layout'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    try {
      const user = await queryClient.fetchQuery(authQueryOptions.getCurrentUser)

      if (!user) {
        throw new Error('No user found')
      }

      return { user }
    } catch {
      return redirect({ to: '/login' })
    }
  },
  component: Layout,
})
