import { Select as SelectPrimitive } from '@base-ui/react/select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function Select({ ...props }: SelectPrimitive.Root.Props<string>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-none border-0 border-b-2 border-accent bg-transparent px-2.5 py-1 text-base text-black outline-none transition-colors focus-visible:border-accent focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4 text-black/40" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectPortal({ ...props }: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />
}

function SelectPopup({ className, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPortal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        className="z-100"
        sideOffset={6}
        align="start"
      >
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            'min-w-(--anchor-width) max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg transition duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPortal>
  )
}

function SelectList({ className, ...props }: SelectPrimitive.List.Props) {
  return (
    <SelectPrimitive.List
      data-slot="select-list"
      className={cn('flex flex-col gap-0.5', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors select-none data-highlighted:bg-secondary data-highlighted:text-foreground',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="flex h-4 w-4 shrink-0 items-center justify-center">
        <Check className="h-3.5 w-3.5 text-primary" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPopup,
  SelectList,
  SelectItem,
}
