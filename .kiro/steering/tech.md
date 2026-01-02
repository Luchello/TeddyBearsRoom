# 기술 스택 및 아키텍처

## 핵심 스택

| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| **Next.js** | 16 (App Router) | 서버 컴포넌트, 스트리밍, 최적화된 번들링 |
| **React** | 19 | Concurrent features, Server Components |
| **TypeScript** | 5 (strict mode) | 타입 안전성, 런타임 에러 사전 방지 |
| **Tailwind CSS** | 4 | 성능 최적화, CSS 변수 기반 테마 |
| **Prisma** | 7 | 타입 안전한 ORM, 마이그레이션 관리 |
| **Supabase** | PostgreSQL | Auth/Storage 통합, RLS 보안 |
| **Zustand** | 5 | 가벼운 클라이언트 상태 관리 |
| **TanStack Query** | 5 | 서버 상태, 캐싱, 동기화 |

---

## UI 시스템

### 컴포넌트 아키텍처
```
Radix UI (headless) → shadcn/ui (스타일링) → 커스텀 컴포넌트
```

### 스타일링 도구
- **CVA (class-variance-authority)**: variant 기반 컴포넌트 스타일
- **clsx + tailwind-merge**: 조건부 클래스 병합, 충돌 해결
- **Lucide React**: 일관된 아이콘 시스템

### 폼 관리
- **React Hook Form 7**: 성능 최적화된 비제어 폼
- **Zod 4**: 런타임 스키마 검증, TypeScript 통합

---

## 데이터베이스 전략 (Dual-Layer)

### E-commerce 모델 (PascalCase)
신규 개발 대상. Prisma로 관리.
```
Profile, Product, CartItem, WishlistItem
Order, OrderItem, Subscription
DonationOrg, DonationVote
```

### Legacy 모델 (snake_case, ts_ prefix)
외부 시스템에서 관리. 읽기 전용 접근.
```
body_measurements (RLS 암호화)
ts_products, ts_orders (분석/자동화)
ts_inventory, ts_wholesalers (공급망)
```

> **주의**: `ts_*` 테이블은 외부에서 관리됨. 신규 기능은 PascalCase 모델에만 추가.

---

## 보안

### HTTP 헤더 (OWASP 기반)
- **CSP**: 스크립트 출처 제한
- **HSTS**: HTTPS 강제
- **X-Frame-Options**: 클릭재킹 방지
- **X-Content-Type-Options**: MIME 스니핑 방지

### 데이터 보호
- **pgcrypto**: 민감 데이터 DB 레벨 암호화
- **Supabase RLS**: 행 단위 접근 제어

### Rate Limiting
- **@upstash/redis + ratelimit**: API 남용 방지

---

## 디자인 시스템

### Light Theme: "Skin & Silk"
- 베이스: Rose, Champagne 톤
- 부드럽고 고급스러운 느낌

### Dark Theme: "Midnight & Neon"
- 베이스: Deep Navy/Black
- 악센트: 네온 그린, 퍼플
- Glassmorphism 효과 적용

### 컴포넌트 특징
- 반투명 배경 + 블러
- 미묘한 테두리 그라데이션
- 부드러운 그림자

---

## 테스트 전략

| 유형 | 도구 | 용도 |
|------|------|------|
| **Unit** | Vitest + happy-dom | 컴포넌트, 유틸, 훅 |
| **E2E** | Playwright (Chromium) | 사용자 워크플로우 |

### 테스트 원칙
- TDD Red-Green-Refactor 사이클 준수
- Mock 최소화, 실제 동작 테스트 우선

---

## 주요 기술적 결정

### Tailwind CSS 4
```css
/* @apply 불가 → @theme directive 사용 */
@theme {
  --color-primary: oklch(0.7 0.15 350);
}
```
**이유**: Tailwind 4는 JIT 컴파일러 변경으로 `@apply` 지원 제거. CSS 변수 기반 테마가 더 유연.

### Next.js 16 + useSearchParams()
```tsx
// Suspense boundary 필수
<Suspense fallback={<Loading />}>
  <SearchParamsComponent />
</Suspense>
```
**이유**: 서버 렌더링 시 searchParams는 동적 값. Suspense 없이 접근하면 빌드 에러.

### Prisma 7 + Supabase
```typescript
// @prisma/adapter-pg 사용, Pool 싱글톤 패턴
import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
```
**이유**: Prisma 7은 드라이버 어댑터 필수. Connection pooling으로 서버리스 환경 최적화.

---

## 환경 변수

```bash
# 필수 (.env.local)
DATABASE_URL=          # Supabase pooler (port 6543)
DIRECT_URL=            # Supabase direct (port 5432, 마이그레이션용)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 명령어 참조

```bash
# 개발 (web/ 디렉토리에서 실행)
npm run dev           # 개발 서버
npm run build         # 프로덕션 빌드
npm run lint          # ESLint

# Prisma
npx prisma generate   # 클라이언트 생성
npx prisma db push    # 스키마 푸시
npx prisma migrate dev --name <name>  # 마이그레이션
npx prisma studio     # DB GUI
```
