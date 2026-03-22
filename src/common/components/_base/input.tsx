import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <InputPrimitive
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-none border-0 border-b-2 border-accent bg-transparent px-2.5 py-1 text-base text-black transition-colors outline-none placeholder:text-black/50 focus-visible:border-accent focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          type === 'number' && '[appearance:textfield]',
          className
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export { Input }
