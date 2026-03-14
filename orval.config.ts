import { defineConfig } from 'orval'

export default defineConfig({
  frontendApi: {
    input: {
      target: './orval/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/_base/generated',
      schemas: './src/api/_base/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/common/api/_base/client.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
