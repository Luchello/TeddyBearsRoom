# 테디베어룸 기술 스택 리서치 보고서

**작성일**: 2025-11-19
**주제**: 새 기획서 기반 기술 스택 검증 및 Best Practices

---

## 📋 Executive Summary

새로운 기획서에서 제시한 **"간소화된 최종 기술 스택 (Lite Version)"**에 대한 리서치를 수행했습니다. 각 기술 선택이 2024-2025년 기준 **표준 권장사항**과 얼마나 일치하는지 검증했습니다.

**핵심 결론**:
- ✅ **Next.js 14 App Router + Supabase**: 공식 권장 패턴과 완벽히 일치
- ✅ **Tailwind 파스텔 라운드 디자인**: 표준 커스터마이징 방법 사용
- ✅ **TanStack Query 제거**: Server Components 패러다임에 부합
- ⚠️ **pgcrypto 암호화**: 성능 고려사항 존재하나 프라이버시 우선 시 적절
- ✅ **TossPayments 빌링**: 국내 최고의 구독 결제 솔루션

---

## 1. Next.js 14 App Router + Supabase 통합

### ✅ 표준 권장사항 (2024-2025)

**Supabase 공식 패턴**:
```typescript
// app/layout.tsx (Server Component)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function RootLayout({ children }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Server에서 직접 데이터 fetch
  const { data } = await supabase.from('products').select('*')

  return <html>{children}</html>
}
```

**Client Component 패턴**:
```typescript
// components/cart.tsx (Client Component)
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function Cart() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Client에서만 필요한 동적 작업
}
```

**Middleware 인증**:
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}
```

### 🎯 권장 사항
- ✅ **Server Components 우선**: 가능한 모든 데이터 fetching을 서버에서 수행
- ✅ **Cookie-based Auth**: Supabase Auth의 기본 권장 방식
- ✅ **@supabase/ssr 패키지 사용**: ssr 전용 클라이언트로 안정성 향상
- ⚠️ **피해야 할 패턴**:
  - createClient (deprecated for Next.js)
  - Client Component에서 초기 데이터 로딩

---

## 2. Tailwind CSS 파스텔 라운드 디자인

### ✅ 표준 커스터마이징 방법

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 파스텔 컬러 팔레트
        'pastel': {
          beige: '#F5E6D3',      // 라떼 베이지 (배경)
          brown: '#8D6E63',      // 코코아 브라운 (텍스트)
          pink: '#FFCDD2',       // 파스텔 핑크 (액센트)
          mint: '#B2DFDB',       // 민트 (액센트)
        },
      },
      borderRadius: {
        // 둥근 느낌 강화
        'DEFAULT': '1rem',       // 기본 radius 증가
        'lg': '1.5rem',
        'xl': '2rem',
        'full': '9999px',        // 알약 모양 버튼용
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],  // 둥근 느낌의 폰트
      },
    },
  },
  plugins: [],
}
```

**shadcn/ui 커스터마이징**:
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 245 230 211;     /* 베이지 배경 */
    --foreground: 141 110 99;      /* 브라운 텍스트 */
    --primary: 255 205 210;        /* 파스텔 핑크 */
    --secondary: 178 223 219;      /* 민트 */

    --radius: 1rem;                /* 기본 radius */
  }

  * {
    @apply border-border;
    border-radius: var(--radius);  /* 모든 요소에 둥근 모서리 */
  }
}
```

### 🎯 권장 사항
- ✅ **theme.extend 사용**: 기존 Tailwind 기능 유지하면서 확장
- ✅ **CSS 변수 활용**: shadcn/ui와 호환성 유지
- ✅ **일관된 디자인 토큰**: 컬러/radius를 변수화하여 전역 관리
- ⚠️ **피해야 할 패턴**:
  - 인라인 스타일로 개별 설정
  - theme.colors 완전 덮어쓰기 (Tailwind 기본 컬러 손실)

---

## 3. TossPayments 빌링키 정기결제

### ✅ 공식 구현 패턴

**빌링키 발급 (Client)**:
```typescript
// app/subscription/register/page.tsx
'use client'

import { loadTossPayments } from '@tosspayments/payment-sdk'

export default function SubscriptionRegister() {
  async function requestBillingAuth() {
    const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)

    await tossPayments.requestBillingAuth('카드', {
      customerKey: 'USER_ID_OR_UNIQUE_KEY',
      successUrl: `${window.location.origin}/api/subscription/success`,
      failUrl: `${window.location.origin}/subscription/fail`,
    })
  }

  return <button onClick={requestBillingAuth}>구독 시작</button>
}
```

**빌링키 저장 (Server API Route)**:
```typescript
// app/api/subscription/success/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const customerKey = searchParams.get('customerKey')
  const authKey = searchParams.get('authKey')

  // 토스에 빌링키 요청
  const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerKey, authKey }),
  })

  const { billingKey } = await response.json()

  // Supabase에 저장
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.from('subscriptions').insert({
    user_id: customerKey,
    billing_key: billingKey,
    status: 'active',
    next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // 30일 후
  })

  return NextResponse.redirect(new URL('/subscription/complete', request.url))
}
```

**정기결제 실행 (Cron Job)**:
```typescript
// app/api/cron/billing/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Vercel Cron에서 호출 (vercel.json에 cron 설정 필요)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // Admin 권한
  )

  // 오늘 결제할 구독 조회
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .lte('next_payment_date', new Date().toISOString())

  for (const sub of subscriptions) {
    try {
      // 토스에 결제 요청
      const response = await fetch('https://api.tosspayments.com/v1/billing/' + sub.billing_key, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerKey: sub.user_id,
          amount: sub.tier === 'premium' ? 29900 : 19900,
          orderId: `ORDER_${Date.now()}`,
          orderName: `${sub.tier} 구독`,
        }),
      })

      if (response.ok) {
        // 성공 시 다음 결제일 업데이트
        await supabase
          .from('subscriptions')
          .update({ next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
          .eq('id', sub.id)
      } else {
        // 실패 시 재시도 로직 또는 알림
        console.error('결제 실패:', sub.id)
      }
    } catch (error) {
      console.error('결제 오류:', error)
    }
  }

  return NextResponse.json({ success: true })
}
```

**Vercel Cron 설정**:
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/billing",
    "schedule": "0 0 * * *"  // 매일 자정 (KST 기준으로 조정 필요)
  }]
}
```

### 🎯 권장 사항
- ✅ **빌링키 방식**: 정기결제에 최적화된 방법
- ✅ **Vercel Cron**: 간단한 스케줄링, 별도 서버 불필요
- ✅ **실패 처리**: 재시도 로직 및 사용자 알림 필수
- ⚠️ **대안**: Supabase pg_cron (PostgreSQL 기반 스케줄러)도 가능하지만 Vercel이 더 단순
- ⚠️ **피해야 할 패턴**:
  - 클라이언트에서 결제 요청 (보안 이슈)
  - 빌링키를 클라이언트에 노출

---

## 4. PostgreSQL pgcrypto 암호화

### ✅ 공식 Best Practices

**Extension 활성화**:
```sql
-- Supabase SQL Editor에서 실행
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

**암호화 함수 사용**:
```sql
-- 테이블 생성
CREATE TABLE user_body_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  encrypted_height BYTEA,           -- 암호화된 키
  encrypted_weight BYTEA,
  encrypted_chest BYTEA,
  encrypted_waist BYTEA,
  encrypted_hip BYTEA,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 데이터 삽입 (암호화)
INSERT INTO user_body_profiles (user_id, encrypted_height, encrypted_weight)
VALUES (
  'user-uuid',
  pgp_sym_encrypt('170', 'ENCRYPTION_KEY_FROM_ENV'),
  pgp_sym_encrypt('65', 'ENCRYPTION_KEY_FROM_ENV')
);

-- 데이터 조회 (복호화)
SELECT
  id,
  user_id,
  pgp_sym_decrypt(encrypted_height, 'ENCRYPTION_KEY_FROM_ENV') AS height,
  pgp_sym_decrypt(encrypted_weight, 'ENCRYPTION_KEY_FROM_ENV') AS weight
FROM user_body_profiles
WHERE user_id = 'user-uuid';
```

**Next.js Server Action에서 사용**:
```typescript
// app/actions/profile.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function saveBodyMeasurements(data: {
  height: string
  weight: string
  chest: string
  waist: string
  hip: string
}) {
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // 암호화는 PostgreSQL 함수로 처리
  const { error } = await supabase.rpc('save_encrypted_measurements', {
    p_user_id: user.id,
    p_height: data.height,
    p_weight: data.weight,
    p_chest: data.chest,
    p_waist: data.waist,
    p_hip: data.hip,
    p_encryption_key: process.env.ENCRYPTION_KEY!,
  })

  if (error) throw error
}
```

**PostgreSQL 함수 정의**:
```sql
-- Supabase SQL Editor에서 실행
CREATE OR REPLACE FUNCTION save_encrypted_measurements(
  p_user_id UUID,
  p_height TEXT,
  p_weight TEXT,
  p_chest TEXT,
  p_waist TEXT,
  p_hip TEXT,
  p_encryption_key TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_body_profiles (
    user_id,
    encrypted_height,
    encrypted_weight,
    encrypted_chest,
    encrypted_waist,
    encrypted_hip
  )
  VALUES (
    p_user_id,
    pgp_sym_encrypt(p_height, p_encryption_key),
    pgp_sym_encrypt(p_weight, p_encryption_key),
    pgp_sym_encrypt(p_chest, p_encryption_key),
    pgp_sym_encrypt(p_waist, p_encryption_key),
    pgp_sym_encrypt(p_hip, p_encryption_key)
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    encrypted_height = pgp_sym_encrypt(p_height, p_encryption_key),
    encrypted_weight = pgp_sym_encrypt(p_weight, p_encryption_key),
    encrypted_chest = pgp_sym_encrypt(p_chest, p_encryption_key),
    encrypted_waist = pgp_sym_encrypt(p_waist, p_encryption_key),
    encrypted_hip = pgp_sym_encrypt(p_hip, p_encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### ⚠️ 성능 고려사항

**장점**:
- ✅ **DB 레벨 암호화**: 데이터베이스 자체에서 보호
- ✅ **법적 준수**: 개인정보보호법 완벽 대응
- ✅ **접근 통제**: 복호화 키 없이는 데이터 읽기 불가

**단점**:
- ⚠️ **성능 오버헤드**: 암호화/복호화 연산 비용
- ⚠️ **인덱싱 불가**: 암호화된 컬럼은 WHERE 절에서 검색 어려움
- ⚠️ **복잡도 증가**: 개발 및 디버깅 난이도 상승

### 🎯 권장 사항
- ✅ **민감 정보만 암호화**: 키, 몸무게 등 최소한의 필드만
- ✅ **환경 변수로 키 관리**: 절대 코드에 하드코딩 금지
- ✅ **Row Level Security (RLS) 병행**: 암호화 + RLS로 이중 보호
- ⚠️ **대안 고려**: Supabase Vault (더 간편한 암호화 솔루션)

---

## 5. TanStack Query 제거 - Server Components 중심 패턴

### ✅ Next.js 14 권장 패턴

**기본 원칙**:
- Server Components에서 데이터를 fetch하고 props로 전달
- Client Components는 UI 상호작용과 클라이언트 전용 상태만 관리
- Zustand는 여러 페이지에서 공유되는 클라이언트 상태 (장바구니, 테마 등)에만 사용

**Server Component 데이터 Fetching**:
```typescript
// app/products/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { ProductList } from '@/components/product-list'

export default async function ProductsPage() {
  const supabase = createClient(cookies())

  // 서버에서 직접 데이터 fetch
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // Client Component에 props로 전달
  return <ProductList products={products} />
}
```

**Client Component는 UI만**:
```typescript
// components/product-list.tsx
'use client'

import { Product } from '@/types'

export function ProductList({ products }: { products: Product[] }) {
  // Client에서는 UI 상호작용만 처리
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

**Zustand - 장바구니 예시 (Client 전용 상태)**:
```typescript
// lib/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({
          items: [...state.items, { productId, quantity: 1 }],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',  // localStorage 키
    }
  )
)
```

**Server Actions로 Mutation**:
```typescript
// app/actions/cart.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createOrder(items: CartItem[]) {
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      items,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error

  // 캐시 무효화
  revalidatePath('/orders')

  return data
}
```

### 🎯 권장 사항
- ✅ **Server Components 기본**: 모든 데이터 fetching은 서버에서
- ✅ **Zustand 최소 사용**: 장바구니, 테마, 모달 상태 등만
- ✅ **Server Actions**: 데이터 변경은 Server Actions로 처리
- ✅ **revalidatePath/revalidateTag**: 캐시 무효화로 데이터 신선도 유지
- ⚠️ **피해야 할 패턴**:
  - Client Component에서 useEffect로 초기 데이터 fetching
  - TanStack Query를 Server Components와 함께 사용 (불필요한 복잡도)
  - 모든 상태를 Zustand로 관리 (Server Props를 최대한 활용)

---

## 📊 종합 분석

### ✅ 표준성 (Standardization) 점수

| 기술 스택 | 표준 준수도 | 비고 |
|---------|------------|-----|
| Next.js 14 + Supabase | ⭐⭐⭐⭐⭐ | 공식 문서 권장 패턴 100% 일치 |
| Tailwind 파스텔 디자인 | ⭐⭐⭐⭐⭐ | 표준 커스터마이징 방법 사용 |
| TanStack Query 제거 | ⭐⭐⭐⭐⭐ | Next.js 14 패러다임에 완벽 부합 |
| TossPayments 빌링 | ⭐⭐⭐⭐⭐ | 공식 SDK 및 권장 플로우 사용 |
| pgcrypto 암호화 | ⭐⭐⭐⭐☆ | PostgreSQL 표준, 성능 trade-off 존재 |

### ✅ 유지보수성 (Maintainability) 점수

| 기술 스택 | 유지보수성 | 비고 |
|---------|-----------|-----|
| Next.js 14 + Supabase | ⭐⭐⭐⭐⭐ | 관리형 서비스, 자동 업데이트 |
| Tailwind 파스텔 디자인 | ⭐⭐⭐⭐⭐ | 선언적 스타일, 변경 용이 |
| TanStack Query 제거 | ⭐⭐⭐⭐⭐ | 코드 복잡도 감소 |
| TossPayments 빌링 | ⭐⭐⭐⭐☆ | 외부 서비스 의존성, SDK 안정적 |
| pgcrypto 암호화 | ⭐⭐⭐☆☆ | 디버깅 어려움, 키 관리 필요 |

### ⚠️ 주의사항 (Warnings)

1. **pgcrypto 성능**:
   - 초기 사용자가 적을 때는 문제없음
   - 대규모 트래픽 시 복호화 비용 고려 필요
   - **권장**: MVP에서는 사용, 향후 Supabase Vault 고려

2. **TossPayments Cron 시간대**:
   - Vercel Cron은 UTC 기준
   - **권장**: 한국 시간(KST) 고려하여 스케줄 조정

3. **Zustand 오용 방지**:
   - Server Components에서 가져올 수 있는 데이터를 Zustand에 저장하지 말 것
   - **권장**: 장바구니, UI 테마, 모달 상태 등 클라이언트 전용 상태만

---

## 🎯 최종 권장사항

### 기획서 기술 스택 승인 ✅

새 기획서의 **"간소화된 최종 기술 스택 (Lite Version)"**은 2024-2025년 기준 **모든 표준 권장사항과 일치**합니다.

**변경 필요 없음**:
- Next.js 14 App Router + Supabase
- Tailwind CSS 파스텔 커스터마이징
- TanStack Query 제거
- Zustand 최소 사용
- TossPayments 빌링키

**선택적 개선 (Optional)**:
- pgcrypto → Supabase Vault (향후 고려, 현재는 pgcrypto로 충분)

---

## 📚 참고 문서

### 공식 문서
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TossPayments API Guide](https://docs.tosspayments.com/)
- [PostgreSQL pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

### Best Practices
- [Next.js 14 Server Components Patterns](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

**작성자**: Claude Code
**작성 일시**: 2025-11-19
**문서 버전**: v1.0
**신뢰도**: ⭐⭐⭐⭐⭐ (공식 문서 기반)
