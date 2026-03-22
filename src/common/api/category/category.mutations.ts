import {
  categoryControllerAssignUsersToCategory,
  categoryControllerCreateCategory,
} from '@/common/api/_base/category'
import type {
  AssignUsersToCategoryRequest,
  CreateCategoryRequest,
} from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { mutationOptions } from '@tanstack/react-query'

type CreateCategoryMutationInput = {
  workspaceId: string
  request: CreateCategoryRequest
}

type AssignUsersToCategoryMutationInput = {
  workspaceId: string
  categoryId: string
  request: AssignUsersToCategoryRequest
}

export const categoryMutationOptions = {
  assignUsersToCategory: mutationOptions({
    mutationFn: async ({ workspaceId, categoryId, request }: AssignUsersToCategoryMutationInput) => {
      const response = await categoryControllerAssignUsersToCategory(
        categoryId,
        request,
        {
          'workspace-id': workspaceId,
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
  createCategory: mutationOptions({
    mutationFn: async ({ workspaceId, request }: CreateCategoryMutationInput) => {
      const response = await categoryControllerCreateCategory(
        request,
        {
          'workspace-id': workspaceId,
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
