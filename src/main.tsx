import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/common/components/_base/tooltip'
import './index.css'
import { queryClient } from './lib/tanstack-query'
import { router } from './lib/tanstack-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#4c4a3d',
            border: '1px solid #e2e1dc',
          },
          classNames: {
            success: '[&>svg]:text-[#2d4ea8]',
            error: '[&>svg]:text-[#dc2626]',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
