import { apiOptions } from '@/common/api'
import { Loader } from '@/common/components/_base/loader'
import type { Category } from '@/common/mocks/categories'
import { CategorySection } from '@/features/workspace/components/home/category-section'
import { HomeRoutesSection } from '@/features/workspace/components/home/home-routes-section'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export function HomePage() {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })

  const workspaceId = currentUser?.workspaceId ?? ''

  const {
    data: myCategories,
    isLoading: isCategoriesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
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

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return
    }

    void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
      <HomeRoutesSection workspaceId={workspaceId} />
      <CategorySection
        workspaceId={workspaceId}
        categories={categories}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </main>
  )
}
