import type { GetMyRoutesResponse } from '@/common/api/_base/api-types.schemas'
import { Button } from '@/common/components/_base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/_base/dialog'
import { InputField } from '@/common/components/_base/input-field'
import { Gauge } from 'lucide-react'
import { useEndKmModal } from './useEndKmModal'

function formatKmWithSpaces(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

type EndKmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  route: GetMyRoutesResponse
}

export function EndKmModal({ open, onOpenChange, workspaceId, route }: EndKmModalProps) {
  const { reset, register, handleSubmit, errors, isSubmitting } = useEndKmModal({
    workspaceId,
    route,
    onClose: () => onOpenChange(false),
  })

  function handleDialogOpenChange(next: boolean) {
    if (!next) {
      reset({ endKm: '' })
    }
    onOpenChange(next)
  }

  const handleClose = () => handleDialogOpenChange(false)

  const titleCar = route.car.name
  const plate = route.car.plateNumber

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
          <DialogTitle className="flex items-center gap-2 text-white">
            <Gauge className="h-5 w-5" />
            Add end km
          </DialogTitle>
          <DialogDescription className="text-white/75">
            {titleCar} ({plate}) · start {route.startKm} km
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4 overflow-y-auto px-4" onSubmit={handleSubmit}>
          <InputField
            id="endKm"
            label="End km"
            inputMode="numeric"
            autoComplete="off"
            error={errors.endKm?.message}
            {...register('endKm', {
              onChange: (e) => {
                const raw = e.target.value.replace(/\D/g, '')
                e.target.value = raw ? formatKmWithSpaces(raw) : ''
              },
            })}
          />

          <DialogFooter className="border-t border-border/50 px-0">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border font-semibold text-muted-foreground hover:bg-secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1 bg-accent font-semibold text-accent-foreground shadow-cta hover:bg-accent-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : 'Save Route'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
