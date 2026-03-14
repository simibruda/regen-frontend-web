import { MutationCache ,QueryClient} from '@tanstack/react-query';

type InvalidateConfig = 'all' | string[][]

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: false,
      throwOnError: (error) => {
        //? Only throw critical errors to the Error Boundary
        const err = error as Error & { cause?: string | number }
        const errorCause = err?.cause
        
        if (errorCause === 'NO_INTERNET') return true
        if (errorCause === 'SERVER_UNREACHABLE') return true
        if (errorCause === 'TIMEOUT') return true
        if (errorCause === 'NETWORK_ERROR') return true
        
        if (typeof errorCause === 'number'){
          if(errorCause >= 500) return true
          if(errorCause === 401) return true
        } 
        
        return false
      },
    },
    mutations: {
      throwOnError: (error) => {
        //? Only throw critical errors to the Error Boundary
        const err = error as Error & { cause?: string | number }
        const errorCause = err?.cause
        
        if (errorCause === 'NO_INTERNET') return true
        if (errorCause === 'SERVER_UNREACHABLE') return true
        if (errorCause === 'TIMEOUT') return true
        if (errorCause === 'NETWORK_ERROR') return true
        
        if (typeof errorCause === 'number'){
          if(errorCause >= 500) return true
          if(errorCause === 401) return true
        } 
          
        return false
      },
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const invalidates = mutation.meta?.invalidates as InvalidateConfig

      if (invalidates === 'all') {
        queryClient.invalidateQueries() // Invalidates everything
      }
      if (Array.isArray(invalidates)) {
        invalidates.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key })
        })
      }
    },
  }),
})