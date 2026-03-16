import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.format())}`)
}

export const ENV = {
  API_URL: parsed.data.VITE_API_URL,
}
