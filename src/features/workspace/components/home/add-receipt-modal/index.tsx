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
import { InputField } from '@/common/components/_base/input-field'
import { SearchableSelectField } from '@/common/components/_base/searchable-select-field'
import {
  homeWorkspaceAccentIconTriggerCn,
  homeWorkspaceAccentTriggerCn,
} from '@/features/workspace/components/home/home-workspace-action-triggers'
import { Receipt } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { useAddReceiptModal } from './useAddReceiptModal'

type AddReceiptModalProps = {
  mobile?: boolean
}

export function AddReceiptModal({ mobile = false }: AddReceiptModalProps) {
  const {
    open,
    setOpen,
    categorySearchValue,
    setCategorySearchValue,
    workspaceId,
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    filteredCategoryOptions,
    handleOpenChange,
    onSubmit,
    handleClose,
  } = useAddReceiptModal()

  return (
    <>
      {mobile ? (
        <Button
          type="button"
          variant="default"
          size="icon"
          className={homeWorkspaceAccentIconTriggerCn(true)}
          aria-label="Add receipt"
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <Receipt className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          className={homeWorkspaceAccentTriggerCn(false)}
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <Receipt className="h-4 w-4" />
          Add Receipt
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Receipt className="h-5 w-5" />
              Add Receipt
            </DialogTitle>
            <DialogDescription className="text-white/75">
              Fill in all details to add a new receipt.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-2 overflow-y-auto px-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputField
              id="place"
              label="Place"
              error={errors.place?.message}
              {...register('place')}
            />

            <InputField
              id="date"
              type="date"
              label="Date"
              error={errors.date?.message}
              {...register('date')}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <InputField
                  id="amount"
                  type="number"
                  value={field.value || ''}
                  label="Amount"
                  error={errors.amount?.message}
                  ref={field.ref}
                  onChange={(e) => {
                    if (e.target.value === '') return field.onChange(undefined)
                    const num = parseFloat(parseFloat(e.target.value).toFixed(2))
                    if (!Number.isNaN(num)) field.onChange(num)
                  }}
                />
              )}
            />
            <Controller
              name="categoryId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SearchableSelectField
                  id="categoryId"
                  label="Category"
                  searchPlaceholder="Search categories..."
                  noOptionsText="No categories found."
                  error={errors.categoryId?.message}
                  options={filteredCategoryOptions}
                  value={value}
                  onValueChange={onChange}
                  searchValue={categorySearchValue}
                  onSearchValueChange={setCategorySearchValue}
                />
              )}
            />

            <Controller
              name="file"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Dropzone value={value} onChange={onChange} error={errors.file?.message} />
              )}
            />

            <DialogFooter className="border-t border-border/50 px-0">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Receipt'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
