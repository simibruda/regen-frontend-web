import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const addUserSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['Manager', 'Coordinator', 'Field Worker']),
  selectedCategoryIds: z.array(z.string()),
})

export type AddUserFormValues = z.infer<typeof addUserSchema>

type UseAddUserModalParams = {
  onOpenChange: (open: boolean) => void
  onSubmitUser: (data: AddUserFormValues) => void
}

const defaultValues: AddUserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'Field Worker',
  selectedCategoryIds: [],
}

export function useAddUserModal({ onOpenChange, onSubmitUser }: UseAddUserModalParams) {
  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues,
  })

  const selectedCategoryIds = watch('selectedCategoryIds')

  function toggleCategory(categoryId: string) {
    const current = getValues('selectedCategoryIds')
    const next = current.includes(categoryId)
      ? current.filter((item) => item !== categoryId)
      : [...current, categoryId]

    setValue('selectedCategoryIds', next, { shouldDirty: true, shouldValidate: true })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
    }
    onOpenChange(nextOpen)
  }

  function handleCancel() {
    handleOpenChange(false)
  }

  const handleSubmitForm = handleSubmit((data) => {
    onSubmitUser(data)
    handleOpenChange(false)
  })

  return {
    register,
    control,
    errors,
    isSubmitting,
    selectedCategoryIds,
    toggleCategory,
    handleOpenChange,
    handleCancel,
    handleSubmitForm,
  }
}
