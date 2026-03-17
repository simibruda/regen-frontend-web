import { Button } from '@/common/components/_base/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/components/_base/dialog'
import { SharedDataTable } from '@/features/workspace/components/category/shared-data-table'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Eye, Plus, Trash2, Users } from 'lucide-react'
import { useMemo } from 'react'

type UserRole = 'Manager' | 'Coordinator' | 'Field Worker'

export type UserRow = {
	id: string
	firstName: string
	lastName: string
	role: UserRole
	assignedCategories: string[]
}

type UsersTableSectionProps = {
	users: UserRow[]
	onDeleteUser: (userId: string) => void
	onAddUser: () => void
}

export function UsersTableSection({ users, onDeleteUser, onAddUser }: UsersTableSectionProps) {
	const userColumns = useMemo<ColumnDef<UserRow>[]>(
		() => [
			{ header: 'Name', accessorKey: 'firstName' },
			{ header: 'Last Name', accessorKey: 'lastName' },
			{ header: 'Role', accessorKey: 'role' },
			{
				header: 'Details',
				id: 'details',
				cell: ({ row }) => (
					<Dialog>
						<DialogTrigger
							render={
								<Button
									size="sm"
									variant="outline"
									className="border-border text-foreground hover:bg-secondary"
								/>
							}
						>
							<Eye className="h-4 w-4" />
							See more
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
								<DialogTitle className="text-white">
									{row.original.firstName} {row.original.lastName}
								</DialogTitle>
								<DialogDescription className="text-white/75">
									User details and assigned categories.
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-3 px-4 pb-4">
								<div className="rounded-lg border border-border bg-card p-3">
									<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										Role
									</p>
									<p className="mt-1 text-sm font-medium text-foreground">{row.original.role}</p>
								</div>

								<div className="rounded-lg border border-border bg-card p-3">
									<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										Assigned categories
									</p>
									{row.original.assignedCategories.length === 0 ? (
										<p className="mt-1 text-sm text-muted-foreground">No categories assigned.</p>
									) : (
										<ul className="mt-2 space-y-1">
											{row.original.assignedCategories.map((category) => (
												<li key={`${row.original.id}-${category}`} className="text-sm text-foreground">
													- {category}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						</DialogContent>
					</Dialog>
				),
			},
			{
				header: '',
				id: 'delete',
				cell: ({ row }) => (
					<Button
						size="sm"
						className="bg-destructive text-white hover:bg-destructive/90"
						onClick={() => onDeleteUser(row.original.id)}
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</Button>
				),
			},
		],
		[onDeleteUser],
	)

	const usersTable = useReactTable({
		data: users,
		columns: userColumns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2">
				<Users className="h-5 w-5 text-primary" />
				<h2 className="text-lg font-semibold text-foreground">Users</h2>
			</div>
			<div className="mt-0.5 flex flex-col gap-2 pl-7 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm text-muted-foreground">
					Use see more to view user details and assigned categories.
				</p>
				<Button size="sm" className="w-fit" onClick={onAddUser}>
					<Plus className="h-4 w-4" />
					Add User
				</Button>
			</div>
			<div className="mt-4 overflow-x-auto">
				<SharedDataTable table={usersTable} emptyMessage="No users available." />
			</div>
		</section>
	)
}
