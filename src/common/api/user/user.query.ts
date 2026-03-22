import { useQuery } from '@tanstack/react-query'
import { customInstance } from '@/lib/axios'
import { QUERY_KEY } from '@/common/constants/query-key.constant'

export type UserRole = 'ADMIN' | 'USER'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  workspaceId: string
  avatar?: string | null
}

export const getUsers = (workspaceId: string) => {
  return customInstance<User[]>({
    url: `/management/user/${workspaceId}`,
    method: 'GET',
  })
}

export const useUsers = (workspaceId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.USERS, workspaceId],
    queryFn: () => getUsers(workspaceId),
    enabled: !!workspaceId,
  })
}
