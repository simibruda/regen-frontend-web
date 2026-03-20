import { apiOptions } from '@/common/api'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useMemo } from 'react'

type PieSlice = {
  name: string
  totalAmount: number
  color: string
  percentage: number
}

type PieChartData = {
  slices: PieSlice[]
  totalAmount: number
  conicGradient: string
}

type ReceiptGroup = {
  name: string
  totalAmount: number
  percentage: number
}

type UseStatsSectionParams = {
  startDate: string
  endDate: string
  hasValidRange: boolean
}

export function useStatsSection({
  startDate,
  endDate,
  hasValidRange,
}: UseStatsSectionParams) {
  const { id: categoryId } = useParams({ from: '/_auth-guard/category/$id' })
  const { data: currentUser } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })
  const workspaceId = currentUser?.workspaceId ?? ''

  const { data: categoryStats } = useQuery({
    ...apiOptions.queries.getCategoryStats(workspaceId, categoryId, { startDate, endDate }),
    enabled: Boolean(workspaceId) && Boolean(categoryId) && hasValidRange,
  })

  const resolvedCategoryStats = useMemo(() => {
    if (!categoryStats) return undefined

    const maybeWrappedStats = categoryStats as typeof categoryStats & { data?: typeof categoryStats }
    return maybeWrappedStats.data ?? categoryStats
  }, [categoryStats])

  const totalReceiptAmount = resolvedCategoryStats?.totalReceiptAmount ?? 0
  const totalRoutes = resolvedCategoryStats?.totalRoutes ?? 0
  const totalKm = resolvedCategoryStats?.totalKm ?? 0
  const totalFuel = resolvedCategoryStats?.totalFuel ?? 0
  const receiptsByName = useMemo<ReceiptGroup[]>(
    () => resolvedCategoryStats?.receiptsByName ?? [],
    [resolvedCategoryStats],
  )

  const pieChartData = useMemo<PieChartData>(() => {
    const palette = ['#4c7be0', '#34d399', '#fbbf24', '#d946ef', '#f97316', '#60a5fa']

    const slices = receiptsByName.map((item, index) => {
      const start = receiptsByName.slice(0, index).reduce((sum, receipt) => sum + receipt.percentage, 0)
      return {
        name: item.name,
        totalAmount: item.totalAmount,
        color: palette[index % palette.length],
        percentage: item.percentage,
        start,
        end: start + item.percentage,
      }
    })

    const conicGradient =
      slices.length === 0
        ? 'conic-gradient(var(--secondary) 0deg 360deg)'
        : `conic-gradient(${slices
            .map((slice) => `${slice.color} ${slice.start.toFixed(2)}% ${Math.min(slice.end, 100).toFixed(2)}%`)
            .join(', ')})`

    return { slices, totalAmount: totalReceiptAmount, conicGradient }
  }, [receiptsByName, totalReceiptAmount])

  return {
    totalReceiptAmount,
    totalRoutes,
    totalKm,
    totalFuel,
    pieChartData,
  }
}
