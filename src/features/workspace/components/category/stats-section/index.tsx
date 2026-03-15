import { cn } from '@/lib/utils'
import { BarChart3, CalendarDays, Car, Fuel, Gauge, MapPin, Receipt } from 'lucide-react'

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
  fleetRows: {
    id: string
    name: string
    plateNumber: string
    totalKm: number
    fuelLiters: number
  }[]
}

export function StatsSection({
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
  fleetRows,
}: StatsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">FILTER PERIOD</p>
        <div className="flex w-full max-w-lg items-center rounded-xl border border-border bg-background px-3 py-2 shadow-sm">
          <label htmlFor="start-date" className="flex min-w-0 flex-1 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
            />
          </label>
          <span className="px-2 text-muted-foreground">-</span>
          <label htmlFor="end-date" className="flex min-w-0 flex-1 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
            />
          </label>
        </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="rounded-xl p-2 md:p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Receipts grouped by name</h2>
          </div>
          <p className="mt-0.5 pl-7 text-sm text-muted-foreground">Amounts for selected start/end dates.</p>

          <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] md:items-center">
            {pieChartData.slices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No receipt data in selected range.</p>
            ) : (
              <>
                <div className="mx-auto">
                  <div
                    className="relative h-48 w-48 rounded-full"
                    style={{ backgroundImage: pieChartData.conicGradient }}
                    aria-label="Receipts distribution pie chart"
                  >
                    <div className="absolute inset-7 grid place-items-center rounded-full bg-card text-center">
                      <span className="text-xs text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(pieChartData.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pr-2">
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

        <section className="rounded-xl p-2 md:p-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-foreground">Fleet Overview</h2>
          </div>
          <p className="mt-0.5 pl-7 text-sm text-muted-foreground">Vehicle utilization summary</p>

          <div className="mt-5 divide-y divide-border rounded-lg border border-border/70 bg-secondary/10">
            {fleetRows.map((row) => (
              <div key={row.id} className="flex items-center justify-between px-3 py-2.5">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-foreground">
                    <Car className="h-3.5 w-3.5 text-muted-foreground" />
                    {row.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{row.plateNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">{row.totalKm} km</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{row.fuelLiters.toFixed(1)} L</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
