import { CategoriesConfigPage } from '@/pages/CategoriesConfigPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard/categories-config')({
  component: CategoriesConfigPage,
})
