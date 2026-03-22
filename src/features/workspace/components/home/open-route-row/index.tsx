import type { GetMyRoutesResponse } from '@/common/api/_base/api-types.schemas'
import { EndKmModal } from '@/features/workspace/components/home/end-km-modal'
import dayjs from 'dayjs'
import { useState } from 'react'

function formatRouteDate(iso: string) {
  return dayjs(iso).format('MMM D, YYYY')
}

function orderedStopNames(route: GetMyRoutesResponse) {
  return [...route.routeItems].sort((a, b) => a.order - b.order).map((item) => item.name)
}

export type OpenRouteRowProps = {
  workspaceId: string
  route: GetMyRoutesResponse
}

export function OpenRouteRow({ workspaceId, route }: OpenRouteRowProps) {
  const [endKmOpen, setEndKmOpen] = useState(false)
  const stops = orderedStopNames(route)
  const stopsPreview = stops.slice(0, 3).join(' → ')
  const stopsSuffix = stops.length > 3 ? '…' : ''

  return (
    <li>
      <EndKmModal open={endKmOpen} onOpenChange={setEndKmOpen} workspaceId={workspaceId} route={route} />

      <button
        type="button"
        onClick={() => setEndKmOpen(true)}
        className="flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {route.car.name}{' '}
            <span className="text-muted-foreground">({route.car.plateNumber})</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {formatRouteDate(route.date)} · Start {route.startKm} km
            {stopsPreview.length > 0 ? (
              <>
                {' '}
                · {stopsPreview}
                {stopsSuffix}
              </>
            ) : null}
          </p>
        </div>
        <span className="shrink-0 self-start rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
          In progress
        </span>
      </button>
    </li>
  )
}
