import { UsersPage } from '@/pages/UsersPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard/_manager-guard/users')({
  component: UsersPage,
})
