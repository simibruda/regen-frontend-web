import { Button } from '@/common/components/_base/button'
import { homeWorkspaceOutlineTriggerCn } from '@/features/workspace/components/home/home-workspace-action-triggers'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { useRef } from 'react'

type CategoryPageHeaderProps = {
  categoryName: string
  startDate: string
  endDate: string
  hasValidRange: boolean
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

export function CategoryPageHeader({
  categoryName,
  startDate,
  endDate,
  hasValidRange,
  onStartDateChange,
  onEndDateChange,
}: CategoryPageHeaderProps) {
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.focus()
  }

  return (
    <header className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      <div className="bg-linear-to-r from-primary/15 via-primary/5 to-transparent px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <Link to="/" className="shrink-0">
              <Button type="button" variant="outline" className={homeWorkspaceOutlineTriggerCn(false)}>
                <ArrowLeft className="h-4 w-4 text-primary" />
                Back
              </Button>
            </Link>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/90">
                Category
              </p>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {categoryName}
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Analytics, breakdown, and records for the selected date range.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-2 lg:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date range
            </p>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-2.5 shadow-inner">
                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                <input
                  ref={startDateInputRef}
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => onStartDateChange(event.target.value)}
                  onClick={() => openDatePicker(startDateInputRef.current)}
                  className="w-full min-w-0 bg-transparent text-sm font-medium text-foreground outline-none [&::-webkit-calendar-picker-indicator]:opacity-60"
                />
              </div>
              <span className="hidden text-center text-muted-foreground sm:block">→</span>
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background/90 px-3 py-2.5 shadow-inner">
                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                <input
                  ref={endDateInputRef}
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => onEndDateChange(event.target.value)}
                  onClick={() => openDatePicker(endDateInputRef.current)}
                  className="w-full min-w-0 bg-transparent text-sm font-medium text-foreground outline-none [&::-webkit-calendar-picker-indicator]:opacity-60"
                />
              </div>
            </div>
            {!hasValidRange && (
              <p className="text-sm text-destructive">Start date must be on or before end date.</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
