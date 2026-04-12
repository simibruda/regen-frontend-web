import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customInstance } from '@/lib/axios'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { UserRole } from './user.queries'

export type CreateUserRequest = {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  workspaceId: string
}

export const createUser = (data: CreateUserRequest) => {
  return customInstance({
    url: `/management/user/${data.workspaceId}`,
    method: 'POST',
    data,
  })
}

export const deleteUser = ({ id, workspaceId }: { id: string; workspaceId: string }) => {
  return customInstance({
    url: `/management/user/${workspaceId}/${id}`,
    method: 'DELETE',
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS, variables.workspaceId] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS, variables.workspaceId] })
    },
  })
}
