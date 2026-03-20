import { authControllerLogin } from "@/common/api/_base/auth"
import type { LoginRequest, AuthControllerRegisterBody } from "@/common/api/_base/api-types.schemas"
import { authControllerRegister } from "@/common/api/_base/auth"
import { mutationOptions } from "@tanstack/react-query"

export const authMutationOptions = {
  register: mutationOptions({
    mutationFn: async (request: AuthControllerRegisterBody) => {
      try {
        const response = await authControllerRegister(request)
        localStorage.setItem('token', response.jwt)
        return response
      } catch (error) {
        localStorage.removeItem('token')
        throw error
      }
    },
  }),
  login: mutationOptions({
    mutationFn: async (request: LoginRequest) => {
      try {
      const response = await authControllerLogin(request)
        localStorage.setItem('token', response.jwt)
        return response
      } catch (error) {
        localStorage.removeItem('token')
        throw error
      }
    },
  }),
}
