import { receiptControllerAddRecipe } from '@/common/api/_base/receipt'
import type { ReceiptControllerAddRecipeBody } from '@/common/api/_base/api-types.schemas'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { mutationOptions } from '@tanstack/react-query'

type CreateReceiptMutationInput = {
  workspaceId: string
  request: ReceiptControllerAddRecipeBody
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
}
