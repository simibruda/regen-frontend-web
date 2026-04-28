import { Button } from '@/common/components/_base/button'
import { SharedDataTable } from '@/features/workspace/components/category/shared-data-table'
import type { UserRow } from '@/pages/UsersPage'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Plus, Users } from 'lucide-react'
import { useMemo } from 'react'
import { UserActionsCell } from './UserActionsCell'

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
			{ header: 'Email', accessorKey: 'email' },
			{
				header: 'Action',
				id: 'action',
				cell: ({ row }) => (
					<UserActionsCell
						user={row.original}
						onDeleteUser={onDeleteUser}
					/>
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
				<p className="text-sm text-muted-foreground">Manage users and roles from a single table.</p>
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
