import { LoadingPage } from '@/common/components/layout/LoadingPage'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { queryClient } from './tanstack-query'

export const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 0,
  defaultPendingComponent: LoadingPage,
  defaultErrorComponent: () => <div>Error</div>,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
