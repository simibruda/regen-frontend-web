import { apiOptions } from '@/common/api'
import type { GetMyRoutesResponse } from '@/common/api/_base/api-types.schemas'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export type EndKmFormValues = {
  endKm: string
}

type UseEndKmModalArgs = {
  workspaceId: string
  route: GetMyRoutesResponse
  onClose: () => void
}

export function useEndKmModal({ workspaceId, route, onClose }: UseEndKmModalArgs) {
  const queryClient = useQueryClient()
  const startKm = route.startKm

  const schema = useMemo(
    () =>
      z
        .object({
          endKm: z.string().min(1, 'End km is required'),
        })
        .superRefine((data, ctx) => {
          const n = Number(String(data.endKm).replace(/\s/g, ''))
          if (Number.isNaN(n)) {
            ctx.addIssue({ code: 'custom', message: 'Enter a valid number', path: ['endKm'] })
            return
          }
          if (n <= startKm) {
            ctx.addIssue({
              code: 'custom',
              message: `Must be greater than start km (${startKm})`,
              path: ['endKm'],
            })
          }
        }),
    [startKm]
  )

  const form = useForm<EndKmFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { endKm: '' },
  })

  const { reset, handleSubmit, register, formState } = form

  const { mutateAsync, isPending } = useMutation({
    ...apiOptions.mutations.updateRouteEndKm,
  })

  async function onSubmit(data: EndKmFormValues) {
    const endKm = Number(String(data.endKm).replace(/\s/g, ''))
    try {
      await mutateAsync({
        workspaceId,
        routeId: route.id,
        request: { endKm },
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ROUTE] })
      toast.success('End km saved')
      reset({ endKm: '' })
      onClose()
    } catch {
      toast.error('Could not update end km')
    }
  }

  return {
    reset,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    isSubmitting: isPending,
  }
}
