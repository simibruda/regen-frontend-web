import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/common/components/_base/button'
import { InputField } from '@/common/components/_base/input-field'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  function onSubmit(data: RegisterFormValues) {
    console.log('Register submitted:', data)
    toast.success('Account created successfully!')
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
            <h1 className="text-xl font-medium tracking-tight text-primary">
              Register
            </h1>
            <p className="text-xs text-black/50">
              Create your account to get started.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

            <p className="text-center text-sm text-black/70">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>

            <Button
              type="submit"
              variant="default"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
