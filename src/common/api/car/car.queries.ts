import { carControllerGetWorkspaceCarsTotalKm } from '@/common/api/_base/car'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

export const carQueryOptions = {
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
    }),
}
