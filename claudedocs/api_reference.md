# API Reference Documentation

TeddyBear's Room - REST API Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINT MAP                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   /api                                                                      │
│   ├── /products                                                             │
│   │   ├── GET    /              → List products                            │
│   │   └── GET    /[id]          → Get product detail                       │
│   │                                                                         │
│   ├── /orders                                                               │
│   │   ├── GET    /              → List user orders                         │
│   │   ├── POST   /              → Create order                             │
│   │   └── GET    /[id]          → Get order detail                         │
│   │                                                                         │
│   ├── /users                                                                │
│   │   └── /me                                                               │
│   │       ├── GET    /          → Get current user                         │
│   │       ├── PATCH  /          → Update profile                           │
│   │       └── /measurements                                                │
│   │           ├── GET    /      → Get measurements                         │
│   │           └── POST   /      → Save measurements                        │
│   │                                                                         │
│   ├── /cart                                                                 │
│   │   ├── GET    /              → Get cart items                           │
│   │   ├── POST   /              → Add to cart                              │
│   │   └── DELETE /[id]          → Remove from cart                         │
│   │                                                                         │
│   ├── /wishlist                                                             │
│   │   ├── GET    /              → Get wishlist                             │
│   │   ├── POST   /              → Add to wishlist                          │
│   │   └── DELETE /[id]          → Remove from wishlist                     │
│   │                                                                         │
│   ├── /coupons                                                              │
│   │   └── POST   /validate      → Validate coupon code                     │
│   │                                                                         │
│   └── /subscriptions                                                        │
│       ├── GET    /              → Get subscription status                  │
│       ├── POST   /              → Create subscription                      │
│       └── DELETE /              → Cancel subscription                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Common Response Format

### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  count?: number;       // For list endpoints
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Response
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;       // e.g., "VALIDATION_ERROR"
    message: string;    // Human-readable message
    details?: Record<string, string[]>;  // Field-level errors
  };
}
```

### HTTP Status Codes
| Code | Usage |
|------|-------|
| `200` | Successful GET, PATCH |
| `201` | Successful POST (created) |
| `204` | Successful DELETE |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized |
| `403` | Forbidden (no permission) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Products API

### GET /api/products

상품 목록을 조회합니다.

**Query Parameters**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `category` | string | Category slug로 필터링 | - |
| `brand` | string | Brand slug로 필터링 | - |
| `sort` | string | 정렬 방식 | `latest` |
| `new` | boolean | 신상품만 조회 | `false` |
| `best` | boolean | 베스트 상품만 조회 | `false` |
| `page` | number | 페이지 번호 | `1` |
| `limit` | number | 페이지당 개수 | `20` |
| `minPrice` | number | 최소 가격 | - |
| `maxPrice` | number | 최대 가격 | - |

**Sort Options**

| Value | Description |
|-------|-------------|
| `latest` | 최신순 (기본값) |
| `price-low` | 가격 낮은 순 |
| `price-high` | 가격 높은 순 |
| `best` | 인기순 |

**Request Example**
```bash
GET /api/products?category=vibrators&sort=price-low&page=1&limit=12
```

**Response Example**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "Premium Vibrator",
      "slug": "premium-vibrator",
      "price": 89000,
      "compareAtPrice": 120000,
      "imageUrl": "https://cdn.example.com/product1.jpg",
      "isNew": true,
      "isBest": false,
      "isSoldOut": false,
      "category": {
        "id": "cat123",
        "name": "바이브레이터",
        "slug": "vibrators"
      }
    }
  ],
  "count": 48,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

**Implementation**
```typescript
// src/app/api/products/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "latest";
  const isNew = searchParams.get("new") === "true";
  const isBest = searchParams.get("best") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    is_active: true,
    ...(category && { category: { slug: category } }),
    ...(isNew && { is_new: true }),
    ...(isBest && { is_best: true }),
  };

  // Build orderBy
  const orderBy = getOrderBy(sort);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        images: { take: 1, orderBy: { sort_order: "asc" } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return Response.json({
    success: true,
    data: products.map(formatProduct),
    count: total,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

---

### GET /api/products/[id]

단일 상품 상세 정보를 조회합니다.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID or slug |

**Response Example**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "Premium Vibrator",
    "slug": "premium-vibrator",
    "description": "프리미엄 품질의 바이브레이터입니다.",
    "price": 89000,
    "compareAtPrice": 120000,
    "stockQuantity": 50,
    "isNew": true,
    "isBest": false,
    "category": {
      "id": "cat123",
      "name": "바이브레이터",
      "slug": "vibrators"
    },
    "brand": {
      "id": "brand123",
      "name": "BrandName",
      "slug": "brandname"
    },
    "images": [
      {
        "id": "img1",
        "url": "https://cdn.example.com/product1-1.jpg",
        "altText": "Product front view"
      },
      {
        "id": "img2",
        "url": "https://cdn.example.com/product1-2.jpg",
        "altText": "Product side view"
      }
    ],
    "variants": [
      {
        "id": "var1",
        "name": "Pink",
        "sku": "PV-001-PK",
        "price": null,
        "stockQuantity": 25,
        "options": { "color": "Pink" }
      }
    ],
    "sizeData": {
      "measurements": [
        { "type": "LENGTH", "min": 15, "max": 20, "unit": "cm" },
        { "type": "GIRTH", "min": 8, "max": 12, "unit": "cm" }
      ]
    }
  }
}
```

---

## Orders API

### POST /api/orders

새 주문을 생성합니다.

**Authentication**: Required

**Request Body**
```typescript
interface CreateOrderInput {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shipping: {
    name: string;
    phone: string;
    address: {
      zipCode: string;
      address1: string;
      address2?: string;
    };
    memo?: string;
  };
  couponCode?: string;
  paymentMethod: "CARD" | "BANK_TRANSFER" | "KAKAO_PAY" | "TOSS_PAY";
}
```

**Request Example**
```json
{
  "items": [
    { "productId": "clx123", "quantity": 2 },
    { "productId": "clx456", "variantId": "var1", "quantity": 1 }
  ],
  "shipping": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": {
      "zipCode": "06234",
      "address1": "서울시 강남구 테헤란로 123",
      "address2": "4층 401호"
    },
    "memo": "경비실에 맡겨주세요"
  },
  "couponCode": "WELCOME10",
  "paymentMethod": "CARD"
}
```

**Response Example**
```json
{
  "success": true,
  "data": {
    "id": "ord_abc123",
    "orderNumber": "TBR-20251217-001",
    "status": "PAYMENT_PENDING",
    "subtotal": 178000,
    "discount": 17800,
    "innerCircleDiscount": 0,
    "shippingFee": 0,
    "total": 160200,
    "paymentUrl": "https://pay.toss.im/order/..."
  }
}
```

---

### GET /api/orders

사용자의 주문 목록을 조회합니다.

**Authentication**: Required

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | 주문 상태로 필터링 |
| `page` | number | 페이지 번호 |
| `limit` | number | 페이지당 개수 |

**Response Example**
```json
{
  "success": true,
  "data": [
    {
      "id": "ord_abc123",
      "orderNumber": "TBR-20251217-001",
      "status": "DELIVERED",
      "total": 160200,
      "itemCount": 3,
      "createdAt": "2025-12-17T10:30:00Z",
      "items": [
        {
          "name": "Premium Vibrator",
          "quantity": 2,
          "price": 89000,
          "imageUrl": "https://cdn.example.com/product1.jpg"
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

---

## Users API

### GET /api/users/me

현재 로그인한 사용자 정보를 조회합니다.

**Authentication**: Required

**Response Example**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "isAdultVerified": true,
    "adultVerifiedAt": "2025-12-01T00:00:00Z",
    "subscriptionTier": "STANDARD",
    "subscription": {
      "tier": "STANDARD",
      "status": "ACTIVE",
      "currentPeriodEnd": "2026-01-17T00:00:00Z",
      "price": 9900
    },
    "createdAt": "2025-11-15T00:00:00Z"
  }
}
```

---

### GET /api/users/me/measurements

사용자의 신체 정보를 조회합니다 (암호화된 데이터).

**Authentication**: Required

**Response Example**
```json
{
  "success": true,
  "data": {
    "height": 175,
    "weight": 70,
    "length": 14,
    "girth": 11,
    "updatedAt": "2025-12-15T10:00:00Z"
  }
}
```

### POST /api/users/me/measurements

신체 정보를 저장합니다.

**Request Body**
```json
{
  "height": 175,
  "weight": 70,
  "length": 14,
  "girth": 11
}
```

---

## Cart API

### GET /api/cart

서버 측 장바구니를 조회합니다 (로그인 사용자용).

**Authentication**: Required

**Response Example**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_1",
        "productId": "clx123",
        "variantId": null,
        "quantity": 2,
        "product": {
          "id": "clx123",
          "name": "Premium Vibrator",
          "price": 89000,
          "imageUrl": "https://cdn.example.com/product1.jpg"
        }
      }
    ],
    "totals": {
      "subtotal": 178000,
      "discount": 0,
      "shipping": 3000,
      "total": 181000
    }
  }
}
```

### POST /api/cart

장바구니에 상품을 추가합니다.

**Request Body**
```json
{
  "productId": "clx123",
  "variantId": "var1",
  "quantity": 1
}
```

---

## Coupons API

### POST /api/coupons/validate

쿠폰 코드를 검증합니다.

**Request Body**
```json
{
  "code": "WELCOME10",
  "subtotal": 100000
}
```

**Response Example (Valid)**
```json
{
  "success": true,
  "data": {
    "code": "WELCOME10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "calculatedDiscount": 10000,
    "minOrderAmount": 50000,
    "maxDiscount": 20000,
    "expiresAt": "2025-12-31T23:59:59Z"
  }
}
```

**Response Example (Invalid)**
```json
{
  "success": false,
  "error": {
    "code": "COUPON_EXPIRED",
    "message": "이 쿠폰은 만료되었습니다."
  }
}
```

---

## Subscriptions API

### GET /api/subscriptions

현재 구독 상태를 조회합니다.

**Authentication**: Required

**Response Example**
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "tier": "STANDARD",
    "status": "ACTIVE",
    "price": 9900,
    "currentPeriodStart": "2025-12-17T00:00:00Z",
    "currentPeriodEnd": "2026-01-17T00:00:00Z",
    "nextBillingDate": "2026-01-17T00:00:00Z",
    "selectedOrg": {
      "id": "org_1",
      "name": "기부 단체명"
    },
    "benefits": {
      "discountRate": 10,
      "freeShippingThreshold": 30000,
      "donationRate": 1
    }
  }
}
```

### POST /api/subscriptions

새 구독을 생성합니다.

**Request Body**
```json
{
  "tier": "STANDARD",
  "paymentMethod": "billingKey",
  "billingKey": "bk_abc123...",
  "customerKey": "cust_123",
  "selectedOrgId": "org_1"
}
```

### DELETE /api/subscriptions

구독을 해지합니다.

**Request Body**
```json
{
  "reason": "더 이상 필요하지 않음",
  "feedback": "서비스 개선 의견..."
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | 입력 데이터 검증 실패 |
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `PRODUCT_NOT_FOUND` | 404 | 상품을 찾을 수 없음 |
| `OUT_OF_STOCK` | 400 | 재고 부족 |
| `COUPON_INVALID` | 400 | 유효하지 않은 쿠폰 |
| `COUPON_EXPIRED` | 400 | 만료된 쿠폰 |
| `COUPON_MIN_ORDER` | 400 | 최소 주문 금액 미달 |
| `PAYMENT_FAILED` | 400 | 결제 실패 |
| `SUBSCRIPTION_EXISTS` | 400 | 이미 구독 중 |
| `ADULT_VERIFICATION_REQUIRED` | 403 | 성인인증 필요 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| 일반 API | 100 requests / minute |
| 결제 API | 10 requests / minute |
| 인증 API | 5 requests / minute |

Rate limit 초과 시 `429 Too Many Requests` 응답.

---

## Webhooks (TossPayments)

### POST /api/webhooks/toss

TossPayments 결제 완료 웹훅을 처리합니다.

**Headers**
```
Authorization: Basic {encoded_secret_key}
Content-Type: application/json
```

**Payload Example**
```json
{
  "eventType": "PAYMENT_CONFIRMED",
  "data": {
    "paymentKey": "pk_abc123...",
    "orderId": "TBR-20251217-001",
    "status": "DONE",
    "totalAmount": 160200,
    "method": "카드",
    "approvedAt": "2025-12-17T10:35:00Z"
  }
}
```

---

**Last Updated**: 2025-12-17
