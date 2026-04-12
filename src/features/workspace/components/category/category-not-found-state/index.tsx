import { Button } from '@/common/components/_base/button'
import { homeWorkspaceOutlineTriggerCn } from '@/features/workspace/components/home/home-workspace-action-triggers'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function CategoryNotFoundState() {
  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-lg font-semibold text-foreground">Category not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This category does not exist or is not accessible in your workspace.
          </p>
          <Link to="/" className="mt-4 inline-block">
            <Button type="button" variant="outline" className={homeWorkspaceOutlineTriggerCn(false)}>
              <ArrowLeft className="h-4 w-4 text-primary" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
