import { apiOptions } from '@/common/api'
import { RECEIPTS_PAGE_LIMIT } from '@/common/api/receipt/receipt.queries'
import type { ReceiptWorkspaceResponse } from '@/common/api/_base/api-types.schemas'
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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Download, FileText } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { SharedDataTable } from '../shared-data-table'

type ReceiptsTableSectionProps = {
  startDate: string
  endDate: string
}

export function ReceiptsTableSection({
  startDate,
  endDate,
}: ReceiptsTableSectionProps) {
  const { id: categoryId } = useParams({ from: '/_auth-guard/category/$id' })
  const { data: currentUser } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser?.workspaceId ?? ''
  const enabled = Boolean(workspaceId && categoryId)

  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
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

  const handleDownloadReceipt = useCallback(
    async (receiptId: string) => {
      if (!workspaceId) return

      const response = await queryClient.fetchQuery(
        apiOptions.queries.getReceiptBlob(workspaceId, receiptId)
      )

      const link = document.createElement('a')
      link.href = response.blobUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click()
    },
    [queryClient, workspaceId],
  )

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
        id: 'download',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary"
            onClick={() => void handleDownloadReceipt(row.original.id)}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        ),
      },
    ],
    [handleDownloadReceipt],
  )

  const receiptTable = useReactTable({
    data: receipts,
    columns: receiptColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Receipts</h2>
      </div>
      <p className="mt-0.5 pl-7 text-sm text-muted-foreground">
        Includes place, amount, date, and file download action.
      </p>
      {isLoading ? (
        <div className="mt-8">
          <Loader />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
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
