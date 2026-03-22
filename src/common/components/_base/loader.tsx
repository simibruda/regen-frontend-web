import { cn } from '@/lib/utils'

type LoaderProps = {
  className?: string
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-live="polite" aria-label="Loading">
      <div className="mx-auto flex w-full max-w-xs items-center gap-2">
        <div className="h-2 flex-1 animate-pulse rounded-full bg-accent/80 [animation-delay:-200ms]" />
        <div className="h-2 flex-1 animate-pulse rounded-full bg-accent/65 [animation-delay:-100ms]" />
        <div className="h-2 flex-1 animate-pulse rounded-full bg-accent/50" />
      </div>

      <div className="mx-auto flex items-center justify-center gap-3">
        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-300ms]" />
        <span className="size-2 animate-bounce rounded-full bg-primary/80 [animation-delay:-150ms]" />
        <span className="size-2 animate-bounce rounded-full bg-primary/60" />
      </div>
    </div>
  )
}
