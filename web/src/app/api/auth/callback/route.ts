/**
 * OAuth Callback Route Handler
 * TeddyBear's Room - Social Login Callback
 *
 * Supabase OAuth PKCE flow callback handler.
 * Exchanges authorization code for session and redirects user.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    console.error('[OAuth Callback] Provider error:', error, errorDescription)
    const errorUrl = new URL('/auth-code-error', origin)
    errorUrl.searchParams.set('error', error)
    // 상세 에러 설명 URL 노출 제거 (보안)
    return NextResponse.redirect(errorUrl.toString())
  }

  if (code) {
    const supabase = await createClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Successful authentication
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
    console.error('[OAuth Callback] Session exchange error:', exchangeError.message)
    const errorUrl = new URL('/auth-code-error', origin)
    errorUrl.searchParams.set('error', 'session_exchange_failed')
    // 상세 에러 메시지 URL 노출 제거 (보안)
    return NextResponse.redirect(errorUrl.toString())
  }

  // No code provided - invalid callback
  console.error('[OAuth Callback] No authorization code provided')
  return NextResponse.redirect(`${origin}/auth-code-error?error=no_code`)
}
