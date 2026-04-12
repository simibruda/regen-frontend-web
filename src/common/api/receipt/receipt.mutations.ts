import {
  receiptControllerAddManyRecipes,
  receiptControllerAddRecipe,
  receiptControllerExtractReceiptFromPdf,
} from '@/common/api/_base/receipt'
import type {
  ReceiptControllerAddManyRecipesBody,
  ReceiptControllerAddRecipeBody,
  ReceiptControllerExtractReceiptFromPdfBody,
} from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { mutationOptions } from '@tanstack/react-query'

type CreateReceiptMutationInput = {
  workspaceId: string
  request: ReceiptControllerAddRecipeBody
}

type CreateManyReceiptsMutationInput = {
  workspaceId: string
  request: ReceiptControllerAddManyRecipesBody
}

type ExtractReceiptFromPdfMutationInput = {
  workspaceId: string
  request: ReceiptControllerExtractReceiptFromPdfBody
}

export const receiptMutationOptions = {
  createReceipt: mutationOptions({
    mutationFn: async ({ workspaceId, request }: CreateReceiptMutationInput) => {
      const response = await receiptControllerAddRecipe(
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
  createManyReceipts: mutationOptions({
    mutationFn: async ({ workspaceId, request }: CreateManyReceiptsMutationInput) => {
      const response = await receiptControllerAddManyRecipes(
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
  extractReceiptFromPdf: mutationOptions({
    mutationFn: async ({ workspaceId, request }: ExtractReceiptFromPdfMutationInput) => {
      const response = await receiptControllerExtractReceiptFromPdf(
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
}
