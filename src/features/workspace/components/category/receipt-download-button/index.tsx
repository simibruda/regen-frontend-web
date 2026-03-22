import { apiOptions } from '@/common/api'
import type { ReceiptWorkspaceResponse } from '@/common/api/_base/api-types.schemas'
import { Button } from '@/common/components/_base/button'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Download } from 'lucide-react'
import { useCallback, useState, type ComponentProps } from 'react'

type ReceiptDownloadButtonProps = {
  workspaceId: string
  receipt: Pick<ReceiptWorkspaceResponse, 'id' | 'place' | 'date'>
  categoryName: string
  className?: string
  size?: ComponentProps<typeof Button>['size']
  variant?: ComponentProps<typeof Button>['variant']
  label?: string
}

export function ReceiptDownloadButton({
  workspaceId,
  receipt,
  categoryName,
  className = 'border-border text-foreground hover:bg-secondary',
  size = 'sm',
  variant = 'outline',
  label = 'Download',
}: ReceiptDownloadButtonProps) {
  const queryClient = useQueryClient()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = useCallback(async () => {
    if (!workspaceId) return

    setIsDownloading(true)
    try {
      const blob = await queryClient.fetchQuery(
        apiOptions.queries.getReceiptBlob(workspaceId, receipt.id)
      )

      if (!(blob instanceof Blob)) {
        return
      }

      const baseName = buildReceiptDownloadBaseName(
        receipt.place,
        receipt.date,
        categoryName
      )
      const ext = extensionFromBlobType(blob.type)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${baseName}.${ext}`
      link.rel = 'noopener noreferrer'
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsDownloading(false)
    }
  }, [categoryName, queryClient, receipt.date, receipt.id, receipt.place, workspaceId])

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      disabled={!workspaceId || isDownloading}
      onClick={() => void handleDownload()}
    >
      <Download className="h-4 w-4" />
      {isDownloading ? 'Downloading...' : label}
    </Button>
  )
}

function extensionFromBlobType(mime: string): string {
  if (mime.includes('pdf')) return 'pdf'
  if (mime.includes('png')) return 'png'
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg'
  return 'bin'
}

/** place + date + _ + category name (filesystem-safe). */
function buildReceiptDownloadBaseName(place: string, dateIso: string, category: string): string {
  const datePart = dayjs(dateIso).format('DD.MM.YYYY')
  const placePart = sanitizeFileSegment(place, { spacesToUnderscore: true })
  const catPart = sanitizeFileSegment(category, { spacesToUnderscore: true })
  return `${placePart}${datePart}_${catPart}`
}

function sanitizeFileSegment(
  value: string,
  options: { spacesToUnderscore?: boolean } = {}
): string {
  const { spacesToUnderscore = false } = options
  let next = value.replace(/[/\\?%*:|"<>]/g, '')
  next = spacesToUnderscore ? next.replace(/\s+/g, '_') : next.replace(/\s+/g, '')
  return next.trim() || 'file'
}
