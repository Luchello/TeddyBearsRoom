'use client'

/**
 * Cart Mutation Hooks
 *
 * TanStack Query를 사용한 장바구니 mutations
 * - Optimistic updates로 즉각적인 UI 피드백 제공
 * - 에러 발생 시 자동 롤백
 */

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { cartKeys } from '@/lib/query-keys'
import { useCartStore } from '@/stores/cart-store'

/**
 * 장바구니 아이템 타입
 */
export interface CartItem {
  productId: string
  quantity: number
  name: string
  price: number
  image: string
  slug: string
}

/**
 * 장바구니에 상품 추가 API 호출
 */
async function addToCart(item: CartItem): Promise<void> {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    throw new Error('장바구니에 추가하는데 실패했습니다')
  }
}

/**
 * 장바구니 아이템 수량 변경 API 호출
 */
async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<void> {
  const response = await fetch('/api/cart', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, quantity }),
  })

  if (!response.ok) {
    throw new Error('수량 변경에 실패했습니다')
  }
}

/**
 * 장바구니 아이템 삭제 API 호출
 */
async function removeFromCart(itemId: string): Promise<void> {
  const response = await fetch(`/api/cart?itemId=${itemId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('장바구니에서 삭제하는데 실패했습니다')
  }
}

/**
 * 장바구니 전체 삭제 API 호출
 */
async function clearCart(): Promise<void> {
  const response = await fetch('/api/cart', {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('장바구니를 비우는데 실패했습니다')
  }
}

/**
 * 장바구니 추가 Mutation Hook
 *
 * Optimistic update로 즉각적인 UI 반영
 * 에러 발생 시 자동 롤백
 *
 * @example
 * ```tsx
 * const addToCart = useAddToCart()
 *
 * addToCart.mutate({
 *   productId: '123',
 *   quantity: 1,
 *   name: '상품명',
 *   price: 10000,
 *   image: '/image.jpg',
 *   slug: 'product-slug'
 * })
 * ```
 */
export function useAddToCart(
  options?: Omit<UseMutationOptions<void, Error, CartItem, { previousCart: unknown }>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  const { addSimpleItem } = useCartStore()

  return useMutation<void, Error, CartItem, { previousCart: unknown }>({
    mutationFn: addToCart,
    // Optimistic update: 즉시 Zustand store 업데이트
    onMutate: async (newItem) => {
      // 진행 중인 cart 쿼리 취소
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })

      // 이전 상태 저장 (롤백용)
      const previousCart = queryClient.getQueryData(cartKeys.items())

      // Zustand store 즉시 업데이트 (addSimpleItem 사용)
      addSimpleItem({
        productId: newItem.productId,
        quantity: newItem.quantity,
        name: newItem.name,
        price: newItem.price,
        imageUrl: newItem.image,
      })

      return { previousCart }
    },
    // 에러 발생 시 롤백
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
      }
    },
    // 성공 또는 에러 후 cart 쿼리 무효화 (서버 상태 동기화)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() })
    },
    ...options,
  })
}

/**
 * 장바구니 수량 변경 Mutation Hook
 *
 * @example
 * ```tsx
 * const updateQuantity = useUpdateCartItemQuantity()
 *
 * updateQuantity.mutate({
 *   itemId: 'cart-item-id',
 *   quantity: 2
 * })
 * ```
 */
export function useUpdateCartItemQuantity(
  options?: Omit<
    UseMutationOptions<void, Error, { itemId: string; quantity: number }, { previousCart: unknown }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()
  const { updateItem } = useCartStore()

  return useMutation<void, Error, { itemId: string; quantity: number }, { previousCart: unknown }>({
    mutationFn: ({ itemId, quantity }) =>
      updateCartItemQuantity(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })
      const previousCart = queryClient.getQueryData(cartKeys.items())

      updateItem(itemId, quantity)

      return { previousCart }
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() })
    },
    ...options,
  })
}

/**
 * 장바구니 아이템 삭제 Mutation Hook
 *
 * @example
 * ```tsx
 * const removeItem = useRemoveFromCart()
 *
 * removeItem.mutate('item-id')
 * ```
 */
export function useRemoveFromCart(
  options?: Omit<UseMutationOptions<void, Error, string, { previousCart: unknown }>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  const { removeItem } = useCartStore()

  return useMutation<void, Error, string, { previousCart: unknown }>({
    mutationFn: removeFromCart,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })
      const previousCart = queryClient.getQueryData(cartKeys.items())

      removeItem(itemId)

      return { previousCart }
    },
    onError: (err, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() })
    },
    ...options,
  })
}

/**
 * 장바구니 전체 삭제 Mutation Hook
 *
 * @example
 * ```tsx
 * const clearCart = useClearCart()
 *
 * clearCart.mutate()
 * ```
 */
export function useClearCart(
  options?: Omit<UseMutationOptions<void, Error, void, { previousCart: unknown }>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  const { clearCart: clearZustandCart } = useCartStore()

  return useMutation<void, Error, void, { previousCart: unknown }>({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })
      const previousCart = queryClient.getQueryData(cartKeys.items())

      clearZustandCart()

      return { previousCart }
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() })
    },
    ...options,
  })
}
