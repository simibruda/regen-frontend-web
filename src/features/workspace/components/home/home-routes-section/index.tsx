import { apiOptions } from '@/common/api'
import type { GetMyRoutesResponse } from '@/common/api/_base/api-types.schemas'
import { Loader } from '@/common/components/_base/loader'
import { AddReceiptModal } from '@/features/workspace/components/home/add-receipt-modal'
import { AddRouteModal } from '@/features/workspace/components/home/add-route-modal'
import { OpenRouteRow } from '@/features/workspace/components/home/open-route-row'
import { useQuery } from '@tanstack/react-query'
import { Route } from 'lucide-react'

export type HomeRoutesSectionProps = {
  workspaceId: string
}

export function HomeRoutesSection({ workspaceId }: HomeRoutesSectionProps) {
  const { data: myUnfinished = [], isLoading: isMyUnfinishedLoading } = useQuery({
    ...apiOptions.queries.getMyUnfinishedRoutes(workspaceId, 1),
    enabled: Boolean(workspaceId),
  })

  const isLoadingBlock = isMyUnfinishedLoading

  if (!workspaceId) {
    return null
  }

  if (isLoadingBlock) {
    return (
      <div className="mb-10 flex min-h-[120px] items-center justify-center rounded-2xl border border-border bg-card py-12">
        <Loader />
      </div>
    )
  }

  return (
    <div className="mb-10">
      <section>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-2.5">
              <Route className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Open routes</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your routes still in progress (no end km).
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <AddRouteModal />
            <AddReceiptModal />
          </div>
        </div>
        {myUnfinished.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
            No open routes right now.
          </p>
        ) : (
          <ul className="space-y-2">
            {myUnfinished.map((route: GetMyRoutesResponse) => (
              <OpenRouteRow key={route.id} workspaceId={workspaceId} route={route} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
