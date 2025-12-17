# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TeddyBear's Room** - 성인용품 E-commerce 플랫폼 (Korean Adult Products E-commerce)

| 항목 | 내용 |
|------|------|
| **Live** | https://teddybearsroom.com |
| **Stack** | Next.js 16 + Supabase + Prisma 7 |
| **Status** | ✅ MVP Complete (2025-12-09) |

## Commands

```bash
# Development (run from /web directory)
cd web
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (includes prisma generate)
npm run lint         # ESLint check

# Prisma (run from /web directory)
npx prisma generate  # Generate Prisma Client after schema changes
npx prisma db push   # Push schema changes without migration
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio    # Open DB GUI
npx tsx prisma/seed.ts  # Run seed script
```

## Architecture

### Tech Stack
```
┌──────────────────────────────────────────────────────────┐
│  Frontend: Next.js 16 (App Router) + Tailwind CSS 4     │
│  State: Zustand 5 (cart, wishlist, auth stores)         │
│  UI: shadcn/ui + Radix primitives                       │
├──────────────────────────────────────────────────────────┤
│  Backend: Next.js API Routes (/app/api/)                │
│  ORM: Prisma 7 with @prisma/adapter-pg                  │
│  Database: Supabase PostgreSQL                          │
│  Auth: Supabase Auth + PASS 본인확인                    │
│  Payment: TossPayments (billing key)                    │
└──────────────────────────────────────────────────────────┘
```

### Database Schema (Dual-Layer)

Prisma schema (`web/prisma/schema.prisma`) has two distinct model groups:

**1. E-commerce Models (PascalCase)** - Core shop functionality
- `Profile`, `Product`, `CartItem`, `WishlistItem`
- `Order`, `OrderItem`, `Subscription`
- `DonationOrg`, `DonationVote`

**2. Legacy/Analytics Models (snake_case, `ts_` prefix)** - Pre-existing Supabase tables
- `body_measurements` - RLS-protected encrypted body data
- `ts_products`, `ts_orders` - Analytics/automation tables
- `ts_inventory`, `ts_wholesalers` - Supply chain management

⚠️ **Important**: `ts_*` tables are managed externally. Focus new features on PascalCase models.

### State Management Pattern

Zustand stores with localStorage persistence (`web/src/stores/`):
- `cart-store.ts` - Cart items, coupon, totals calculation
- `wishlist-store.ts` - Wishlist items
- `filter-store.ts` - Product filtering state

**Key Pattern**: Stores use `version` + `migrate` function for persistence schema changes.

### Route Groups (Next.js App Router)

```
app/
├── (auth)/     # Auth pages: /login, /register
├── (shop)/     # Shop pages: /products, /cart, /checkout
└── api/        # API routes
```

Route groups `(name)` organize code without affecting URLs.

## Key Integrations

| System | Purpose | Notes |
|--------|---------|-------|
| **Supabase Auth** | Authentication | + PASS 본인확인 for age verification |
| **TossPayments** | Payments | Billing key for subscriptions, standard payments |
| **pgcrypto** | Encryption | Body measurements encrypted at DB level |

## Business Context

### Inner Circle (이너 서클) Subscription

```
Inner Circle = 구독 프로그램 브랜드
└── Roommate 🏠 = 9,900원/월
    ├── 10% discount (INNER_CIRCLE_DISCOUNT_RATE = 0.1)
    ├── Free shipping ≥ 30,000원 (vs 50,000원 regular)
    └── 1% donation participation
```

Constants in `web/src/types/cart.ts`:
- `FREE_SHIPPING_THRESHOLD = 50000`
- `INNER_CIRCLE_FREE_SHIPPING_THRESHOLD = 30000`

> 📌 Full details: `claudedocs/subscription_standard.md`

## Environment Variables

```bash
# Required in web/.env.local
DATABASE_URL=        # Supabase pooler (port 6543)
DIRECT_URL=          # Supabase direct (port 5432, for migrations)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Micro-Lessons

- **Zustand persist**: Version 변경 시 반드시 `migrate` 함수 제공
- **Tailwind CSS 4**: `@apply` 불가 → `@theme` directive로 CSS 변수 정의
- **Next.js 16 + `useSearchParams()`**: Suspense boundary 필수
- **Prisma 7**: `@prisma/adapter-pg` 사용, Pool 싱글톤 패턴 (`lib/prisma.ts`)
