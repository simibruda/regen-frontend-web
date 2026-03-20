import { authMutationOptions } from './auth/auth.mutations'
import { authQueryOptions } from './auth/auth.queries'
import { categoryQueryOptions } from './category/category.queries'
import { workspaceQueryOptions } from './workspace/workspace.queries'

export const apiOptions = {
  mutations: { ...authMutationOptions },
  queries: { ...authQueryOptions, ...workspaceQueryOptions, ...categoryQueryOptions },
}
