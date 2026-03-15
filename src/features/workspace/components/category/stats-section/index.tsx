import { Button } from '@/common/components/_base/button'
import { InputField } from '@/common/components/_base/input-field'
import { Separator } from '@/common/components/_base/separator'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, Fuel, Gauge, MapPin, Receipt } from 'lucide-react'

type PieSlice = {
  name: string
  totalAmount: number
  color: string
  percentage: number
}

type PieChartData = {
  slices: PieSlice[]
  totalAmount: number
  conicGradient: string
}

type StatsSectionProps = {
  categoryName: string
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  hasValidRange: boolean
  totalReceiptAmount: number
  totalRoutes: number
  totalKm: number
  totalFuel: number
  pieChartData: PieChartData
}

export function StatsSection({
  categoryName,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  hasValidRange,
  totalReceiptAmount,
  totalRoutes,
  totalKm,
  totalFuel,
  pieChartData,
}: StatsSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-linear-to-br from-card to-secondary/15 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{categoryName}</h1>
          <p className="text-sm text-muted-foreground">Category analytics and records by date</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 text-primary" />
            Back
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <InputField
          id="start-date"
          type="date"
          label="Start date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
        <InputField
          id="end-date"
          type="date"
          label="End date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </div>

      {!hasValidRange && (
        <p className="mt-1 text-sm text-destructive">Start date must be before or equal to end date.</p>
      )}



      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <StatCard
          icon={<Receipt className="h-5 w-5 text-blue-700" />}
          label="Total Receipts"
          value={formatCurrency(totalReceiptAmount)}
          cardClassName="border-l-blue-600 bg-blue-50/80"
          iconWrapClassName="bg-blue-100"
        />
        <StatCard
          icon={<MapPin className="h-5 w-5 text-emerald-700" />}
          label="Total Routes"
          value={String(totalRoutes)}
          cardClassName="border-l-emerald-600 bg-emerald-50/80"
          iconWrapClassName="bg-emerald-100"
        />
        <StatCard
          icon={<Gauge className="h-5 w-5 text-violet-700" />}
          label="Total KM"
          value={totalKm.toLocaleString()}
          cardClassName="border-l-violet-600 bg-violet-50/80"
          iconWrapClassName="bg-violet-100"
        />
        <StatCard
          icon={<Fuel className="h-5 w-5 text-amber-700" />}
          label="Approx. Fuel"
          value={`${totalFuel.toFixed(1)} L`}
          cardClassName="border-l-amber-600 bg-amber-50/80"
          iconWrapClassName="bg-amber-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Receipts grouped by name</h2>
      </div>
      <p className="mt-0.5 pl-7 text-sm text-muted-foreground">Amounts for selected start/end dates.</p>
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:items-center">
        {pieChartData.slices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No receipt data in selected range.</p>
        ) : (
          <>
            <div className="mx-auto">
              <div
                className="relative h-52 w-52 rounded-full"
                style={{ backgroundImage: pieChartData.conicGradient }}
                aria-label="Receipts distribution pie chart"
              >
                <div className="absolute inset-8 grid place-items-center rounded-full bg-card text-center">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(pieChartData.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {pieChartData.slices.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-secondary/25 px-3 py-2"
                >
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(item.totalAmount)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function StatCard({
  icon,
  label,
  value,
  cardClassName,
  iconWrapClassName,
}: {
  icon: React.ReactNode
  label: string
  value: string
  cardClassName?: string
  iconWrapClassName?: string
}) {
  return (
    <div className={cn('flex items-center gap-2.5 rounded-lg border-l-4 px-3 py-2', cardClassName)}>
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
          iconWrapClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] leading-tight text-muted-foreground">{label}</p>
        <p className="truncate text-lg leading-tight font-bold tabular-nums text-foreground">{value}</p>
      </div>
    </div>
  )
}

function formatCurrency(value: number) {
  return `${value.toFixed(2)} RON`
}
