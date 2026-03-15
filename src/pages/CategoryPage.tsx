import { Button } from '@/common/components/_base/button'
import { cars } from '@/common/mocks/cars'
import { categories } from '@/common/mocks/categories'
import { receipts } from '@/common/mocks/receipts'
import { routes } from '@/common/mocks/routes'
import { CarsTableSection } from '@/features/workspace/components/category/cars-table-section'
import { ReceiptsTableSection } from '@/features/workspace/components/category/receipts-table-section'
import { RoutesTableSection } from '@/features/workspace/components/category/routes-table-section'
import { StatsSection } from '@/features/workspace/components/category/stats-section'
import { Link, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'

export function CategoryPage() {
  const { id } = useParams({ from: '/_auth-guard/category/$id' })
  const category = categories.find((item) => item.id === id)
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  const hasValidRange = dayjs(startDate).isValid() && dayjs(endDate).isValid() && startDate <= endDate

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
    const palette = ['#2d4ea8', '#5378c5', '#fbc909', '#10b981', '#8b5cf6', '#f97316']
    const totalAmount = receiptChartData.reduce((sum, item) => sum + item.totalAmount, 0)

    const slices = receiptChartData.reduce<
      {
        name: string
        totalAmount: number
        color: string
        percentage: number
        start: number
        end: number
      }[]
    >((acc, item, index) => {
      const percentage = totalAmount === 0 ? 0 : (item.totalAmount / totalAmount) * 100
      const start = acc[index - 1]?.end ?? 0

      acc.push({
        ...item,
        color: palette[index % palette.length],
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
              (slice) =>
                `${slice.color} ${slice.start.toFixed(2)}% ${Math.min(slice.end, 100).toFixed(2)}%`,
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
        <StatsSection
          categoryName={category.name}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          hasValidRange={hasValidRange}
          totalReceiptAmount={totalReceiptAmount}
          totalRoutes={filteredRoutes.length}
          totalKm={totalKm}
          totalFuel={totalFuel}
          pieChartData={pieChartData}
        />

        <ReceiptsTableSection receipts={filteredReceipts} categoryName={category.name} />
        <RoutesTableSection routes={filteredRoutes} />
        <CarsTableSection routes={filteredRoutes} />
      </div>
    </main>
  )
}
