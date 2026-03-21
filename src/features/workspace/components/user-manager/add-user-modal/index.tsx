import { Button } from '@/common/components/_base/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/common/components/_base/dialog'
import { InputField } from '@/common/components/_base/input-field'
import { SelectField } from '@/common/components/_base/select-field'
import { UserFormActions } from '@/features/workspace/components/user-manager/add-user-modal/UserFormActions'
import {
    useAddUserModal,
    type AddUserFormValues,
} from '@/features/workspace/components/user-manager/add-user-modal/useAddUserModal'
import type { UserRole } from '@/pages/UsersPage'
import { Controller } from 'react-hook-form'

type CategoryOption = {
  id: string
  name: string
}

type AddUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryOptions: CategoryOption[]
  onSubmitUser: (data: AddUserFormValues) => void
}

export function AddUserModal({
  open,
  onOpenChange,
  categoryOptions,
  onSubmitUser,
}: AddUserModalProps) {
  const {
    register,
    control,
    errors,
    isSubmitting,
    selectedCategoryIds,
    toggleCategory,
    handleOpenChange,
    handleCancel,
    handleSubmitForm,
  } = useAddUserModal({ onOpenChange, onSubmitUser })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
          <DialogTitle className="text-white">Add User</DialogTitle>
          <DialogDescription className="text-white/75">
            Create a new user and set role and assigned categories.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-2 overflow-y-auto px-4" onSubmit={handleSubmitForm}>
          <InputField
            id="user-first-name"
            label="First Name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <InputField
            id="user-last-name"
            label="Last Name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          <InputField
            id="user-email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register('email')}
          />

          <InputField
            id="user-password"
            type="password"
            label="Password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Controller
            name="role"
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectField
                id="user-role"
                label="Role"
                value={value}
                onValueChange={(nextRole) => onChange(nextRole as UserRole)}
                options={[
                  { label: 'Manager', value: 'Manager' },
                  { label: 'Coordinator', value: 'Coordinator' },
                  { label: 'Field Worker', value: 'Field Worker' },
                ]}
              />
            )}
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

          <UserFormActions isSubmitting={isSubmitting} onCancel={handleCancel} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
