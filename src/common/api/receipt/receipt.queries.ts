import {
  receiptControllerGetReceiptBlob,
  receiptControllerGetWorkspaceReceipts,
} from '@/common/api/_base/receipt'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { queryOptions } from '@tanstack/react-query'

export const RECEIPTS_PAGE_LIMIT = 20

export const receiptQueryOptions = {
  getWorkspaceReceipts: (
    workspaceId: string,
    startDate: string,
    endDate: string,
    page = 1,
    categoryId?: string
  ) =>
    queryOptions({
      queryKey: [QUERY_KEY.RECEIPT, 'workspace', workspaceId, categoryId ?? 'all', startDate, endDate, page],
      queryFn: async () => {
        const response = await receiptControllerGetWorkspaceReceipts(
          { 'workspace-id': workspaceId },
          {
            page,
            limit: RECEIPTS_PAGE_LIMIT,
            where: {
              ...(categoryId ? { categoryId: { equals: categoryId } } : {}),
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
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
  getReceiptBlob: (workspaceId: string, receiptId: string) =>
    queryOptions({
      queryKey: [QUERY_KEY.RECEIPT, 'blob', workspaceId, receiptId],
      queryFn: async () => {
        const response = await receiptControllerGetReceiptBlob(
          receiptId,
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
