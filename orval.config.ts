import { defineConfig } from 'orval'

export default defineConfig({
  store: {
    input: {
      target: './openapi.sanitized.json',
    },
    output: {
      headers: true,
      mode: 'tags',
      target: './src/common/api/_base/api-types.ts',
      mock: false,
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})

