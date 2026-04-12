import { apiOptions } from '@/common/api'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export type BankStatementRow = {
  id: string
  date: string
  name: string
  amount: string
  categoryId: string
}

const CATEGORY_SEARCH_DEBOUNCE_MS = 500
const MAX_DECIMALS = 2

function newRow(
  partial?: Partial<Pick<BankStatementRow, 'date' | 'name' | 'amount' | 'categoryId'>>,
): BankStatementRow {
  return {
    id: crypto.randomUUID(),
    date: partial?.date ?? '',
    name: partial?.name ?? '',
    amount: partial?.amount ?? '',
    categoryId: partial?.categoryId ?? '',
  }
}

function parseAmount(raw: string): number | undefined {
  const n = parseFloat(raw.trim().replace(',', '.'))
  if (Number.isNaN(n) || n < 1) return undefined
  if (!Number.isInteger(n * 10 ** MAX_DECIMALS)) return undefined
  return n
}

export function useBankStatementModal(workspaceId: string) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | undefined>()
  const [rows, setRows] = useState<BankStatementRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [categorySearchValue, setCategorySearchValue] = useState('')
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState('')
  const [isSavingReceipts, setIsSavingReceipts] = useState(false)

  const queryClient = useQueryClient()
  const extractReceiptFromPdfMutation = useMutation(apiOptions.mutations.extractReceiptFromPdf)
  const createManyReceiptsMutation = useMutation(apiOptions.mutations.createManyReceipts)

  const { data: myCategories } = useQuery({
    ...apiOptions.queries.getMyCategories(workspaceId, debouncedCategorySearch.trim()),
    enabled: Boolean(workspaceId) && open,
  })

  const categoryOptions = useMemo(
    () =>
      (myCategories ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [myCategories],
  )

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedCategorySearch(categorySearchValue)
    }, CATEGORY_SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [categorySearchValue])

  const handleOpenChange = useCallback((next: boolean) => {
    if (!next) {
      setFile(undefined)
      setRows([])
      setCategorySearchValue('')
    }
    setOpen(next)
  }, [])

  const importPdf = useCallback(
    async (pdfFile: File) => {
      if (!workspaceId) {
        toast.error('Workspace not found')
        return
      }

      setIsParsing(true)
      try {
        const parsed = await extractReceiptFromPdfMutation.mutateAsync({
          workspaceId,
          request: { file: pdfFile },
        })
        if (parsed.length === 0) {
          toast.message('No transactions found', {
            description:
              'No date + amount pairs were detected. Scanned PDFs have no text—use a searchable PDF or add rows manually.',
          })
          setRows([])
          return
        }
        setRows(
          parsed.map((t) =>
            newRow({
              date: t.date,
              name: t.shopper,
              amount: String(t.amount),
            }),
          ),
        )
        toast.success(`Imported ${parsed.length} transaction(s)`)
      } catch (e) {
        console.error(e)
        toast.error('Could not read this PDF')
        setRows([])
      } finally {
        setIsParsing(false)
      }
    },
    [extractReceiptFromPdfMutation, workspaceId],
  )

  const handleFileChange = useCallback(
    (next: File | undefined) => {
      setFile(next)
      if (next) {
        void importPdf(next)
      } else {
        setRows([])
      }
    },
    [importPdf],
  )

  const updateRow = useCallback(
    (id: string, field: keyof Pick<BankStatementRow, 'date' | 'name' | 'amount' | 'categoryId'>, value: string) => {
      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    },
    [],
  )

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }, [])

  const appendRow = useCallback(() => {
    setRows((prev) => [...prev, newRow()])
  }, [])

  const startManualRows = useCallback(() => {
    setRows([newRow()])
  }, [])

  const handleAddReceipts = useCallback(async () => {
    if (!workspaceId) {
      toast.error('Workspace not found')
      return
    }
    if (!file) {
      toast.error('Upload a statement PDF first')
      return
    }
    if (rows.length === 0) {
      toast.error('Add at least one row')
      return
    }

    const problems: string[] = []
    const payloads: Array<{ place: string; item: { amount: number; categoryId: string; date: string } }> = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const line = i + 1
      const place = row.name.trim()
      if (!place) problems.push(`Row ${line}: place is required`)
      if (!row.date.trim()) problems.push(`Row ${line}: date is required`)
      if (!row.categoryId) problems.push(`Row ${line}: category is required`)
      const amount = parseAmount(row.amount)
      if (amount === undefined) problems.push(`Row ${line}: amount must be at least 1 with up to 2 decimals`)
      const d = dayjs(row.date.trim())
      if (!row.date.trim() || !d.isValid()) problems.push(`Row ${line}: invalid date`)

      if (place && row.categoryId && amount !== undefined && d.isValid()) {
        payloads.push({
          place,
          item: {
            amount,
            categoryId: row.categoryId,
            date: d.startOf('day').toISOString(),
          },
        })
      }
    }

    if (problems.length > 0) {
      toast.error(problems[0], { description: problems.length > 1 ? `And ${problems.length - 1} more issue(s).` : undefined })
      return
    }

    setIsSavingReceipts(true)
    try {
      for (const { place, item } of payloads) {
        await createManyReceiptsMutation.mutateAsync({
          workspaceId,
          request: {
            file,
            place,
            items: JSON.stringify([item]),
          },
        })
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECEIPT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] })
      toast.success(`Created ${payloads.length} receipt(s)`)
      handleOpenChange(false)
    } catch (e) {
      console.error(e)
      toast.error('Failed to create receipts')
    } finally {
      setIsSavingReceipts(false)
    }
  }, [workspaceId, file, rows, createManyReceiptsMutation, queryClient, handleOpenChange])

  return {
    open,
    setOpen,
    handleOpenChange,
    file,
    handleFileChange,
    rows,
    isParsing,
    categorySearchValue,
    setCategorySearchValue,
    categoryOptions,
    updateRow,
    removeRow,
    appendRow,
    startManualRows,
    handleAddReceipts,
    isSavingReceipts,
  }
}
