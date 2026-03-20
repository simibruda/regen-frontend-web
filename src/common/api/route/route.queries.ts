import { routeControllerGetWorkspaceRoutes } from '@/common/api/_base/route'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

export const ROUTES_PAGE_LIMIT = 20

export const routeQueryOptions = {
  getWorkspaceRoutes: (
    workspaceId: string,
    startDate: string,
    endDate: string,
    page = 1,
    userIds?: string[]
  ) =>
    queryOptions({
      queryKey: [QUERY_KEY.ROUTE, 'workspace', workspaceId, userIds?.join(',') ?? 'all', startDate, endDate, page],
      queryFn: async () => {
        const response = await routeControllerGetWorkspaceRoutes(
          { 'workspace-id': workspaceId },
          {
            page,
            limit: ROUTES_PAGE_LIMIT,
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
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
