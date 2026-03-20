import { Button } from '@/common/components/_base/button'
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
    <div className="space-y-4 border-b border-border/60 pb-4">
      <div className="flex items-center gap-6">
        <Link to="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 text-primary" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-[2rem] leading-tight font-bold text-foreground">{categoryName}</h1>
          <p className="mt-1 text-base text-muted-foreground">Category analytics and records by date</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">FILTER PERIOD</p>
        <div className="flex w-full max-w-lg items-center rounded-xl border border-border bg-background px-3 py-2 shadow-sm">
          <label
            htmlFor="start-date"
            className="flex min-w-0 flex-1 items-center gap-2"
            onClick={() => openDatePicker(startDateInputRef.current)}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={startDateInputRef}
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              onClick={() => openDatePicker(startDateInputRef.current)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </label>
          <span className="px-2 text-muted-foreground">-</span>
          <label
            htmlFor="end-date"
            className="flex min-w-0 flex-1 items-center gap-2"
            onClick={() => openDatePicker(endDateInputRef.current)}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={endDateInputRef}
              id="end-date"
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              onClick={() => openDatePicker(endDateInputRef.current)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </label>
        </div>
      </div>

      {!hasValidRange && (
        <p className="text-sm text-destructive">Start date must be before or equal to end date.</p>
      )}
    </div>
  )
}
