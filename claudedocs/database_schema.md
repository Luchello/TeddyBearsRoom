# Database Schema Documentation

TeddyBear's Room - E-commerce Platform Database Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATABASE ARCHITECTURE OVERVIEW                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│   │   Profile   │────▶│    Order    │────▶│  OrderItem  │             │
│   │  (User)     │     │             │     │             │             │
│   └──────┬──────┘     └─────────────┘     └─────────────┘             │
│          │                                       │                     │
│          │            ┌─────────────┐            │                     │
│          ├───────────▶│ Subscription│            │                     │
│          │            └─────────────┘            │                     │
│          │                                       ▼                     │
│          │            ┌─────────────┐     ┌─────────────┐             │
│          ├───────────▶│  CartItem   │────▶│   Product   │◀────────┐  │
│          │            └─────────────┘     └──────┬──────┘         │  │
│          │                                       │                │  │
│          │            ┌─────────────┐            │         ┌──────┴──┐
│          └───────────▶│WishlistItem │────────────┘         │Category │
│                       └─────────────┘                      └─────────┘
│                                                                         │
│   ═══════════════════════════════════════════════════════════════      │
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│   │DonationOrg  │◀────│DonationVote │     │   Brand     │             │
│   └─────────────┘     └─────────────┘     └─────────────┘             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Database** | Supabase PostgreSQL |
| **Project ID** | `bjnjbbdcwkooswvexiuh` |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Extensions** | pgcrypto (암호화), uuid-ossp |

---

## Core E-commerce Models

### 1. Profile (사용자)

```prisma
model Profile {
  id                  String    @id @default(dbgenerated("gen_random_uuid()"))
  email               String    @unique
  name                String?
  phone               String?

  // 신체 정보 (pgcrypto 암호화)
  body_measurements   Json?

  // 성인인증 (PASS 본인확인)
  is_adult_verified   Boolean   @default(false)
  adult_verified_at   DateTime?
  ci_hash             String?   @unique  // 연계정보 해시

  // 구독 정보
  subscription_tier   SubscriptionTier @default(NONE)

  // 관계
  cart_items          CartItem[]
  wishlist_items      WishlistItem[]
  orders              Order[]
  subscription        Subscription?
  donation_votes      DonationVote[]

  // 타임스탬프
  created_at          DateTime  @default(now())
  updated_at          DateTime  @updatedAt
}
```

**주요 필드 설명**:
- `body_measurements`: JSON 형태로 신체 정보 저장, DB 레벨 pgcrypto 암호화
- `ci_hash`: PASS 본인확인 시 발급되는 연계정보(CI) 해시값
- `subscription_tier`: NONE / STANDARD / PREMIUM 열거형

---

### 2. Product (상품)

```prisma
model Product {
  id              String    @id @default(dbgenerated("gen_random_uuid()"))
  name            String
  slug            String    @unique
  description     String?

  // 가격 정보
  price           Int       // 판매가 (원)
  compare_at_price Int?     // 정상가 (할인 전)
  cost_price      Int?      // 원가

  // 상태
  is_active       Boolean   @default(true)
  is_new          Boolean   @default(false)
  is_best         Boolean   @default(false)

  // 재고
  stock_quantity  Int       @default(0)
  track_inventory Boolean   @default(true)

  // 사이즈 추천
  size_data       Json?     // 사이즈 추천 데이터

  // 관계
  category_id     String?
  category        Category? @relation(fields: [category_id])
  brand_id        String?
  brand           Brand?    @relation(fields: [brand_id])
  images          ProductImage[]
  variants        ProductVariant[]
  cart_items      CartItem[]
  wishlist_items  WishlistItem[]
  order_items     OrderItem[]

  // 타임스탬프
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
}
```

**사이즈 추천 (size_data) JSON 구조**:
```typescript
{
  measurements: {
    type: "LENGTH" | "GIRTH" | "DEPTH" | "WIDTH",
    min: number,
    max: number,
    recommendation: "SMALL" | "MEDIUM" | "LARGE" | "ALL"
  }[]
}
```

---

### 3. Order (주문)

```prisma
model Order {
  id              String      @id @default(dbgenerated("gen_random_uuid()"))
  order_number    String      @unique

  // 주문 상태
  status          OrderStatus @default(PENDING)

  // 금액
  subtotal        Int         // 상품 합계
  discount        Int         @default(0)
  shipping_fee    Int         @default(0)
  total           Int         // 최종 결제 금액

  // 배송 정보
  shipping_name   String?
  shipping_phone  String?
  shipping_address Json?

  // 결제 정보
  payment_method  String?
  payment_key     String?     // TossPayments 결제키
  paid_at         DateTime?

  // 구독 할인 적용 여부
  inner_circle_discount Int   @default(0)

  // 관계
  profile_id      String
  profile         Profile     @relation(fields: [profile_id])
  items           OrderItem[]

  // 타임스탬프
  created_at      DateTime    @default(now())
  updated_at      DateTime    @updatedAt
}

enum OrderStatus {
  PENDING          // 주문 대기
  PAYMENT_PENDING  // 결제 대기
  PAID             // 결제 완료
  PREPARING        // 상품 준비 중
  SHIPPED          // 배송 중
  DELIVERED        // 배송 완료
  CANCELLED        // 취소됨
  REFUNDED         // 환불됨
}
```

---

### 4. Subscription (구독)

```prisma
model Subscription {
  id                String            @id @default(dbgenerated("gen_random_uuid()"))

  // 구독 정보
  tier              SubscriptionTier  @default(STANDARD)
  status            SubscriptionStatus @default(ACTIVE)

  // TossPayments 빌링키
  billing_key       String?           // 빌링키
  customer_key      String?           // 고객 키

  // 결제 주기
  current_period_start DateTime?
  current_period_end   DateTime?
  next_billing_date    DateTime?

  // 금액
  price             Int               // 월 구독료 (9,900원)

  // 기부 선택
  selected_org_id   String?
  selected_org      DonationOrg?      @relation(fields: [selected_org_id])

  // 관계
  profile_id        String            @unique
  profile           Profile           @relation(fields: [profile_id])

  // 타임스탬프
  created_at        DateTime          @default(now())
  updated_at        DateTime          @updatedAt
  cancelled_at      DateTime?
}

enum SubscriptionTier {
  NONE      // 비구독
  STANDARD  // Roommate (9,900원/월)
  PREMIUM   // 향후 확장용
}

enum SubscriptionStatus {
  ACTIVE        // 활성
  PAUSED        // 일시정지
  CANCELLED     // 해지
  PAST_DUE      // 연체
  EXPIRED       // 만료
}
```

---

### 5. CartItem & WishlistItem

```prisma
model CartItem {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  quantity    Int       @default(1)

  // 선택된 옵션
  variant_id  String?
  variant     ProductVariant? @relation(fields: [variant_id])

  // 관계
  profile_id  String
  profile     Profile   @relation(fields: [profile_id])
  product_id  String
  product     Product   @relation(fields: [product_id])

  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  @@unique([profile_id, product_id, variant_id])
}

model WishlistItem {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))

  profile_id  String
  profile     Profile   @relation(fields: [profile_id])
  product_id  String
  product     Product   @relation(fields: [product_id])

  created_at  DateTime  @default(now())

  @@unique([profile_id, product_id])
}
```

---

## 기부 시스템 Models

### DonationOrg & DonationVote

```prisma
model DonationOrg {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  name        String
  description String?
  logo_url    String?
  website     String?

  // 투표 집계
  vote_count  Int       @default(0)

  is_active   Boolean   @default(true)

  // 관계
  votes       DonationVote[]
  subscriptions Subscription[]

  created_at  DateTime  @default(now())
}

model DonationVote {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))

  profile_id  String
  profile     Profile     @relation(fields: [profile_id])
  org_id      String
  org         DonationOrg @relation(fields: [org_id])

  // 투표 가중치 (구독 기간에 따라)
  weight      Int         @default(1)

  created_at  DateTime    @default(now())

  @@unique([profile_id, org_id])
}
```

**기부 로직**:
- 이너 서클 회원 구독료의 1%가 기부됨
- 회원이 기부 단체 투표 가능
- 투표 결과에 따라 분기별 기부금 분배

---

## 보조 Models

### Category, Brand, ProductImage, ProductVariant

```prisma
model Category {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  name        String
  slug        String    @unique
  description String?
  image_url   String?

  // 계층 구조
  parent_id   String?
  parent      Category? @relation("CategoryHierarchy", fields: [parent_id])
  children    Category[] @relation("CategoryHierarchy")

  products    Product[]

  sort_order  Int       @default(0)
  is_active   Boolean   @default(true)

  created_at  DateTime  @default(now())
}

model Brand {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  name        String
  slug        String    @unique
  logo_url    String?

  products    Product[]
  is_active   Boolean   @default(true)

  created_at  DateTime  @default(now())
}

model ProductImage {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  url         String
  alt_text    String?
  sort_order  Int       @default(0)

  product_id  String
  product     Product   @relation(fields: [product_id])
}

model ProductVariant {
  id          String    @id @default(dbgenerated("gen_random_uuid()"))
  name        String              // e.g., "Small", "Red"
  sku         String?   @unique

  price       Int?                // null이면 상품 가격 사용
  compare_at_price Int?
  stock_quantity Int    @default(0)

  options     Json?               // {color: "Red", size: "M"}

  product_id  String
  product     Product   @relation(fields: [product_id])
  cart_items  CartItem[]

  is_active   Boolean   @default(true)
}
```

---

## Trend Shopping (ts_) Models

> ⚠️ 트렌드 쇼핑 기능은 향후 확장을 위한 모델입니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TREND SHOPPING SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐          │
│   │ts_categories │────▶│ ts_products  │────▶│ts_inventory  │          │
│   └──────────────┘     └──────────────┘     └──────────────┘          │
│                              │                                          │
│                              ▼                                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐          │
│   │ts_wholesalers│────▶│  ts_orders   │────▶│ts_trend_data │          │
│   └──────────────┘     └──────────────┘     └──────────────┘          │
│                                                                         │
│   Monitoring & Logs:                                                    │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│   │  ts_alerts   │  │ts_system_logs│  │ts_daily_reports│              │
│   └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### ts_products (트렌드 상품)
```prisma
model ts_products {
  id              String    @id @default(dbgenerated("gen_random_uuid()"))
  name            String
  naver_id        String?   @unique  // 네이버 상품 ID
  coupang_id      String?             // 쿠팡 상품 ID

  current_price   Int?
  lowest_price    Int?
  highest_price   Int?

  trend_score     Float     @default(0)
  search_volume   Int       @default(0)

  category_id     String?
  category        ts_categories? @relation(fields: [category_id])

  inventory       ts_inventory[]
  trend_data      ts_trend_data[]

  last_crawled    DateTime?
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
}
```

---

## 보안 및 암호화

### pgcrypto 사용

```sql
-- 신체 정보 암호화 예시
INSERT INTO profiles (id, body_measurements)
VALUES (
  gen_random_uuid(),
  pgp_sym_encrypt(
    '{"height": 175, "weight": 70}'::text,
    'encryption_key'
  )
);

-- 복호화
SELECT
  pgp_sym_decrypt(body_measurements::bytea, 'encryption_key')::json
FROM profiles
WHERE id = 'user_id';
```

**암호화 대상 필드**:
- `Profile.body_measurements` - 신체 측정 데이터
- 결제 정보는 TossPayments에서 관리 (PCI-DSS 준수)

---

## 인덱스 전략

```prisma
// 검색 최적화
@@index([category_id])
@@index([brand_id])
@@index([is_active, is_new])
@@index([is_active, is_best])
@@index([slug])

// 주문 조회 최적화
@@index([profile_id])
@@index([status])
@@index([created_at])

// 구독 관리
@@index([next_billing_date])
@@index([status])
```

---

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| 001 | 2025-11-XX | Initial schema |
| 002 | 2025-11-XX | Add subscription models |
| 003 | 2025-12-XX | Add donation system |
| 004 | 2025-12-XX | Add trend shopping (ts_*) |

---

## Entity Relationship Summary

```
Profile (1) ──────────── (N) CartItem
Profile (1) ──────────── (N) WishlistItem
Profile (1) ──────────── (N) Order
Profile (1) ──────────── (1) Subscription
Profile (1) ──────────── (N) DonationVote

Product (1) ──────────── (N) CartItem
Product (1) ──────────── (N) WishlistItem
Product (1) ──────────── (N) OrderItem
Product (1) ──────────── (N) ProductImage
Product (1) ──────────── (N) ProductVariant
Product (N) ──────────── (1) Category
Product (N) ──────────── (1) Brand

Order (1) ─────────────── (N) OrderItem
OrderItem (N) ─────────── (1) Product

Subscription (N) ──────── (1) DonationOrg
DonationVote (N) ───────── (1) DonationOrg

Category (Self-referencing hierarchy)
```

---

**Last Updated**: 2025-12-17
