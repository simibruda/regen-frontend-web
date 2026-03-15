import type { QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { buttonClassName } from '../common/components/ui/button'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <header className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="mb-4 text-3xl font-bold">React + TanStack + Orval Starter</h1>
        <nav className="flex gap-3">
          <Link
            to="/"
            className={buttonClassName({ variant: 'outlet', size: 'sm' })}
          >
            Home
          </Link>
          <Link
            to="/posts"
            className={buttonClassName({ variant: 'outlet', size: 'sm' })}
          >
            Posts
          </Link>
        </nav>
      </header>

      <main className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <Outlet />
      </main>
    </div>
  )
}
