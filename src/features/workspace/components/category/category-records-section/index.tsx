import { cn } from '@/lib/utils'
import { Car, MapPin, Receipt } from 'lucide-react'
import { CarsTableSection } from '../cars-table-section'
import { ReceiptsTableSection } from '../receipts-table-section'
import { RoutesTableSection } from '../routes-table-section'

export type CategoryRecordsTab = 'receipts' | 'routes' | 'cars'

type CategoryRecordsSectionProps = {
  startDate: string
  endDate: string
  activeTab: CategoryRecordsTab
  onTabChange: (tab: CategoryRecordsTab) => void
}

export function CategoryRecordsSection({
  startDate,
  endDate,
  activeTab,
  onTabChange,
}: CategoryRecordsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="inline-flex rounded-xl border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => onTabChange('receipts')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'receipts'
              ? 'bg-secondary text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          )}
        >
          <Receipt className="h-4 w-4" />
          Receipts
        </button>
        <button
          type="button"
          onClick={() => onTabChange('routes')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'routes'
              ? 'bg-secondary text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          )}
        >
          <MapPin className="h-4 w-4" />
          Routes
        </button>
        <button
          type="button"
          onClick={() => onTabChange('cars')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === 'cars'
              ? 'bg-secondary text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          )}
        >
          <Car className="h-4 w-4" />
          Cars
        </button>
      </div>

      {activeTab === 'receipts' && (
        <ReceiptsTableSection
          key={`${startDate}-${endDate}`}
          startDate={startDate}
          endDate={endDate}
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
    </section>
  )
}
