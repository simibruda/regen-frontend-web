import { cn } from '@/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from './select'

type SelectFieldProps = {
  label: string
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  id?: string
}

function SelectField({
  label,
  error,
  placeholder,
  options,
  value,
  onValueChange,
  name,
  id,
}: SelectFieldProps) {
  const hasValue = value !== undefined && value !== ''

  return (
    <div>
      <div className="relative">
        <Select
          name={name}
          value={value ?? null}
          onValueChange={(nextValue) => onValueChange?.(nextValue ?? '')}
        >
          <SelectTrigger
            id={id}
            aria-invalid={!!error}
            className={cn(
              'peer pt-5',
              error && 'border-destructive focus-visible:border-destructive',
            )}
          >
            <SelectValue placeholder={placeholder ?? ''} />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
        </Select>
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-2.5 transition-all',
            hasValue ? 'top-1 text-xs' : 'top-3 text-sm',
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
}

SelectField.displayName = 'SelectField'

export { SelectField }
export type { SelectFieldProps }
