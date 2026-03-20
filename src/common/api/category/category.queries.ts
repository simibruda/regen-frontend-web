import {
  categoryControllerGetCategoryById,
  categoryControllerGetCategoryStats,
  categoryControllerGetMyCategories,
  categoryControllerGetWorkspaceCategories,
} from '@/common/api/_base/category'
import type { GetCategoryStatsRequest } from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

const CATEGORIES_PAGE_LIMIT = 20

export const categoryQueryOptions = {
  getCategoryById: (workspaceId: string, categoryId: string) =>
    queryOptions({
      queryKey: [QUERY_KEY.CATEGORY, 'id', workspaceId, categoryId],
      queryFn: async () => {
        const response = await categoryControllerGetCategoryById(
          categoryId,
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
  getCategoryStats: (
    workspaceId: string,
    categoryId: string,
    request: GetCategoryStatsRequest
  ) =>
    queryOptions({
      queryKey: [QUERY_KEY.CATEGORY, 'stats', workspaceId, categoryId, request.startDate, request.endDate],
      queryFn: async () => {
        const response = await categoryControllerGetCategoryStats(
          categoryId,
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
  getMyInfiniteCategories: (workspaceId: string) =>
    infiniteQueryOptions({
      queryKey: [QUERY_KEY.CATEGORY, 'my-categories', workspaceId],
      queryFn: async ({ pageParam }) => {
        const response = await categoryControllerGetMyCategories(
          {
            'workspace-id': workspaceId,
          },
          {
            page: pageParam,
            limit: CATEGORIES_PAGE_LIMIT,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
            },
          }
        )
        return response
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.length < CATEGORIES_PAGE_LIMIT) {
          return undefined
        }

        return lastPageParam + 1
      },
    }),
  getWorkspaceInfiniteCategories: (workspaceId: string) =>
    infiniteQueryOptions({
      queryKey: [QUERY_KEY.CATEGORY, 'workspace-categories', workspaceId],
      queryFn: async ({ pageParam }) => {
        const response = await categoryControllerGetWorkspaceCategories(
          {
            'workspace-id': workspaceId,
          },
          {
            page: pageParam,
            limit: CATEGORIES_PAGE_LIMIT,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)}`,
            },
          }
        )
        return response
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.length < CATEGORIES_PAGE_LIMIT) {
          return undefined
        }

        return lastPageParam + 1
      },
    }),
}
