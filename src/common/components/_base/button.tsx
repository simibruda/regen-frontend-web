import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white hover:bg-primary-2',
        outline: 'border border-border bg-background text-foreground hover:bg-secondary',
        ghost: 'text-white hover:bg-white/10',
        outlet: 'bg-accent text-white hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-4',
        lg: 'h-11 px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)           

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

type ButtonClassNameOptions = VariantProps<typeof buttonVariants> & {
  className?: string
}

function buttonClassName(options?: ButtonClassNameOptions) {
  const { className, ...variants } = options ?? {}
  return cn(buttonVariants(variants), className)
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonClassName, buttonVariants }
