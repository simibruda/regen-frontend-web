import { useParams } from '@tanstack/react-router'
import { CategoryDetails } from '@/features/workspace/components/category/category-details'

export function CategoryPage() {
  const { id } = useParams({ from: '/_auth-guard/category/$id' })

  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <CategoryDetails categoryId={id} />
    </main>
  )
}
