# 프로젝트 구조 가이드

## 아키텍처 원칙

### Layer-First + Feature Co-location 혼합 전략

본 프로젝트는 **레이어 우선 분리**와 **기능별 그룹화**를 혼합한 구조를 채택한다.

- **최상위**: 역할(Layer)별 디렉토리 분리 - `components/`, `lib/`, `hooks/`, `stores/`
- **components 내부**: 기능(Feature)별 하위 분리 - `products/`, `cart/`, `checkout/`
- **app 라우트**: Route Groups로 논리적 그룹화 - `(auth)`, `(shop)`

```
이유:
- 레이어 분리로 관심사 분리 명확
- Feature Co-location으로 관련 코드 응집도 향상
- Route Groups로 URL 영향 없이 코드 정리
```

---

## 디렉토리 구조

```
web/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트 그룹
│   ├── (shop)/            # 쇼핑 관련 라우트 그룹
│   └── api/               # API Routes
│
├── components/            # UI 컴포넌트
│   ├── ui/               # Primitives (shadcn/ui)
│   ├── layout/           # 레이아웃 컴포넌트
│   └── [feature]/        # Feature별 컴포넌트
│       ├── index.ts      # Barrel Export
│       └── *.tsx         # 컴포넌트 파일
│
├── lib/                   # 유틸리티 및 서비스
│   ├── services/         # 비즈니스 로직 서비스
│   ├── utils/            # 순수 유틸리티 함수
│   └── supabase/         # Supabase 클라이언트
│
├── hooks/                 # 커스텀 훅
├── stores/                # Zustand 스토어
├── types/                 # TypeScript 타입 정의
├── constants/             # 상수 정의
├── config/                # 설정 파일
└── providers/             # React Context Provider
```

### Route Groups 패턴

```
app/
├── (auth)/           # 인증 페이지 - /login, /register
│   ├── login/
│   └── register/
├── (shop)/           # 쇼핑 페이지 - /products, /cart
│   ├── products/
│   ├── cart/
│   └── checkout/
└── api/              # API 엔드포인트
```

> Route Groups `(name)`은 URL 경로에 영향을 주지 않으면서 관련 라우트를 논리적으로 그룹화한다.

---

## 네이밍 컨벤션

### 파일명

| 분류 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | `kebab-case.tsx` | `product-card.tsx` |
| 훅 | `use-*.ts` | `use-cart.ts` |
| 스토어 | `*-store.ts` | `cart-store.ts` |
| 서비스 | `*.service.ts` | `order.service.ts` |
| 타입 | `kebab-case.ts` | `product.ts` |
| 유틸리티 | `kebab-case.ts` | `format-currency.ts` |

### Export 이름

| 분류 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `ProductCard` |
| 훅 | camelCase (use 접두사) | `useCart` |
| 스토어 | camelCase (*Store 접미사) | `useCartStore` |
| 타입/인터페이스 | PascalCase | `Product`, `CartItem` |
| 상수 | SCREAMING_SNAKE_CASE | `FREE_SHIPPING_THRESHOLD` |

---

## Import 규칙

### 절대 경로 전용

```typescript
// Good - 절대 경로 사용
import { ProductCard } from '@/components/products'
import { useCart } from '@/hooks/use-cart'
import { formatCurrency } from '@/lib/utils'

// Bad - 상대 경로 금지
import { ProductCard } from '../components/products'
import { useCart } from '../../hooks/use-cart'
```

### tsconfig.json 설정

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import 순서

```typescript
// 1. 외부 라이브러리
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. 내부 모듈 (@/)
import { Button } from '@/components/ui'
import { useCartStore } from '@/stores/cart-store'

// 3. 타입 (type import)
import type { Product } from '@/types'
```

---

## 주요 패턴

### 1. Barrel Export 패턴

모든 feature 폴더는 `index.ts`를 통해 public API를 노출한다.

```typescript
// components/products/index.ts
export { ProductCard } from './product-card'
export { ProductGrid } from './product-grid'
export { ProductFilter } from './product-filter'

// 사용 시
import { ProductCard, ProductGrid } from '@/components/products'
```

**장점**:
- Import 경로 단순화
- 내부 구현 캡슐화
- 리팩토링 시 영향 범위 최소화

### 2. Zustand Store 패턴

persist + version + migrate 조합으로 안정적인 상태 영속화 구현.

```typescript
// stores/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
    }),
    {
      name: 'cart-storage',
      version: 2,  // 스키마 버전
      migrate: (persisted, version) => {
        // 버전 업그레이드 시 마이그레이션 로직
        if (version === 1) {
          return { ...persisted, newField: 'default' }
        }
        return persisted
      },
    }
  )
)
```

### 3. 서비스 레이어 패턴

비즈니스 로직은 서비스 레이어에 분리하여 컴포넌트에서 추상화.

```typescript
// lib/services/order.service.ts
export const orderService = {
  async createOrder(data: CreateOrderInput): Promise<Order> {
    // 주문 생성 로직
  },

  async getOrderById(id: string): Promise<Order | null> {
    // 주문 조회 로직
  },

  async calculateTotals(items: CartItem[]): Promise<OrderTotals> {
    // 합계 계산 로직
  },
}

// 컴포넌트에서 사용
import { orderService } from '@/lib/services/order.service'
const order = await orderService.createOrder(data)
```

### 4. 컴포넌트 최적화 패턴

React.memo와 커스텀 비교 함수로 불필요한 리렌더링 방지.

```typescript
// components/products/product-card.tsx
import { memo } from 'react'

interface ProductCardProps {
  product: Product
  onAddToCart: (id: string) => void
}

function ProductCardComponent({ product, onAddToCart }: ProductCardProps) {
  return (/* ... */)
}

// 커스텀 비교 함수로 최적화
export const ProductCard = memo(ProductCardComponent, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.product.price === next.product.price
  )
})
```

---

## 파일 배치 가이드

### 새 기능 추가 시

```
1. 타입 정의 → types/[feature].ts
2. 서비스 로직 → lib/services/[feature].service.ts
3. 커스텀 훅 → hooks/use-[feature].ts
4. 컴포넌트 → components/[feature]/
5. 페이지 → app/(group)/[route]/page.tsx
```

### 기존 기능 수정 시

```
1. 해당 feature 폴더 확인
2. index.ts의 export 현황 파악
3. 관련 타입/서비스 함께 수정
4. 테스트 업데이트
```

---

## 금지 사항

- 상대 경로 import (`../`, `./`)
- components 폴더 내 비즈니스 로직 직접 구현
- index.ts 없이 feature 폴더 생성
- PascalCase 파일명 (컴포넌트 파일도 kebab-case)
- 순환 의존성 (Circular Dependency)
