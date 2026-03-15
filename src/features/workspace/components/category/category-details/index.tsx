import { Button } from '@/common/components/_base/button'
import { InputField } from '@/common/components/_base/input-field'
import { Separator } from '@/common/components/_base/separator'
import { cars } from '@/common/mocks/cars'
import { categories } from '@/common/mocks/categories'
import type { WorkspaceReceipt } from '@/common/mocks/receipts'
import { receipts } from '@/common/mocks/receipts'
import { routes } from '@/common/mocks/routes'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  Fuel,
  Gauge,
  MapPin,
  Receipt,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { CarsTableSection } from '../cars-table-section'
import { ReceiptsTableSection } from '../receipts-table-section'
import { RoutesTableSection, type RouteTableRow } from '../routes-table-section'

type CategoryDetailsProps = {
  categoryId: string
}

export function CategoryDetails({ categoryId }: CategoryDetailsProps) {
  const category = categories.find((item) => item.id === categoryId)
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({})

  const hasValidRange = dayjs(startDate).isValid() && dayjs(endDate).isValid() && startDate <= endDate

  const filteredReceipts = useMemo(
    () =>
      receipts.filter(
        (receipt) =>
          receipt.categoryId === categoryId &&
          hasValidRange &&
          receipt.date >= startDate &&
          receipt.date <= endDate,
      ),
    [categoryId, endDate, hasValidRange, startDate],
  )

  const filteredRoutes = useMemo(
    () =>
      routes.filter(
        (route) =>
          route.categoryId === categoryId &&
          hasValidRange &&
          route.date >= startDate &&
          route.date <= endDate,
      ),
    [categoryId, endDate, hasValidRange, startDate],
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

    let currentOffset = 0
    const slices = receiptChartData.map((item, index) => {
      const percentage = totalAmount === 0 ? 0 : (item.totalAmount / totalAmount) * 100
      const start = currentOffset
      currentOffset += percentage

      return {
        ...item,
        color: palette[index % palette.length],
        percentage,
        start,
        end: currentOffset,
      }
    })

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

  const routeRows = useMemo<RouteTableRow[]>(
    () =>
      filteredRoutes.map((route) => {
        const car = cars.find((item) => item.id === route.carId)
        return {
          id: route.id,
          carName: car?.name ?? 'Unknown',
          plateNumber: car?.plateNumber ?? 'N/A',
          userFirstName: route.userFirstName,
          userLastName: route.userLastName,
          startKm: route.startKm,
          endKm: route.endKm,
          routeKm: route.endKm - route.startKm,
          stops: route.stops,
        }
      }),
    [filteredRoutes],
  )

  const carRows = useMemo(
    () =>
      cars.map((car) => {
        const totalKm = filteredRoutes
          .filter((route) => route.carId === car.id)
          .reduce((sum, route) => sum + (route.endKm - route.startKm), 0)

        return {
          id: car.id,
          name: car.name,
          plateNumber: car.plateNumber,
          totalKm,
          aproxConsume: (totalKm * car.averageConsumptionPer100Km) / 100,
        }
      }),
    [filteredRoutes],
  )

  const handleDownloadReceipt = useCallback(
    (receiptId: string) => {
      const receipt = filteredReceipts.find((item) => item.id === receiptId)
      if (!receipt) return

      const mockFileContent = [
        `Receipt: ${receipt.name}`,
        `User: ${receipt.userFirstName} ${receipt.userLastName}`,
        `Amount: ${formatCurrency(receipt.amount)}`,
        `Date: ${dayjs(receipt.date).format('DD.MM.YYYY')}`,
        `Category: ${category?.name ?? '-'}`,
        `File: ${receipt.fileName}`,
      ].join('\n')

      const blob = new Blob([mockFileContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = receipt.fileName.replace(/\.(pdf|jpg|jpeg|png)$/i, '.txt')
      link.click()
      URL.revokeObjectURL(url)
    },
    [category?.name, filteredReceipts],
  )

  const receiptColumns = useMemo<ColumnDef<WorkspaceReceipt>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'First Name', accessorKey: 'userFirstName' },
      { header: 'Last Name', accessorKey: 'userLastName' },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => (
          <span className="font-medium">{formatCurrency(row.original.amount)}</span>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => dayjs(row.original.date).format('DD.MM.YYYY'),
      },
      {
        header: '',
        id: 'download',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => handleDownloadReceipt(row.original.id)}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        ),
      },
    ],
    [handleDownloadReceipt],
  )

  const routeColumns = useMemo<ColumnDef<RouteTableRow>[]>(
    () => [
      {
        header: '',
        id: 'expand',
        cell: ({ row }) => (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-md text-primary hover:bg-secondary"
            onClick={() =>
              setExpandedRoutes((prev) => ({ ...prev, [row.original.id]: !prev[row.original.id] }))
            }
          >
            {expandedRoutes[row.original.id] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        ),
      },
      { header: 'Car Name', accessorKey: 'carName' },
      { header: 'Plate Number', accessorKey: 'plateNumber' },
      { header: 'First Name', accessorKey: 'userFirstName' },
      { header: 'Last Name', accessorKey: 'userLastName' },
      { header: 'Start KM', accessorKey: 'startKm' },
      { header: 'End KM', accessorKey: 'endKm' },
      { header: 'Route KM', accessorKey: 'routeKm' },
    ],
    [expandedRoutes],
  )

  const carColumns = useMemo<ColumnDef<(typeof carRows)[number]>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Plate Number', accessorKey: 'plateNumber' },
      { header: 'Total KM', accessorKey: 'totalKm' },
      {
        header: 'Approx. Fuel',
        accessorKey: 'aproxConsume',
        cell: ({ row }) => `${row.original.aproxConsume.toFixed(1)} L`,
      },
    ],
    [],
  )

  const receiptTable = useReactTable({
    data: filteredReceipts,
    columns: receiptColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const routeTable = useReactTable({
    data: routeRows,
    columns: routeColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const carTable = useReactTable({
    data: carRows,
    columns: carColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!category) {
    return (
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
    )
  }

  const totalReceiptAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0)
  const totalKm = carRows.reduce((sum, c) => sum + c.totalKm, 0)
  const totalFuel = carRows.reduce((sum, c) => sum + c.aproxConsume, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-2xl border border-border bg-linear-to-br from-card to-secondary/15 p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
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
            onChange={(event) => setStartDate(event.target.value)}
          />
          <InputField
            id="end-date"
            type="date"
            label="End date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>

        {!hasValidRange && (
          <p className="mt-1 text-sm text-destructive">
            Start date must be before or equal to end date.
          </p>
        )}

        <Separator className="my-4" />

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
            value={String(filteredRoutes.length)}
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

        <Separator className="my-5" />

        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Receipts grouped by name</h2>
        </div>
        <p className="mt-0.5 pl-7 text-sm text-muted-foreground">
          Amounts for selected start/end dates.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:items-center">
          {receiptChartData.length === 0 ? (
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

      <ReceiptsTableSection table={receiptTable} />
      <RoutesTableSection table={routeTable} expandedRoutes={expandedRoutes} />
      <CarsTableSection table={carTable} />
    </div>
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
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border-l-4 px-3 py-2',
        cardClassName,
      )}
    >
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
