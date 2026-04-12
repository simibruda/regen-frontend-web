import { apiOptions } from '@/common/api'
import {
  CurrentUserResponseRole,
  type ReceiptWorkspaceResponse,
} from '@/common/api/_base/api-types.schemas'
import { RECEIPTS_PAGE_LIMIT } from '@/common/api/receipt/receipt.queries'
import { Loader } from '@/common/components/_base/loader'
import { ReceiptDeleteButton } from '@/features/workspace/components/category/receipt-delete-button'
import { ReceiptDownloadButton } from '@/features/workspace/components/category/receipt-download-button'
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
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SharedDataTable } from '../shared-data-table'

type ReceiptsTableSectionProps = {
  startDate: string
  endDate: string
  categoryName: string
}

export function ReceiptsTableSection({
  startDate,
  endDate,
  categoryName,
}: ReceiptsTableSectionProps) {
  const { id: categoryId } = useParams({ from: '/_auth-guard/category/$id' })
  const { data: currentUser } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser?.workspaceId ?? ''
  const canDeleteReceipts = currentUser?.role === CurrentUserResponseRole.ADMIN
  const enabled = Boolean(workspaceId && categoryId)

  const [currentPage, setCurrentPage] = useState(1)
  const { data: receipts = [], isLoading } = useQuery({
    ...apiOptions.queries.getWorkspaceReceipts(
      workspaceId,
      startDate,
      endDate,
      currentPage,
      categoryId
    ),
    enabled,
  })
  const hasNextPage = receipts.length === RECEIPTS_PAGE_LIMIT

  const receiptColumns = useMemo<ColumnDef<ReceiptWorkspaceResponse>[]>(
    () => [
      { header: 'Place', accessorKey: 'place' },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.amount)}</span>,
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => dayjs(row.original.date).format('DD.MM.YYYY'),
      },
      {
        header: '',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ReceiptDownloadButton
              workspaceId={workspaceId}
              receipt={row.original}
              categoryName={categoryName}
            />
            {canDeleteReceipts ? (
              <ReceiptDeleteButton workspaceId={workspaceId} receipt={row.original} />
            ) : null}
          </div>
        ),
      },
    ],
    [canDeleteReceipts, categoryName, workspaceId],
  )

  const receiptTable = useReactTable({
    data: receipts,
    columns: receiptColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <section className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <FileText className="me-1.5 inline h-4 w-4 align-text-bottom text-primary" />
        Place, amount, date — download the original file when needed.
      </p>
      {isLoading ? (
        <div className="py-10">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <SharedDataTable table={receiptTable} emptyMessage="No receipts for selected date range." />
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

function formatCurrency(value: number) {
  return `${value.toFixed(2)} RON`
}
