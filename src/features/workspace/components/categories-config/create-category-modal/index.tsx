import { apiOptions } from '@/common/api'
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
import { QUERY_KEY } from '@/common/constants/query-key.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FolderPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
})

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

type CreateCategoryModalProps = {
  workspaceId: string
}

const defaultValues: CreateCategoryFormValues = {
  name: '',
}

export function CreateCategoryModal({ workspaceId }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync: createCategoryMutation } = useMutation({
    ...apiOptions.mutations.createCategory,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues,
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
    }
    setOpen(nextOpen)
  }

  async function onSubmit(data: CreateCategoryFormValues) {
    try {
      await createCategoryMutation({
        workspaceId,
        request: { name: data.name },
      })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORY] })
      toast.success('Category created successfully')
      handleOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to create category')
    }
  }

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)} disabled={!workspaceId}>
        <FolderPlus className="h-4 w-4" />
        Add Category
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
            <DialogTitle className="flex items-center gap-2 text-white">
              <FolderPlus className="h-5 w-5" />
              Create Category
            </DialogTitle>
            <DialogDescription className="text-white/75">
              Enter a name to create a new category.
            </DialogDescription>
          </DialogHeader>

          <form
            className="flex flex-col gap-2 overflow-y-auto px-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputField
              id="name"
              label="Category Name"
              error={errors.name?.message}
              {...register('name')}
            />

            <DialogFooter className="border-t border-border/50 px-0">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
