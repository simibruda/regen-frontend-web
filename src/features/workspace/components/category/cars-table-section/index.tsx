import { apiOptions } from '@/common/api'
import { Loader } from '@/common/components/_base/loader'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Car as CarIcon } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { SharedDataTable } from '../shared-data-table'

type CarRow = {
  id: string
  name: string
  plateNumber: string
  totalKm: number
  averageLiterConsumed: number
}

type CarsTableSectionProps = {
  startDate: string
  endDate: string
}

export function CarsTableSection({
  startDate,
  endDate,
}: CarsTableSectionProps) {
  const { id: categoryId } = useParams({ from: '/_auth-guard/category/$id' })
  const { data: currentUser } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser?.workspaceId ?? ''
  const enabled = Boolean(workspaceId && categoryId)

  const { data: cars = [], isLoading } = useQuery({
    ...apiOptions.queries.getWorkspaceCarsTotalKm(workspaceId, categoryId, startDate, endDate),
    enabled,
  })
  const carRows = useMemo<CarRow[]>(
    () =>
      cars.map((car) => ({
        id: car.id,
        name: car.name,
        plateNumber: car.plateNumber,
        totalKm: car.totalKm,
        averageLiterConsumed: car.averageLiterConsumed,
      })),
    [cars],
  )

  const carColumns = useMemo<ColumnDef<CarRow>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Plate Number', accessorKey: 'plateNumber' },
      { header: 'Total KM', accessorKey: 'totalKm' },
      {
        header: 'Approx. Fuel',
        accessorKey: 'averageLiterConsumed',
        cell: ({ row }) => `${row.original.averageLiterConsumed.toFixed(1)} L`,
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
      {renderBody(isLoading, <SharedDataTable table={carTable} emptyMessage="No cars available." />)}
    </section>
  )
}

function renderBody(isLoading: boolean, table: ReactNode) {
  if (isLoading) {
    return (
      <div className="mt-8">
        <Loader />
      </div>
    )
  }

  return <div className="mt-4 overflow-x-auto">{table}</div>
}
