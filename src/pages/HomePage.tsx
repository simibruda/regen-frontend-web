import { apiOptions } from '@/common/api'
import { Loader } from '@/common/components/_base/loader'
import type { Category } from '@/common/mocks/categories'
import { CategorySection } from '@/features/workspace/components/home/category-section'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function HomePage() {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })

  const workspaceId = currentUser?.workspaceId ?? ''

  const { data: myCategories, isLoading: isCategoriesLoading } = useInfiniteQuery({
    ...apiOptions.queries.getMyInfiniteCategories(workspaceId),
    enabled: Boolean(workspaceId),
  })

  const categories: Category[] = (myCategories?.pages.flatMap((page) => page) ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    assignedPeople: category.assignedUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
    })),
  }))

  if (isCurrentUserLoading || isCategoriesLoading) {
    return (
      <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
        <div className="mx-auto mt-20 max-w-5xl">
          <Loader />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <CategorySection categories={categories} />
    </main>
  )
}
