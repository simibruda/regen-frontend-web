import { apiOptions } from '@/common/api'
import { Button } from '@/common/components/_base/button'
import { InputField } from '@/common/components/_base/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()

  const { mutateAsync: loginMutation } = useMutation({
    ...apiOptions.mutations.login,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      await loginMutation(data)
      toast.success('Login successful!')
      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      toast.error('Failed to login')
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
            <h1 className="text-xl font-medium tracking-tight text-primary">Login</h1>
            <p className="text-xs text-black/50">Enter your email and password to continue.</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

            <p className="text-center text-sm text-black/70">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>

            <Button type="submit" variant="default" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
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
