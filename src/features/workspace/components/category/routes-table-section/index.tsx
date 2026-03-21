import { apiOptions } from '@/common/api'
import { ROUTES_PAGE_LIMIT } from '@/common/api/route/route.queries'
import { Button } from '@/common/components/_base/button'
import { Loader } from '@/common/components/_base/loader'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/common/components/_base/pagination'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'

export type RouteTableRow = {
  id: string
  userAvatarUrl: string | null
  userFirstName: string
  userLastName: string
  userDisplayName: string
  carName: string
  plateNumber: string
  userId: string
  date: string
  startKm: number
  endKm: number | null
  routeKm: number | null
  stops: { order: number; name: string }[]
}

function userInitials(firstName: string, lastName: string) {
  const a = firstName.trim().charAt(0)
  const b = lastName.trim().charAt(0)
  if (a && b) return `${a}${b}`.toUpperCase()
  if (a) return a.toUpperCase()
  if (b) return b.toUpperCase()
  return '?'
}

type RoutesTableSectionProps = {
  startDate: string
  endDate: string
}

export function RoutesTableSection({
  startDate,
  endDate,
}: RoutesTableSectionProps) {
  const { id: categoryId } = useParams({ from: '/_auth-guard/category/$id' })
  const { data: currentUser } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser?.workspaceId ?? ''
  const enabled = Boolean(workspaceId && categoryId)

  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({})

  const { data: workspaceRoutes = [], isLoading: isRoutesLoading } = useQuery({
    ...apiOptions.queries.getWorkspaceRoutes(workspaceId, startDate, endDate, currentPage),
    enabled,
  })

  const { data: cars = [], isLoading: isCarsLoading } = useQuery({
    ...apiOptions.queries.getWorkspaceCarsTotalKm(workspaceId, categoryId, startDate, endDate),
    enabled,
  })

  const hasNextPage = workspaceRoutes.length === ROUTES_PAGE_LIMIT
  const isLoading = isRoutesLoading || isCarsLoading

  const carsById = useMemo(() => new Map(cars.map((car) => [car.id, car])), [cars])
  const routeRows = useMemo<RouteTableRow[]>(
    () =>
      workspaceRoutes.map((route) => {
        const car = carsById.get(route.carId)
        const endKm = route.endKm
        return {
          id: route.id,
          userAvatarUrl: route.avatar ?? null,
          userFirstName: route.firstName,
          userLastName: route.lastName,
          userDisplayName: `${route.firstName} ${route.lastName}`.trim() || '—',
          carName: car?.name ?? 'Unknown',
          plateNumber: car?.plateNumber ?? 'N/A',
          userId: route.userId,
          date: route.date,
          startKm: route.startKm,
          endKm,
          routeKm: endKm === null ? null : endKm - route.startKm,
          stops: [...route.routeItems]
            .sort((a, b) => a.order - b.order)
            .map((item) => ({ order: item.order, name: item.name })),
        }
      }),
    [carsById, workspaceRoutes]
  )

  const routeColumns = useMemo<ColumnDef<RouteTableRow>[]>(
    () => [
      {
        header: 'Avatar',
        id: 'avatar',
        cell: ({ row }) => {
          const { userAvatarUrl, userDisplayName } = row.original
          if (userAvatarUrl) {
            return (
              <img
                src={userAvatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            )
          }
          return (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
              title={userDisplayName}
            >
              {userInitials(row.original.userFirstName, row.original.userLastName)}
            </div>
          )
        },
      },
      { header: 'User Name', accessorKey: 'userDisplayName' },
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
      { header: 'User ID', accessorKey: 'userId' },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => dayjs(row.original.date).format('DD.MM.YYYY'),
      },
      { header: 'Start KM', accessorKey: 'startKm' },
      {
        header: 'End KM',
        accessorKey: 'endKm',
        cell: ({ row }) => (row.original.endKm ?? '-'),
      },
      {
        header: 'Route KM',
        accessorKey: 'routeKm',
        cell: ({ row }) => (row.original.routeKm ?? '-'),
      },
    ],
    [expandedRoutes]
  )

  const routeTable = useReactTable({
    data: routeRows,
    columns: routeColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const columnCount = routeTable.getAllLeafColumns().length

  return (
    <section className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <MapPin className="me-1.5 inline h-4 w-4 align-text-bottom text-primary" />
        Expand a row to see stops in order.
      </p>
      {isLoading ? (
        <div className="py-10">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-border text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                {routeTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b border-border px-3 py-2.5 font-semibold">
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (currentPage <= 1) return
                    setCurrentPage((page) => page - 1)
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (!hasNextPage) return
                    setCurrentPage((page) => page + 1)
                  }}
                  className={!hasNextPage ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
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