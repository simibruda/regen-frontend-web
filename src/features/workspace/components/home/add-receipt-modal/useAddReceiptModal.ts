import { apiOptions } from '@/common/api'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 10 * 1024 * 1024
const MAX_DECIMALS = 2
const CATEGORY_SEARCH_DEBOUNCE_MS = 500

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

const defaultValues = {
  place: '',
  date: dayjs().format('YYYY-MM-DD'),
  amount: undefined,
  categoryId: '',
}

export function useAddReceiptModal() {
  const [open, setOpen] = useState(false)
  const [categorySearchValue, setCategorySearchValue] = useState('')
  const [debouncedCategorySearchValue, setDebouncedCategorySearchValue] = useState('')

  const { data: currentUser } = useSuspenseQuery({
    ...apiOptions.queries.getCurrentUser,
  })

  const workspaceId = currentUser.workspaceId

  const { data: myCategories } = useQuery({
    ...apiOptions.queries.getMyCategories(workspaceId, debouncedCategorySearchValue.trim()),
  })
  const queryClient = useQueryClient()

  const { mutateAsync: createReceiptMutation } = useMutation({
    ...apiOptions.mutations.createReceipt,
  })

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
  const categoryOptions = useMemo(
    () =>
      (myCategories ?? []).map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [myCategories]
  )

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
      setCategorySearchValue('')
    }
    setOpen(nextOpen)
  }

  async function onSubmit(data: ReceiptFormValues) {
    try {
      await createReceiptMutation({
        workspaceId,
        request: {
          place: data.place,
          date: dayjs(data.date).startOf('day').toISOString(),
          amount: data.amount,
          categoryId: data.categoryId,
          file: data.file,
        },
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECEIPT] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] })
      toast.success('Receipt created successfully')
      handleOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to create receipt')
    }
  }

  function handleClose() {
    handleOpenChange(false)
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCategorySearchValue(categorySearchValue)
    }, CATEGORY_SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [categorySearchValue])

  return {
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
    filteredCategoryOptions: categoryOptions,
    handleOpenChange,
    onSubmit,
    handleClose,
  }
}
