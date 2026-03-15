import { Button } from '@/common/components/_base/button'
import type { WorkspaceReceipt } from '@/common/mocks/receipts'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Download, FileText } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { SharedDataTable } from '../shared-data-table'

type ReceiptsTableSectionProps = {
  receipts: WorkspaceReceipt[]
  categoryName?: string
}

export function ReceiptsTableSection({ receipts, categoryName }: ReceiptsTableSectionProps) {
  const handleDownloadReceipt = useCallback(
    (receiptId: string) => {
      const receipt = receipts.find((item) => item.id === receiptId)
      if (!receipt) return

      const mockFileContent = [
        `Receipt: ${receipt.name}`,
        `User: ${receipt.userFirstName} ${receipt.userLastName}`,
        `Amount: ${formatCurrency(receipt.amount)}`,
        `Date: ${dayjs(receipt.date).format('DD.MM.YYYY')}`,
        `Category: ${categoryName ?? '-'}`,
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
    [categoryName, receipts],
  )

  const receiptColumns = useMemo<ColumnDef<WorkspaceReceipt>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'First Name', accessorKey: 'userFirstName' },
      { header: 'Last Name', accessorKey: 'userLastName' },
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
        Includes name, user, amount, date, and file download action.
      </p>
      <div className="mt-4 overflow-x-auto">
        <SharedDataTable table={receiptTable} emptyMessage="No receipts for selected date range." />
      </div>
    </section>
  )
}

function formatCurrency(value: number) {
  return `${value.toFixed(2)} RON`
}
