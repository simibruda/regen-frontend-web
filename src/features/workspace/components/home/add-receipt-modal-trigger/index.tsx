import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { Button } from '@/common/components/_base/button'
import { AddReceiptModal } from '../add-receipt-modal'

type AddReceiptModalTriggerProps = {
  mobile?: boolean
}

export function AddReceiptModalTrigger({ mobile = false }: AddReceiptModalTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {mobile ? (
        <Button
          size="lg"
          variant="default"
          className="rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Receipt className="h-5 w-5" />
          Add Receipt
        </Button>
      ) : (
        <Button variant="default" onClick={() => setOpen(true)}>
          <Receipt className="h-4 w-4" />
          Add Receipt
        </Button>
      )}

      <AddReceiptModal open={open} onOpenChange={setOpen} />
    </>
  )
}
