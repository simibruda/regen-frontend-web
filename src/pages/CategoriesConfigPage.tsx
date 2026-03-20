import { apiOptions } from '@/common/api'
import type { GetCategoriesResponse } from '@/common/api/_base/api-types.schemas'
import { Loader } from '@/common/components/_base/loader'
import { CategoryAssignmentSection } from '@/features/workspace/components/categories-config/category-assignment-section'
import { CategoriesTable } from '@/features/workspace/components/categories-config/categories-table'
import { CreateCategoryModal } from '@/features/workspace/components/categories-config/create-category-modal'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo, useState, type UIEvent } from 'react'

const EMPTY_CATEGORIES: GetCategoriesResponse[] = []

export function CategoriesConfigPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [pendingAssignedByCategory, setPendingAssignedByCategory] = useState<Record<string, string[]>>({})

  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })

  const workspaceId = currentUser?.workspaceId ?? ''

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...apiOptions.queries.getWorkspaceInfiniteCategories(workspaceId),
    enabled: Boolean(workspaceId),
  })

  const categories = useMemo(
    () => categoriesData?.pages.flatMap((page) => page) ?? EMPTY_CATEGORIES,
    [categoriesData],
  )

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  )

  const isLoading = isCurrentUserLoading || isCategoriesLoading

  const handleCategoriesScroll = async (event: UIEvent<HTMLDivElement>) => {
    if (isFetchingNextPage || !hasNextPage) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const remainingScroll = scrollHeight - scrollTop - clientHeight

    if (remainingScroll < 120) {
      await fetchNextPage()
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }

  if (isLoading) {
    return (
      <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
        <div className="mx-auto mt-20 max-w-6xl">
          <Loader />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories config</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a category row to manage assigned users.
            </p>
          </div>
          <CreateCategoryModal workspaceId={workspaceId} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <CategoriesTable
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            pendingAssignedByCategory={pendingAssignedByCategory}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            onScroll={handleCategoriesScroll}
            onCategorySelect={handleCategorySelect}
          />

          <div className="xl:sticky xl:top-5 xl:self-start">
            {selectedCategory ? (
              <CategoryAssignmentSection
                selectedCategory={selectedCategory}
                workspaceId={workspaceId}
                pendingAssignedUserIds={pendingAssignedByCategory[selectedCategory.id]}
                onAssignedUserIdsChange={(nextAssignedUserIds) => {
                  setPendingAssignedByCategory((prev) => ({
                    ...prev,
                    [selectedCategory.id]: nextAssignedUserIds,
                  }))
                }}
              />
            ) : (
              <section className="rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
                Select a category from the table to configure assignments.
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
