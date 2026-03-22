import { useCreateUser, useDeleteUser } from '@/common/api/user/user.mutations'
import { useUsers } from '@/common/api/user/user.query'
import { categories } from '@/common/mocks/categories'
import type { AddUserFormValues } from '@/features/workspace/components/user-manager/add-user-modal/useAddUserModal'
import type { UserRow } from '@/pages/UsersPage'
import { useMemo, useState } from 'react'

const workspaceId = 'workspace-1' // Hardcoded for now

type CategoryOption = {
	id: string
	name: string
}

export function useUsersPage() {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

	const { data: usersData, isLoading } = useUsers(workspaceId)
	const createUserMutation = useCreateUser()
	const deleteUserMutation = useDeleteUser()

	const users = useMemo<UserRow[]>(() => {
		if (!usersData) return []
		return usersData.map((user) => ({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			password: 'hashed-password',
			role: user.role === 'ADMIN' ? 'Manager' : 'Field Worker', // Map backend role to frontend role
			assignedCategories: [], // Backend doesn't support this yet
		}))
	}, [usersData])

	const categoryOptions = useMemo<CategoryOption[]>(
		() => categories.map((category) => ({ id: category.id, name: category.name })),
		[],
	)

	function handleDeleteUser(userId: string) {
		deleteUserMutation.mutate({ id: userId, workspaceId })
	}

	async function handleAddUser(data: AddUserFormValues) {
		await createUserMutation.mutateAsync({
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			role: data.role === 'Manager' ? 'ADMIN' : 'USER',
			workspaceId,
		})
		setIsAddDialogOpen(false)
	}

	function openAddDialog() {
		setIsAddDialogOpen(true)
	}

	function handleAddDialogOpenChange(open: boolean) {
		setIsAddDialogOpen(open)
	}

	return {
		users,
		categoryOptions,
		isAddDialogOpen,
		openAddDialog,
		handleAddDialogOpenChange,
		handleDeleteUser,
		handleAddUser,
		isLoading,
	}
}
