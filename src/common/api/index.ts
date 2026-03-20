import { authMutationOptions } from './auth/auth.mutations'
import { authQueryOptions } from './auth/auth.queries'
import { categoryMutationOptions } from './category/category.mutations'
import { categoryQueryOptions } from './category/category.queries'
import { userQueryOptions } from './user/user.queries'
import { workspaceQueryOptions } from './workspace/workspace.queries'

export const apiOptions = {
  mutations: { ...authMutationOptions, ...categoryMutationOptions },
  queries: { ...authQueryOptions, ...workspaceQueryOptions, ...categoryQueryOptions, ...userQueryOptions },
}
