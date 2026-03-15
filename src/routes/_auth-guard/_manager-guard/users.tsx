import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth-guard/_manager-guard/users"!</div>
}
