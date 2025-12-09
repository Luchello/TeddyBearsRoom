# CLAUDE.md

프로젝트 가이드 for Claude Code

## Project Overview

**TeddyBear's Room** - 성인용품 E-commerce 플랫폼

| 항목 | 내용 |
|------|------|
| **Live** | https://teddybearsroom.com |
| **Stack** | Next.js 16 + Supabase + Prisma 7 |
| **Status** | ✅ MVP Complete (2025-12-09) |

## Repository Structure

```
TeddyBear'sRoom/
├── CLAUDE.md                 # 본 파일
├── claudedocs/
│   └── subscription_standard.md  # 구독 비즈니스 로직
└── web/                      # Full-stack Next.js App
    ├── prisma/
    │   ├── schema.prisma     # DB 스키마 (20+ 모델)
    │   └── migrations/       # Migration 히스토리
    ├── src/
    │   ├── app/
    │   │   ├── api/          # Backend API
    │   │   │   ├── products/
    │   │   │   ├── orders/
    │   │   │   └── users/
    │   │   ├── (auth)/       # Auth 라우트 그룹
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── (shop)/       # Shop 라우트 그룹
    │   │   │   ├── account/
    │   │   │   ├── cart/
    │   │   │   ├── checkout/
    │   │   │   ├── orders/
    │   │   │   ├── products/
    │   │   │   └── wishlist/
    │   │   ├── layout.tsx    # Root 레이아웃
    │   │   ├── page.tsx      # Homepage
    │   │   └── globals.css   # Tailwind 4 Design System
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui 기반 컴포넌트
    │   │   ├── layout/       # Header, Footer, Navigation
    │   │   ├── auth/         # LoginForm, RegisterForm
    │   │   ├── product/      # ProductCard, ProductGrid, Filters
    │   │   ├── cart/         # CartItem, CartSummary
    │   │   └── checkout/     # Shipping, Payment, Summary
    │   ├── stores/           # Zustand 상태 관리
    │   │   ├── cart-store.ts
    │   │   ├── wishlist-store.ts
    │   │   └── auth-store.ts
    │   └── lib/
    │       ├── prisma.ts     # Prisma 싱글톤
    │       └── supabase/     # Supabase 클라이언트
    ├── middleware.ts         # Auth 미들웨어
    └── .env.local            # 환경변수
```

## Tech Stack

```yaml
# Backend (보존됨)
Database: Supabase PostgreSQL (bjnjbbdcwkooswvexiuh)
ORM: Prisma 7 with @prisma/adapter-pg
Auth: Supabase Auth + PASS 본인확인
Payment: TossPayments (빌링키 정기결제)
Deploy: Vercel

# UI Layer (✅ MVP Complete)
Framework: Next.js 16.0.7 (App Router)
Styling: Tailwind CSS 4 (@theme directive)
State: Zustand 5 (cart, wishlist, auth stores)
UI Components: shadcn/ui + Radix primitives
```

## Architecture Decisions

### 1. 보안: pgcrypto 암호화
- 신체정보 DB 레벨 암호화
- 클라이언트에서만 복호화

### 2. 성인인증: PASS 본인확인
- SKT CI/DI 기반 실명 인증
- 회원가입 시 1회 인증

### 3. 결제: TossPayments
- 구독: 빌링키(Billing Key) 정기결제
- 일반: 카드/계좌이체/간편결제
- 스케줄: Vercel Cron → TossPayments API

### 4. 사이즈 추천: Pass/Fail 로직
- 복잡한 점수제 X → 범위 기반 단순 매칭
- OK / TIGHT·LOOSE / NO

## Business Context

### 이너 서클 (Inner Circle) 구독 시스템

```
이너 서클 = 구독 프로그램 브랜드
└── Roommate 🏠 = 구독 상품 (9,900원/월)
    ├── 10% 상시 할인
    ├── 1% 기부 참여
    └── 3만원↑ 무료배송
```

> 📌 상세: `claudedocs/subscription_standard.md`

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | 상품 목록 |
| `/api/products/[id]` | GET | 상품 상세 |
| `/api/orders` | POST | 주문 생성 |
| `/api/users/me` | GET | 내 정보 |
| `/api/users/me/measurements` | GET/POST | 신체 정보 |

## Development

```bash
cd web
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

### 규칙
- TypeScript strict mode
- Feature branch workflow
- 문서는 `claudedocs/`에 저장

### Micro-Lessons (Learnings)
- Zustand persist: version 변경 시 반드시 `migrate` 함수 제공 필요
- Light Mode 가독성: muted-foreground #9C→#5C, glass-morphism 88% 불투명도 필요
- Tailwind CSS 4: `@apply`로 custom utilities 사용 불가 → `@theme` directive로 CSS 변수 직접 정의
- Next.js 16 + `useSearchParams()`: 반드시 Suspense boundary로 감싸야 함 (서버 컴포넌트 호환)
- Route Groups: `(auth)`, `(shop)` 괄호 표기로 URL 영향 없이 레이아웃/로직 분리 가능

---

**Last Updated**: 2025-12-09 | **Status**: ✅ MVP Build Complete
