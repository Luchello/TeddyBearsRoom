# TanStack Query Implementation Summary

**Date**: 2025-12-17
**Status**: ✅ Complete
**Build**: Passing

## Overview

Implemented TanStack Query (React Query) v5 for TeddyBear's Room to provide client-side caching, optimistic updates, and improved UX for data fetching.

## Files Created

### 1. Query Infrastructure

#### `web/src/lib/query-keys.ts`
Query key factory for type-safe cache management:
- `productKeys` - Product queries (list, detail)
- `cartKeys` - Cart queries (items, summary)
- `wishlistKeys` - Wishlist queries
- `orderKeys` - Order queries (list, detail)
- `subscriptionKeys` - Subscription queries (current, history)

**Pattern**:
```typescript
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
}
```

#### `web/src/providers/query-provider.tsx`
React Query provider with optimized defaults:
- **staleTime**: 5 minutes (data stays fresh)
- **gcTime**: 30 minutes (garbage collection time)
- **retry**: 1 attempt on network errors
- **refetchOnWindowFocus**: Enabled
- **DevTools**: Development only

### 2. Product Query Hooks

#### `web/src/hooks/use-products.ts`
Composable product query hooks:

**Core Hooks**:
- `useProducts(filters)` - Paginated product list with filtering
- `useProduct(slug)` - Single product detail by slug
- `useFeaturedProducts()` - Featured products (featured=true, active=true, limit=8)
- `useProductsByCategory(category, subcategory)` - Category-filtered products

**Types**:
```typescript
interface Product {
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

interface ProductFilters extends Record<string, unknown> {
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

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
```

### 3. Cart Mutation Hooks

#### `web/src/hooks/use-cart.ts`
Optimistic cart mutations with automatic rollback:

**Hooks**:
- `useAddToCart()` - Add item to cart with optimistic update
- `useUpdateCartItemQuantity()` - Update quantity (by itemId)
- `useRemoveFromCart()` - Remove item (by itemId)
- `useClearCart()` - Clear entire cart

**Optimistic Update Pattern**:
```typescript
export function useAddToCart() {
  const queryClient = useQueryClient()
  const { addSimpleItem } = useCartStore()

  return useMutation<void, Error, CartItem, { previousCart: unknown }>({
    mutationFn: addToCart,
    // 1. Optimistic update: Update Zustand immediately
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.items() })
      const previousCart = queryClient.getQueryData(cartKeys.items())

      addSimpleItem(newItem) // Immediate UI update

      return { previousCart } // Save for rollback
    },
    // 2. Error: Rollback to previous state
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.items(), context.previousCart)
      }
    },
    // 3. Success/Error: Sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.items() })
      queryClient.invalidateQueries({ queryKey: cartKeys.summary() })
    },
  })
}
```

## Integration with Root Layout

#### `web/src/app/layout.tsx`
Wrapped app with QueryProvider:

```typescript
import { QueryProvider } from "@/providers/query-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
```

## Usage Examples

### Product Queries

```typescript
// Product list with filters
const { data, isLoading, error } = useProducts({
  category: 'toys',
  inStock: true,
  page: 1,
  limit: 20,
  sortBy: 'price',
  sortOrder: 'asc'
})

// Single product
const { data: product } = useProduct('product-slug')

// Featured products
const { data: featured } = useFeaturedProducts()

// Category products
const { data: categoryProducts } = useProductsByCategory('toys', 'vibrators')
```

### Cart Mutations

```typescript
// Add to cart
const addToCart = useAddToCart()
addToCart.mutate({
  productId: '123',
  quantity: 1,
  name: 'Product Name',
  price: 10000,
  image: '/image.jpg',
  slug: 'product-slug'
})

// Update quantity
const updateQuantity = useUpdateCartItemQuantity()
updateQuantity.mutate({
  itemId: 'cart-item-id',
  quantity: 2
})

// Remove item
const removeItem = useRemoveFromCart()
removeItem.mutate('cart-item-id')

// Clear cart
const clearCart = useClearCart()
clearCart.mutate()
```

## Benefits

### 1. Client-Side Caching
- Data cached for 5 minutes (staleTime)
- Reduced API calls and improved performance
- Automatic background refetching

### 2. Optimistic Updates
- Instant UI feedback on mutations
- Automatic rollback on errors
- Better perceived performance

### 3. Developer Experience
- Type-safe query keys
- Composable hooks
- Built-in loading and error states
- React Query DevTools in development

### 4. UX Improvements
- Faster page transitions (cached data)
- Immediate feedback on actions
- Automatic retry on network errors
- Window focus refetching

## Configuration Details

### Query Defaults
```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,              // 5 min
    gcTime: 30 * 60 * 1000,                // 30 min
    retry: 1,                               // 1 retry
    refetchOnWindowFocus: true,            // Auto-refetch
    refetchOnMount: true,                  // Refetch on mount
  },
  mutations: {
    retry: false,                          // No retry
  }
}
```

### Cache Invalidation Strategy
- Cart mutations invalidate `cartKeys.items()` and `cartKeys.summary()`
- Product mutations would invalidate relevant product keys
- Automatic on `onSettled` (after success or error)

## TypeScript Patterns

### Generic Mutation Types
```typescript
useMutation<TData, TError, TVariables, TContext>({
  // TData: void (no return data)
  // TError: Error
  // TVariables: CartItem (input)
  // TContext: { previousCart: unknown } (for rollback)
})
```

### Extending Options
```typescript
function useAddToCart(
  options?: Omit<
    UseMutationOptions<void, Error, CartItem, { previousCart: unknown }>,
    'mutationFn'
  >
)
```

## Next Steps

### Potential Enhancements
1. **Prefetching**: Prefetch product details on hover
2. **Infinite Queries**: Implement infinite scroll for product lists
3. **Persisted Queries**: Persist cache to localStorage
4. **Server State**: Integrate with Supabase real-time subscriptions
5. **Optimistic Wishlist**: Add wishlist mutations with optimistic updates
6. **Order Queries**: Create order history hooks

### API Integration Notes
- Cart mutation APIs need implementation (`/api/cart` endpoints)
- Product APIs should return `ProductsResponse` format
- Consider rate limiting and error handling

## References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
