import { cn } from '@/lib/utils'

/** Outline + label (e.g. category Back, desktop Add route / Bank statement). */
export function homeWorkspaceOutlineTriggerCn(mobile: boolean) {
  return cn(
    'shrink-0 border-border text-foreground hover:bg-secondary',
    mobile ? 'shadow-lg' : 'shadow-sm',
  )
}

/** Accent + label (desktop Add receipt). */
export function homeWorkspaceAccentTriggerCn(mobile: boolean) {
  return cn('shrink-0', mobile ? 'shadow-lg' : 'shadow-sm')
}

/** Icon-only circular triggers: Add route, Bank statement (mobile FAB only). */
export function homeWorkspaceOutlineIconTriggerCn(mobile: boolean) {
  return cn(
    'size-11 shrink-0 rounded-full border-border p-0 text-foreground hover:bg-secondary',
    mobile ? 'shadow-lg' : 'shadow-sm',
  )
}

/** Icon-only circular trigger: Add receipt (mobile FAB only). */
export function homeWorkspaceAccentIconTriggerCn(mobile: boolean) {
  return cn('size-11 shrink-0 rounded-full p-0', mobile ? 'shadow-lg' : 'shadow-sm')
}
