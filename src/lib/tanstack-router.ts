import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen';
import { queryClient } from './tanstack-query';

export const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 0,
  defaultPendingComponent: <>,
  defaultErrorComponent: ({ error }: { error: Error }) =>
  FallbackErrorPage({
    error,
    resetError: () => {
      window.location.reload()
    },
  }),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}