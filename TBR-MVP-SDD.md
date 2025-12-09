# TBR (TeddyBearsRoom) MVP Software Design Document

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║     ████████╗██████╗ ██████╗                                              ║
║     ╚══██╔══╝██╔══██╗██╔══██╗                                             ║
║        ██║   ██████╔╝██████╔╝                                             ║
║        ██║   ██╔══██╗██╔══██╗                                             ║
║        ██║   ██████╔╝██║  ██║                                             ║
║        ╚═╝   ╚═════╝ ╚═╝  ╚═╝                                             ║
║                                                                           ║
║              🧸 TeddyBearsRoom / 테디베어스룸                              ║
║              MVP Software Design Document                                 ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 📋 Document Information

| 항목 | 내용 |
|------|------|
| **프로젝트명** | TBR (TeddyBearsRoom / 테디베어스룸) |
| **문서 버전** | 1.0.0 |
| **작성일** | 2025-12-08 |
| **작성자** | Luchello |
| **문서 유형** | Software Design Document (SDD) |

---

## 📑 Table of Contents

1. [Document Overview](#section-1-document-overview)
2. [System Overview](#section-2-system-overview)
3. [Architecture Design](#section-3-architecture-design)
4. [Component Design](#section-4-component-design)
5. [Authentication & Authorization](#section-5-authentication--authorization)
6. [Payment Integration](#section-6-payment-integration)
7. [State Management](#section-7-state-management)
8. [UI/UX Systems](#section-8-uiux-systems)
9. [API Design](#section-9-api-design)
10. [Testing Strategy](#section-10-testing-strategy)
11. [Deployment](#section-11-deployment)
12. [Appendix](#section-12-appendix)

---

# Section 1: Document Overview

## 1.1 프로젝트 개요

TBR(TeddyBearsRoom/테디베어스룸)은 **파스텔톤 감성의 성인용품 이커머스 플랫폼**입니다.

### 핵심 컨셉

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   "성인용품도 예쁘게, 감성적으로"                                         │
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│   │   파스텔    │    │    귀여운   │    │   안전한    │                 │
│   │   색상톤    │ +  │   브랜딩    │ +  │   쇼핑경험  │                 │
│   └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                         │
│   기존 성인용품 사이트의 어둡고 자극적인 분위기와 차별화                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 비즈니스 모델

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   💰 Revenue Streams                                                    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   1. 개별 상품 판매 (Primary)                                    │   │
│   │      └─ 성인용품 직접 판매                                       │   │
│   │                                                                 │   │
│   │   2. 이너 써클 Inner Circle (Secondary)                          │   │
│   │      └─ RoomMate 플랜: 월 ₩9,900 / 연 ₩89,100 (25% 할인)        │   │
│   │      └─ 이너 써클 멤버 전용 혜택 제공                            │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 1.2 MVP 범위

### 포함 기능 (12개)

| # | 기능 | 설명 |
|---|------|------|
| 1 | 회원가입/로그인 | 이메일 기반 인증 |
| 2 | PASS 성인인증 | 통신사 본인확인 |
| 3 | 상품 목록 | 카테고리별 조회 |
| 4 | 상품 상세 | 상세 정보 표시 |
| 5 | 장바구니 | 상품 담기/수정/삭제 |
| 6 | 주문/결제 | TossPayments 연동 |
| 7 | 주문 내역 | 주문 조회 |
| 8 | 이너 써클 가입 | 멤버십 결제/관리 |
| 9 | 마이페이지 | 회원 정보 관리 |
| 10 | 관리자 상품관리 | CRUD |
| 11 | 관리자 주문관리 | 주문 처리 |
| 12 | 관리자 회원관리 | 회원 조회 |

### 제외 기능 (V2 예정)

| 기능 | 제외 사유 |
|------|----------|
| 리뷰 시스템 | MVP 복잡도 감소 |
| 기부 기능 | V2에서 판매수익 1% 기부 |

## 1.3 성공 기준

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🎯 MVP Success Criteria                                               │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   월 매출 목표: ₩500,000                                         │   │
│   │   출시 일정: ASAP (기한 없음, 최대한 빠르게)                       │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 1.4 타겟 사용자

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   👥 Target Demographics                                                │
│                                                                         │
│   • 연령: 20~30대                                                       │
│   • 성별: 무관                                                          │
│   • 특징: 페티시/감성 지향, 프라이버시 중시                              │
│   • 니즈: 예쁘고 안전한 쇼핑 경험                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 2: System Overview

## 2.1 기술 스택

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🛠️ Tech Stack Overview                                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   FRONTEND                                                      │   │
│   │   ├─ Framework: Next.js 14 (App Router)                         │   │
│   │   ├─ Language: TypeScript                                       │   │
│   │   ├─ Styling: Tailwind CSS + shadcn/ui                          │   │
│   │   └─ State: Zustand + TanStack Query                            │   │
│   │                                                                 │   │
│   │   BACKEND                                                       │   │
│   │   ├─ Database: Supabase (PostgreSQL)                            │   │
│   │   ├─ Auth: Supabase Auth (@supabase/ssr)                        │   │
│   │   ├─ Storage: Supabase Storage                                  │   │
│   │   └─ Realtime: Supabase Realtime (필요시)                       │   │
│   │                                                                 │   │
│   │   EXTERNAL SERVICES                                             │   │
│   │   ├─ Payment: TossPayments                                      │   │
│   │   ├─ Adult Verification: PASS (통신사 본인확인)                  │   │
│   │   └─ Analytics: PostHog                                         │   │
│   │                                                                 │   │
│   │   DEPLOYMENT                                                    │   │
│   │   ├─ Hosting: Vercel                                            │   │
│   │   ├─ CI/CD: GitHub Actions                                      │   │
│   │   └─ Monitoring: Sentry                                         │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.2 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         TBR System Architecture                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         CLIENT LAYER                            │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │   │
│   │   │   Desktop   │  │   Mobile    │  │   Tablet    │            │   │
│   │   │   Browser   │  │   Browser   │  │   Browser   │            │   │
│   │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │   │
│   │          │                │                │                    │   │
│   │          └────────────────┼────────────────┘                    │   │
│   │                           ▼                                     │   │
│   └───────────────────────────┼─────────────────────────────────────┘   │
│                               │                                         │
│   ┌───────────────────────────┼─────────────────────────────────────┐   │
│   │                           ▼                                     │   │
│   │                    PRESENTATION LAYER                           │   │
│   │   ┌─────────────────────────────────────────────────────────┐   │   │
│   │   │                   Next.js 14 (Vercel)                   │   │   │
│   │   │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │   │   │
│   │   │  │   React    │ │   Server   │ │   Route Handlers   │   │   │   │
│   │   │  │ Components │ │ Components │ │   (API Routes)     │   │   │   │
│   │   │  └────────────┘ └────────────┘ └────────────────────┘   │   │   │
│   │   │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │   │   │
│   │   │  │  Zustand   │ │  TanStack  │ │   Server Actions   │   │   │   │
│   │   │  │  (Client)  │ │   Query    │ │   (Mutations)      │   │   │   │
│   │   │  └────────────┘ └────────────┘ └────────────────────┘   │   │   │
│   │   └─────────────────────────────────────────────────────────┘   │   │
│   └───────────────────────────┼─────────────────────────────────────┘   │
│                               │                                         │
│   ┌───────────────────────────┼─────────────────────────────────────┐   │
│   │                           ▼                                     │   │
│   │                      SERVICE LAYER                              │   │
│   │   ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐     │   │
│   │   │   Supabase    │ │  TossPayments │ │      PASS         │     │   │
│   │   │   (BaaS)      │ │   (Payment)   │ │ (Adult Verify)    │     │   │
│   │   │               │ │               │ │                   │     │   │
│   │   │ • PostgreSQL  │ │ • 단건결제    │ │ • 통신사 인증     │     │   │
│   │   │ • Auth        │ │ • 빌링키      │ │ • CI 연계정보     │     │   │
│   │   │ • Storage     │ │ • 웹훅        │ │                   │     │   │
│   │   │ • RLS         │ │               │ │                   │     │   │
│   │   └───────────────┘ └───────────────┘ └───────────────────┘     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.3 데이터 플로우

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Data Flow Architecture                           │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   READ FLOW (조회)                                                      │
│   ════════════════                                                      │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────┐  │
│   │  Client  │───▶│ Server Comp  │───▶│   Supabase   │───▶│  Data   │  │
│   │Component │    │  (RSC)       │    │   Client     │    │         │  │
│   └──────────┘    └──────────────┘    └──────────────┘    └─────────┘  │
│                                                                         │
│                                                                         │
│   WRITE FLOW (변경)                                                     │
│   ═════════════════                                                     │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────┐  │
│   │  Client  │───▶│   Server     │───▶│   Supabase   │───▶│  Data   │  │
│   │Component │    │   Actions    │    │   Client     │    │         │  │
│   └──────────┘    └──────────────┘    └──────────────┘    └─────────┘  │
│        │                                                       │        │
│        │              Revalidate                               │        │
│        └───────────────────────────────────────────────────────┘        │
│                                                                         │
│                                                                         │
│   PAYMENT FLOW (결제)                                                   │
│   ═══════════════════                                                   │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  Client  │───▶│ TossPayments │───▶│   Webhook    │                  │
│   │Component │    │    SDK       │    │   Handler    │                  │
│   └──────────┘    └──────────────┘    └──────┬───────┘                  │
│                                              │                          │
│                                              ▼                          │
│                                       ┌──────────────┐                  │
│                                       │   Supabase   │                  │
│                                       │ (주문 저장)  │                  │
│                                       └──────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 3: Architecture Design

## 3.1 폴더 구조

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   📁 Feature-Based Folder Structure                                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   tbr/                                                                  │
│   ├── 📁 app/                      # Next.js App Router                 │
│   │   ├── 📁 (auth)/               # Auth Route Group                   │
│   │   │   ├── login/                                                    │
│   │   │   ├── register/                                                 │
│   │   │   └── verify/                                                   │
│   │   ├── 📁 (shop)/               # Shop Route Group                   │
│   │   │   ├── products/                                                 │
│   │   │   ├── cart/                                                     │
│   │   │   └── checkout/                                                 │
│   │   ├── 📁 (account)/            # Account Route Group                │
│   │   │   ├── mypage/                                                   │
│   │   │   ├── orders/                                                   │
│   │   │   └── inner-circle/                                             │
│   │   ├── 📁 (admin)/              # Admin Route Group                  │
│   │   │   ├── products/                                                 │
│   │   │   ├── orders/                                                   │
│   │   │   └── users/                                                    │
│   │   ├── 📁 api/                  # Route Handlers                     │
│   │   │   ├── webhooks/                                                 │
│   │   │   │   ├── toss/                                                 │
│   │   │   │   └── pass/                                                 │
│   │   │   └── upload/                                                   │
│   │   ├── layout.tsx                                                    │
│   │   ├── page.tsx                                                      │
│   │   └── globals.css                                                   │
│   │                                                                     │
│   ├── 📁 features/                 # Feature Modules                    │
│   │   ├── 📁 auth/                                                      │
│   │   │   ├── components/                                               │
│   │   │   ├── hooks/                                                    │
│   │   │   ├── actions/                                                  │
│   │   │   ├── types/                                                    │
│   │   │   └── index.ts                                                  │
│   │   ├── 📁 products/                                                  │
│   │   │   ├── components/                                               │
│   │   │   ├── hooks/                                                    │
│   │   │   ├── actions/                                                  │
│   │   │   ├── types/                                                    │
│   │   │   └── index.ts                                                  │
│   │   ├── 📁 cart/                                                      │
│   │   ├── 📁 checkout/                                                  │
│   │   ├── 📁 orders/                                                    │
│   │   ├── 📁 inner-circle/                                              │
│   │   └── 📁 admin/                                                     │
│   │                                                                     │
│   ├── 📁 components/               # Shared Components                  │
│   │   ├── 📁 ui/                   # shadcn/ui Components               │
│   │   │   ├── button.tsx                                                │
│   │   │   ├── input.tsx                                                 │
│   │   │   ├── card.tsx                                                  │
│   │   │   └── ...                                                       │
│   │   ├── 📁 common/               # Common Components                  │
│   │   │   ├── Header.tsx                                                │
│   │   │   ├── Footer.tsx                                                │
│   │   │   ├── Logo.tsx                                                  │
│   │   │   └── ...                                                       │
│   │   └── 📁 layouts/              # Layout Components                  │
│   │       ├── ShopLayout.tsx                                            │
│   │       ├── AdminLayout.tsx                                           │
│   │       └── AuthLayout.tsx                                            │
│   │                                                                     │
│   ├── 📁 lib/                      # Utilities & Configs                │
│   │   ├── 📁 supabase/                                                  │
│   │   │   ├── client.ts            # Browser client                     │
│   │   │   ├── server.ts            # Server client                      │
│   │   │   ├── middleware.ts        # Middleware client                  │
│   │   │   └── admin.ts             # Admin client                       │
│   │   ├── 📁 toss/                                                      │
│   │   │   ├── client.ts                                                 │
│   │   │   └── types.ts                                                  │
│   │   ├── utils.ts                                                      │
│   │   └── constants.ts                                                  │
│   │                                                                     │
│   ├── 📁 stores/                   # Zustand Stores                     │
│   │   ├── cart-store.ts                                                 │
│   │   ├── ui-store.ts                                                   │
│   │   └── filter-store.ts                                               │
│   │                                                                     │
│   ├── 📁 hooks/                    # Global Hooks                       │
│   │   ├── use-auth.ts                                                   │
│   │   ├── use-media-query.ts                                            │
│   │   └── use-debounce.ts                                               │
│   │                                                                     │
│   ├── 📁 types/                    # Global Types                       │
│   │   ├── database.types.ts        # Supabase Generated                 │
│   │   ├── api.types.ts                                                  │
│   │   └── common.types.ts                                               │
│   │                                                                     │
│   ├── 📁 styles/                   # Global Styles                      │
│   │   └── theme.ts                 # Tailwind Theme                     │
│   │                                                                     │
│   ├── 📁 tests/                    # Test Files                         │
│   │   ├── 📁 unit/                                                      │
│   │   ├── 📁 integration/                                               │
│   │   └── 📁 e2e/                                                       │
│   │                                                                     │
│   ├── 📁 docs/                     # Documentation                      │
│   │   └── SDD.md                   # This file!                         │
│   │                                                                     │
│   ├── middleware.ts                # Next.js Middleware                 │
│   ├── next.config.js                                                    │
│   ├── tailwind.config.ts                                                │
│   ├── tsconfig.json                                                     │
│   └── package.json                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.2 디자인 패턴

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🎨 Design Patterns                                                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Container/Presentational Pattern                                   │
│   ═══════════════════════════════════                                   │
│                                                                         │
│   ┌────────────────────────┐      ┌────────────────────────┐            │
│   │    Container (Server)  │      │  Presentational (UI)   │            │
│   │    ──────────────────  │      │  ───────────────────   │            │
│   │    • Data fetching     │─────▶│  • Pure rendering      │            │
│   │    • Business logic    │      │  • Props-based         │            │
│   │    • Server Component  │      │  • Client Component    │            │
│   └────────────────────────┘      └────────────────────────┘            │
│                                                                         │
│   2. Custom Hooks Pattern                                               │
│   ═══════════════════════════                                           │
│                                                                         │
│   ┌────────────────────────┐                                            │
│   │      useProduct()      │                                            │
│   │    ──────────────────  │                                            │
│   │    • State logic       │                                            │
│   │    • Side effects      │                                            │
│   │    • Reusable across   │                                            │
│   │      components        │                                            │
│   └────────────────────────┘                                            │
│                                                                         │
│   3. Compound Component Pattern                                         │
│   ═══════════════════════════════                                       │
│                                                                         │
│   <ProductCard>                                                         │
│     <ProductCard.Image />                                               │
│     <ProductCard.Title />                                               │
│     <ProductCard.Price />                                               │
│     <ProductCard.Actions />                                             │
│   </ProductCard>                                                        │
│                                                                         │
│   4. Repository Pattern                                                 │
│   ══════════════════════                                                │
│                                                                         │
│   ┌────────────────────────┐                                            │
│   │   ProductRepository    │                                            │
│   │    ──────────────────  │                                            │
│   │    • getAll()          │                                            │
│   │    • getById()         │                                            │
│   │    • create()          │                                            │
│   │    • update()          │                                            │
│   │    • delete()          │                                            │
│   └────────────────────────┘                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 4: Component Design

## 4.1 컴포넌트 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🧩 Component Architecture (Atomic Design + Compound Pattern)          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   LEVEL 1: ATOMS (UI Primitives)                                        │
│   ══════════════════════════════                                        │
│   shadcn/ui 기반 기본 컴포넌트                                           │
│                                                                         │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │ Button  │ │  Input  │ │  Badge  │ │  Card   │ │ Avatar  │          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                                         │
│   LEVEL 2: MOLECULES (Composed Components)                              │
│   ════════════════════════════════════════                              │
│   Atoms 조합으로 구성                                                    │
│                                                                         │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│   │  FormField   │ │  SearchBar   │ │  PriceTag    │                    │
│   │  ──────────  │ │  ──────────  │ │  ──────────  │                    │
│   │  Label       │ │  Input       │ │  원가        │                    │
│   │  Input       │ │  Button      │ │  할인가      │                    │
│   │  Error       │ │  Dropdown    │ │  할인율      │                    │
│   └──────────────┘ └──────────────┘ └──────────────┘                    │
│                                                                         │
│   LEVEL 3: ORGANISMS (Feature Components)                               │
│   ═══════════════════════════════════════                               │
│   비즈니스 로직 포함                                                     │
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │  ProductCard (Compound Component)                             │     │
│   │  ─────────────────────────────────                            │     │
│   │  ┌─────────────────────────────────────────────────────────┐  │     │
│   │  │  <ProductCard>                                          │  │     │
│   │  │    <ProductCard.Image />      ← 상품 이미지             │  │     │
│   │  │    <ProductCard.Badge />      ← NEW/SALE 뱃지           │  │     │
│   │  │    <ProductCard.Title />      ← 상품명                  │  │     │
│   │  │    <ProductCard.Price />      ← 가격 정보               │  │     │
│   │  │    <ProductCard.Rating />     ← 평점 (V2)               │  │     │
│   │  │    <ProductCard.Actions />    ← 장바구니/찜하기         │  │     │
│   │  │  </ProductCard>                                         │  │     │
│   │  └─────────────────────────────────────────────────────────┘  │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   LEVEL 4: TEMPLATES (Page Layouts)                                     │
│   ═════════════════════════════════                                     │
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │  ShopLayout                                                   │     │
│   │  ──────────                                                   │     │
│   │  ┌─────────────────────────────────────────────────────────┐  │     │
│   │  │  Header                                                 │  │     │
│   │  ├─────────────────────────────────────────────────────────┤  │     │
│   │  │  ┌─────────┐  ┌───────────────────────────────────────┐ │  │     │
│   │  │  │ Sidebar │  │            Main Content               │ │  │     │
│   │  │  │ (필터)  │  │                                       │ │  │     │
│   │  │  └─────────┘  └───────────────────────────────────────┘ │  │     │
│   │  ├─────────────────────────────────────────────────────────┤  │     │
│   │  │  Footer                                                 │  │     │
│   │  └─────────────────────────────────────────────────────────┘  │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.2 컴포넌트 목록

### Common Components (16개)

| 컴포넌트 | 설명 | 타입 |
|----------|------|------|
| Header | 사이트 헤더 | Server |
| Footer | 사이트 푸터 | Server |
| Logo | 로고 컴포넌트 | Server |
| Navigation | 메뉴 네비게이션 | Client |
| SearchBar | 검색 바 | Client |
| CartIcon | 장바구니 아이콘 (수량 표시) | Client |
| UserMenu | 사용자 메뉴 드롭다운 | Client |
| Breadcrumb | 경로 표시 | Server |
| Pagination | 페이지네이션 | Client |
| LoadingSpinner | 로딩 스피너 | Client |
| ErrorBoundary | 에러 바운더리 | Client |
| EmptyState | 빈 상태 표시 | Server |
| Toast | 토스트 알림 | Client |
| Modal | 모달 컴포넌트 | Client |
| ConfirmDialog | 확인 다이얼로그 | Client |
| ImageWithFallback | 이미지 (폴백 포함) | Client |

### Feature Components (38개)

#### Auth (6개)
- LoginForm
- RegisterForm
- PasswordResetForm
- AdultVerificationButton
- AuthGuard
- SessionProvider

#### Products (8개)
- ProductCard (Compound)
- ProductGrid
- ProductDetail
- ProductGallery
- ProductInfo
- ProductFilter
- CategoryNav
- SortDropdown

#### Cart (5개)
- CartDrawer
- CartItem
- CartSummary
- QuantitySelector
- EmptyCart

#### Checkout (6개)
- CheckoutForm
- AddressForm
- PaymentSection
- OrderSummary
- TossPaymentWidget
- OrderComplete

#### Orders (4개)
- OrderList
- OrderCard
- OrderDetail
- OrderStatus

#### Inner Circle (5개)
- PlanCard
- PlanComparison
- SubscriptionStatus
- BillingHistory
- CancelSubscription

#### Admin (4개)
- AdminSidebar
- DataTable
- StatsCard
- ChartWidget

## 4.3 컴포넌트 예시 코드

### ProductCard (Compound Component)

```typescript
// features/products/components/ProductCard/index.tsx

import { createContext, useContext, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

// Context
interface ProductCardContextType {
  product: Product;
  isHovered: boolean;
}

const ProductCardContext = createContext<ProductCardContextType | null>(null);

const useProductCard = () => {
  const context = useContext(ProductCardContext);
  if (!context) {
    throw new Error('ProductCard 컴포넌트 내에서 사용해주세요');
  }
  return context;
};

// Root Component
interface ProductCardProps {
  product: Product;
  children: ReactNode;
  className?: string;
}

export function ProductCard({ product, children, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ProductCardContext.Provider value={{ product, isHovered }}>
      <article
        className={cn(
          'group relative rounded-2xl bg-white',
          'border border-tbr-beige-200',
          'transition-all duration-300',
          'hover:shadow-lg hover:border-tbr-mint-300',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          {children}
        </Link>
      </article>
    </ProductCardContext.Provider>
  );
}

// Sub Components
ProductCard.Image = function ProductCardImage({ className }: { className?: string }) {
  const { product, isHovered } = useProductCard();
  
  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-t-2xl', className)}>
      <Image
        src={product.thumbnail_url}
        alt={product.name}
        fill
        className={cn(
          'object-cover transition-transform duration-500',
          isHovered && 'scale-105'
        )}
      />
    </div>
  );
};

ProductCard.Badge = function ProductCardBadge() {
  const { product } = useProductCard();
  
  if (!product.is_new && !product.discount_rate) return null;
  
  return (
    <div className="absolute top-3 left-3 flex gap-2">
      {product.is_new && (
        <Badge variant="mint">NEW</Badge>
      )}
      {product.discount_rate > 0 && (
        <Badge variant="pink">{product.discount_rate}%</Badge>
      )}
    </div>
  );
};

ProductCard.Title = function ProductCardTitle({ className }: { className?: string }) {
  const { product } = useProductCard();
  
  return (
    <h3 className={cn(
      'font-medium text-tbr-gray-900 line-clamp-2',
      className
    )}>
      {product.name}
    </h3>
  );
};

ProductCard.Price = function ProductCardPrice({ className }: { className?: string }) {
  const { product } = useProductCard();
  const hasDiscount = product.discount_rate > 0;
  
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {hasDiscount && (
        <span className="text-sm text-tbr-gray-400 line-through">
          ₩{product.original_price.toLocaleString()}
        </span>
      )}
      <span className="text-lg font-bold text-tbr-gray-900">
        ₩{product.price.toLocaleString()}
      </span>
    </div>
  );
};

ProductCard.Actions = function ProductCardActions({ className }: { className?: string }) {
  const { product, isHovered } = useProductCard();
  
  return (
    <div className={cn(
      'absolute bottom-4 right-4 flex gap-2',
      'opacity-0 translate-y-2 transition-all duration-300',
      isHovered && 'opacity-100 translate-y-0',
      className
    )}>
      <Button
        size="icon"
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
          // 찜하기 로직
        }}
      >
        <Heart className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="mint"
        onClick={(e) => {
          e.preventDefault();
          // 장바구니 담기 로직
        }}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Usage Example
export function ProductCardDefault({ product }: { product: Product }) {
  return (
    <ProductCard product={product}>
      <ProductCard.Image />
      <ProductCard.Badge />
      <div className="p-4 space-y-2">
        <ProductCard.Title />
        <ProductCard.Price />
      </div>
      <ProductCard.Actions />
    </ProductCard>
  );
}
```

---

# Section 5: Authentication & Authorization

## 5.1 인증 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    TBR Authentication Architecture                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │                     Authentication Flow                       │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   STEP 1: 회원가입/로그인 (Supabase Auth)                               │
│   ═══════════════════════════════════════                               │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  Client  │───▶│ Supabase Auth│───▶│  JWT Token   │                  │
│   │  (Form)  │    │   Server     │    │   발급       │                  │
│   └──────────┘    └──────────────┘    └──────────────┘                  │
│                                                                         │
│   STEP 2: 성인인증 (PASS)                                               │
│   ═══════════════════════                                               │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  Client  │───▶│    PASS      │───▶│  CI 정보     │                  │
│   │  (본인확인)│   │ (통신사 인증)│    │   저장       │                  │
│   └──────────┘    └──────────────┘    └──────────────┘                  │
│                                                                         │
│   STEP 3: 권한 확인                                                     │
│   ═════════════════                                                     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                                                              │      │
│   │   User States:                                               │      │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │      │
│   │   │  ANONYMOUS  │─▶│  LOGGED_IN  │─▶│  ADULT_VERIFIED     │  │      │
│   │   │  (비회원)   │  │  (회원)     │  │  (성인인증완료)     │  │      │
│   │   └─────────────┘  └─────────────┘  └─────────────────────┘  │      │
│   │                                                              │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Supabase Auth 설정

### 클라이언트 설정

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    }
  );
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
```

## 5.3 PASS 성인인증

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     PASS Adult Verification Flow                        │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐                                                          │
│   │  Client  │                                                          │
│   │  (TBR)   │                                                          │
│   └────┬─────┘                                                          │
│        │                                                                │
│        │ 1. 본인인증 요청                                               │
│        ▼                                                                │
│   ┌──────────────┐                                                      │
│   │   PASS API   │                                                      │
│   │  (인증 팝업) │                                                      │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          │ 2. 통신사 선택 (SKT/KT/LG U+)                                │
│          ▼                                                              │
│   ┌──────────────┐                                                      │
│   │   통신사     │                                                      │
│   │  인증 서버   │                                                      │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          │ 3. SMS 인증                                                  │
│          ▼                                                              │
│   ┌──────────────┐                                                      │
│   │   인증완료   │                                                      │
│   │   Callback   │                                                      │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          │ 4. CI(연계정보) + 생년월일 반환                              │
│          ▼                                                              │
│   ┌──────────────┐    ┌──────────────┐                                  │
│   │   TBR API    │───▶│   Supabase   │                                  │
│   │  (Callback)  │    │  (CI 저장)   │                                  │
│   └──────────────┘    └──────────────┘                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### PASS 콜백 핸들러

```typescript
// app/api/webhooks/pass/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface PASSCallbackData {
  resultCode: string;
  resultMsg: string;
  ci: string;           // 연계정보 (88 bytes)
  di: string;           // 중복가입확인정보
  birthDate: string;    // YYYYMMDD
  gender: string;       // 1: 남성, 2: 여성
  name: string;
  phone: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: PASSCallbackData = await request.json();

    // 1. 결과 코드 확인
    if (data.resultCode !== '0000') {
      return NextResponse.json(
        { error: data.resultMsg },
        { status: 400 }
      );
    }

    // 2. 성인 여부 확인 (만 19세 이상)
    const birthYear = parseInt(data.birthDate.substring(0, 4));
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 19) {
      return NextResponse.json(
        { error: '성인만 이용 가능한 서비스입니다.' },
        { status: 403 }
      );
    }

    // 3. 사용자 정보 업데이트
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 4. CI 정보 저장 (암호화)
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ci: data.ci,
        is_adult_verified: true,
        adult_verified_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PASS callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 5.4 Protected Routes

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// 보호가 필요한 경로
const PROTECTED_ROUTES = [
  '/mypage',
  '/orders',
  '/inner-circle',
  '/checkout',
];

// 성인인증이 필요한 경로
const ADULT_ONLY_ROUTES = [
  '/products',
  '/cart',
  '/checkout',
];

// 관리자 전용 경로
const ADMIN_ROUTES = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // 1. 로그인 필요 경로 체크
  const isProtected = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. 성인인증 필요 경로 체크
  const isAdultOnly = ADULT_ONLY_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isAdultOnly && user) {
    // 성인인증 상태 확인 로직
    // (실제 구현시 user_profiles 테이블 조회)
  }

  // 3. 관리자 경로 체크
  const isAdmin = ADMIN_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isAdmin) {
    // 관리자 권한 확인 로직
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

# Section 6: Payment Integration

## 6.1 결제 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     TossPayments Integration                            │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SINGLE PAYMENT FLOW (단건 결제)                                       │
│   ═══════════════════════════════                                       │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  Client  │───▶│ TossPayments │───▶│   결제창     │                  │
│   │ (주문서) │    │    SDK       │    │              │                  │
│   └──────────┘    └──────────────┘    └──────┬───────┘                  │
│                                              │                          │
│                              결제 성공       │                          │
│                                              ▼                          │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │ Supabase │◀───│   TBR API    │◀───│  Callback    │                  │
│   │ (주문저장)│    │ (결제 승인) │    │  (paymentKey)│                  │
│   └──────────┘    └──────────────┘    └──────────────┘                  │
│                                                                         │
│                                                                         │
│   SUBSCRIPTION FLOW (구독 결제)                                         │
│   ═════════════════════════════                                         │
│                                                                         │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  Client  │───▶│ TossPayments │───▶│   카드등록   │                  │
│   │ (구독신청)│    │    SDK       │    │   (빌링키)  │                  │
│   └──────────┘    └──────────────┘    └──────┬───────┘                  │
│                                              │                          │
│                              빌링키 발급     │                          │
│                                              ▼                          │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │ Supabase │◀───│   TBR API    │◀───│  Callback    │                  │
│   │(빌링키저장)    │ (첫 결제)   │    │ (billingKey) │                  │
│   └──────────┘    └──────────────┘    └──────────────┘                  │
│                          │                                              │
│                          │ 매월 자동결제                                │
│                          ▼                                              │
│                   ┌──────────────┐                                      │
│                   │ Vercel Cron  │                                      │
│                   │ (정기 결제)  │                                      │
│                   └──────────────┘                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.2 TossPayments 설정

```typescript
// lib/toss/client.ts
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export async function initTossPayments() {
  const tossPayments = await loadTossPayments(clientKey);
  return tossPayments;
}

// 단건 결제 요청
export async function requestPayment(options: {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
}) {
  const tossPayments = await initTossPayments();
  const payment = tossPayments.payment({ customerKey: options.customerEmail });

  await payment.requestPayment({
    method: 'CARD',
    amount: {
      value: options.amount,
      currency: 'KRW',
    },
    orderId: options.orderId,
    orderName: options.orderName,
    successUrl: `${window.location.origin}/checkout/success`,
    failUrl: `${window.location.origin}/checkout/fail`,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
  });
}

// 빌링키 발급 요청 (구독)
export async function requestBillingAuth(options: {
  customerKey: string;
  customerName: string;
  customerEmail: string;
}) {
  const tossPayments = await initTossPayments();
  const payment = tossPayments.payment({ customerKey: options.customerKey });

  await payment.requestBillingAuth({
    method: 'CARD',
    successUrl: `${window.location.origin}/inner-circle/success`,
    failUrl: `${window.location.origin}/inner-circle/fail`,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
  });
}
```

## 6.3 결제 승인 API

```typescript
// app/api/payments/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 1. 토스페이먼츠 결제 승인 요청
    const response = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const paymentResult = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: paymentResult.message },
        { status: response.status }
      );
    }

    // 2. 주문 정보 저장
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('orders')
      .update({
        payment_key: paymentKey,
        status: 'PAID',
        paid_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)
      .eq('user_id', user?.id);

    if (error) throw error;

    return NextResponse.json({ success: true, payment: paymentResult });
  } catch (error) {
    console.error('Payment confirm error:', error);
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}
```

## 6.4 이너 써클 플랜

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       RoomMate Inner Circle Plans                       │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────┐    ┌─────────────────────────┐            │
│   │                         │    │                         │            │
│   │     MONTHLY PLAN        │    │     YEARLY PLAN         │            │
│   │     ────────────        │    │     ──────────          │            │
│   │                         │    │                         │            │
│   │     ₩9,900 / 월         │    │     ₩89,100 / 년        │            │
│   │                         │    │     (₩7,425/월)         │            │
│   │                         │    │                         │            │
│   │                         │    │     🏷️ 25% 할인         │            │
│   │                         │    │                         │            │
│   └─────────────────────────┘    └─────────────────────────┘            │
│                                                                         │
│   이너 써클 멤버 혜택:                                                  │
│   • 전 상품 10% 할인                                                    │
│   • 무료 배송                                                           │
│   • 신상품 우선 알림                                                    │
│   • 이너 써클 전용 상품                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 7: State Management

## 7.1 상태 관리 전략

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    State Management Architecture                        │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   SERVER STATE (TanStack Query)                                 │   │
│   │   ═════════════════════════════                                 │   │
│   │                                                                 │   │
│   │   • Products (상품 목록, 상세)                                  │   │
│   │   • Orders (주문 내역)                                          │   │
│   │   • User Profile (사용자 정보)                                  │   │
│   │   • Inner Circle (멤버십 상태)                                  │   │
│   │                                                                 │   │
│   │   특징: 캐싱, 자동 리페칭, 낙관적 업데이트                       │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   CLIENT STATE (Zustand)                                        │   │
│   │   ══════════════════════                                        │   │
│   │                                                                 │   │
│   │   • Cart Store (장바구니)                                       │   │
│   │   • UI Store (모달, 토스트, 사이드바)                           │   │
│   │   • Filter Store (상품 필터링)                                  │   │
│   │                                                                 │   │
│   │   특징: 클라이언트 전용, localStorage 연동                      │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Zustand Stores

### Cart Store

```typescript
// stores/cart-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
  options?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'tbr-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

### UI Store

```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  type: 'confirm' | 'alert' | 'custom' | null;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Modal
  modal: ModalState;
  openModal: (config: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
  
  // Toast
  toasts: ToastState[];
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Mobile Menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Modal
  modal: { isOpen: false, type: null },
  openModal: (config) =>
    set({ modal: { ...config, isOpen: true } }),
  closeModal: () =>
    set({ modal: { isOpen: false, type: null } }),

  // Toast
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Mobile Menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
```

## 7.3 TanStack Query Hooks

```typescript
// features/products/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductFilters } from '../types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Fetch Products
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const supabase = createClient();
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.sort) {
        const [field, order] = filters.sort.split('-');
        query = query.order(field, { ascending: order === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// Fetch Single Product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}
```

---

# Section 8: UI/UX Systems

## 8.1 디자인 시스템 개요

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       TBR Design System                                 │
│                                                                         │
│                    "Soft, Cute, Safe" 🧸                                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   DESIGN PHILOSOPHY                                                     │
│   ═════════════════                                                     │
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│   │    Soft     │    │    Cute     │    │    Safe     │                 │
│   │   ───────   │    │   ───────   │    │   ───────   │                 │
│   │  파스텔톤   │    │  귀여운     │    │  안전한     │                 │
│   │  부드러운   │    │  친근한     │    │  신뢰감     │                 │
│   │  라운드     │    │  감성적     │    │  프라이버시 │                 │
│   └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8.2 컬러 팔레트

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          Color Palette                                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   PRIMARY: BEIGE (Brand Color)                                          │
│   ════════════════════════════                                          │
│                                                                         │
│   ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐        │
│   │ 50  │ 100 │ 200 │ 300 │ 400 │ 500 │ 600 │ 700 │ 800 │ 900 │        │
│   │     │     │     │     │     │     │     │     │     │     │        │
│   │#FDF │#FAF │#F5E │#EED │#E6D │#D4C │#B8A │#9C8 │#806 │#644 │        │
│   │BF6  │5EB  │DCD  │5BC  │1A7  │4A0  │B8C  │A74  │F5C  │E4A  │        │
│   └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘        │
│                                                                         │
│   SECONDARY: MINT (CTA Color)                                           │
│   ═══════════════════════════                                           │
│                                                                         │
│   ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐        │
│   │ 50  │ 100 │ 200 │ 300 │ 400 │ 500 │ 600 │ 700 │ 800 │ 900 │        │
│   │     │     │     │     │     │     │     │     │     │     │        │
│   │#F0F │#CCF │#99E │#66D │#33C │#00B │#009 │#008 │#006 │#004 │        │
│   │DFA  │AEF  │8E4  │8D9  │8CE  │8A8  │9A0  │485  │E6A  │D4F  │        │
│   └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘        │
│                                                                         │
│   ACCENT: PINK (Favorite/Heart)                                         │
│   ═════════════════════════════                                         │
│                                                                         │
│   ┌─────┬─────┬─────┬─────┬─────┐                                       │
│   │ 100 │ 200 │ 300 │ 400 │ 500 │                                       │
│   │     │     │     │     │     │                                       │
│   │#FDF │#FBC │#F9A │#F78 │#F56 │                                       │
│   │2F4  │DD9  │8BE  │3A3  │088  │                                       │
│   └─────┴─────┴─────┴─────┴─────┘                                       │
│                                                                         │
│   SPECIAL: LAVENDER (Premium/Inner Circle)                              │
│   ════════════════════════════════════════                              │
│                                                                         │
│   ┌─────┬─────┬─────┬─────┬─────┐                                       │
│   │ 100 │ 200 │ 300 │ 400 │ 500 │                                       │
│   │     │     │     │     │     │                                       │
│   │#F3E │#E9D │#DFC │#D5B │#CBA │                                       │
│   │8FF  │5FF  │2FF  │FFF  │FFF  │                                       │
│   └─────┴─────┴─────┴─────┴─────┘                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8.3 Tailwind 설정

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TBR Brand Colors
        tbr: {
          beige: {
            50: '#FDFBF6',
            100: '#FAF5EB',
            200: '#F5EDCD',
            300: '#EED5BC',
            400: '#E6D1A7',
            500: '#D4C4A0',
            600: '#B8AB8C',
            700: '#9C8A74',
            800: '#806F5C',
            900: '#644E4A',
          },
          mint: {
            50: '#F0FDFA',
            100: '#CCFAEF',
            200: '#99E8E4',
            300: '#66D8D9',
            400: '#33C8CE',
            500: '#00B8A8',
            600: '#009A90',
            700: '#008485',
            800: '#006E6A',
            900: '#004D4F',
          },
          pink: {
            100: '#FDF2F4',
            200: '#FBCDD9',
            300: '#F9A8BE',
            400: '#F783A3',
            500: '#F56088',
          },
          lavender: {
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#DFC2FF',
            400: '#D5BFFF',
            500: '#CBBFFF',
          },
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'tbr': '1rem',        // 16px - 기본 라운딩
        'tbr-lg': '1.5rem',   // 24px - 카드
        'tbr-xl': '2rem',     // 32px - 모달
      },
      boxShadow: {
        'tbr': '0 4px 20px rgba(212, 196, 160, 0.15)',
        'tbr-hover': '0 8px 30px rgba(212, 196, 160, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

## 8.4 반응형 브레이크포인트

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      Responsive Breakpoints                             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────┬────────────┬──────────────────────────────────────────┐   │
│   │ Name    │ Width      │ Target Devices                           │   │
│   ├─────────┼────────────┼──────────────────────────────────────────┤   │
│   │ sm      │ ≥ 640px    │ Large phones (landscape)                 │   │
│   │ md      │ ≥ 768px    │ Tablets                                  │   │
│   │ lg      │ ≥ 1024px   │ Laptops, small desktops                  │   │
│   │ xl      │ ≥ 1280px   │ Desktops                                 │   │
│   │ 2xl     │ ≥ 1536px   │ Large desktops                           │   │
│   └─────────┴────────────┴──────────────────────────────────────────┘   │
│                                                                         │
│   Grid Columns:                                                         │
│   • Mobile (< 640px): 1-2 columns                                       │
│   • Tablet (768px): 2-3 columns                                         │
│   • Desktop (1024px+): 3-4 columns                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 9: API Design

## 9.1 API 전략

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       Hybrid API Strategy                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   SERVER ACTIONS (내부 데이터 변경)                             │   │
│   │   ═══════════════════════════════                               │   │
│   │                                                                 │   │
│   │   • 장바구니 추가/수정/삭제                                     │   │
│   │   • 주문 생성                                                   │   │
│   │   • 사용자 정보 업데이트                                        │   │
│   │   • 관리자 CRUD 작업                                            │   │
│   │                                                                 │   │
│   │   장점: 타입 안전성, 간결한 코드, 자동 재검증                   │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   ROUTE HANDLERS (외부 연동)                                    │   │
│   │   ═════════════════════════                                     │   │
│   │                                                                 │   │
│   │   • TossPayments 웹훅                                           │   │
│   │   • PASS 성인인증 콜백                                          │   │
│   │   • 파일 업로드                                                 │   │
│   │   • 외부 서비스 연동                                            │   │
│   │                                                                 │   │
│   │   장점: 표준 HTTP, 웹훅 지원, 외부 접근 가능                    │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Server Actions 예시

```typescript
// features/cart/actions/index.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema
const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1).max(99),
  options: z.record(z.string()).optional(),
});

// Response Type
interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Add to Cart Action
export async function addToCart(
  input: z.infer<typeof AddToCartSchema>
): Promise<ActionResponse> {
  try {
    // 1. 입력 검증
    const validated = AddToCartSchema.parse(input);

    // 2. 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // 3. 상품 존재 확인
    const { data: product } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', validated.productId)
      .single();

    if (!product) {
      return { success: false, error: '상품을 찾을 수 없습니다.' };
    }

    if (product.stock < validated.quantity) {
      return { success: false, error: '재고가 부족합니다.' };
    }

    // 4. 장바구니 추가/업데이트
    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: validated.productId,
        quantity: validated.quantity,
        options: validated.options,
      }, {
        onConflict: 'user_id,product_id',
      });

    if (error) throw error;

    // 5. 캐시 무효화
    revalidatePath('/cart');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: '입력값이 올바르지 않습니다.' };
    }
    console.error('addToCart error:', error);
    return { success: false, error: '장바구니 추가에 실패했습니다.' };
  }
}
```

## 9.3 API 응답 표준

```typescript
// types/api.types.ts

// 성공 응답
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// 에러 응답
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// HTTP Status Codes
// 200 OK - 성공
// 201 Created - 생성 성공
// 204 No Content - 삭제 성공
// 400 Bad Request - 잘못된 요청
// 401 Unauthorized - 인증 필요
// 403 Forbidden - 권한 없음
// 404 Not Found - 리소스 없음
// 409 Conflict - 충돌
// 422 Unprocessable Entity - 검증 실패
// 500 Internal Server Error - 서버 에러
```

---

# Section 10: Testing Strategy

## 10.1 테스트 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Testing Architecture                             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                          ┌─────────────┐                                │
│                          │    E2E      │  ← Playwright                  │
│                          │   Tests     │    (사용자 시나리오)           │
│                          └──────┬──────┘                                │
│                                 │                                       │
│                    ┌────────────┴────────────┐                          │
│                    │      Integration        │  ← Vitest + MSW          │
│                    │        Tests            │    (API 연동)            │
│                    └────────────┬────────────┘                          │
│                                 │                                       │
│         ┌───────────────────────┴───────────────────────┐               │
│         │                  Unit Tests                   │  ← Vitest     │
│         │                                               │    (개별 기능) │
│         └───────────────────────────────────────────────┘               │
│                                                                         │
│   테스트 커버리지 목표: 90%+                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 10.2 테스트 도구

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          Testing Tools                                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Unit & Integration:                                                   │
│   • Vitest - 테스트 프레임워크                                          │
│   • React Testing Library - 컴포넌트 테스트                             │
│   • MSW (Mock Service Worker) - API 모킹                                │
│   • @faker-js/faker - 테스트 데이터 생성                                │
│                                                                         │
│   E2E:                                                                  │
│   • Playwright - E2E 테스트                                             │
│   • Page Object Model 패턴                                              │
│                                                                         │
│   Coverage:                                                             │
│   • @vitest/coverage-v8                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 10.3 테스트 파일 구조

```
tests/
├── unit/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   ├── CartItem.test.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useCart.test.ts
│   │   ├── useProducts.test.ts
│   │   └── ...
│   └── utils/
│       ├── formatPrice.test.ts
│       └── ...
├── integration/
│   ├── cart.test.ts
│   ├── checkout.test.ts
│   └── ...
├── e2e/
│   ├── auth.spec.ts
│   ├── purchase-flow.spec.ts
│   ├── inner-circle.spec.ts
│   └── pages/
│       ├── HomePage.ts
│       ├── ProductPage.ts
│       └── CheckoutPage.ts
├── mocks/
│   ├── handlers.ts
│   ├── server.ts
│   └── data/
│       ├── products.ts
│       └── users.ts
└── setup.ts
```

## 10.4 테스트 예시

### Unit Test (Vitest)

```typescript
// tests/unit/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '@/features/products/components/ProductCard';
import { mockProduct } from '@/tests/mocks/data/products';

describe('ProductCard', () => {
  it('상품 정보를 올바르게 렌더링한다', () => {
    render(
      <ProductCard product={mockProduct}>
        <ProductCard.Image />
        <ProductCard.Title />
        <ProductCard.Price />
      </ProductCard>
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`₩${mockProduct.price.toLocaleString()}`)).toBeInTheDocument();
  });

  it('할인 상품은 할인율 뱃지를 표시한다', () => {
    const discountProduct = { ...mockProduct, discount_rate: 20 };
    
    render(
      <ProductCard product={discountProduct}>
        <ProductCard.Badge />
      </ProductCard>
    );

    expect(screen.getByText('20%')).toBeInTheDocument();
  });
});
```

### E2E Test (Playwright)

```typescript
// tests/e2e/purchase-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('구매 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('상품을 장바구니에 담고 결제할 수 있다', async ({ page }) => {
    // 1. 상품 페이지 이동
    await page.goto('/products/test-product-id');
    
    // 2. 장바구니 담기
    await page.click('button:has-text("장바구니 담기")');
    await expect(page.locator('.toast')).toContainText('장바구니에 담았습니다');
    
    // 3. 장바구니 이동
    await page.click('[data-testid="cart-icon"]');
    await expect(page).toHaveURL('/cart');
    
    // 4. 결제 진행
    await page.click('button:has-text("결제하기")');
    await expect(page).toHaveURL('/checkout');
    
    // 5. 주문 정보 입력
    await page.fill('[name="name"]', '테스트 사용자');
    await page.fill('[name="phone"]', '010-1234-5678');
    await page.fill('[name="address"]', '서울시 강남구');
  });
});
```

---

# Section 11: Deployment

## 11.1 배포 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    TBR 3-Tier Deployment Architecture                   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │                        Git Repository                           │   │
│   │                         (GitHub)                                │   │
│   │                                                                 │   │
│   │   ┌───────────┐    ┌───────────┐    ┌───────────────────────┐   │   │
│   │   │  feature  │───▶│  develop  │───▶│        main           │   │   │
│   │   │ branches  │    │  branch   │    │       branch          │   │   │
│   │   └───────────┘    └─────┬─────┘    └───────────┬───────────┘   │   │
│   │                          │                      │               │   │
│   └──────────────────────────┼──────────────────────┼───────────────┘   │
│                              │                      │                   │
│                              ▼                      ▼                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      GitHub Actions                             │   │
│   │                                                                 │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │   │
│   │   │    Lint     │─▶│    Test     │─▶│      Deploy         │     │   │
│   │   │  & Format   │  │  & Build    │  │                     │     │   │
│   │   └─────────────┘  └─────────────┘  └──────────┬──────────┘     │   │
│   │                                                │                │   │
│   └────────────────────────────────────────────────┼────────────────┘   │
│                                                    │                    │
│   ┌────────────────────────────────────────────────┼────────────────┐   │
│   │                                                ▼                │   │
│   │                         Vercel                                  │   │
│   │                                                                 │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │   │
│   │   │ Development │  │   Staging   │  │    Production       │     │   │
│   │   │             │  │             │  │                     │     │   │
│   │   │  dev.tbr    │  │ staging.tbr │  │   teddybearsroom    │     │   │
│   │   │   .shop     │  │    .shop    │  │      .shop          │     │   │
│   │   └─────────────┘  └─────────────┘  └─────────────────────┘     │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 11.2 환경별 설정

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      Environment Configuration                          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ DEVELOPMENT                                                     │   │
│   │ ═══════════                                                     │   │
│   │ Branch: develop, feature/*                                      │   │
│   │ URL: dev.teddybearsroom.shop                                    │   │
│   │ Database: Supabase (dev project)                                │   │
│   │ Payment: TossPayments (테스트 모드)                              │   │
│   │ Logging: Debug level                                            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ STAGING                                                         │   │
│   │ ═══════                                                         │   │
│   │ Branch: develop (auto-deploy)                                   │   │
│   │ URL: staging.teddybearsroom.shop                                │   │
│   │ Database: Supabase (staging project)                            │   │
│   │ Payment: TossPayments (테스트 모드)                              │   │
│   │ Logging: Info level                                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ PRODUCTION                                                      │   │
│   │ ══════════                                                      │   │
│   │ Branch: main (manual deploy)                                    │   │
│   │ URL: teddybearsroom.shop                                        │   │
│   │ Database: Supabase (prod project)                               │   │
│   │ Payment: TossPayments (실제 결제)                                │   │
│   │ Logging: Error level                                            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 11.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          alias-domains: staging.teddybearsroom.shop

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 11.4 모니터링 설정

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        Monitoring Stack                                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   Vercel Analytics                                              │   │
│   │   ─────────────────                                             │   │
│   │   • Core Web Vitals (LCP, FID, CLS)                             │   │
│   │   • 페이지별 성능 메트릭                                         │   │
│   │   • 실시간 트래픽 모니터링                                       │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   Sentry                                                        │   │
│   │   ──────                                                        │   │
│   │   • Error tracking                                              │   │
│   │   • Performance monitoring                                      │   │
│   │   • Release tracking                                            │   │
│   │   • Source map 연동                                             │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   PostHog                                                       │   │
│   │   ───────                                                       │   │
│   │   • Product analytics                                           │   │
│   │   • User behavior tracking                                      │   │
│   │   • Feature flags                                               │   │
│   │   • Session recording                                           │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   BetterStack (Uptime)                                          │   │
│   │   ────────────────────                                          │   │
│   │   • Uptime monitoring                                           │   │
│   │   • SSL certificate monitoring                                  │   │
│   │   • Incident alerts (Slack/Email)                               │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 11.5 배포 체크리스트

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      Deployment Checklist                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   PRE-DEPLOYMENT                                                        │
│   ══════════════                                                        │
│   □ 모든 테스트 통과 확인                                               │
│   □ 환경 변수 설정 확인                                                 │
│   □ DB 마이그레이션 완료                                                │
│   □ API 키 유효성 확인                                                  │
│   □ 빌드 에러 없음 확인                                                 │
│                                                                         │
│   POST-DEPLOYMENT                                                       │
│   ═══════════════                                                       │
│   □ 배포 완료 확인                                                      │
│   □ 헬스체크 엔드포인트 확인                                            │
│   □ 주요 기능 동작 확인                                                 │
│   □ 결제 테스트 (스테이징)                                              │
│   □ 에러 로그 확인                                                      │
│   □ 성능 메트릭 확인                                                    │
│                                                                         │
│   ROLLBACK CRITERIA                                                     │
│   ═════════════════                                                     │
│   □ 5xx 에러 급증                                                       │
│   □ 결제 실패율 증가                                                    │
│   □ 페이지 로드 시간 3초 초과                                           │
│   □ 주요 기능 장애                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section 12: Appendix

## 12.1 Q&A 결정 사항 요약

| Q# | 질문 | 결정 |
|----|------|------|
| Q1 | 브랜드 컨셉 | 파스텔톤 감성, "성인용품도 예쁘게" |
| Q2 | MVP vs Full | MVP 우선 |
| Q2-1 | MVP 기능 범위 | 12개 포함, 2개 제외 (리뷰, 기부) |
| Q2-2 | MVP 일정 | ASAP (기한 없음, 빠르게) |
| Q2-3 | MVP 성공 기준 | 월 매출 50만원 |
| Q3 | 이너 써클 | RoomMate (단일) |
| Q3-1 | 멤버십 상세 | 월 9,900원 / 연 89,100원 (25% 할인) |
| Q4 | 기부 여부 | V2에서 구현 예정 |
| Q5 | 퍼리 마케팅 | 활용 예정 |
| Q6 | 기부 비율 | 판매수익 1% |
| Q7 | 타겟 사용자 | 20~30대, 성별 무관, 페티시 지향 |
| Q8 | 배포 환경 | Vercel |
| Q9 | Styling & State | Tailwind+shadcn/ui, Zustand+TanStack Query |
| Q10 | 폴더 구조 | Feature-Based |
| Q11 | Design Patterns | Container/Presentational, Custom Hooks, Compound, Repository |
| Q12 | Section 5 작성방식 | 종합형 (이론 + 코드 + 다이어그램) |
| Q13 | 인증 Session 관리 | @supabase/ssr (Server-Side) |
| Q14 | 성인인증 방식 | PASS 본인확인 (통신사 인증) |
| Q15 | API 전략 | Hybrid (Server Actions + Route Handlers) |
| Q16 | API 문서화 | SDD 내 관리 |
| Q17 | 테스트 프레임워크 | Vitest + Playwright |
| Q18 | 테스트 커버리지 목표 | 90%+ (균등 테스트) |
| Q19 | 환경 분리 전략 | 3-Tier (Dev + Staging + Prod) |
| Q20 | 모니터링 도구 | Full Stack (Vercel + Sentry + PostHog + Uptime) |
| Q21 | 도메인 설정 | 이미 보유 |
| Q22 | 배포 자동화 수준 | GitHub Actions 통합 |

## 12.2 데이터베이스 스키마 (핵심 테이블)

```sql
-- Users & Authentication
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  ci TEXT,                          -- PASS 연계정보
  is_adult_verified BOOLEAN DEFAULT FALSE,
  adult_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  discount_rate INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'PENDING',
  total_amount INTEGER NOT NULL,
  payment_key TEXT,
  paid_at TIMESTAMPTZ,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT NOT NULL,          -- 'monthly' | 'yearly'
  status TEXT DEFAULT 'active',
  billing_key TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 12.3 환경 변수 목록

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# TossPayments
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# PASS (성인인증)
PASS_CLIENT_ID=
PASS_CLIENT_SECRET=
PASS_CALLBACK_URL=

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Environment
NEXT_PUBLIC_APP_ENV=development|staging|production
NEXT_PUBLIC_APP_URL=
```

## 12.4 참고 링크

| 서비스 | 링크 |
|--------|------|
| Next.js 14 Docs | https://nextjs.org/docs |
| Supabase Docs | https://supabase.com/docs |
| TossPayments Docs | https://docs.tosspayments.com |
| shadcn/ui | https://ui.shadcn.com |
| Tailwind CSS | https://tailwindcss.com |
| TanStack Query | https://tanstack.com/query |
| Zustand | https://zustand-demo.pmnd.rs |
| Vitest | https://vitest.dev |
| Playwright | https://playwright.dev |

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                        End of Document                                    ║
║                                                                           ║
║                    TBR MVP SDD v1.0.0                                     ║
║                                                                           ║
║                    Created: 2025-12-08                                    ║
║                    Author: Luchello                                       ║
║                                                                           ║
║                    🧸 TeddyBearsRoom 🧸                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```
