import { apiOptions } from '@/common/api'
import { Loader } from '@/common/components/_base/loader'
import { CategoryNotFoundState } from '@/features/workspace/components/category/category-not-found-state'
import { CategoryPageHeader } from '@/features/workspace/components/category/category-page-header'
import {
  CategoryRecordsSection,
  type CategoryRecordsTab,
} from '@/features/workspace/components/category/category-records-section'
import { StatsSection } from '@/features/workspace/components/category/stats-section'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export function CategoryPage() {
  const { id } = useParams({ from: '/_auth-guard/category/$id' })
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [activeTab, setActiveTab] = useState<CategoryRecordsTab>('receipts')

  const hasValidRange =
    dayjs(startDate).isValid() && dayjs(endDate).isValid() && startDate <= endDate
  const startDateIso = useMemo(() => dayjs(startDate).startOf('day').toISOString(), [startDate])
  const endDateIso = useMemo(() => dayjs(endDate).endOf('day').toISOString(), [endDate])

  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery({
    ...apiOptions.queries.getCurrentUser,
  })

  const workspaceId = currentUser?.workspaceId ?? ''

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    ...apiOptions.queries.getCategoryById(workspaceId, id),
    enabled: Boolean(workspaceId),
  })
  const isLoading = isCurrentUserLoading || isCategoryLoading

  if (isLoading) {
    return (
      <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
        <div className="mx-auto mt-20 max-w-5xl">
          <Loader />
        </div>
      </main>
    )
  }

  if (!category) {
    return <CategoryNotFoundState />
  }

  return (
    <main className="min-h-full bg-background p-4 pb-36 md:p-5 md:pb-5">
      <div className="mx-auto max-w-5xl space-y-8">
        <CategoryPageHeader
          categoryName={category.name}
          startDate={startDate}
          endDate={endDate}
          hasValidRange={hasValidRange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <StatsSection
          startDate={startDateIso}
          endDate={endDateIso}
          hasValidRange={hasValidRange}
        />

        <CategoryRecordsSection
          startDate={startDateIso}
          endDate={endDateIso}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </main>
  )
}
