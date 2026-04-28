import { AddUserModal } from '@/features/workspace/components/user-manager/add-user-modal'
import { useUsersPage } from '@/features/workspace/components/user-manager/useUsersPage'
import { UsersTableSection } from '@/features/workspace/components/user-manager/users-table-section'
import { Users } from 'lucide-react'

export type UserRole = 'Manager' | 'Coordinator' | 'Field Worker'

export type UserRow = {
	id: string
	firstName: string
	lastName: string
	role: UserRole
	email: string
	password: string
	assignedCategories: string[]
}

export function UsersPage() {
	const {
		users,
		categoryOptions,
		isAddDialogOpen,
		openAddDialog,
		handleAddDialogOpenChange,
		handleDeleteUser,
		handleAddUser,
		isLoading,
	} = useUsersPage()

	if (isLoading) {
		return <div className="flex h-full items-center justify-center">Loading users...</div>
	}

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

				<UsersTableSection
					users={users}
					onDeleteUser={handleDeleteUser}
					onAddUser={openAddDialog}
				/>
			</div>

			<AddUserModal
				open={isAddDialogOpen}
				onOpenChange={handleAddDialogOpenChange}
				categoryOptions={categoryOptions}
				onSubmitUser={handleAddUser}
			/>
		</main>
	)
}
