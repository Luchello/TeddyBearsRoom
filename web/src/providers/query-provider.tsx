'use client'

/**
 * TanStack Query Provider
 *
 * React Query 설정 및 제공
 * - 캐싱 전략: staleTime 5분, gcTime 30분
 * - 재시도: 1회 (네트워크 에러 시)
 * - DevTools: 개발 환경에서만 활성화
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 데이터를 fresh로 간주
            staleTime: 5 * 60 * 1000,
            // 30분간 garbage collection 방지
            gcTime: 30 * 60 * 1000,
            // 네트워크 에러 시 1회만 재시도
            retry: 1,
            // 윈도우 포커스 시 자동 refetch 활성화
            refetchOnWindowFocus: true,
            // 마운트 시 stale 데이터 refetch
            refetchOnMount: true,
          },
          mutations: {
            // mutation 에러 시 재시도 안 함
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  )
}
