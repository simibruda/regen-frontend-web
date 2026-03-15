import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

type InputFieldProps = React.ComponentProps<'input'> & {
  label: string
  error?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            placeholder=" "
            aria-invalid={!!error}
            className={cn(
              'peer pt-5',
              error && 'border-destructive focus-visible:border-destructive',
              className,
            )}
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute left-2.5 top-1 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs',
              error ? 'text-destructive' : 'text-black/50',
            )}
          >
            {label}
          </label>
        </div>
        <div className="h-4">
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>
    )
  },
)

InputField.displayName = 'InputField'

export { InputField }
export type { InputFieldProps }
