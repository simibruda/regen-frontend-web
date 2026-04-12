import { Button } from '@/common/components/_base/button'
import { DialogFooter } from '@/common/components/_base/dialog'

type UserFormActionsProps = {
  isSubmitting: boolean
  onCancel: () => void
}

export function UserFormActions({ isSubmitting, onCancel }: UserFormActionsProps) {
  return (
    <DialogFooter className="border-t border-border/50 px-0">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save User'}
        </Button>
      </div>
    </DialogFooter>
  )
}
