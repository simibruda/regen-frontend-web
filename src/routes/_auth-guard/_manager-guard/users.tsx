import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>THIS PAGE IS WIP</div>
}
