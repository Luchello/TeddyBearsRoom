# TeddyBear's Room - Project Overview

## Tech Stack
- **Framework**: Next.js 16.0.7 (App Router) + React 19.2
- **Database**: Supabase PostgreSQL + Prisma 7
- **Auth**: Supabase Auth + PASS 본인확인 (성인인증)
- **Payment**: TossPayments (빌링키 정기결제)
- **State**: Zustand 5 (Cart, UI state)
- **Styling**: Tailwind CSS 4 + Radix UI

## Current Status (2025-12-08)
- **Phase**: UI Clean Slate - 새 UI 재구현 대기
- **Backend**: API Routes 완성 (/api/products, /api/orders, /api/users)
- **Frontend**: 기본 컴포넌트 구현됨 (ProductCard, Header, Cart)
- **Data**: Mock data 사용 중 (DB 연동 준비됨)

## Key Architecture Decisions
1. Route Groups: (auth), (shop) 분리
2. Feature-based structure: /features/auth, /features/cart, /features/products
3. Compound Component pattern: ProductCard
4. Dual theme: Light (Pastel Wonderland) + Dark (Latex Luxe)

## Business Logic
- **Inner Circle (이너 서클)**: 구독 프로그램 브랜드
- **Roommate**: 구독 상품 (9,900원/월)
  - 10% 상시 할인
  - 1% 기부 참여
  - 3만원↑ 무료배송
