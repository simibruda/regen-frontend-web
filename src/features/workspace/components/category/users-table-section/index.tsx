import { categories } from '@/common/mocks/categories'
import { SharedDataTable } from '@/features/workspace/components/category/shared-data-table'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { useMemo } from 'react'

type UserRole = 'Manager' | 'Coordinator' | 'Field Worker'

type UserRow = {
	id: string
	firstName: string
	lastName: string
	role: UserRole
	assignedCategories: string[]
}

const roleByUserId: Partial<Record<string, UserRole>> = {
	p1: 'Manager',
	p4: 'Coordinator',
	p6: 'Coordinator',
}

export function UsersTableSection() {
	const userRows = useMemo<UserRow[]>(() => {
		const usersMap = new Map<string, UserRow>()

		categories.forEach((category) => {
			category.assignedPeople.forEach((person) => {
				const [firstName, ...lastNameParts] = person.name.split(' ')
				const lastName = lastNameParts.join(' ') || '-'

				const existingUser = usersMap.get(person.id)
				if (existingUser) {
					existingUser.assignedCategories.push(category.name)
					return
				}

				usersMap.set(person.id, {
					id: person.id,
					firstName,
					lastName,
					role: roleByUserId[person.id] ?? 'Field Worker',
					assignedCategories: [category.name],
				})
			})
		})

		return Array.from(usersMap.values()).sort((a, b) => {
			const lastNameCompare = a.lastName.localeCompare(b.lastName)
			if (lastNameCompare !== 0) return lastNameCompare
			return a.firstName.localeCompare(b.firstName)
		})
	}, [])

	const userColumns = useMemo<ColumnDef<UserRow>[]>(
		() => [
			{ header: 'Name', accessorKey: 'firstName' },
			{ header: 'Last Name', accessorKey: 'lastName' },
			{ header: 'Role', accessorKey: 'role' },
			{
				header: 'Assigned Categories',
				accessorKey: 'assignedCategories',
				cell: ({ row }) => row.original.assignedCategories.join(', '),
			},
		],
		[],
	)

	const usersTable = useReactTable({
		data: userRows,
		columns: userColumns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2">
				<Users className="h-5 w-5 text-primary" />
				<h2 className="text-lg font-semibold text-foreground">Users</h2>
			</div>
			<p className="mt-0.5 pl-7 text-sm text-muted-foreground">
				Includes first name, last name, role, and assigned categories.
			</p>
			<div className="mt-4 overflow-x-auto">
				<SharedDataTable table={usersTable} emptyMessage="No users available." />
			</div>
		</section>
	)
}
