'use client'

/**
 * Product Query Hooks
 *
 * TanStack Query를 사용한 상품 데이터 fetching hooks
 * - useProducts: 상품 목록 조회 (필터링, 페이지네이션 지원)
 * - useProduct: 단일 상품 상세 조회
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { productKeys } from '@/lib/query-keys'

/**
 * Product 타입 정의
 * Prisma Product 모델과 일치
 */
export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  stock: number
  category: string
  subcategory: string | null
  tags: string[]
  images: string[]
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 상품 목록 필터 타입
 */
export interface ProductFilters extends Record<string, unknown> {
  category?: string
  subcategory?: string
  tags?: string[]
  featured?: boolean
  active?: boolean
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 상품 목록 응답 타입
 */
export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/**
 * 상품 목록 조회 API 호출
 */
async function fetchProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const params = new URLSearchParams()

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.append(key, String(value))
        }
      }
    })
  }

  const response = await fetch(`/api/products?${params.toString()}`)

  if (!response.ok) {
    throw new Error('상품 목록을 불러오는데 실패했습니다')
  }

  return response.json()
}

/**
 * 단일 상품 조회 API 호출
 */
async function fetchProduct(slug: string): Promise<Product> {
  const response = await fetch(`/api/products/${slug}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('상품을 찾을 수 없습니다')
    }
    throw new Error('상품 정보를 불러오는데 실패했습니다')
  }

  return response.json()
}

/**
 * 상품 목록 조회 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProducts({
 *   category: 'toys',
 *   inStock: true,
 *   page: 1,
 *   limit: 20
 * })
 * ```
 */
export function useProducts(
  filters?: ProductFilters,
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => fetchProducts(filters),
    ...options,
  })
}

/**
 * 단일 상품 조회 Hook
 *
 * @example
 * ```tsx
 * const { data: product, isLoading, error } = useProduct('product-slug')
 * ```
 */
export function useProduct(
  slug: string,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProduct(slug),
    // slug가 없으면 쿼리 실행 안 함
    enabled: Boolean(slug),
    ...options,
  })
}

/**
 * 추천 상품 조회 Hook (featured = true)
 */
export function useFeaturedProducts(
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  return useProducts(
    { featured: true, active: true, limit: 8 },
    options
  )
}

/**
 * 카테고리별 상품 조회 Hook
 */
export function useProductsByCategory(
  category: string,
  subcategory?: string,
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) {
  return useProducts(
    {
      category,
      subcategory,
      active: true,
      inStock: true,
    },
    options
  )
}
