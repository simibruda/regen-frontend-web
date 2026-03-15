import { cars } from '@/common/mocks/cars'
import type { WorkspaceRoute } from '@/common/mocks/routes'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Car as CarIcon } from 'lucide-react'
import { useMemo } from 'react'
import { SharedDataTable } from '../shared-data-table'

type CarRow = {
  id: string
  name: string
  plateNumber: string
  totalKm: number
  aproxConsume: number
}

type CarsTableSectionProps = {
  routes: WorkspaceRoute[]
}

export function CarsTableSection({ routes }: CarsTableSectionProps) {
  const carRows = useMemo(
    () =>
      cars.map((car) => {
        const totalKm = routes
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
    [routes],
  )

  const carColumns = useMemo<ColumnDef<CarRow>[]>(
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

  const carTable = useReactTable({
    data: carRows,
    columns: carColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <CarIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Cars</h2>
      </div>
      <p className="mt-0.5 pl-7 text-sm text-muted-foreground">
        Workspace cars with total km and approximate fuel use for selected dates.
      </p>
      <div className="mt-4 overflow-x-auto">
        <SharedDataTable table={carTable} emptyMessage="No cars available." />
      </div>
    </section>
  )
}
