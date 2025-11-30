// ====================================
// TeddyBear's Room - ProductCardSkeleton 컴포넌트
// 상품 카드 로딩 스켈레톤 (Placeholder)
// ====================================
//
// 🎯 용도:
// - 상품 데이터 로딩 중 표시되는 플레이스홀더
// - 레이아웃 시프트(CLS) 방지
// - 사용자에게 로딩 피드백 제공
//
// 📦 구조:
// - ProductCardSkeleton: 단일 카드 스켈레톤
// - ProductGridSkeleton: 그리드 형태 다중 스켈레톤
//
// 🎨 디자인:
// - animate-pulse: Tailwind 펄스 애니메이션
// - bg-muted: 테마에 맞는 회색 배경
// - 실제 ProductCard와 동일한 레이아웃
//
// 📝 사용:
// - Suspense fallback으로 활용
// - 조건부 렌더링 시 로딩 상태
// ====================================

// ──────────────────────────────────────
// ProductCardSkeleton 컴포넌트
// ──────────────────────────────────────

/**
 * 단일 상품 카드 스켈레톤
 *
 * @description
 * 상품 데이터 로딩 중 표시되는 플레이스홀더입니다.
 * - 이미지 영역 (aspect-square)
 * - 카테고리 배지
 * - 상품명 (2줄)
 * - 가격
 *
 * @example
 * // 단일 사용
 * <ProductCardSkeleton />
 *
 * // Suspense와 함께
 * <Suspense fallback={<ProductCardSkeleton />}>
 *   <ProductCard product={product} />
 * </Suspense>
 */
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

// ──────────────────────────────────────
// ProductGridSkeleton 컴포넌트
// ──────────────────────────────────────

/**
 * 그리드 형태의 다중 스켈레톤
 *
 * @description
 * 여러 개의 ProductCardSkeleton을 그리드로 배치합니다.
 * - 반응형 그리드: 1열(모바일) → 2열(sm) → 4열(lg)
 * - count 파라미터로 스켈레톤 개수 조절
 *
 * @param count - 표시할 스켈레톤 개수 (기본값: 4)
 *
 * @example
 * // 기본 사용 (4개)
 * <ProductGridSkeleton />
 *
 * // 8개 표시
 * <ProductGridSkeleton count={8} />
 */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
