# System Architecture Documentation

TeddyBear's Room - E-commerce Platform Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                 │   │
│  │                                                                      │   │
│  │   Browser ─────▶ Next.js App (React 19.2)                           │   │
│  │                       │                                              │   │
│  │                       ├── Server Components (RSC)                    │   │
│  │                       ├── Client Components ("use client")          │   │
│  │                       └── Zustand Stores (Client State)             │   │
│  │                                                                      │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                         API LAYER                                    │   │
│  │                                                                      │   │
│  │   /api/products ──────┐                                             │   │
│  │   /api/orders ────────┼──────▶ Next.js Route Handlers               │   │
│  │   /api/users ─────────┘              │                              │   │
│  │                                      │                              │   │
│  │                            Prisma ORM │                              │   │
│  │                                      │                              │   │
│  └──────────────────────────────────────┼──────────────────────────────┘   │
│                                         │                                   │
│  ┌──────────────────────────────────────▼──────────────────────────────┐   │
│  │                         DATA LAYER                                   │   │
│  │                                                                      │   │
│  │   Supabase PostgreSQL ◀────────────────────────────────▶ Auth       │   │
│  │         │                                                  │        │   │
│  │         ├── pgcrypto (암호화)                               │        │   │
│  │         └── RLS Policies                             PASS 본인확인  │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         EXTERNAL SERVICES                            │  │
│  │                                                                      │  │
│  │   TossPayments ──────▶ 결제/정기결제                                  │  │
│  │   Vercel Cron ────────▶ 구독 갱신 스케줄                              │  │
│  │   CDN ─────────────────▶ 이미지/정적 자산                             │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Detail

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.7 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Radix UI** | Latest | Accessible primitives |
| **Zustand** | 5.0.8 | Client state management |
| **React Query** | 5.90.12 | Server state management |
| **React Hook Form** | 7.68.0 | Form handling |
| **Zod** | 4.1.13 | Schema validation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma** | 7.0.1 | ORM with type-safe queries |
| **Supabase** | 2.86.0 | PostgreSQL + Auth |
| **@supabase/ssr** | 0.8.0 | Server-side auth |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting, Edge Functions, Cron |
| **Supabase** | Database, Auth, Storage |
| **TossPayments** | Payment processing |

---

## Directory Structure

```
web/
├── prisma/
│   ├── schema.prisma         # Database schema (20+ models)
│   ├── migrations/           # Migration history
│   └── seed.ts               # Seed data
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Route Handlers
│   │   │   ├── products/
│   │   │   │   ├── route.ts          # GET /api/products
│   │   │   │   └── [id]/route.ts     # GET /api/products/:id
│   │   │   ├── orders/
│   │   │   │   └── route.ts          # POST /api/orders
│   │   │   └── users/
│   │   │       └── me/
│   │   │           ├── route.ts      # GET /api/users/me
│   │   │           └── measurements/route.ts
│   │   │
│   │   ├── (auth)/           # Auth Route Group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (shop)/           # Shop Route Group
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── account/              # User account
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout flow
│   │   │   ├── orders/               # Order history
│   │   │   ├── products/             # Product listing & detail
│   │   │   └── wishlist/             # Wishlist
│   │   │
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Tailwind + Design system
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── auth/             # Auth components
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── products/         # Product components
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   └── product-filters.tsx
│   │   ├── cart/             # Cart components
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   └── checkout/         # Checkout components
│   │       ├── shipping-form.tsx
│   │       ├── payment-form.tsx
│   │       └── order-summary.tsx
│   │
│   ├── stores/               # Zustand stores
│   │   ├── index.ts          # Store exports
│   │   ├── cart-store.ts     # Cart state
│   │   ├── wishlist-store.ts # Wishlist state
│   │   ├── auth-store.ts     # Auth state
│   │   └── ui-store.ts       # UI state
│   │
│   ├── types/                # TypeScript definitions
│   │   ├── index.ts          # Common types
│   │   ├── product.ts        # Product types
│   │   ├── cart.ts           # Cart types
│   │   ├── order.ts          # Order types
│   │   └── user.ts           # User types
│   │
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts         # Prisma singleton
│   │   ├── utils.ts          # Helper functions
│   │   └── supabase/
│   │       ├── client.ts     # Browser client
│   │       ├── server.ts     # Server client
│   │       └── middleware.ts # Auth middleware
│   │
│   └── hooks/                # Custom hooks
│       ├── use-cart.ts
│       └── use-auth.ts
│
├── middleware.ts             # Next.js middleware
├── .env.local                # Environment variables
└── package.json
```

---

## State Management Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   CLIENT STATE (Zustand)              SERVER STATE (React Query)           │
│   ┌───────────────────────┐          ┌───────────────────────┐             │
│   │                       │          │                       │             │
│   │  cart-store.ts        │          │  Products Query       │             │
│   │  ├── items[]          │          │  ├── queryKey         │             │
│   │  ├── isOpen           │          │  ├── queryFn          │             │
│   │  ├── addItem()        │          │  └── staleTime        │             │
│   │  ├── removeItem()     │          │                       │             │
│   │  └── getTotals()      │          │  Orders Query         │             │
│   │                       │          │  User Query           │             │
│   │  wishlist-store.ts    │          │                       │             │
│   │  ├── items[]          │          └───────────────────────┘             │
│   │  ├── addItem()        │                    │                           │
│   │  └── removeItem()     │                    │                           │
│   │                       │                    ▼                           │
│   │  ui-store.ts          │          ┌───────────────────────┐             │
│   │  ├── isMobileMenu     │          │   API Route Handlers  │             │
│   │  ├── isSearchOpen     │          │   /api/products       │             │
│   │  └── modal state      │          │   /api/orders         │             │
│   │                       │          │   /api/users          │             │
│   └───────────────────────┘          └───────────────────────┘             │
│            │                                   │                           │
│            │     localStorage                  │     Prisma                │
│            ▼     (persist)                     ▼     (ORM)                 │
│   ┌───────────────────────┐          ┌───────────────────────┐             │
│   │   Browser Storage     │          │   PostgreSQL (Supabase)│            │
│   │   tbr-cart            │          │                       │             │
│   │   tbr-wishlist        │          └───────────────────────┘             │
│   └───────────────────────┘                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cart Store (Zustand)

```typescript
// src/stores/cart-store.ts

interface CartStore extends CartState {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  appliedCoupon: AppliedCoupon | null;

  // Actions
  addItem: (input, product, variant?) => void;
  addSimpleItem: (input) => void;
  updateItem: (itemId, quantity) => void;
  removeItem: (itemId) => void;
  clearCart: () => void;

  // Coupon
  applyCoupon: (code) => Promise<boolean>;
  removeCoupon: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotals: (isInnerCircle) => CartTotals;
}

// Persist configuration
persist(store, {
  name: 'tbr-cart',
  version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    items: state.items,
    appliedCoupon: state.appliedCoupon,
  }),
})
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. EMAIL/PASSWORD REGISTRATION                                           │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐                         │
│   │  Client   │───▶│ Supabase  │───▶│   Email   │                         │
│   │  Form     │    │   Auth    │    │  Verify   │                         │
│   └───────────┘    └───────────┘    └───────────┘                         │
│                                                                             │
│   2. PASS 본인확인 (성인인증)                                               │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐                         │
│   │  Client   │───▶│   PASS    │───▶│  CI/DI    │                         │
│   │  Request  │    │   API     │    │  Return   │                         │
│   └───────────┘    └───────────┘    └───────────┘                         │
│        │                                  │                                │
│        │         ┌───────────────────────┘                                │
│        ▼         ▼                                                         │
│   ┌─────────────────────┐                                                  │
│   │  Profile Update     │                                                  │
│   │  is_adult_verified  │                                                  │
│   │  ci_hash            │                                                  │
│   └─────────────────────┘                                                  │
│                                                                             │
│   3. SESSION MANAGEMENT                                                     │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐                         │
│   │ Supabase  │───▶│Middleware │───▶│  Route    │                         │
│   │  Cookie   │    │  Check    │    │  Handler  │                         │
│   └───────────┘    └───────────┘    └───────────┘                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Middleware (Auth Protection)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get, set, remove } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/account') && !user) {
    return NextResponse.redirect('/login');
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/orders/:path*'],
};
```

---

## Payment Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW (TossPayments)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ONE-TIME PAYMENT                                                          │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐        │
│   │ Checkout  │───▶│   Toss    │───▶│  Payment  │───▶│  Confirm  │        │
│   │   Page    │    │  Widget   │    │  Gateway  │    │   API     │        │
│   └───────────┘    └───────────┘    └───────────┘    └───────────┘        │
│                                                                             │
│   SUBSCRIPTION (빌링키)                                                      │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐                         │
│   │  Register │───▶│  Issue    │───▶│   Store   │                         │
│   │  Card     │    │BillingKey │    │ billing_key│                        │
│   └───────────┘    └───────────┘    └───────────┘                         │
│                           │                                                │
│                           ▼                                                │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐                         │
│   │  Vercel   │───▶│  Charge   │───▶│  Update   │                         │
│   │   Cron    │    │  API      │    │Subscription│                        │
│   └───────────┘    └───────────┘    └───────────┘                         │
│   (매월 결제일)                                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Design System

### Tailwind CSS 4 Configuration

```css
/* globals.css */

@import "tailwindcss";
@import "tw-animate-css";

@theme {
  /* Primary Colors (Pastel Pink/Coral) */
  --color-primary-50: #fef1f1;
  --color-primary-100: #fee2e2;
  --color-primary-200: #fecaca;
  --color-primary-300: #fca5a5;
  --color-primary-400: #f87171;
  --color-primary-500: #ef4444;  /* Main Primary */
  --color-primary-600: #dc2626;
  --color-primary-700: #b91c1c;

  /* Secondary Colors (Soft Lavender) */
  --color-secondary-50: #faf5ff;
  --color-secondary-100: #f3e8ff;
  --color-secondary-200: #e9d5ff;
  --color-secondary-500: #a855f7;  /* Main Secondary */

  /* Accent Colors (Mint/Sage) */
  --color-accent-50: #f0fdfa;
  --color-accent-100: #ccfbf1;
  --color-accent-500: #14b8a6;  /* Main Accent */

  /* Semantic Colors */
  --color-background: #fffbf9;
  --color-foreground: #1a1a1a;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #5c5c5c;

  /* Shadows */
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 20px rgba(239, 68, 68, 0.15);

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Design Tokens

```typescript
// Component styling patterns
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-600 shadow-soft",
        secondary: "bg-secondary/10 text-secondary-700 hover:bg-secondary/20",
        outline: "border border-primary text-primary hover:bg-primary/5",
        ghost: "text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-7 text-lg",
        icon: "h-10 w-10",
      },
    },
  }
);
```

---

## Performance Optimizations

### 1. Image Optimization
```typescript
// Next.js Image with responsive sizes
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
/>
```

### 2. Hydration Safety
```typescript
// Prevent hydration mismatch with client-only rendering
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

// Usage in Header component
const isHydrated = useHydrated();
{isHydrated ? <Sheet>...</Sheet> : <Placeholder />}
```

### 3. Route Groups
```
(auth)/    → Auth-specific layout, no URL prefix
(shop)/    → Shop-specific layout, no URL prefix
```

### 4. Dynamic Imports
```typescript
// Lazy load heavy components
const ProductFilters = dynamic(() => import('./product-filters'), {
  loading: () => <FiltersSkeleton />,
});
```

---

## Security Measures

| Area | Implementation |
|------|----------------|
| **Auth** | Supabase Auth + PASS CI/DI verification |
| **Data Encryption** | pgcrypto for body measurements |
| **Session** | HttpOnly cookies, short-lived tokens |
| **API Protection** | Middleware auth checks, rate limiting |
| **Payment** | TossPayments PCI-DSS compliance |
| **Input Validation** | Zod schemas on all inputs |
| **CORS** | Configured in Next.js middleware |

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bjnjbbdcwkooswvexiuh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Direct connection for Prisma)
DATABASE_URL=postgresql://...

# TossPayments
TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...

# PASS 본인확인
PASS_CLIENT_ID=...
PASS_CLIENT_SECRET=...
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   GitHub Repository                                                         │
│        │                                                                    │
│        │  Push to main branch                                              │
│        ▼                                                                    │
│   ┌───────────┐                                                            │
│   │  Vercel   │                                                            │
│   │  Build    │                                                            │
│   └─────┬─────┘                                                            │
│         │                                                                   │
│         ├───▶ prisma generate                                              │
│         ├───▶ next build                                                   │
│         └───▶ Deploy to Edge                                               │
│                                                                             │
│   Production URLs:                                                          │
│   • https://teddybearsroom.com (main)                                      │
│   • https://teddybearsroom.vercel.app (preview)                            │
│                                                                             │
│   Cron Jobs (vercel.json):                                                 │
│   • /api/cron/subscription-renewal - Daily at 00:00 KST                    │
│   • /api/cron/donation-settlement - Monthly                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2025-12-17
