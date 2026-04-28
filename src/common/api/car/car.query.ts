import {
  carControllerGetWorkspaceCars,
  carControllerGetWorkspaceCarsTotalKm,
} from '@/common/api/_base/car'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions, useQuery } from '@tanstack/react-query'

const CARS_PAGE_LIMIT = 20

export const carQueryOptions = {
  getWorkspaceCars: (workspaceId: string, searchValue = '') =>
    queryOptions({
      queryKey: [QUERY_KEY.CAR, 'workspace', workspaceId, searchValue],
      queryFn: async () => {
        const response = await carControllerGetWorkspaceCars(
          { 'workspace-id': workspaceId },
          {
            page: 1,
            limit: CARS_PAGE_LIMIT,
            searchValue: searchValue.trim().length > 0 ? searchValue.trim() : undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
            },
          }
        )
        return response
      },
      enabled: Boolean(workspaceId),
    }),
  getWorkspaceCarsTotalKm: (workspaceId: string, categoryId: string, startDate: string, endDate: string) =>
    queryOptions({
      queryKey: [QUERY_KEY.CAR, 'workspace-total-km', workspaceId, categoryId, startDate, endDate],
      queryFn: async () => {
        const response = await carControllerGetWorkspaceCarsTotalKm(
          {
            categoryId,
            startDate,
            endDate,
          },
          { 'workspace-id': workspaceId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
            },
          }
        )
        return response
      },
      enabled: Boolean(workspaceId) && Boolean(categoryId),
    }),
}

export const useWorkspaceCars = (workspaceId: string, searchValue = '') => {
  return useQuery(carQueryOptions.getWorkspaceCars(workspaceId, searchValue))
}

export const useWorkspaceCarsTotalKm = (
  workspaceId: string,
  categoryId: string,
  startDate: string,
  endDate: string
) => {
  return useQuery(carQueryOptions.getWorkspaceCarsTotalKm(workspaceId, categoryId, startDate, endDate))
}
