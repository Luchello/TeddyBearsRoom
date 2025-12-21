# TeddyBear's Room - Technical Documentation

> Comprehensive documentation for the TeddyBear's Room e-commerce platform

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ████████╗██████╗ ██████╗     ████████╗███████╗ ██████╗██╗  ██╗           │
│   ╚══██╔══╝██╔══██╗██╔══██╗    ╚══██╔══╝██╔════╝██╔════╝██║  ██║           │
│      ██║   ██████╔╝██████╔╝       ██║   █████╗  ██║     ███████║           │
│      ██║   ██╔══██╗██╔══██╗       ██║   ██╔══╝  ██║     ██╔══██║           │
│      ██║   ██████╔╝██║  ██║       ██║   ███████╗╚██████╗██║  ██║           │
│      ╚═╝   ╚═════╝ ╚═╝  ╚═╝       ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝           │
│                                                                             │
│                    TeddyBear's Room Documentation                           │
│                    ──────────────────────────────────                       │
│                    E-commerce Platform for Adults                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Links

| Document | Description | Status |
|----------|-------------|--------|
| [Architecture](./architecture.md) | System architecture, tech stack, deployment | ✅ Complete |
| [Database Schema](./database_schema.md) | Prisma models, relationships, ER diagram | ✅ Complete |
| [API Reference](./api_reference.md) | REST endpoints, request/response formats | ✅ Complete |
| [Components](./components.md) | React components, UI library, patterns | ✅ Complete |
| [State Management](./state_management.md) | Zustand stores, persistence, selectors | ✅ Complete |
| [Subscription](./subscription_standard.md) | Inner Circle business logic | ✅ Complete |

---

## Project Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROJECT SUMMARY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Name:        TeddyBear's Room (테디베어스룸)                              │
│   Type:        성인용품 E-commerce Platform                                 │
│   Live:        https://teddybearsroom.com                                   │
│   Status:      ✅ MVP Complete (2025-12-09)                                 │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  Tech Stack                                                          │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │  Frontend:  Next.js 16 + React 19 + Tailwind CSS 4                  │  │
│   │  Backend:   Next.js API Routes + Prisma 7                           │  │
│   │  Database:  Supabase PostgreSQL                                      │  │
│   │  State:     Zustand 5 + TanStack Query 5                            │  │
│   │  Auth:      Supabase Auth + PASS 본인확인                            │  │
│   │  Payment:   TossPayments (빌링키 정기결제)                           │  │
│   │  Deploy:    Vercel                                                   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────┐                                                     │
│   │     Browser      │                                                     │
│   │  (React Client)  │                                                     │
│   └────────┬─────────┘                                                     │
│            │                                                                │
│            ▼                                                                │
│   ┌──────────────────┐     ┌──────────────────┐                           │
│   │   Next.js App    │────▶│   Supabase Auth  │                           │
│   │   (Vercel)       │     │   + PASS 인증    │                           │
│   └────────┬─────────┘     └──────────────────┘                           │
│            │                                                                │
│            ▼                                                                │
│   ┌──────────────────┐     ┌──────────────────┐                           │
│   │   API Routes     │────▶│  TossPayments    │                           │
│   │   (Prisma ORM)   │     │  (결제/구독)     │                           │
│   └────────┬─────────┘     └──────────────────┘                           │
│            │                                                                │
│            ▼                                                                │
│   ┌──────────────────┐                                                     │
│   │    Supabase      │                                                     │
│   │   PostgreSQL     │                                                     │
│   │   + pgcrypto     │                                                     │
│   └──────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [architecture.md](./architecture.md)

---

## Database Models

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE DATA MODELS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   E-COMMERCE CORE                    SUBSCRIPTION SYSTEM                    │
│   ┌─────────────────┐                ┌─────────────────┐                   │
│   │    Profile      │───────────────▶│  Subscription   │                   │
│   │    (User)       │                │  (Roommate)     │                   │
│   └───────┬─────────┘                └────────┬────────┘                   │
│           │                                   │                             │
│           │ has_many                          │ selects                     │
│           ▼                                   ▼                             │
│   ┌───────────────┐                  ┌─────────────────┐                   │
│   │    Order      │                  │  DonationOrg    │                   │
│   │   CartItem    │                  │  DonationVote   │                   │
│   │ WishlistItem  │                  └─────────────────┘                   │
│   └───────┬───────┘                                                        │
│           │                                                                 │
│           │ belongs_to                                                      │
│           ▼                                                                 │
│   ┌─────────────────┐                ┌─────────────────┐                   │
│   │    Product      │◀───────────────│   Category      │                   │
│   │  ProductImage   │                │     Brand       │                   │
│   │ ProductVariant  │                └─────────────────┘                   │
│   └─────────────────┘                                                      │
│                                                                             │
│   TOTAL: 20+ Models (including ts_* trend shopping tables)                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [database_schema.md](./database_schema.md)

---

## API Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API STRUCTURE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   /api                                                                      │
│   ├── /products                                                             │
│   │   ├── GET     /              # 상품 목록 (pagination, filter)          │
│   │   └── GET     /[id]          # 상품 상세                               │
│   │                                                                         │
│   ├── /orders                                                               │
│   │   ├── POST    /              # 주문 생성                               │
│   │   └── GET     /              # 주문 목록 (인증필수)                    │
│   │                                                                         │
│   ├── /users                                                                │
│   │   ├── GET     /me            # 내 프로필                               │
│   │   └── GET/POST /me/measurements  # 신체정보 (암호화)                   │
│   │                                                                         │
│   ├── /cart                                                                 │
│   │   ├── GET     /              # 장바구니 조회                           │
│   │   ├── POST    /              # 상품 추가                               │
│   │   └── DELETE  /[itemId]      # 상품 제거                               │
│   │                                                                         │
│   ├── /coupons                                                              │
│   │   └── POST    /validate      # 쿠폰 검증                               │
│   │                                                                         │
│   └── /subscriptions                                                        │
│       ├── POST    /              # 구독 시작                               │
│       └── DELETE  /              # 구독 해지                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [api_reference.md](./api_reference.md)

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   src/components/                                                           │
│   │                                                                         │
│   ├── ui/                    # Base Components (shadcn/ui)                 │
│   │   ├── button.tsx         # Button variants                             │
│   │   ├── input.tsx          # Form inputs                                 │
│   │   ├── badge.tsx          # Status badges                               │
│   │   ├── card.tsx           # Card containers                             │
│   │   └── ...                # 20+ UI primitives                           │
│   │                                                                         │
│   ├── layout/                # Layout Components                           │
│   │   ├── header.tsx         # Global navigation                           │
│   │   ├── footer.tsx         # Site footer                                 │
│   │   └── navigation.tsx     # Mobile nav                                  │
│   │                                                                         │
│   ├── products/              # Product Domain                              │
│   │   ├── product-card.tsx   # Product display                             │
│   │   ├── product-grid.tsx   # Grid layout                                 │
│   │   └── product-filters.tsx # Category filters                           │
│   │                                                                         │
│   ├── cart/                  # Cart Domain                                 │
│   │   ├── cart-item.tsx      # Cart line item                              │
│   │   ├── cart-summary.tsx   # Price summary                               │
│   │   └── cart-drawer.tsx    # Slide-out cart                              │
│   │                                                                         │
│   ├── checkout/              # Checkout Flow                               │
│   │   ├── shipping-form.tsx  # Address input                               │
│   │   └── payment-form.tsx   # Payment selection                           │
│   │                                                                         │
│   └── home/                  # Homepage Sections                           │
│       ├── hero-section.tsx   # Main banner                                 │
│       └── roommate-section.tsx # Inner Circle promo                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [components.md](./components.md)

---

## State Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ZUSTAND STORES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         CART STORE                                   │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │  State:                                                              │  │
│   │  • items: CartItem[]           # 장바구니 아이템                     │  │
│   │  • isInnerCircle: boolean      # 구독 여부                          │  │
│   │                                                                      │  │
│   │  Computed:                                                           │  │
│   │  • subtotal → 상품 합계                                              │  │
│   │  • discount → 이너서클 할인 (10%)                                   │  │
│   │  • shippingFee → 배송비 (50k/30k 이상 무료)                         │  │
│   │  • total → 최종 결제금액                                            │  │
│   │                                                                      │  │
│   │  Actions:                                                            │  │
│   │  • addItem(product, quantity, variant)                               │  │
│   │  • removeItem(productId, variantId)                                  │  │
│   │  • updateQuantity(productId, variantId, quantity)                    │  │
│   │  • clearCart()                                                       │  │
│   │  • setInnerCircle(status)                                            │  │
│   │                                                                      │  │
│   │  Persist: localStorage ('cart-storage')                              │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                       WISHLIST STORE                                 │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │  State: items: WishlistItem[]                                        │  │
│   │  Actions: addItem, removeItem, isInWishlist, clearWishlist           │  │
│   │  Persist: localStorage ('wishlist-storage')                          │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         UI STORE                                     │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │  State: isCartOpen, isMobileMenuOpen, isSearchOpen                   │  │
│   │  Actions: openCart, closeCart, toggleMobileMenu, toggleSearch        │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [state_management.md](./state_management.md)

---

## Business Logic: Inner Circle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INNER CIRCLE (이너 서클)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Inner Circle = TeddyBear's Room 구독 프로그램 브랜드                      │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  Roommate 🏠 (9,900원/월)                                           │  │
│   ├─────────────────────────────────────────────────────────────────────┤  │
│   │                                                                      │  │
│   │  BENEFITS:                                                           │  │
│   │  ├── 💰 10% 상시 할인 (전 상품)                                     │  │
│   │  ├── 🚚 3만원↑ 무료배송 (일반: 5만원↑)                              │  │
│   │  ├── 🎁 1% 기부 참여권                                              │  │
│   │  └── 🏷️ 회원 전용 프로모션                                          │  │
│   │                                                                      │  │
│   │  PAYMENT:                                                            │  │
│   │  ├── TossPayments 빌링키 정기결제                                    │  │
│   │  ├── 매월 자동 결제                                                  │  │
│   │  └── Vercel Cron 스케줄러                                           │  │
│   │                                                                      │  │
│   │  DONATION SYSTEM:                                                    │  │
│   │  ├── 구독료의 1%가 기부됨                                           │  │
│   │  ├── 회원이 기부 단체 투표                                          │  │
│   │  └── 분기별 기부금 분배                                             │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

→ 상세: [subscription_standard.md](./subscription_standard.md)

---

## Key Constants

```typescript
// 배송비 기준
export const FREE_SHIPPING_THRESHOLD = 50000;        // 일반 회원
export const INNER_CIRCLE_FREE_SHIPPING_THRESHOLD = 30000;  // 이너서클
export const SHIPPING_FEE = 3000;                    // 기본 배송비

// 이너서클 할인
export const INNER_CIRCLE_DISCOUNT_RATE = 0.1;      // 10%

// 구독료
export const ROOMMATE_PRICE = 9900;                 // 월 9,900원
export const DONATION_RATE = 0.01;                  // 1%
```

---

## Security Measures

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY FEATURES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. 성인인증 (PASS 본인확인)                                              │
│      └── SKT CI/DI 기반 실명인증                                           │
│      └── 회원가입 시 1회 인증 (ci_hash 저장)                               │
│                                                                             │
│   2. 데이터 암호화 (pgcrypto)                                              │
│      └── body_measurements: 신체정보 DB 레벨 암호화                        │
│      └── 클라이언트에서만 복호화                                           │
│                                                                             │
│   3. 결제 보안 (TossPayments)                                              │
│      └── PCI-DSS 준수                                                      │
│      └── 카드정보 미저장 (빌링키만 저장)                                   │
│                                                                             │
│   4. 인증 (Supabase Auth)                                                  │
│      └── JWT 토큰 기반                                                     │
│      └── Row Level Security (RLS)                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Development Guide

### Getting Started

```bash
# 프로젝트 클론 후
cd web

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 편집

# 개발 서버 실행
npm run dev
```

### Required Environment Variables

```bash
# Supabase
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# TossPayments
TOSS_CLIENT_KEY="..."
TOSS_SECRET_KEY="..."
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npx prisma generate` | Prisma 클라이언트 생성 |
| `npx prisma migrate dev` | DB 마이그레이션 |

---

## Document Structure

```
claudedocs/
├── README.md              # 본 파일 (종합 개요)
├── architecture.md        # 시스템 아키텍처
├── database_schema.md     # 데이터베이스 스키마
├── api_reference.md       # API 엔드포인트
├── components.md          # 컴포넌트 라이브러리
├── state_management.md    # Zustand 상태관리
└── subscription_standard.md # 구독 비즈니스 로직
```

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| MVP 1.0 | 2025-12-09 | MVP 빌드 완료 |
| Docs 1.0 | 2025-12-17 | 기술 문서화 완료 |

---

**Last Updated**: 2025-12-17
