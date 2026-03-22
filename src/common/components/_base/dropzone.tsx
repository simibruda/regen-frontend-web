import { FileText, Image, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

const DEFAULT_ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const DEFAULT_ACCEPT_STRING = '.pdf,.jpg,.jpeg,.png'
const DEFAULT_DESCRIPTION = 'PDF, JPG, or PNG \u00b7 max 10 MB'

type DropzoneProps = {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
  acceptedTypes?: string[]
  accept?: string
  description?: string
  label?: string
}

export function Dropzone({
  value,
  onChange,
  error,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  accept = DEFAULT_ACCEPT_STRING,
  description = DEFAULT_DESCRIPTION,
  label = 'File',
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file && acceptedTypes.includes(file.type)) {
        onChange(file)
      }
    },
    [onChange, acceptedTypes],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onChange(file)
    },
    [onChange],
  )

  const fileIcon =
    value?.type === 'application/pdf' ? (
      <FileText className="h-5 w-5 text-rose-500" />
    ) : (
      <Image className="h-5 w-5 text-blue-500" />
    )

  return (
    <div>
      <p className="mb-1 text-xs text-black/50">{label}</p>
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          {fileIcon}
          <span className="flex-1 truncate text-sm text-foreground">{value.name}</span>
          <button
            type="button"
            onClick={() => {
              onChange(undefined)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop a file here or <span className="font-medium text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/70">{description}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <div className="h-4">{error && <p className="text-xs text-destructive">{error}</p>}</div>
    </div>
  )
}
