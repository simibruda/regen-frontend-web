import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from './select'

type SearchableSelectOption = {
  value: string
  label: string
}

type SearchableSelectFieldProps = {
  label: string
  error?: string
  placeholder?: string
  searchPlaceholder?: string
  noOptionsText?: string
  options: SearchableSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  name?: string
  id?: string
}

function SearchableSelectField({
  label,
  error,
  placeholder,
  searchPlaceholder = 'Search...',
  noOptionsText = 'No options found.',
  options,
  value,
  onValueChange,
  searchValue,
  onSearchValueChange,
  name,
  id,
}: SearchableSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabelFallback, setSelectedLabelFallback] = useState('')

  const hasValue = value !== undefined && value !== ''
  const selectedLabelFromOptions = useMemo(() => {
    if (!hasValue) {
      return undefined
    }
    return options.find((option) => option.value === value)?.label
  }, [hasValue, options, value])

  const selectedLabel = selectedLabelFromOptions ?? selectedLabelFallback
  const optionsWithSelected = useMemo(() => {
    const nextOptions = [...options]

    if (hasValue && selectedLabel && !nextOptions.some((option) => option.value === value)) {
      nextOptions.unshift({ value, label: selectedLabel })
    }

    return nextOptions
  }, [hasValue, options, selectedLabel, value])

  return (
    <div>
      <div className="relative">
        <Select
          name={name}
          value={value ?? null}
          onValueChange={(nextValue) => {
            const resolvedValue = nextValue ?? ''
            onValueChange?.(resolvedValue)

            if (!resolvedValue) {
              setSelectedLabelFallback('')
              return
            }

            const resolvedLabel = optionsWithSelected.find(
              (option) => option.value === resolvedValue
            )?.label
            if (resolvedLabel) {
              setSelectedLabelFallback(resolvedLabel)
            }
          }}
          onOpenChange={(nextOpen) => {
            setIsOpen(nextOpen)
            if (!nextOpen) {
              onSearchValueChange('')
            }
          }}
        >
          <SelectTrigger
            id={id}
            aria-invalid={!!error}
            className={cn(
              'peer pt-5',
              error && 'border-destructive focus-visible:border-destructive'
            )}
          >
            <SelectValue placeholder={placeholder ?? ''}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectPopup>
            <div className="px-2 pb-2">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(event) => onSearchValueChange(event.target.value)}
                onKeyDownCapture={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                onKeyUpCapture={(event) => event.stopPropagation()}
                placeholder={searchPlaceholder}
                className="h-10 w-full min-w-0 rounded-none border-0 border-b-2 border-accent bg-transparent px-2.5 py-1 text-base text-foreground caret-foreground outline-none placeholder:text-muted-foreground md:text-sm"
              />
            </div>
            <SelectList>
              {optionsWithSelected.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {optionsWithSelected.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">{noOptionsText}</div>
              )}
            </SelectList>
          </SelectPopup>
        </Select>
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-2.5 transition-all',
            hasValue || isOpen ? 'top-1 text-xs' : 'top-3 text-sm',
            error ? 'text-destructive' : 'text-black/50'
          )}
        >
          {label}
        </label>
      </div>
      <div className="h-4">{error && <p className="text-xs text-destructive">{error}</p>}</div>
    </div>
  )
}

SearchableSelectField.displayName = 'SearchableSelectField'

export { SearchableSelectField }
export type { SearchableSelectFieldProps, SearchableSelectOption }
