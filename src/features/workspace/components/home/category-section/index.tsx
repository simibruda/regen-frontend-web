import { LayoutGrid } from 'lucide-react'
import { categories } from '@/common/mocks/categories'
import { CategoryCard } from '../category-card'
import { AddReceiptModalTrigger } from '../add-receipt-modal-trigger'
import { AddRouteModalTrigger } from '../add-route-modal-trigger'

const totalPeople = new Set(
  categories.flatMap((c) => c.assignedPeople.map((p) => p.id)),
).size

export function CategorySection() {
  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-2.5">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Categories</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {categories.length} categories &middot; {totalPeople} people assigned
              </p>
            </div>
          </div>

          {/* Desktop buttons — hidden on mobile */}
          <div className="hidden items-center gap-2 md:flex">
            <AddRouteModalTrigger />
            <AddReceiptModalTrigger />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </section>
      </div>

      {/* Mobile FABs — sit above the bottom nav (bottom-4 + ~56px nav height) */}
      <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 flex-row gap-2 md:hidden">
        <AddRouteModalTrigger mobile />
        <AddReceiptModalTrigger mobile />
      </div>
    </>
  )
}
