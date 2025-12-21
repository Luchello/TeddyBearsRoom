/**
 * TanStack Query Client Configuration
 * TeddyBear's Room Server State Management
 */

import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

/**
 * Create a new QueryClient instance with TBR-specific defaults
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 1 minute (data considered fresh for 1 minute)
        staleTime: 60 * 1000,
        // Garbage collection time: 5 minutes (cached data removed after 5 minutes of being unused)
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 3 times
        retry: 3,
        // Delay between retries (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Don't refetch on reconnect (to prevent unnecessary requests)
        refetchOnReconnect: false,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Optimistic update recovery
        onError: (error) => {
          logger.error("[QueryClient]", "Mutation error:", error);
        },
      },
      dehydrate: {
        // Include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

// Browser: Create a singleton instance
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: Always create a new QueryClient
    return makeQueryClient();
  }

  // Browser: Create a singleton instance
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

/**
 * Query Keys Factory
 * Centralized query key management for consistency
 */
export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    slug: (slug: string) => [...queryKeys.products.all, "slug", slug] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    detail: (id: string) => [...queryKeys.categories.all, id] as const,
    tree: () => [...queryKeys.categories.all, "tree"] as const,
  },

  // Brands
  brands: {
    all: ["brands"] as const,
    lists: () => [...queryKeys.brands.all, "list"] as const,
    detail: (id: string) => [...queryKeys.brands.all, id] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    addresses: () => [...queryKeys.user.all, "addresses"] as const,
    measurements: () => [...queryKeys.user.all, "measurements"] as const,
    subscription: () => [...queryKeys.user.all, "subscription"] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
    orderNumber: (orderNumber: string) =>
      [...queryKeys.orders.all, "number", orderNumber] as const,
  },

  // Cart
  cart: {
    all: ["cart"] as const,
    current: () => [...queryKeys.cart.all, "current"] as const,
    totals: () => [...queryKeys.cart.all, "totals"] as const,
  },

  // Search
  search: {
    all: ["search"] as const,
    products: (query: string) =>
      [...queryKeys.search.all, "products", query] as const,
    suggestions: (query: string) =>
      [...queryKeys.search.all, "suggestions", query] as const,
  },
} as const;

/**
 * Invalidation helpers
 */
export const invalidateQueries = {
  products: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),

  productDetail: (queryClient: QueryClient, id: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) }),

  user: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),

  orders: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),

  cart: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
};
