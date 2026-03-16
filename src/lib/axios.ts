import Axios, { type AxiosRequestConfig } from 'axios'
import { ENV } from '@/common/config/env.config'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: ENV.API_URL,
})

type PromiseWithCancel<T> = Promise<T> & { cancel?: () => void }

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data) as PromiseWithCancel<T>

  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}
