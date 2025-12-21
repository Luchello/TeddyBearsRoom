/**
 * useAmbassador Hook
 * TeddyBear's Room - Ambassador State Management
 *
 * Provides reactive ambassador state for referral system.
 * Handles ambassador status, benefits, and free shipping usage.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Ambassador Hook Flow                                       │
 * │                                                             │
 * │  Mount ──> Fetch Status ──> Update State                   │
 * │    │                            │                          │
 * │    └── isLoading: true          └── isLoading: false       │
 * │                                                             │
 * │  useFreeShipping() ──> POST API ──> Optimistic Update      │
 * │    │                       │              │                │
 * │    └── Decrement count     └── Rollback on error           │
 * └─────────────────────────────────────────────────────────────┘
 */

"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import type { AmbassadorInfo, UseFreeShippingResponse } from '@/types/referral'

// ============================================
// Types
// ============================================

export interface AmbassadorState {
  /** Ambassador info (null if not loaded or not ambassador) */
  ambassador: AmbassadorInfo | null
  /** Loading state during fetch */
  isLoading: boolean
  /** Error if fetch failed */
  error: Error | null
}

export interface UseAmbassadorReturn extends AmbassadorState {
  /** Whether user is an active ambassador */
  isAmbassador: boolean
  /** Whether user can use free shipping benefit */
  canUseFreeShipping: boolean
  /** Use one free shipping coupon */
  useFreeShipping: () => Promise<UseFreeShippingResponse>
  /** Refetch ambassador status */
  refetch: () => Promise<void>
}

// ============================================
// API Functions
// ============================================

/**
 * Fetch ambassador status from API
 */
async function fetchAmbassadorStatus(): Promise<AmbassadorInfo | null> {
  const response = await fetch('/api/referrals/ambassador', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    // 401/403: User not authenticated or not authorized
    if (response.status === 401 || response.status === 403) {
      return null
    }
    throw new Error(`Failed to fetch ambassador status: ${response.status}`)
  }

  const data = await response.json()
  return data as AmbassadorInfo
}

/**
 * Use free shipping benefit via API
 */
async function postUseFreeShipping(): Promise<UseFreeShippingResponse> {
  const response = await fetch('/api/ambassador/free-shipping', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.error || `Failed to use free shipping: ${response.status}`,
    }
  }

  return data as UseFreeShippingResponse
}

// ============================================
// Hook Implementation
// ============================================

/**
 * React hook for managing ambassador state
 *
 * @returns Ambassador state and methods
 *
 * @example
 * ```tsx
 * function AmbassadorBenefits() {
 *   const {
 *     ambassador,
 *     isLoading,
 *     isAmbassador,
 *     canUseFreeShipping,
 *     useFreeShipping
 *   } = useAmbassador()
 *
 *   if (isLoading) return <Skeleton />
 *   if (!isAmbassador) return null
 *
 *   return (
 *     <div>
 *       <AmbassadorBadge />
 *       {canUseFreeShipping && (
 *         <button onClick={useFreeShipping}>
 *           Use Free Shipping ({ambassador?.benefits.monthlyFreeShipping} left)
 *         </button>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAmbassador(): UseAmbassadorReturn {
  const [state, setState] = useState<AmbassadorState>({
    ambassador: null,
    isLoading: true,
    error: null,
  })

  // Prevent duplicate fetches
  const isFetchingRef = useRef(false)
  // Track if component is mounted
  const isMountedRef = useRef(true)

  /**
   * Fetch ambassador status and update state
   */
  const refetch = useCallback(async () => {
    // Prevent duplicate concurrent fetches
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const ambassadorInfo = await fetchAmbassadorStatus()

      // Only update if still mounted
      if (isMountedRef.current) {
        setState({
          ambassador: ambassadorInfo,
          isLoading: false,
          error: null,
        })
      }
    } catch (err) {
      console.error('[useAmbassador] Fetch error:', err)

      if (isMountedRef.current) {
        setState({
          ambassador: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch ambassador status'),
        })
      }
    } finally {
      isFetchingRef.current = false
    }
  }, [])

  /**
   * Use free shipping with optimistic update
   */
  const useFreeShipping = useCallback(async (): Promise<UseFreeShippingResponse> => {
    const { ambassador } = state

    // Validate preconditions
    if (!ambassador) {
      return { success: false, error: 'Ambassador status not loaded' }
    }

    if (!ambassador.benefits.freeShippingAvailable) {
      return { success: false, error: 'No free shipping available' }
    }

    // Store previous state for rollback
    const previousAmbassador = ambassador

    // Optimistic update: decrement free shipping count
    const optimisticBenefits = {
      ...ambassador.benefits,
      monthlyFreeShipping: Math.max(0, ambassador.benefits.monthlyFreeShipping - 1),
      freeShippingAvailable: ambassador.benefits.monthlyFreeShipping > 1,
    }

    setState(prev => ({
      ...prev,
      ambassador: prev.ambassador ? {
        ...prev.ambassador,
        benefits: optimisticBenefits,
      } : null,
    }))

    try {
      const result = await postUseFreeShipping()

      if (!result.success) {
        // Rollback on failure
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            ambassador: previousAmbassador,
          }))
        }
        return result
      }

      // Refetch to get accurate state from server
      await refetch()

      return result
    } catch (err) {
      console.error('[useAmbassador] Use free shipping error:', err)

      // Rollback on error
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          ambassador: previousAmbassador,
        }))
      }

      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to use free shipping',
      }
    }
  }, [state, refetch])

  /**
   * Initialize ambassador state on mount
   */
  useEffect(() => {
    isMountedRef.current = true
    refetch()

    return () => {
      isMountedRef.current = false
    }
  }, [refetch])

  // ============================================
  // Derived State
  // ============================================

  const { ambassador } = state

  /** User is an active ambassador */
  const isAmbassador = ambassador?.isAmbassador === true && ambassador?.status === 'ACTIVE'

  /** User can use free shipping benefit */
  const canUseFreeShipping = isAmbassador && (ambassador?.benefits.freeShippingAvailable ?? false)

  return {
    ...state,
    isAmbassador,
    canUseFreeShipping,
    useFreeShipping,
    refetch,
  }
}

// ============================================
// Utility Hooks
// ============================================

/**
 * Hook that returns only ambassador status
 * Lightweight check without full state
 */
export function useIsAmbassador(): boolean {
  const { isAmbassador } = useAmbassador()
  return isAmbassador
}

/**
 * Hook that returns free shipping availability
 */
export function useCanUseFreeShipping(): boolean {
  const { canUseFreeShipping } = useAmbassador()
  return canUseFreeShipping
}

export default useAmbassador
