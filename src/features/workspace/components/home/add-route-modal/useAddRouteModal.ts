import { apiOptions } from '@/common/api'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const stopSchema = z.object({
  order: z.number().int().min(1),
  name: z.string().min(1, 'Stop name is required'),
})

const routeSchema = z.object({
  startKm: z.number().min(1, 'Start KM is required'),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  carId: z.string().min(1, 'Car is required'),
  stops: z
    .array(stopSchema)
    .min(1, 'At least one stop is required')
    .refine((stops) => new Set(stops.map((s) => s.order)).size === stops.length, {
      message: 'Stop order must be unique',
      path: ['stops'],
    }),
})

type RouteFormValues = z.infer<typeof routeSchema>

const defaultValues = {
  startKm: undefined,
  date: dayjs().format('YYYY-MM-DD'),
  categoryId: '',
  carId: '',
  stops: [{ order: 1, name: '' }],
}
const CATEGORY_SEARCH_DEBOUNCE_MS = 500

export function useAddRouteModal() {
  const [open, setOpen] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [categorySearchValue, setCategorySearchValue] = useState('')
  const [debouncedCategorySearchValue, setDebouncedCategorySearchValue] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCategorySearchValue(categorySearchValue)
    }, CATEGORY_SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [categorySearchValue])
  const { data: currentUser } = useSuspenseQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser.workspaceId
  const { data: myCategories } = useQuery({
    ...apiOptions.queries.getMyCategories(workspaceId, debouncedCategorySearchValue.trim()),
  })
  const queryClient = useQueryClient()
  const { mutateAsync: createRouteMutation } = useMutation({
    ...apiOptions.mutations.createRoute,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues,
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'stops',
  })
  const categoryOptions = useMemo(
    () =>
      (myCategories ?? []).map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [myCategories]
  )

  const syncOrders = useCallback(() => {
    const currentStops = getValues('stops')
    const orderedStops = currentStops.map((stop, index) => ({
      ...stop,
      order: index + 1,
    }))
    setValue('stops', orderedStops, { shouldValidate: true, shouldDirty: true })
  }, [getValues, setValue])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
      setDragIndex(null)
      setCategorySearchValue('')
    }
    setOpen(nextOpen)
  }

  function handleClose() {
    handleOpenChange(false)
  }

  async function onSubmit(data: RouteFormValues) {
    try {
      await createRouteMutation({
        workspaceId,
        request: {
          startKm: Number(data.startKm),
          date: dayjs(data.date).startOf('day').toISOString(),
          categoryId: data.categoryId,
          carId: data.carId,
          routeItems: data.stops.map((stop) => ({
            name: stop.name,
            order: stop.order,
          })),
        },
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ROUTE] })
      toast.success('Route created successfully')
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create route')
    }
  }

  function handleAddStop() {
    append({ order: fields.length + 1, name: '' })
  }

  function handleRemoveStop(index: number) {
    remove(index)
    requestAnimationFrame(syncOrders)
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      return
    }

    move(dragIndex, targetIndex)
    setDragIndex(null)
    requestAnimationFrame(syncOrders)
  }

  return {
    open,
    setOpen,
    setDragIndex,
    categorySearchValue,
    setCategorySearchValue,
    workspaceId,
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    filteredCategoryOptions: categoryOptions,
    fields,
    handleOpenChange,
    handleClose,
    onSubmit,
    handleAddStop,
    handleRemoveStop,
    handleDrop,
  }
}