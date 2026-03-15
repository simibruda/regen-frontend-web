import { Button } from '@/common/components/_base/button'
import { cars } from '@/common/mocks/cars'
import type { WorkspaceRoute } from '@/common/mocks/routes'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'

export type RouteTableRow = {
  id: string
  carName: string
  plateNumber: string
  userFirstName: string
  userLastName: string
  startKm: number
  endKm: number
  routeKm: number
  stops: { order: number; name: string }[]
}

type RoutesTableSectionProps = {
  routes: WorkspaceRoute[]
}

export function RoutesTableSection({ routes }: RoutesTableSectionProps) {
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({})
  const routeRows = useMemo<RouteTableRow[]>(
    () =>
      routes.map((route) => {
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
    [routes],
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

  const routeTable = useReactTable({
    data: routeRows,
    columns: routeColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const columnCount = routeTable.getAllLeafColumns().length

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Routes</h2>
      </div>
      <p className="mt-0.5 pl-7 text-sm text-muted-foreground">
        Expand a route row to see each stop order and name.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-border text-sm">
          <thead className="bg-primary text-left text-xs uppercase tracking-wide text-primary-foreground">
            {routeTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b border-primary-2 px-3 py-2.5 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {routeTable.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-3 py-8 text-center text-muted-foreground">
                  No routes for selected date range.
                </td>
              </tr>
            ) : (
              routeTable.getRowModel().rows.map((row) => (
                <ExpandableRouteRow
                  key={row.id}
                  row={row}
                  isExpanded={!!expandedRoutes[row.original.id]}
                  columnCount={columnCount}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ExpandableRouteRow({
  row,
  isExpanded,
  columnCount,
}: {
  row: Row<RouteTableRow>
  isExpanded: boolean
  columnCount: number
}) {
  return (
    <>
      <tr className="bg-card transition-colors hover:bg-secondary/30">
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="border-b border-border px-3 py-2.5 text-foreground">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {isExpanded && (
        <tr className="bg-secondary/20">
          <td colSpan={columnCount} className="border-b border-border px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stops route flow
            </p>
            <div className="overflow-x-auto p-1">
              <div className="flex min-w-[320px] flex-wrap items-center gap-2">
                {row.original.stops.map((stop, index) => (
                  <div key={`${row.original.id}-${stop.order}`} className="flex items-center gap-2">
                    <div className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:-translate-y-0.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {stop.order}
                      </span>
                      <span className="text-sm font-medium text-foreground">{stop.name}</span>
                    </div>
                    {index < row.original.stops.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-primary/70" aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
