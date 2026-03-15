import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-2',
        outline: 'border border-white bg-transparent text-white hover:bg-white/10',
        ghost: 'text-white hover:bg-white/10',
        outlet: 'bg-accent text-white hover:bg-primary-2',
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

export type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonClassNameOptions = ButtonVariants & {
  className?: string
}

export function buttonClassName(options?: ButtonClassNameOptions) {
  const { className, ...variants } = options ?? {}
  return cn(buttonVariants(variants), className)
}
