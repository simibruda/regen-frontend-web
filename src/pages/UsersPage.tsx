import { UsersTableSection } from '@/features/workspace/components/category/users-table-section'
import { Users } from 'lucide-react'

export function UsersPage() {
	return (
		<main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
			<div className="mx-auto max-w-5xl space-y-6">
				<section className="space-y-3 border-b border-border/60 pb-4">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h1 className="text-[2rem] leading-tight font-bold text-foreground">Users</h1>
							<p className="mt-1 text-base text-muted-foreground">
								Team members, roles, and their category assignments.
							</p>
						</div>
					</div>
				</section>

				<UsersTableSection />
			</div>
		</main>
	)
}
