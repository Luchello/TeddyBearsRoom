/**
 * Social Login Helper Functions
 * TeddyBear's Room - OAuth Authentication
 *
 * Provides type-safe social login functions for Supabase OAuth.
 * Supports: Kakao, Google (Naver planned for Phase 2)
 */

import { createClient } from '@/lib/supabase/client'
import type { Provider } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// ============================================
// Types
// ============================================

/** Supported OAuth providers */
export type SocialProvider = 'kakao' | 'google'

/** Result of social login initiation */
export interface SocialLoginResult {
  success: boolean
  url?: string
  error?: string
}

/** Provider display information */
export interface ProviderInfo {
  id: SocialProvider
  name: string
  nameKo: string
  color: string
  icon: React.ComponentType<{ className?: string }>
}

// ============================================
// Configuration
// ============================================

/**
 * Get the OAuth callback URL based on environment
 */
function getCallbackUrl(next?: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const callbackUrl = new URL('/api/auth/callback', baseUrl)

  if (next) {
    callbackUrl.searchParams.set('next', next)
  }

  return callbackUrl.toString()
}

/**
 * Map our provider names to Supabase provider names
 */
function toSupabaseProvider(provider: SocialProvider): Provider {
  const mapping: Record<SocialProvider, Provider> = {
    kakao: 'kakao',
    google: 'google',
  }
  return mapping[provider]
}

// ============================================
// Social Login Functions
// ============================================

/**
 * Initiate social login with specified provider
 *
 * @param provider - OAuth provider (kakao, google)
 * @param redirectTo - URL to redirect after successful login
 * @returns Promise with success status and optional redirect URL
 *
 * @example
 * ```tsx
 * const result = await signInWithSocial('kakao', '/dashboard')
 * if (result.url) {
 *   window.location.href = result.url
 * }
 * ```
 */
export async function signInWithSocial(
  provider: SocialProvider,
  redirectTo?: string
): Promise<SocialLoginResult> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: toSupabaseProvider(provider),
      options: {
        redirectTo: getCallbackUrl(redirectTo),
        // Google-specific: Request offline access for refresh tokens
        ...(provider === 'google' && {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }),
      },
    })

    if (error) {
      logger.error('[Social Login]', `${provider} error:`, error.message)
      return {
        success: false,
        error: error.message,
      }
    }

    if (data.url) {
      return {
        success: true,
        url: data.url,
      }
    }

    return {
      success: false,
      error: 'No redirect URL received',
    }
  } catch (err) {
    logger.error('[Social Login]', `${provider} exception:`, err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Sign out the current user
 *
 * @returns Promise<void>
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

