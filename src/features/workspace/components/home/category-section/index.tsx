import { LayoutGrid, MapPin, Receipt } from 'lucide-react'
import { Button } from '@/common/components/_base/button'
import { categories } from '@/common/mocks/categories'
import { CategoryCard } from '../category-card'

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
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
              <MapPin className="h-4 w-4 text-primary" />
              Add Route
            </Button>
            <Button variant="default">
              <Receipt className="h-4 w-4" />
              Add Receipt
            </Button>
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
        <Button size="lg" variant="outline" className="rounded-full border-border text-foreground shadow-lg hover:bg-secondary">
          <MapPin className="h-5 w-5 text-primary" />
          Add Route
        </Button>
        <Button size="lg" variant="default" className="rounded-full shadow-lg">
          <Receipt className="h-5 w-5" />
          Add Receipt
        </Button>
      </div>
    </>
  )
}
