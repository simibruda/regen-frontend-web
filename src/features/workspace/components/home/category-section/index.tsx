import type { Category } from '@/common/mocks/categories'
import { LayoutGrid } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AddReceiptModal } from '../add-receipt-modal'
import { AddRouteModal } from '../add-route-modal'
import { CategoryCard } from '../category-card'

type CategorySectionProps = {
  categories: Category[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

export function CategorySection({
  categories,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: CategorySectionProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const totalPeople = new Set(categories.flatMap((c) => c.assignedPeople.map((p) => p.id))).size

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !loadMoreRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, onLoadMore])

  return (
    <>
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-2.5">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Categories</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {categories.length} categories &middot; {totalPeople} people assigned
              </p>
            </div>
          </div>

          {/* Desktop buttons — hidden on mobile */}
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </section>

        <div ref={loadMoreRef} className="py-4 text-center text-sm text-muted-foreground">
          {isFetchingNextPage
            ? 'Loading more categories...'
            : hasNextPage
              ? 'Scroll to load more'
              : categories.length > 0
                ? 'All categories loaded.'
                : 'No categories found.'}
        </div>
      </div>

      {/* Mobile FABs — sit above the bottom nav (bottom-4 + ~56px nav height) */}
      <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 flex-row gap-2 md:hidden">
        <AddRouteModal mobile />
        <AddReceiptModal mobile />
      </div>
    </>
  )
}
