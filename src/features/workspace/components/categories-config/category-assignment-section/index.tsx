import { apiOptions } from '@/common/api'
import type {
  GetCategoriesResponse,
  UserWorkspaceResponse,
} from '@/common/api/_base/api-types.schemas'
import { Button } from '@/common/components/_base/button'
import { Input } from '@/common/components/_base/input'
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/common/components/_base/select'
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type CategoryAssignmentSectionProps = {
  selectedCategory: GetCategoriesResponse
  workspaceId: string
  pendingAssignedUserIds?: string[]
  onAssignedUserIdsChange: (userIds: string[]) => void
}

export function CategoryAssignmentSection({
  selectedCategory,
  workspaceId,
  pendingAssignedUserIds,
  onAssignedUserIdsChange,
}: CategoryAssignmentSectionProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const queryClient = useQueryClient()
  const { data: usersData } = useQuery({
    ...apiOptions.queries.getWorkspaceUsers(workspaceId, debouncedSearchValue.trim()),
    enabled: Boolean(workspaceId),
  })
  const { mutateAsync: assignUsersToCategoryMutation, isPending: isSavingAssignments } =
    useMutation({
      ...apiOptions.mutations.assignUsersToCategory,
    })

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 250)

    return () => window.clearTimeout(debounceTimer)
  }, [searchValue])

  const users = useMemo(() => usersData ?? [], [usersData])
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const categoryUsersById = useMemo(
    () => new Map(selectedCategory.assignedUsers.map((user) => [user.id, user])),
    [selectedCategory.assignedUsers]
  )
  const assignedUserIds = useMemo(
    () => pendingAssignedUserIds ?? selectedCategory.assignedUsers.map((user) => user.id),
    [pendingAssignedUserIds, selectedCategory.assignedUsers]
  )
  const availableUsers = useMemo(() => {
    const normalizedSearch = debouncedSearchValue.trim().toLowerCase()
    const unassignedUsers = users.filter((user) => !assignedUserIds.includes(user.id))

    if (!normalizedSearch) {
      return unassignedUsers
    }

    return unassignedUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      return (
        fullName.includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [assignedUserIds, debouncedSearchValue, users])
  const assignedUsers = useMemo(
    () => getAssignedUsers(assignedUserIds, selectedCategory, usersById),
    [assignedUserIds, selectedCategory, usersById]
  )
  const selectedUserLabel = useMemo(() => {
    if (!selectedUserId) {
      return undefined
    }

    const selectedUser = usersById.get(selectedUserId) ?? categoryUsersById.get(selectedUserId)
    if (!selectedUser) {
      return undefined
    }

    return `${selectedUser.firstName} ${selectedUser.lastName}`
  }, [categoryUsersById, selectedUserId, usersById])

  const persistAssignments = async (nextAssignedUserIds: string[]) => {
    await assignUsersToCategoryMutation({
      workspaceId,
      categoryId: selectedCategory.id,
      request: { userIds: nextAssignedUserIds },
    })
    onAssignedUserIdsChange(nextAssignedUserIds)
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] })
  }

  const handleAssignUser = async () => {
    if (!selectedUserId || assignedUserIds.includes(selectedUserId)) {
      return
    }

    const nextAssignedUserIds = [...assignedUserIds, selectedUserId]
    try {
      await persistAssignments(nextAssignedUserIds)
      setSelectedUserId('')
      setSearchValue('')
      setDebouncedSearchValue('')
      toast.success('User assigned successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to assign user')
    }
  }

  const handleRemoveAssignedUser = async (userId: string) => {
    const nextAssignedUserIds = assignedUserIds.filter((id) => id !== userId)
    try {
      await persistAssignments(nextAssignedUserIds)
      toast.success('User removed successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove user')
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Assign users to {selectedCategory.name}
        </h2>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex-1">
          <Select
            value={selectedUserId || null}
            onValueChange={(value) => setSelectedUserId(value ?? '')}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setSearchValue('')
                setDebouncedSearchValue('')
              }
            }}
          >
            <SelectTrigger className="rounded-lg border border-border bg-background px-3 py-2 text-foreground">
              <SelectValue placeholder="Select a user">{selectedUserLabel}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              <div className="px-2 pb-2">
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search users..."
                />
              </div>
              <SelectList>
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No matching users found.
                  </div>
                )}
              </SelectList>
            </SelectPopup>
          </Select>
        </div>
        <Button
          onClick={handleAssignUser}
          disabled={!selectedUserId || isSavingAssignments}
          className="md:min-w-36"
        >
          <Plus className="h-4 w-4" />
          {isSavingAssignments ? 'Saving...' : 'Assign'}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Assigned users</p>
        <div className="flex flex-wrap gap-2">
          {assignedUsers.length > 0 ? (
            assignedUsers.map((user) => (
              <span
                key={user.id}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
              >
                {user.firstName} {user.lastName}
                <button
                  type="button"
                  className="cursor-pointer rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => handleRemoveAssignedUser(user.id)}
                  disabled={isSavingAssignments}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No users assigned yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

type BasicAssignedUser = Pick<UserWorkspaceResponse, 'id' | 'firstName' | 'lastName'>

function getAssignedUsers(
  assignedUserIds: string[],
  selectedCategory: GetCategoriesResponse,
  usersById: Map<string, UserWorkspaceResponse>
): BasicAssignedUser[] {
  const categoryUsersById = new Map(selectedCategory.assignedUsers.map((user) => [user.id, user]))

  return assignedUserIds
    .map((id) => usersById.get(id) ?? categoryUsersById.get(id) ?? null)
    .filter((user): user is BasicAssignedUser => Boolean(user))
}
