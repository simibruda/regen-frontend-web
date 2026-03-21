import { Button } from '@/common/components/_base/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/components/_base/dialog'
import type { UserRow } from '@/pages/UsersPage'
import { Eye, Trash2 } from 'lucide-react'

type UserActionsCellProps = {
  user: UserRow
  onDeleteUser: (userId: string) => void
}

export function UserActionsCell({ user, onDeleteUser }: UserActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-border text-foreground hover:bg-secondary"
              aria-label={`View ${user.firstName} ${user.lastName}`}
            />
          }
        >
          <Eye className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="text-white">
              {user.firstName} {user.lastName}
            </DialogTitle>
            <DialogDescription className="text-white/75">
              User details and assigned categories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-4 pb-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium text-foreground">{user.role}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="mt-1 text-sm text-foreground">{user.email}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned categories</p>
              {user.assignedCategories.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No categories assigned.</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {user.assignedCategories.map((category) => (
                    <li key={`${user.id}-${category}`} className="text-sm text-foreground">
                      - {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="icon"
        className="h-8 w-8 bg-destructive text-white hover:bg-destructive/90"
        aria-label={`Delete ${user.firstName} ${user.lastName}`}
        onClick={() => onDeleteUser(user.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
