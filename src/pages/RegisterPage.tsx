import { apiOptions } from '@/common/api'
import { Button } from '@/common/components/_base/button'
import { Dropzone } from '@/common/components/_base/dropzone'
import { InputField } from '@/common/components/_base/input-field'
import { LOCAL_STORAGE_KEYS } from '@/common/constants/local-storage.constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const createRegisterSchema = (hasWorkspaceId: boolean) =>
  z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().min(1, 'Email is required').email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
      workspaceName: z.string().optional(),
      avatar: z.instanceof(File).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
    .superRefine((data, ctx) => {
      if (!hasWorkspaceId && (!data.workspaceName || data.workspaceName.trim().length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Workspace name is required',
          path: ['workspaceName'],
        })
      }
    })

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>

export function RegisterPage() {
  const { workspaceId } = useSearch({ from: '/register' })
  const navigate = useNavigate()

  const { mutateAsync: registerMutation } = useMutation({
    ...apiOptions.mutations.register,
  })

  const registerSchema = useMemo(() => createRegisterSchema(Boolean(workspaceId)), [workspaceId])

  const { data: workspace } = useQuery({
    ...apiOptions.queries.getWorkspaceById(workspaceId ?? ''),
    enabled: Boolean(workspaceId),
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting ,isValid},
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  async function onSubmit(data: RegisterFormValues) {
    try {
      const response = await registerMutation({
        ...data,
        workspaceId,
        workspaceName: workspaceId ? undefined : data.workspaceName,
        avatar: data.avatar,
      })

      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.jwt)

      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      toast.error('Failed to register')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary-2/70 via-primary to-primary" />
      <div className="pointer-events-none absolute -left-24 top-12 size-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-accent/20 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/25 bg-card/95 shadow-2xl backdrop-blur-sm">
        <div className="h-2 w-full bg-accent" />

        <div className="p-6 sm:p-8">
          <header className="mb-6 space-y-2 text-center">
            <p className="text-4xl uppercase tracking-tight text-accent">
              <span className="font-bold">Re</span>
              <span className="font-normal">Manage</span>
            </p>
            <h1 className="text-xl font-medium tracking-tight text-primary">Register</h1>
            <p className="text-xs text-black/50">Create your account to get started.</p>
            {workspace?.name && (
              <p className="rounded-md bg-accent/10 px-3 py-2 text-sm text-primary">
                Hello! You will be joining the workspace {workspace.name}.
              </p>
            )}
          </header>

          <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
            {!workspaceId && (
              <InputField
                id="workspaceName"
                type="text"
                label="Workspace Name"
                error={errors.workspaceName?.message}
                {...register('workspaceName')}
              />
            )}

            <InputField
              id="firstName"
              type="text"
              label="First Name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />

            <InputField
              id="lastName"
              type="text"
              label="Last Name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />

            <InputField
              id="email"
              type="email"
              label="Email"
              error={errors.email?.message}
              {...register('email')}
            />

            <InputField
              id="password"
              type="password"
              label="Password"
              error={errors.password?.message}
              {...register('password')}
            />

            <InputField
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <Dropzone
                  label="Avatar"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.avatar?.message}
                  acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                  accept=".jpg,.jpeg,.png,.webp"
                  description="JPG, PNG, or WEBP"
                />
              )}
            />

            <p className="text-center text-sm text-black/70">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>

            <Button type="submit" variant="default" className="mt-2 w-full" disabled={isSubmitting || !isValid}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-black/40">
            Powered by{' '}
            <a
              href="https://fundatiaregen.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Fundația REGEN
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
