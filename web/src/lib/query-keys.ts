/**
 * TanStack Query Key Factory
 *
 * 쿼리 키를 일관되고 타입 안전하게 관리하기 위한 팩토리 패턴
 *
 * 패턴:
 * - all: 전체 도메인
 * - lists: 목록 쿼리
 * - list(filters): 특정 필터 조건의 목록
 * - details: 상세 쿼리
 * - detail(id): 특정 ID의 상세
 */

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
}

export const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  summary: () => [...cartKeys.all, 'summary'] as const,
}

export const wishlistKeys = {
  all: ['wishlist'] as const,
  items: () => [...wishlistKeys.all, 'items'] as const,
}

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
  history: () => [...subscriptionKeys.all, 'history'] as const,
}
