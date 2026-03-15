import { Button } from '@/common/components/_base/button'
import { cars } from '@/common/mocks/cars'
import { categories } from '@/common/mocks/categories'
import { receipts } from '@/common/mocks/receipts'
import { routes } from '@/common/mocks/routes'
import { CarsTableSection } from '@/features/workspace/components/category/cars-table-section'
import { ReceiptsTableSection } from '@/features/workspace/components/category/receipts-table-section'
import { RoutesTableSection } from '@/features/workspace/components/category/routes-table-section'
import { StatsSection } from '@/features/workspace/components/category/stats-section'
import { cn } from '@/lib/utils'
import { Link, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ArrowLeft, CalendarDays, Car, MapPin, Receipt } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

export function CategoryPage() {
  const { id } = useParams({ from: '/_auth-guard/category/$id' })
  const category = categories.find((item) => item.id === id)
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [activeTab, setActiveTab] = useState<'receipts' | 'routes' | 'cars'>('receipts')
  const startDateInputRef = useRef<HTMLInputElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)

  const hasValidRange = dayjs(startDate).isValid() && dayjs(endDate).isValid() && startDate <= endDate

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.focus()
  }

  const filteredReceipts = useMemo(
    () =>
      receipts.filter(
        (receipt) =>
          receipt.categoryId === id &&
          hasValidRange &&
          receipt.date >= startDate &&
          receipt.date <= endDate,
      ),
    [endDate, hasValidRange, id, startDate],
  )

  const filteredRoutes = useMemo(
    () =>
      routes.filter(
        (route) =>
          route.categoryId === id &&
          hasValidRange &&
          route.date >= startDate &&
          route.date <= endDate,
      ),
    [endDate, hasValidRange, id, startDate],
  )

  const receiptChartData = useMemo(() => {
    const totalsByName = new Map<string, number>()
    filteredReceipts.forEach((receipt) => {
      totalsByName.set(receipt.name, (totalsByName.get(receipt.name) ?? 0) + receipt.amount)
    })
    return Array.from(totalsByName.entries())
      .map(([name, totalAmount]) => ({ name, totalAmount }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
  }, [filteredReceipts])

  const pieChartData = useMemo(() => {
    const palette: [string, string][] = [
      ['#1f4bb8', '#4c7be0'],
      ['#0ea5a3', '#34d399'],
      ['#f59e0b', '#fbbf24'],
      ['#a855f7', '#d946ef'],
      ['#ef4444', '#f97316'],
      ['#06b6d4', '#60a5fa'],
    ]
    const totalAmount = receiptChartData.reduce((sum, item) => sum + item.totalAmount, 0)

    const slices = receiptChartData.reduce<
      {
        name: string
        totalAmount: number
        color: string
        gradientStart: string
        gradientEnd: string
        percentage: number
        start: number
        end: number
      }[]
    >((acc, item, index) => {
      const percentage = totalAmount === 0 ? 0 : (item.totalAmount / totalAmount) * 100
      const start = acc[index - 1]?.end ?? 0
      const [gradientStart, gradientEnd] = palette[index % palette.length]

      acc.push({
        ...item,
        color: gradientEnd,
        gradientStart,
        gradientEnd,
        percentage,
        start,
        end: start + percentage,
      })

      return acc
    }, [])

    const conicGradient =
      slices.length === 0
        ? 'conic-gradient(var(--secondary) 0deg 360deg)'
        : `conic-gradient(${slices
            .map(
              (slice) => {
                const start = slice.start.toFixed(2)
                const end = Math.min(slice.end, 100).toFixed(2)
                const mid = ((slice.start + Math.min(slice.end, 100)) / 2).toFixed(2)
                return `${slice.gradientStart} ${start}% ${mid}%, ${slice.gradientEnd} ${mid}% ${end}%`
              },
            )
            .join(', ')})`

    return { slices, totalAmount, conicGradient }
  }, [receiptChartData])

  const totalReceiptAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0)
  const totalKm = filteredRoutes.reduce((sum, route) => sum + (route.endKm - route.startKm), 0)
  const totalFuel = useMemo(() => {
    return filteredRoutes.reduce((sum, route) => {
      const car = cars.find((item) => item.id === route.carId)
      if (!car) return sum
      const routeKm = route.endKm - route.startKm
      return sum + (routeKm * car.averageConsumptionPer100Km) / 100
    }, 0)
  }, [filteredRoutes])

  if (!category) {
    return (
      <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-lg font-semibold text-foreground">Category not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This category does not exist in mock data.
            </p>
            <Link to="/">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-6">
            <Link to="/">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                <ArrowLeft className="h-4 w-4 text-primary" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-[2rem] leading-tight font-bold text-foreground">{category.name}</h1>
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
                  onChange={(event) => setStartDate(event.target.value)}
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
                  onChange={(event) => setEndDate(event.target.value)}
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

        <StatsSection
          totalReceiptAmount={totalReceiptAmount}
          totalRoutes={filteredRoutes.length}
          totalKm={totalKm}
          totalFuel={totalFuel}
          pieChartData={pieChartData}
        />

        <section className="space-y-4">
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setActiveTab('receipts')}
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
              onClick={() => setActiveTab('routes')}
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
              onClick={() => setActiveTab('cars')}
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
            <ReceiptsTableSection receipts={filteredReceipts} categoryName={category.name} />
          )}
          {activeTab === 'routes' && <RoutesTableSection routes={filteredRoutes} />}
          {activeTab === 'cars' && <CarsTableSection routes={filteredRoutes} />}
        </section>
      </div>
    </main>
  )
}
