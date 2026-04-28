import { userControllerGetWorkspaceUsers } from '@/common/api/_base/user'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

const USERS_PAGE_LIMIT = 20

export type UserRole = 'ADMIN' | 'USER'

export const userQueryOptions = {
  getWorkspaceUsers: (workspaceId: string, search?: string) =>
    queryOptions({
      queryKey: [QUERY_KEY.USER, 'workspace-users', workspaceId],
      queryFn: async () => {
        const response = await userControllerGetWorkspaceUsers(
          {
            'workspace-id': workspaceId,
          },
          {
            page: 1,
            limit: USERS_PAGE_LIMIT,
            searchValue: search?.length && search.length > 0 ? search : undefined,
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
