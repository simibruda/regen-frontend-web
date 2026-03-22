import { workspaceControllerGetWorkspaceById } from '@/common/api/_base/workspace'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

export const workspaceQueryOptions = {
  getWorkspaceById: (id: string) =>
    queryOptions({
      queryFn: async () => {
        const response = await workspaceControllerGetWorkspaceById(id)
        return response
      },
      queryKey: [QUERY_KEY.WORKSPACE, 'id', id],
    }),
}
