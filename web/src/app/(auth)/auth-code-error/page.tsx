/**
 * Auth Code Error Page
 * TeddyBear's Room - OAuth Error Handler
 *
 * Displays user-friendly error messages for OAuth failures.
 */

"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

// ============================================
// Error Messages
// ============================================

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  no_code: {
    title: "인증 코드가 없습니다",
    description: "소셜 로그인 과정에서 인증 코드를 받지 못했습니다. 다시 시도해 주세요.",
  },
  session_exchange_failed: {
    title: "세션 생성 실패",
    description: "로그인 세션을 생성하는 데 실패했습니다. 잠시 후 다시 시도해 주세요.",
  },
  access_denied: {
    title: "접근이 거부되었습니다",
    description: "소셜 로그인 권한이 거부되었습니다. 로그인을 위해 필요한 권한을 허용해 주세요.",
  },
  invalid_request: {
    title: "잘못된 요청",
    description: "소셜 로그인 요청이 올바르지 않습니다. 다시 시도해 주세요.",
  },
  temporarily_unavailable: {
    title: "일시적으로 사용할 수 없습니다",
    description: "소셜 로그인 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  },
  server_error: {
    title: "서버 오류",
    description: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  },
  default: {
    title: "로그인 오류",
    description: "소셜 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
  },
}

// ============================================
// Error Content Component
// ============================================

function ErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get("error") || "default"
  const errorMessage = searchParams.get("message")

  const { title, description } = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold">{title}</h1>

        {/* Error Description */}
        <p className="text-muted-foreground">{description}</p>

        {/* Technical Details (Development only) */}
        {process.env.NODE_ENV === "development" && errorMessage && (
          <div className="p-3 rounded-lg bg-muted text-left text-sm font-mono">
            <p className="text-muted-foreground mb-1">Technical details:</p>
            <p className="text-destructive">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button asChild>
            <Link href="/login">다시 로그인하기</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground">
          문제가 계속되면{" "}
          <Link href="/support" className="text-primary hover:underline">
            고객센터
          </Link>
          로 문의해 주세요.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Loading Skeleton
// ============================================

function ErrorSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6 animate-pulse">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted" />
        <div className="h-8 bg-muted rounded w-48 mx-auto" />
        <div className="h-4 bg-muted rounded w-64 mx-auto" />
        <div className="space-y-3 pt-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Page Export
// ============================================

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<ErrorSkeleton />}>
      <ErrorContent />
    </Suspense>
  )
}
