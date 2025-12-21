/**
 * useAuth Hook
 * TeddyBear's Room - Authentication State Management
 *
 * Provides reactive authentication state using Supabase Auth.
 * Handles session persistence and real-time auth state changes.
 */

"use client"

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut as authSignOut } from '@/lib/auth/social'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

// ============================================
// Types
// ============================================

export interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null
  /** Current session (null if not logged in) */
  session: Session | null
  /** Loading state during initial session check */
  isLoading: boolean
  /** Whether user is authenticated */
  isAuthenticated: boolean
  /** Error if auth check failed */
  error: Error | null
}

export interface UseAuthReturn extends AuthState {
  /** Sign out the current user */
  signOut: () => Promise<void>
  /** Refresh the current session */
  refreshSession: () => Promise<void>
}

// ============================================
// Hook Implementation
// ============================================

/**
 * React hook for managing authentication state
 *
 * @returns Authentication state and methods
 *
 * @example
 * ```tsx
 * function ProfileButton() {
 *   const { user, isLoading, signOut } = useAuth()
 *
 *   if (isLoading) return <Skeleton />
 *   if (!user) return <LoginButton />
 *
 *   return (
 *     <button onClick={signOut}>
 *       {user.email}
 *     </button>
 *   )
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Initialize Supabase client once
  const supabase = createClient()

  /**
   * Fetch current session and update state
   * SECURITY: getUser() 사용 - JWT를 서버에서 검증하여 더 안전
   * getSession()은 로컬 스토리지에서 세션을 읽어 검증 없이 반환할 수 있음
   */
  const refreshSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // SECURITY: getUser()는 JWT를 서버에서 검증
      // getSession()은 캐시된 세션을 반환할 수 있어 보안상 권장되지 않음
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      // 세션 정보도 함께 가져오기 (토큰 정보 필요 시)
      const { data: { session } } = await supabase.auth.getSession()

      setState({
        user: user ?? null,
        session: session,
        isLoading: false,
        isAuthenticated: !!user,
        error: null,
      })
    } catch (err) {
      console.error('[useAuth] Session refresh error:', err)
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: err instanceof Error ? err : new Error('Session refresh failed'),
      })
    }
  }, [supabase])

  /**
   * Sign out and clear state
   */
  const signOut = useCallback(async () => {
    try {
      await authSignOut()
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
    } catch (err) {
      console.error('[useAuth] Sign out error:', err)
      // Still clear local state even if server signout fails
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: err instanceof Error ? err : new Error('Sign out failed'),
      })
    }
  }, [])

  /**
   * Initialize auth state and subscribe to changes
   */
  useEffect(() => {
    // Get initial session
    refreshSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('[useAuth] Auth state changed:', event)

        setState({
          user: session?.user ?? null,
          session: session,
          isLoading: false,
          isAuthenticated: !!session?.user,
          error: null,
        })

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('[useAuth] User signed in')
            break
          case 'SIGNED_OUT':
            console.log('[useAuth] User signed out')
            break
          case 'TOKEN_REFRESHED':
            console.log('[useAuth] Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('[useAuth] User updated')
            break
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, refreshSession])

  return {
    ...state,
    signOut,
    refreshSession,
  }
}

// ============================================
// Utility Hooks
// ============================================

/**
 * Hook that returns only the current user
 * Useful when you only need user data without full auth state
 */
export function useUser(): User | null {
  const { user } = useAuth()
  return user
}

/**
 * Hook that returns authentication status
 * Lightweight check without full state
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export default useAuth
