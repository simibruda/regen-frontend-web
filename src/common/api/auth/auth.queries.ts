import { authControllerGetCurrentUser } from "@/common/api/_base/auth"
import { QUERY_KEY } from "@/common/constants/query-key.constant"
import { queryOptions } from "@tanstack/react-query"

export const authQueryOptions = {
    getCurrentUser: queryOptions({
        queryFn: async () => {
            const response = await authControllerGetCurrentUser({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            return response
        },
        queryKey: [QUERY_KEY.GET_CURRENT_USER],
    }),
}