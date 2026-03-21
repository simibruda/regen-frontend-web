import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black">THIS PAGE IS WIP</h1>
    </div>
  )
}
