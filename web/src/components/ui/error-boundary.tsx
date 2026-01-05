/**
 * Error Boundary Components
 * TeddyBear's Room - Graceful Error Handling
 *
 * Uses react-error-boundary for modern React 19 error handling
 * with fallback UI and error recovery capabilities.
 */

"use client";

import * as React from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "./button";

// ============================================================
// FALLBACK COMPONENTS
// ============================================================

/**
 * Default fallback UI for route-level errors
 */
function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="mb-6 text-6xl">😢</div>
      <h2 className="text-xl font-bold mb-2 text-foreground">
        문제가 발생했습니다
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <div className="flex gap-3">
        <Button onClick={resetErrorBoundary} variant="default">
          다시 시도
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          페이지 새로고침
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <details className="mt-6 p-4 bg-muted rounded-lg text-left max-w-lg w-full">
          <summary className="cursor-pointer text-sm font-medium mb-2">
            개발자 정보 (개발 모드에서만 표시)
          </summary>
          <pre className="text-xs overflow-auto text-destructive">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Compact fallback UI for component-level errors
 */
function CompactErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/50 border border-border"
    >
      <div className="mb-3 text-3xl">⚠️</div>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        콘텐츠를 불러오는 데 실패했습니다
      </p>
      <Button onClick={resetErrorBoundary} size="sm" variant="outline">
        다시 시도
      </Button>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-2 text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}

/**
 * Minimal fallback for inline/small components
 */
function InlineErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <span
      role="alert"
      className="inline-flex items-center gap-1 text-sm text-destructive cursor-pointer"
      onClick={resetErrorBoundary}
    >
      <span>⚠️</span>
      <span className="underline">오류 (클릭하여 재시도)</span>
    </span>
  );
}

// ============================================================
// ERROR BOUNDARY WRAPPERS
// ============================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Fallback variant: "default" | "compact" | "inline" */
  variant?: "default" | "compact" | "inline";
  /** Custom fallback component */
  fallback?: React.ComponentType<FallbackProps>;
  /** Called when error is caught */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** Called when reset is triggered */
  onReset?: () => void;
  /** Keys that when changed will reset the error boundary */
  resetKeys?: unknown[];
}

/**
 * Reusable Error Boundary component with multiple fallback variants
 *
 * @example
 * // Route-level error boundary
 * <ErrorBoundary>
 *   <PageContent />
 * </ErrorBoundary>
 *
 * @example
 * // Component-level with compact fallback
 * <ErrorBoundary variant="compact">
 *   <ProductCard />
 * </ErrorBoundary>
 *
 * @example
 * // With error logging
 * <ErrorBoundary onError={(error) => logErrorToService(error)}>
 *   <Component />
 * </ErrorBoundary>
 */
export function ErrorBoundary({
  children,
  variant = "default",
  fallback,
  onError,
  onReset,
  resetKeys,
}: ErrorBoundaryProps) {
  const FallbackComponent = fallback || getFallbackByVariant(variant);

  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("ErrorBoundary caught an error:", error, info);
      }

      // Call custom error handler if provided
      onError?.(error, info);
    },
    [onError]
  );

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

function getFallbackByVariant(
  variant: "default" | "compact" | "inline"
): React.ComponentType<FallbackProps> {
  switch (variant) {
    case "compact":
      return CompactErrorFallback;
    case "inline":
      return InlineErrorFallback;
    default:
      return DefaultErrorFallback;
  }
}

// ============================================================
// SPECIALIZED ERROR BOUNDARIES
// ============================================================

/**
 * Product section error boundary with product-specific messaging
 */
export function ProductErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      variant="compact"
      onError={(error) => {
        // Could log to analytics here
        console.error("Product component error:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Cart error boundary with recovery guidance
 */
export function CartErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => (
        <div
          role="alert"
          className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center"
        >
          <div className="mb-3 text-3xl">🛒</div>
          <h3 className="font-semibold text-amber-900 mb-2">
            장바구니를 불러오는 데 실패했습니다
          </h3>
          <p className="text-sm text-amber-700 mb-4">
            잠시 후 다시 시도해주세요. 문제가 지속되면 페이지를 새로고침 해주세요.
          </p>
          <Button onClick={resetErrorBoundary} size="sm">
            다시 시도
          </Button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Export fallback components for custom usage
export {
  DefaultErrorFallback,
  CompactErrorFallback,
  InlineErrorFallback,
};
