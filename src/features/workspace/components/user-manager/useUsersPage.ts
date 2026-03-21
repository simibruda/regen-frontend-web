import { categories } from '@/common/mocks/categories'
import type { AddUserFormValues } from '@/features/workspace/components/user-manager/add-user-modal/useAddUserModal'
import type {
    UserRole,
    UserRow,
} from '@/features/workspace/components/user-manager/users-table-section'
import { useMemo, useState } from 'react'

const roleByUserId: Partial<Record<string, UserRole>> = {
  p1: 'Manager',
  p4: 'Coordinator',
  p6: 'Coordinator',
}

type CategoryOption = {
  id: string
  name: string
}

function sortUsers(a: UserRow, b: UserRow) {
  const lastNameCompare = a.lastName.localeCompare(b.lastName)
  if (lastNameCompare !== 0) return lastNameCompare
  return a.firstName.localeCompare(b.firstName)
}

function buildInitialUsers(): UserRow[] {
  const usersMap = new Map<string, UserRow>()

  categories.forEach((category) => {
    category.assignedPeople.forEach((person) => {
      const [first, ...lastParts] = person.name.split(' ')
      const last = lastParts.join(' ') || '-'

      const existingUser = usersMap.get(person.id)
      if (existingUser) {
        existingUser.assignedCategories.push(category.name)
        return
      }

      usersMap.set(person.id, {
        id: person.id,
        firstName: first,
        lastName: last,
        role: roleByUserId[person.id] ?? 'Field Worker',
        email: `${person.id}@regen.local`,
        password: 'generated-password',
        assignedCategories: [category.name],
      })
    })
  })

  return Array.from(usersMap.values()).sort(sortUsers)
}

export function useUsersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [users, setUsers] = useState<UserRow[]>(() => buildInitialUsers())

  const categoryOptions = useMemo<CategoryOption[]>(
    () => categories.map((category) => ({ id: category.id, name: category.name })),
    [],
  )

  function handleDeleteUser(userId: string) {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  function handleAddUser(data: AddUserFormValues) {
    const assignedCategories = categoryOptions
      .filter((category) => data.selectedCategoryIds.includes(category.id))
      .map((category) => category.name)

    const newUser: UserRow = {
      id: `user-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      assignedCategories,
    }

    setUsers((prev) => [...prev, newUser].sort(sortUsers))
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
  }
}
