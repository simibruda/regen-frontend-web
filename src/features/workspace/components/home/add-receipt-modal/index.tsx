import { useCallback, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'
import { Receipt, Upload, X, FileText, Image } from 'lucide-react'
import { Button } from '@/common/components/_base/button'
import { InputField } from '@/common/components/_base/input-field'
import { SelectField } from '@/common/components/_base/select-field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/_base/dialog'
import { categories } from '@/common/mocks/categories'

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]
const ACCEPT_STRING = '.pdf,.jpg,.jpeg,.png'
const MAX_SIZE = 10 * 1024 * 1024

const receiptSchema = z.object({
  place: z.string().min(1, 'Place is required'),
  date: z.string().min(1, 'Date is required'),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((f) => ACCEPTED_TYPES.includes(f.type), 'Only PDF, JPG, or PNG files are accepted')
    .refine((f) => f.size <= MAX_SIZE, 'File must be under 10 MB'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (max 2 decimals)'),
  categoryId: z.string().min(1, 'Category is required'),
})

type ReceiptFormValues = z.infer<typeof receiptSchema>

type AddReceiptModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues = {
  place: '',
  date: dayjs().format('YYYY-MM-DD'),
  amount: '',
  categoryId: '',
}

export function AddReceiptModal({ open, onOpenChange }: AddReceiptModalProps) {
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
    onOpenChange(nextOpen)
  }

  function onSubmit(data: ReceiptFormValues) {
    console.log('Receipt submitted:', data)
    handleOpenChange(false)
  }

  function handleClose() {
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
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

          <InputField
            id="amount"
            type="text"
            inputMode="decimal"
            label="Amount"
            error={errors.amount?.message}
            {...register('amount')}
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
              <Dropzone
                value={value}
                onChange={onChange}
                error={errors.file?.message}
              />
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
  )
}

function Dropzone({
  value,
  onChange,
  error,
}: {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file && ACCEPTED_TYPES.includes(file.type)) {
        onChange(file)
      }
    },
    [onChange],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onChange(file)
    },
    [onChange],
  )

  const fileIcon = value?.type === 'application/pdf'
    ? <FileText className="h-5 w-5 text-rose-500" />
    : <Image className="h-5 w-5 text-blue-500" />

  return (
    <div>
      <p className="mb-1 text-xs text-black/50">File</p>
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          {fileIcon}
          <span className="flex-1 truncate text-sm text-foreground">{value.name}</span>
          <button
            type="button"
            onClick={() => {
              onChange(undefined)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop a file here or <span className="font-medium text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/70">PDF, JPG, or PNG &middot; max 10 MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        onChange={handleChange}
        className="hidden"
      />
      <div className="h-4">
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  )
}
