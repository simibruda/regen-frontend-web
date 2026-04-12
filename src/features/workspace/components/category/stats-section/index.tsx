import { cn } from '@/lib/utils'
import { BarChart3, Fuel, Gauge, MapPin, Receipt } from 'lucide-react'
import { useStatsSection } from './useStatsSection'

type StatsSectionProps = {
  startDate: string
  endDate: string
  hasValidRange: boolean
}

export function StatsSection({
  startDate,
  endDate,
  hasValidRange,
}: StatsSectionProps) {
  const { totalReceiptAmount, totalRoutes, totalKm, totalFuel, pieChartData } = useStatsSection({
    startDate,
    endDate,
    hasValidRange,
  })

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Receipt className="h-5 w-5" />}
          label="Total receipts"
          value={formatCurrency(totalReceiptAmount)}
          accent="blue"
        />
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Total routes"
          value={String(totalRoutes)}
          accent="emerald"
        />
        <StatCard
          icon={<Gauge className="h-5 w-5" />}
          label="Total KM"
          value={totalKm.toLocaleString()}
          accent="violet"
        />
        <StatCard
          icon={<Fuel className="h-5 w-5" />}
          label="Approx. fuel"
          value={`${totalFuel.toFixed(1)} L`}
          accent="amber"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        <div className="border-b border-border/60 bg-muted/30 px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Spending by place
              </h2>
              <p className="text-sm text-muted-foreground">
                Share of receipt totals in the selected period.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8">
          {pieChartData.slices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No receipt data in this date range.
            </p>
          ) : (
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
              <div className="flex justify-center">
                <div
                  className="relative h-56 w-56 shrink-0 rounded-full shadow-lg ring-4 ring-background md:h-64 md:w-64"
                  style={{ backgroundImage: pieChartData.conicGradient }}
                  aria-label="Receipts distribution chart"
                >
                  <div className="absolute inset-[22%] rounded-full bg-card shadow-inner ring-1 ring-border/50" />
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-col gap-3">
                <div className="max-h-72 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]">
                  <div className="space-y-2">
                    {pieChartData.slices.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-4 rounded-xl border border-transparent bg-muted/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/40"
                      >
                        <span className="flex min-w-0 items-center gap-3 font-medium text-foreground">
                          <span
                            className="h-3 w-3 shrink-0 rounded-full shadow-sm ring-2 ring-background"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-sm font-semibold tabular-nums text-foreground">
                            {formatCurrency(item.totalAmount)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between rounded-xl border border-border/80 bg-primary/5 px-4 py-3">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-base font-bold tabular-nums text-foreground">
                    {formatCurrency(pieChartData.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

const accentStyles = {
  blue: {
    icon: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    bar: 'bg-blue-500',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    bar: 'bg-emerald-500',
  },
  violet: {
    icon: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
    bar: 'bg-violet-500',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-800 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
} as const

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: keyof typeof accentStyles
}) {
  const a = accentStyles[accent]
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md dark:ring-white/10">
      <div className={cn('absolute inset-x-0 top-0 h-1 rounded-t-2xl', a.bar)} />
      <div className="flex items-start gap-3 pt-1">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            a.icon,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-bold tabular-nums tracking-tight text-foreground md:text-2xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatCurrency(value: number) {
  return `${value.toFixed(2)} RON`
}
