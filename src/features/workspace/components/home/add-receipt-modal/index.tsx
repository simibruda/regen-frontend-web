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
import { SelectField } from '@/common/components/_base/select-field'
import { categories } from '@/common/mocks/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Receipt } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 10 * 1024 * 1024
const MAX_DECIMALS = 2

const receiptSchema = z.object({
  place: z.string().min(1, 'Place is required'),
  date: z.string().min(1, 'Date is required'),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((f) => ACCEPTED_TYPES.includes(f.type), 'Only PDF, JPG, or PNG files are accepted')
    .refine((f) => f.size <= MAX_SIZE, 'File must be under 10 MB'),
  amount: z
    .number()
    .min(1, 'Amount is required')
    .refine(
      (value) => Number.isInteger(value * 10 ** MAX_DECIMALS),
      `Amount can have at most ${MAX_DECIMALS} decimals`
    ),
  categoryId: z.string().min(1, 'Category is required'),
})

type ReceiptFormValues = z.infer<typeof receiptSchema>

type AddReceiptModalProps = {
  mobile?: boolean
}

const defaultValues = {
  place: '',
  date: dayjs().format('YYYY-MM-DD'),
  amount: undefined,
  categoryId: '',
}

export function AddReceiptModal({ mobile = false }: AddReceiptModalProps) {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues,
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
    }
    setOpen(nextOpen)
  }

  function onSubmit(data: ReceiptFormValues) {
    console.log('Receipt submitted:', data)
    handleOpenChange(false)
  }

  function handleClose() {
    handleOpenChange(false)
  }

  return (
    <>
      {mobile ? (
        <Button
          size="lg"
          variant="default"
          className="rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Receipt className="h-5 w-5" />
          Add Receipt
        </Button>
      ) : (
        <Button variant="default" onClick={() => setOpen(true)}>
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
                <SelectField
                  id="categoryId"
                  label="Category"
                  error={errors.categoryId?.message}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  value={value}
                  onValueChange={onChange}
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
