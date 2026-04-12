import { apiOptions } from '@/common/api'
import type { ReceiptWorkspaceResponse } from '@/common/api/_base/api-types.schemas'
import { Button } from '@/common/components/_base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/_base/dialog'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { toast } from 'sonner'

type ReceiptDeleteButtonProps = {
  workspaceId: string
  receipt: Pick<ReceiptWorkspaceResponse, 'id' | 'place'>
  className?: string
  size?: ComponentProps<typeof Button>['size']
  variant?: ComponentProps<typeof Button>['variant']
}

export function ReceiptDeleteButton({
  workspaceId,
  receipt,
  className = 'border-destructive/40 text-destructive hover:bg-destructive/10',
  size = 'sm',
  variant = 'outline',
}: ReceiptDeleteButtonProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { mutateAsync: deleteReceipt, isPending } = useMutation({
    ...apiOptions.mutations.deleteReceipt,
  })

  async function handleConfirmDelete() {
    if (!workspaceId) return

    try {
      await deleteReceipt({ workspaceId, receiptId: receipt.id })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.RECEIPT] })
      toast.success('Receipt deleted')
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete receipt')
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        disabled={!workspaceId}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="flex items-center gap-2 text-white">Delete receipt</DialogTitle>
            <DialogDescription className="text-white/75">
              This permanently removes the receipt file and its record. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <p className="px-4 text-sm text-foreground">
            Delete receipt for <span className="font-medium">{receipt.place}</span>?
          </p>

          <DialogFooter className="border-t border-border/50 px-4 pb-6 md:pb-4">
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary"
                disabled={isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isPending}
                onClick={() => void handleConfirmDelete()}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
