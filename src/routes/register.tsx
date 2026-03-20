import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RegisterPage } from '../pages/RegisterPage'

export const Route = createFileRoute('/register')({
  validateSearch: z.object({
    workspaceId: z.string().optional(),
  }),
  component: RegisterPage,
})
