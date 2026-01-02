/**
 * OAuth Callback Route Handler
 * TeddyBear's Room - Social Login Callback
 *
 * Supabase OAuth PKCE flow callback handler.
 * Exchanges authorization code for session and redirects user.
 * Also ensures Profile record exists (fallback for trigger).
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

/**
 * Ensure Profile exists for authenticated user
 * Fallback for Supabase trigger (handles race conditions)
 */
async function ensureProfile(userId: string, email: string, metadata?: Record<string, unknown>) {
  try {
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        email,
        // Only update name/avatar if currently null
        name: undefined, // Will use existing value
        avatar: undefined,
        updatedAt: new Date(),
      },
      create: {
        id: userId,
        email,
        name: (metadata?.full_name as string) || (metadata?.name as string) || null,
        avatar: (metadata?.avatar_url as string) || (metadata?.picture as string) || null,
        subscriptionTier: 'NONE',
        points: 0,
        isAdultVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    logger.info('[OAuth Callback]', `Profile ensured for user: ${userId}`)
  } catch (error) {
    // Log but don't fail - trigger might have already created it
    logger.warn('[OAuth Callback]', 'Profile upsert warning:', error)
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Get redirect URL from query params (set during signInWithOAuth)
  let next = searchParams.get('next') ?? '/'

  // Security: Ensure next is a relative URL to prevent open redirect
  if (!next.startsWith('/')) {
    next = '/'
  }

  // Handle error from OAuth provider
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    // SECURITY: 상세 에러는 서버 로그에만 기록, 클라이언트에는 일반 에러 코드만 전달
    logger.error('[OAuth Callback]', `Provider error: ${error}`, errorDescription)
    const errorUrl = new URL('/auth-code-error', origin)
    errorUrl.searchParams.set('error', error)
    // 상세 에러 설명 URL 노출 제거 (보안)
    return NextResponse.redirect(errorUrl.toString())
  }

  if (code) {
    const supabase = await createClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Successful authentication - ensure Profile exists
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Ensure Profile record exists (fallback for Supabase trigger)
        await ensureProfile(
          user.id,
          user.email ?? '',
          user.user_metadata as Record<string, unknown>
        )
      }

      // Handle production vs development environments
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // Development: Use origin directly
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Production with load balancer: Use forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Production without load balancer
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    // Session exchange failed
    // SECURITY: 상세 에러 메시지는 서버 로그에만 기록, 클라이언트에는 일반 메시지만 전달
    logger.error('[OAuth Callback]', 'Session exchange error:', exchangeError.message)
    const errorUrl = new URL('/auth-code-error', origin)
    errorUrl.searchParams.set('error', 'session_exchange_failed')
    // 상세 에러 메시지 URL 노출 제거 (보안)
    return NextResponse.redirect(errorUrl.toString())
  }

  // No code provided - invalid callback
  logger.error('[OAuth Callback]', 'No authorization code provided')
  return NextResponse.redirect(`${origin}/auth-code-error?error=no_code`)
}
