import { apiOptions } from '@/common/api'
import { Button } from '@/common/components/_base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/_base/dialog'
import { Dropzone } from '@/common/components/_base/dropzone'
import { Input } from '@/common/components/_base/input'
import { useMutation } from '@tanstack/react-query'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

type EditableRow = {
  id: string
  date: string
  store: string
  amount: string
}

function newRow(partial?: Partial<Pick<EditableRow, 'date' | 'store' | 'amount'>>): EditableRow {
  return {
    id: crypto.randomUUID(),
    date: partial?.date ?? '',
    store: partial?.store ?? '',
    amount: partial?.amount ?? '',
  }
}

type BankStatementModalProps = {
  workspaceId: string
}

export function BankStatementModal({ workspaceId }: BankStatementModalProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | undefined>()
  const [rows, setRows] = useState<EditableRow[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const extractReceiptFromPdfMutation = useMutation(apiOptions.mutations.extractReceiptFromPdf)

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setFile(undefined)
      setRows([])
    }
    setOpen(next)
  }

  const importPdf = useCallback(async (pdfFile: File) => {
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
            store: t.shopper,
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
  }, [extractReceiptFromPdfMutation, workspaceId])

  const handleFileChange = (next: File | undefined) => {
    setFile(next)
    if (next) {
      void importPdf(next)
    } else {
      setRows([])
    }
  }

  const updateRow = (id: string, field: keyof Pick<EditableRow, 'date' | 'store' | 'amount'>, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    )
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
        Bank statement
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="md:max-w-4xl" showCloseButton={!isParsing}>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Bank statement
            </DialogTitle>
            <DialogDescription className="text-white/75">
              Upload a PDF to import transactions, then edit or remove rows as needed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4">
            <Dropzone
              value={file}
              onChange={handleFileChange}
              acceptedTypes={['application/pdf']}
              accept=".pdf"
              description="PDF only"
              label="Statement PDF"
            />

            {isParsing && (
              <p className="text-sm text-muted-foreground">Reading PDF…</p>
            )}

            {rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Transactions
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setRows((prev) => [...prev, newRow()])}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add row
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Store</th>
                        <th className="px-3 py-2 font-medium">Amount</th>
                        <th className="w-12 px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} className="border-b border-border last:border-0">
                          <td className="px-2 py-1 align-middle">
                            <Input
                              value={row.date}
                              onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                              placeholder="DD/MM/YYYY"
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle">
                            <Input
                              value={row.store}
                              onChange={(e) => updateRow(row.id, 'store', e.target.value)}
                              placeholder="Merchant"
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle">
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={row.amount}
                              onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                              placeholder="0.00"
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-1 py-1 align-middle text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeRow(row.id)}
                              aria-label="Delete row"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isParsing && file && rows.length === 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  No rows yet — try another PDF or add rows manually.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1"
                  onClick={() => setRows([newRow()])}
                >
                  <Plus className="h-4 w-4" />
                  Add row
                </Button>
              </div>
            )}

            {!isParsing && !file && (
              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() => setRows([newRow()])}
              >
                <Plus className="h-4 w-4" />
                Add transaction manually
              </Button>
            )}
          </div>

          <DialogFooter className="border-t border-border/50 px-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
