import { cn } from '@/lib/utils'
import { Car, MapPin, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'
import { CarsTableSection } from '../cars-table-section'
import { ReceiptsTableSection } from '../receipts-table-section'
import { RoutesTableSection } from '../routes-table-section'

export type CategoryRecordsTab = 'receipts' | 'routes' | 'cars'

type CategoryRecordsSectionProps = {
  startDate: string
  endDate: string
  categoryName: string
  activeTab: CategoryRecordsTab
  onTabChange: (tab: CategoryRecordsTab) => void
}

export function CategoryRecordsSection({
  startDate,
  endDate,
  categoryName,
  activeTab,
  onTabChange,
}: CategoryRecordsSectionProps) {
  return (
    <section className="space-y-0">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <div className="border-b border-border/60 bg-muted/25 px-4 py-4 sm:px-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Records</h2>
              <p className="text-sm text-muted-foreground">
                Receipts, routes, and cars for this category.
              </p>
            </div>
          </div>
          <div
            className="flex w-full flex-col gap-2 sm:inline-flex sm:flex-row sm:rounded-xl sm:bg-muted/40 sm:p-1.5"
            role="tablist"
            aria-label="Record type"
          >
            <TabButton
              active={activeTab === 'receipts'}
              onClick={() => onTabChange('receipts')}
              icon={<Receipt className="h-4 w-4" />}
              label="Receipts"
            />
            <TabButton
              active={activeTab === 'routes'}
              onClick={() => onTabChange('routes')}
              icon={<MapPin className="h-4 w-4" />}
              label="Routes"
            />
            <TabButton
              active={activeTab === 'cars'}
              onClick={() => onTabChange('cars')}
              icon={<Car className="h-4 w-4" />}
              label="Cars"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'receipts' && (
            <ReceiptsTableSection
              key={`${startDate}-${endDate}`}
              startDate={startDate}
              endDate={endDate}
              categoryName={categoryName}
            />
          )}
          {activeTab === 'routes' && (
            <RoutesTableSection
              key={`${startDate}-${endDate}`}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          {activeTab === 'cars' && (
            <CarsTableSection
              key={`${startDate}-${endDate}`}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-1 sm:justify-center',
        active
          ? 'bg-card text-foreground shadow-sm ring-1 ring-border/80 dark:bg-background'
          : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
