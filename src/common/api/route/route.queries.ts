import {
  routeControllerGetMyRoutes,
  routeControllerGetWorkspaceRoutes,
} from '@/common/api/_base/route'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

export const ROUTES_PAGE_LIMIT = 20

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
})

/** Prisma-style filter: routes with no end km recorded yet (in progress). */

export const routeQueryOptions = {
  getMyUnfinishedRoutes: (workspaceId: string, page = 1) =>
    queryOptions({
      queryKey: [QUERY_KEY.ROUTE, 'my-unfinished', workspaceId, page],
      queryFn: async () => {
        const response = await routeControllerGetMyRoutes(
          { 'workspace-id': workspaceId },
          {
            page,
            limit: ROUTES_PAGE_LIMIT,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            where: {
              endKm: { equals: null },
            },
          },
          { headers: authHeaders() }
        )
        return response
      },
      enabled: Boolean(workspaceId),
    }),

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
          { headers: authHeaders() }
        )
        return response
      },
    }),
}
