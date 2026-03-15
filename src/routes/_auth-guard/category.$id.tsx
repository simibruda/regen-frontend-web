import { createFileRoute } from '@tanstack/react-router'
import { CategoryPage } from '@/pages/CategoryPage'

export const Route = createFileRoute('/_auth-guard/category/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CategoryPage />
}
