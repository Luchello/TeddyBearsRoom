/**
 * Skeleton Component
 * TeddyBear's Room Design System
 */

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "rounded" | "text";
  /** Use shimmer animation instead of pulse (better for product cards) */
  shimmer?: boolean;
}

function Skeleton({
  className,
  variant = "default",
  shimmer = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중..."
      className={cn(
        // Use shimmer animation for smoother loading experience
        shimmer ? "skeleton" : "animate-pulse bg-muted",
        variant === "default" && "rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rounded" && "rounded-2xl",
        variant === "text" && "rounded h-4 w-full",
        className
      )}
      {...props}
    />
  );
}

// Product Card Skeleton - uses shimmer for better visual
function ProductCardSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="상품 로딩 중...">
      <Skeleton shimmer variant="rounded" className="aspect-[3/4] w-full" />
      <div className="space-y-2 px-1">
        <Skeleton shimmer variant="text" className="h-3 w-1/3" />
        <Skeleton shimmer variant="text" className="h-4 w-full" />
        <Skeleton shimmer variant="text" className="h-4 w-2/3" />
        <Skeleton shimmer variant="text" className="h-5 w-1/2" />
      </div>
      <span className="sr-only">상품 정보를 불러오는 중입니다</span>
    </div>
  );
}

// Product Grid Skeleton
function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Text Block Skeleton
function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(i === lines - 1 && "w-3/4")}
        />
      ))}
    </div>
  );
}

// Avatar Skeleton
function AvatarSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
}

// Button Skeleton
function ButtonSkeleton({
  size = "default",
  fullWidth = false,
}: {
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}) {
  const sizeClasses = {
    sm: "h-9 w-20",
    default: "h-11 w-28",
    lg: "h-12 w-36",
  };

  return (
    <Skeleton
      variant="rounded"
      className={cn(sizeClasses[size], fullWidth && "w-full")}
    />
  );
}

// Input Skeleton
function InputSkeleton() {
  return <Skeleton variant="rounded" className="h-11 w-full" />;
}

// Card Skeleton
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-6 w-1/3" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4" />
        <Skeleton variant="text" className="h-4" />
        <Skeleton variant="text" className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// Table Row Skeleton
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn("flex-1", i === 0 && "flex-[0.5]")}
        />
      ))}
    </div>
  );
}

// Order Card Skeleton
function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
        <Skeleton variant="rounded" className="h-6 w-16" />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="rounded" className="h-20 w-20 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-1/2" />
          <Skeleton variant="text" className="h-5 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  TextBlockSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  InputSkeleton,
  CardSkeleton,
  TableRowSkeleton,
  OrderCardSkeleton,
};
