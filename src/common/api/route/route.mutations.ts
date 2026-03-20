import {
  routeControllerCreateRoute,
  routeControllerUpdateRouteEndKm,
} from '@/common/api/_base/route'
import type { CreateRouteRequest, UpdateRouteEndKmRequest } from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { mutationOptions } from '@tanstack/react-query'

type CreateRouteMutationInput = {
  workspaceId: string
  request: CreateRouteRequest
}

type UpdateRouteEndKmMutationInput = {
  workspaceId: string
  routeId: string
  request: UpdateRouteEndKmRequest
}

export const routeMutationOptions = {
  createRoute: mutationOptions({
    mutationFn: async ({ workspaceId, request }: CreateRouteMutationInput) => {
      const response = await routeControllerCreateRoute(
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
  updateRouteEndKm: mutationOptions({
    mutationFn: async ({ workspaceId, routeId, request }: UpdateRouteEndKmMutationInput) => {
      const response = await routeControllerUpdateRouteEndKm(
        routeId,
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
