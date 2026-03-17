import { Button } from '@/common/components/_base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/_base/dialog'
import { InputField } from '@/common/components/_base/input-field'
import { SelectField } from '@/common/components/_base/select-field'
import { categories } from '@/common/mocks/categories'
import type { UserRow } from '@/features/workspace/components/user-manager/users-table-section'
import { UsersTableSection } from '@/features/workspace/components/user-manager/users-table-section'
import { Users } from 'lucide-react'
import { useMemo, useState } from 'react'

type UserRole = 'Manager' | 'Coordinator' | 'Field Worker'

const roleByUserId: Partial<Record<string, UserRole>> = {
	p1: 'Manager',
	p4: 'Coordinator',
	p6: 'Coordinator',
}

export function UsersPage() {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [role, setRole] = useState<UserRole>('Field Worker')
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

	const [users, setUsers] = useState<UserRow[]>(() => {
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
					assignedCategories: [category.name],
				})
			})
		})

		return Array.from(usersMap.values()).sort((a, b) => {
			const lastNameCompare = a.lastName.localeCompare(b.lastName)
			if (lastNameCompare !== 0) return lastNameCompare
			return a.firstName.localeCompare(b.firstName)
		})
	})

	const categoryOptions = useMemo(
		() => categories.map((category) => ({ id: category.id, name: category.name })),
		[],
	)

	function resetAddUserForm() {
		setFirstName('')
		setLastName('')
		setRole('Field Worker')
		setSelectedCategoryIds([])
	}

	function handleDeleteUser(userId: string) {
		setUsers((prev) => prev.filter((user) => user.id !== userId))
	}

	function toggleCategory(categoryId: string) {
		setSelectedCategoryIds((prev) =>
			prev.includes(categoryId)
				? prev.filter((item) => item !== categoryId)
				: [...prev, categoryId],
		)
	}

	function handleAddUser() {
		const trimmedFirstName = firstName.trim()
		const trimmedLastName = lastName.trim()
		if (!trimmedFirstName || !trimmedLastName) return

		const assignedCategories = categoryOptions
			.filter((category) => selectedCategoryIds.includes(category.id))
			.map((category) => category.name)

		const newUser: UserRow = {
			id: `user-${Date.now()}`,
			firstName: trimmedFirstName,
			lastName: trimmedLastName,
			role,
			assignedCategories,
		}

		setUsers((prev) =>
			[...prev, newUser].sort((a, b) => {
				const lastNameCompare = a.lastName.localeCompare(b.lastName)
				if (lastNameCompare !== 0) return lastNameCompare
				return a.firstName.localeCompare(b.firstName)
			}),
		)

		resetAddUserForm()
		setIsAddDialogOpen(false)
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
					onAddUser={() => setIsAddDialogOpen(true)}
				/>
			</div>

			<Dialog
				open={isAddDialogOpen}
				onOpenChange={(open) => {
					setIsAddDialogOpen(open)
					if (!open) resetAddUserForm()
				}}
			>
				<DialogContent>
					<DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
						<DialogTitle className="text-white">Add User</DialogTitle>
						<DialogDescription className="text-white/75">
							Create a new user and set role and assigned categories.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2 overflow-y-auto px-4">
						<InputField
							id="user-first-name"
							label="First Name"
							value={firstName}
							onChange={(event) => setFirstName(event.target.value)}
						/>
						<InputField
							id="user-last-name"
							label="Last Name"
							value={lastName}
							onChange={(event) => setLastName(event.target.value)}
						/>
						<SelectField
							id="user-role"
							label="Role"
							value={role}
							onValueChange={(nextRole) => setRole(nextRole as UserRole)}
							options={[
								{ label: 'Manager', value: 'Manager' },
								{ label: 'Coordinator', value: 'Coordinator' },
								{ label: 'Field Worker', value: 'Field Worker' },
							]}
						/>

						<div className="space-y-2">
							<p className="text-sm font-semibold text-primary">Assigned Categories</p>
							<div className="flex flex-wrap gap-2">
								{categoryOptions.map((category) => {
									const isSelected = selectedCategoryIds.includes(category.id)
									return (
										<Button
											key={category.id}
											type="button"
											variant="outline"
											className={
												isSelected
													? 'border-accent bg-accent text-accent-foreground hover:bg-accent-2'
													: 'border-border text-foreground hover:bg-secondary'
											}
											onClick={() => toggleCategory(category.id)}
										>
											{category.name}
										</Button>
									)
								})}
							</div>
						</div>
					</div>

					<DialogFooter className="border-t border-border/50">
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => {
									resetAddUserForm()
									setIsAddDialogOpen(false)
								}}
							>
								Cancel
							</Button>
							<Button
								type="button"
								className="flex-1"
								onClick={handleAddUser}
								disabled={!firstName.trim() || !lastName.trim()}
							>
								Save User
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	)
}
