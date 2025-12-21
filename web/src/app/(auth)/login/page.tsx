/**
 * Login Page
 * TeddyBear's Room - Social Login Only
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth";
import { useAuth } from "@/hooks/use-auth";

// ============================================
// Login Content Component
// ============================================

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  // Show loading while checking auth
  if (isLoading) {
    return <LoginSkeleton />;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm redirectUrl={redirectUrl} />;
  }

  // Transitioning to redirect
  return <LoginSkeleton />;
}

// ============================================
// Loading Skeleton
// ============================================

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-pulse">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="h-8 w-24 bg-muted rounded mx-auto" />
        <div className="h-4 w-48 bg-muted rounded mx-auto" />
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-4">
        <div className="h-12 bg-muted rounded-lg" />
        <div className="h-12 bg-muted rounded-lg" />
      </div>

      {/* Terms */}
      <div className="pt-4">
        <div className="h-3 w-64 bg-muted rounded mx-auto" />
      </div>
    </div>
  );
}

// ============================================
// Page Export
// ============================================

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
