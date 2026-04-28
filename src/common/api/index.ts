import { authMutationOptions } from './auth/auth.mutations'
import { authQueryOptions } from './auth/auth.queries'
import { carMutationOptions } from './car/car.mutations'
import { carQueryOptions } from './car/car.query'
import { categoryMutationOptions } from './category/category.mutations'
import { categoryQueryOptions } from './category/category.queries'
import { receiptMutationOptions } from './receipt/receipt.mutations'
import { receiptQueryOptions } from './receipt/receipt.queries'
import { routeMutationOptions } from './route/route.mutations'
import { routeQueryOptions } from './route/route.queries'
import { userQueryOptions } from './user/user.queries'
import { workspaceQueryOptions } from './workspace/workspace.queries'

export const apiOptions = {
  mutations: {
    ...authMutationOptions,
    ...categoryMutationOptions,
    ...receiptMutationOptions,
    ...routeMutationOptions,
    ...carMutationOptions,
  },
  queries: {
    ...authQueryOptions,
    ...workspaceQueryOptions,
    ...categoryQueryOptions,
    ...userQueryOptions,
    ...receiptQueryOptions,
    ...routeQueryOptions,
    ...carQueryOptions,
  },
}
