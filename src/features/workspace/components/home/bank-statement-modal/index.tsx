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
import { SearchableSelectField } from '@/common/components/_base/searchable-select-field'
import {
  homeWorkspaceOutlineIconTriggerCn,
  homeWorkspaceOutlineTriggerCn,
} from '@/features/workspace/components/home/home-workspace-action-triggers'
import { FileText, Plus, Receipt, Trash2 } from 'lucide-react'
import dayjs from 'dayjs'
import { useBankStatementModal } from './useBankStatementModal'

function dateToInputValue(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  const d = dayjs(t)
  return d.isValid() ? d.format('YYYY-MM-DD') : ''
}

type BankStatementModalProps = {
  workspaceId: string
  mobile?: boolean
}

export function BankStatementModal({ workspaceId, mobile = false }: BankStatementModalProps) {
  const {
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
  } = useBankStatementModal(workspaceId)

  return (
    <>
      {mobile ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={homeWorkspaceOutlineIconTriggerCn(true)}
          aria-label="Bank statement"
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <FileText className="h-5 w-5 text-primary" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={homeWorkspaceOutlineTriggerCn(false)}
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <FileText className="h-4 w-4 text-primary" />
          Bank statement
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="md:max-w-4xl" showCloseButton={!isParsing && !isSavingReceipts}>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Bank statement
            </DialogTitle>
            <DialogDescription className="text-white/75">
              Upload a PDF to import transactions. Place is saved on each receipt; pick a category
              per row, then add receipts.
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

            {isParsing && <p className="text-sm text-muted-foreground">Reading PDF…</p>}

            {rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Transactions
                  </p>
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={appendRow}>
                    <Plus className="h-3.5 w-3.5" />
                    Add row
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="sticky top-0 z-10 border-b border-border bg-muted/95 backdrop-blur-sm">
                      <tr>
                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Date
                        </th>
                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Place
                        </th>
                        <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Amount
                        </th>
                        <th className="min-w-[160px] px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Category
                        </th>
                        <th className="w-12 px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} className="border-b border-border last:border-0">
                          <td className="px-2 py-1 align-middle">
                            <Input
                              type="date"
                              value={dateToInputValue(row.date)}
                              onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle">
                            <Input
                              value={row.name}
                              onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                              placeholder="Place / merchant"
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle">
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={row.amount}
                              onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                              placeholder="0.00"
                              className="h-9 rounded-md border border-border bg-background px-2"
                            />
                          </td>
                          <td className="px-2 py-1 align-middle">
                            <SearchableSelectField
                              id={`statement-cat-${row.id}`}
                              label="Category"
                              hideLabel
                              placeholder="Select category"
                              searchPlaceholder="Search categories..."
                              noOptionsText="No categories found."
                              options={categoryOptions}
                              value={row.categoryId}
                              onValueChange={(v) => updateRow(row.id, 'categoryId', v)}
                              searchValue={categorySearchValue}
                              onSearchValueChange={setCategorySearchValue}
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
                <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1" onClick={startManualRows}>
                  <Plus className="h-4 w-4" />
                  Add row
                </Button>
              </div>
            )}

            {!isParsing && !file && (
              <Button type="button" variant="outline" className="self-start" onClick={startManualRows}>
                <Plus className="h-4 w-4" />
                Add transaction manually
              </Button>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-t border-border/50 px-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
            <Button
              type="button"
              variant="default"
              className="gap-2"
              disabled={
                !file || rows.length === 0 || isParsing || isSavingReceipts || !workspaceId
              }
              onClick={() => void handleAddReceipts()}
            >
              <Receipt className="h-4 w-4" />
              {isSavingReceipts ? 'Saving…' : 'Add receipts'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
