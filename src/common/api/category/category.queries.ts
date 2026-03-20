import {
  categoryControllerGetMyCategories,
  categoryControllerGetWorkspaceCategories,
} from '@/common/api/_base/category'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { infiniteQueryOptions } from '@tanstack/react-query'

const CATEGORIES_PAGE_LIMIT = 20

export const categoryQueryOptions = {
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
