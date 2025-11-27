// ====================================
// TeddyBear's Room - Loading Skeleton
// Animated placeholder for product cards
// ====================================

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <div className="h-5 w-12 rounded-full bg-muted" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>

        {/* Price */}
        <div className="h-6 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
