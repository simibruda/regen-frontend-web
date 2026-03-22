import { carControllerCreateCar } from '@/common/api/_base/car'
import type { CreateCarRequest } from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { mutationOptions } from '@tanstack/react-query'

type CreateCarMutationInput = {
  workspaceId: string
  request: CreateCarRequest
}

export const carMutationOptions = {
  createCar: mutationOptions({
    mutationFn: async ({ workspaceId, request }: CreateCarMutationInput) => {
      const response = await carControllerCreateCar(
        request,
        { 'workspace-id': workspaceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
          },
        }
      )
      return response
    },
  }),
}
