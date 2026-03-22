import type { GetCategoriesResponse } from '@/common/api/_base/api-types.schemas'
import type { UIEvent } from 'react'

type CategoriesTableProps = {
  categories: GetCategoriesResponse[]
  selectedCategoryId: string | null
  pendingAssignedByCategory: Record<string, string[]>
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onScroll: (event: UIEvent<HTMLDivElement>) => void
  onCategorySelect: (categoryId: string) => void
}

export function CategoriesTable({
  categories,
  selectedCategoryId,
  pendingAssignedByCategory,
  isFetchingNextPage,
  hasNextPage,
  onScroll,
  onCategorySelect,
}: CategoriesTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="max-h-[55vh] overflow-auto" onScroll={onScroll}>
        <table className="w-full min-w-[680px] text-left">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Assigned users</th>
              <th className="px-4 py-3">Preview</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id
              const effectiveAssignedCount =
                pendingAssignedByCategory[category.id]?.length ?? category.assignedUsersCount

              return (
                <tr
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`cursor-pointer border-t border-border/60 transition-colors ${
                    isSelected ? 'bg-secondary/60' : 'hover:bg-secondary/30'
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{category.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{effectiveAssignedCount}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {category.assignedUsers.slice(0, 2).map((user) => user.firstName).join(', ') || 'No users'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {isFetchingNextPage && (
          <div className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
            Loading more categories...
          </div>
        )}

        {!hasNextPage && categories.length > 0 && (
          <div className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
            All categories loaded.
          </div>
        )}
      </div>
    </section>
  )
}
