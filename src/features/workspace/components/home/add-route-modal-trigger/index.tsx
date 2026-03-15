import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/common/components/_base/button'
import { AddRouteModal } from '../add-route-modal'

type AddRouteModalTriggerProps = {
  mobile?: boolean
}

export function AddRouteModalTrigger({ mobile = false }: AddRouteModalTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {mobile ? (
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-border text-foreground shadow-lg hover:bg-secondary"
          onClick={() => setOpen(true)}
        >
          <MapPin className="h-5 w-5 text-primary" />
          Add Route
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
          onClick={() => setOpen(true)}
        >
          <MapPin className="h-4 w-4 text-primary" />
          Add Route
        </Button>
      )}

      <AddRouteModal open={open} onOpenChange={setOpen} />
    </>
  )
}
