# Requirements: backend-api-spec

> Generated: 2025-12-25
> Updated: 2025-12-26
> Status: ✅ Completed (Implementation + Tests)
> Language: ko

## Overview

TeddyBear's Room 백엔드 API 전체 명세 - E-commerce 플랫폼의 인증, 사용자, 상품, 주문, 추천 시스템 API

### Implementation Status

| 항목 | 상태 | 비고 |
|------|------|------|
| API 구현 | ✅ 100% (15/15) | 모든 엔드포인트 구현 완료 |
| 테스트 커버리지 | ✅ 100% (28/28) | 모든 sub-task 테스트 완료 |
| 설계 문서 | ✅ Approved | design.md 승인됨 |
| 태스크 추적 | ✅ Completed | tasks.md 완료됨 |

### Scope

**포함 도메인 (7개, 15개 엔드포인트):**
- Auth (1): OAuth 콜백 ✅
- Users (5): 프로필, 신체 측정 ✅
- Products (2): 상품 목록/상세 ✅
- Orders (2): 주문 조회/생성 ✅
- Referrals (7): 추천 코드, 마일스톤, 통계 ✅
- Ambassador (2): 앰버서더 혜택 ✅
- Cron (1): 자동화 작업 ✅

**제외:**
- `ts_*` prefix 레거시 테이블
- `snake_case` 분석/자동화 모델

---

## 1. Auth (인증)

### 1.1 OAuth 콜백 처리

**Endpoint:** `GET /api/auth/callback`

**Requirement:**
> When OAuth provider redirects with authorization code, the API shall exchange the code for a session and redirect the user to the intended destination.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 성공적인 OAuth 콜백
  Given OAuth 제공자가 유효한 authorization code를 전달
  When GET /api/auth/callback?code={valid_code}&next=/dashboard 호출
  Then 세션이 생성되고
  And 사용자는 /dashboard로 리다이렉트됨

Scenario: authorization code 없이 콜백
  Given code 파라미터가 없음
  When GET /api/auth/callback 호출
  Then /auth-code-error?error=no_code로 리다이렉트됨

Scenario: OAuth 에러 처리
  Given OAuth 제공자가 error 파라미터 전달
  When GET /api/auth/callback?error=access_denied 호출
  Then /auth-code-error?error=access_denied로 리다이렉트됨

Scenario: Open Redirect 방지
  Given next 파라미터가 외부 URL
  When GET /api/auth/callback?code={code}&next=https://evil.com
  Then 루트(/)로 리다이렉트됨
```

---

## 2. Users (사용자)

### 2.1 현재 사용자 프로필 조회

**Endpoint:** `GET /api/users/me`

**Requirement:**
> When an authenticated user requests their profile, the API shall return the profile data or create one if not exists.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 기존 프로필 조회
  Given 사용자가 로그인됨
  And 프로필이 존재함
  When GET /api/users/me 호출
  Then 200 OK 응답
  And { id, email, name, avatar, subscriptionTier, points, createdAt } 반환

Scenario: 프로필 자동 생성
  Given 사용자가 로그인됨
  And 프로필이 존재하지 않음
  When GET /api/users/me 호출
  Then 프로필이 자동 생성됨
  And 200 OK와 생성된 프로필 반환

Scenario: 미인증 사용자
  Given 사용자가 로그인되지 않음
  When GET /api/users/me 호출
  Then 401 Unauthorized 반환

Scenario: Rate Limit 초과
  Given 분당 30회 이상 요청
  When GET /api/users/me 호출
  Then 429 Too Many Requests 반환
```

### 2.2 프로필 수정

**Endpoint:** `PATCH /api/users/me`

**Requirement:**
> When an authenticated user submits profile updates, the API shall validate input and update only provided fields.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 이름 수정
  Given 사용자가 로그인됨
  When PATCH /api/users/me { name: "새로운이름" }
  Then 200 OK
  And name이 "새로운이름"으로 변경됨

Scenario: 아바타 수정 (허용된 호스트)
  Given 사용자가 로그인됨
  When PATCH /api/users/me { avatar: "https://images.unsplash.com/photo.jpg" }
  Then 200 OK
  And avatar가 업데이트됨

Scenario: 아바타 수정 (비허용 호스트 - SSRF 방지)
  Given 사용자가 로그인됨
  When PATCH /api/users/me { avatar: "https://evil.com/image.jpg" }
  Then 400 Bad Request
  And error: "허용되지 않은 이미지 호스트입니다"

Scenario: XSS 방지 (HTML 태그)
  Given 사용자가 로그인됨
  When PATCH /api/users/me { name: "<script>alert(1)</script>" }
  Then 400 Bad Request
  And error: "이름에 특수문자(<, >)를 사용할 수 없습니다"

Scenario: 수정할 필드 없음
  Given 사용자가 로그인됨
  When PATCH /api/users/me { }
  Then 400 Bad Request
  And error: "수정할 필드가 없습니다"
```

### 2.3 신체 측정 정보 조회

**Endpoint:** `GET /api/users/me/measurements`

**Requirement:**
> When an authenticated user requests their measurements, the API shall return body measurement data including encrypted fields.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 측정 정보 조회
  Given 사용자가 로그인됨
  And 측정 정보가 존재함
  When GET /api/users/me/measurements 호출
  Then 200 OK
  And { height, weight, gender, topSize, bottomSize, shoeSize, encryptedMeasurements } 반환

Scenario: 측정 정보 없음
  Given 사용자가 로그인됨
  And 프로필이 없음
  When GET /api/users/me/measurements 호출
  Then 404 Not Found
  And error: "프로필을 찾을 수 없습니다"
```

### 2.4 신체 측정 정보 수정

**Endpoint:** `PATCH /api/users/me/measurements`

**Requirement:**
> When an authenticated user submits measurement updates, the API shall validate ranges and upsert the data.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 측정 정보 수정
  Given 사용자가 로그인됨
  When PATCH /api/users/me/measurements { height: 175, weight: 70 }
  Then 200 OK
  And height: 175, weight: 70 반환

Scenario: 키 범위 검증 (100-250)
  Given 사용자가 로그인됨
  When PATCH /api/users/me/measurements { height: 50 }
  Then 400 Bad Request
  And error: "키는 100cm 이상이어야 합니다"

Scenario: 신발 사이즈 범위 검증 (200-320)
  Given 사용자가 로그인됨
  When PATCH /api/users/me/measurements { shoeSize: 400 }
  Then 400 Bad Request
  And error: "신발 사이즈는 320mm 이하여야 합니다"

Scenario: 성별 enum 검증
  Given 사용자가 로그인됨
  When PATCH /api/users/me/measurements { gender: "INVALID" }
  Then 400 Bad Request
```

### 2.5 신체 측정 정보 삭제

**Endpoint:** `DELETE /api/users/me/measurements`

**Requirement:**
> When an authenticated user requests deletion, the API shall clear all measurement fields (soft delete).

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 측정 정보 삭제
  Given 사용자가 로그인됨
  And 측정 정보가 존재함
  When DELETE /api/users/me/measurements 호출
  Then 200 OK
  And message: "사이즈 정보가 삭제되었습니다"
  And 모든 측정 필드가 null로 설정됨
```

---

## 3. Products (상품)

### 3.1 상품 목록 조회

**Endpoint:** `GET /api/products`

**Requirement:**
> The API shall return a paginated list of products with filtering and sorting options.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 기본 조회 (페이지네이션)
  When GET /api/products 호출
  Then 200 OK
  And { success, data, count, pagination } 반환
  And pagination.page = 1, pagination.limit = 20

Scenario: 카테고리 필터
  When GET /api/products?category=바디토너 호출
  Then 모든 상품의 category가 "바디토너"

Scenario: 신상품 필터
  When GET /api/products?new=true 호출
  Then 모든 상품의 isNew가 true

Scenario: 베스트상품 필터
  When GET /api/products?best=true 호출
  Then 모든 상품의 isBest가 true

Scenario: 가격 낮은순 정렬
  When GET /api/products?sort=price-low 호출
  Then 상품이 가격 오름차순으로 정렬됨

Scenario: 가격 높은순 정렬
  When GET /api/products?sort=price-high 호출
  Then 상품이 가격 내림차순으로 정렬됨

Scenario: 페이지네이션
  When GET /api/products?page=2&limit=12 호출
  Then pagination.page = 2, pagination.limit = 12
  And skip = 12 (첫 12개 건너뜀)

Scenario: 최대 limit 제한
  When GET /api/products?limit=500 호출
  Then pagination.limit = 100 (최대값으로 제한)
```

### 3.2 상품 상세 조회

**Endpoint:** `GET /api/products/[id]`

**Requirement:**
> When a product ID is provided, the API shall return the product details or 404 if not found.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 상품 상세 조회
  Given 상품 ID가 존재함
  When GET /api/products/{id} 호출
  Then 200 OK
  And { success: true, data: Product } 반환

Scenario: 존재하지 않는 상품
  Given 상품 ID가 존재하지 않음
  When GET /api/products/{invalid_id} 호출
  Then 404 Not Found
  And error: "상품을 찾을 수 없습니다"
```

---

## 4. Orders (주문)

### 4.1 주문 목록 조회

**Endpoint:** `GET /api/orders`

**Requirement:**
> When an authenticated user requests orders, the API shall return their order history with items and product details.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 주문 목록 조회
  Given 사용자가 로그인됨
  And 주문이 존재함
  When GET /api/orders 호출
  Then 200 OK
  And 주문 배열 반환 (orderItems, product 포함)
  And 최신순 정렬 (createdAt desc)

Scenario: 주문 없음
  Given 사용자가 로그인됨
  And 주문이 없음
  When GET /api/orders 호출
  Then 200 OK
  And 빈 배열 반환
```

### 4.2 주문 생성

**Endpoint:** `POST /api/orders`

**Requirement:**
> When an authenticated user submits an order, the API shall validate products, calculate total price, and create the order with items.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 주문 생성
  Given 사용자가 로그인됨
  And 유효한 상품 ID 목록
  When POST /api/orders { items: [{productId, quantity}], shippingAddress }
  Then 201 Created
  And 주문이 생성됨
  And totalPrice가 DB 가격 기준으로 계산됨

Scenario: 빈 주문 항목
  Given 사용자가 로그인됨
  When POST /api/orders { items: [] }
  Then 400 Bad Request
  And error: "주문 상품이 없습니다"

Scenario: 존재하지 않는 상품
  Given 사용자가 로그인됨
  When POST /api/orders { items: [{productId: "invalid", quantity: 1}] }
  Then 400 Bad Request
  And error: "상품을 찾을 수 없습니다: invalid"

Scenario: 수량 범위 검증 (1-99)
  Given 사용자가 로그인됨
  When POST /api/orders { items: [{productId: "valid", quantity: 0}] }
  Then 400 Bad Request
  And error: "수량은 최소 1개 이상이어야 합니다"

Scenario: 최대 상품 수 제한
  Given 사용자가 로그인됨
  When POST /api/orders { items: [51개 상품] }
  Then 400 Bad Request
  And error: "한 번에 최대 50개 상품까지 주문 가능합니다"

Scenario: Rate Limit (주문 생성)
  Given 분당 10회 이상 주문 생성 시도
  When POST /api/orders 호출
  Then 429 Too Many Requests
```

---

## 5. Referrals (추천 시스템)

### 5.1 추천 코드 조회/생성

**Endpoint:** `GET /api/referrals/code`

**Requirement:**
> When an authenticated user requests their referral code, the API shall return existing code or generate a new one.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 추천 코드 조회
  Given 사용자가 로그인됨
  When GET /api/referrals/code 호출
  Then 200 OK
  And { code: "TBR{6자}", shareUrl } 반환

Scenario: 추천 코드 형식
  When 추천 코드 생성
  Then 코드는 "TBR" prefix로 시작
  And 6자리 영숫자 (0, O, I, L, 1 제외)
  And 예: "TBR3K7HN2"
```

### 5.2 추천 현황 통계

**Endpoint:** `GET /api/referrals/stats`

**Requirement:**
> When an authenticated user requests stats, the API shall return referral counts, earned points, and ambassador status.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 추천 통계 조회
  Given 사용자가 로그인됨
  When GET /api/referrals/stats 호출
  Then 200 OK
  And { totalReferrals, activeReferrals, totalPointsEarned, unclaimedPoints, ambassador, milestoneConfig, ambassadorConfig } 반환
```

### 5.3 추천 코드 유효성 검증

**Endpoint:** `POST /api/referrals/validate`

**Requirement:**
> When a referral code is submitted, the API shall validate format and existence with rate limiting.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 유효한 추천 코드
  Given 존재하는 추천 코드
  When POST /api/referrals/validate { code: "TBR3K7HN2" }
  Then 200 OK
  And { valid: true, referrerName } 반환

Scenario: 존재하지 않는 코드
  When POST /api/referrals/validate { code: "TBRXXX123" }
  Then 200 OK
  And { valid: false, error } 반환

Scenario: 코드 없음
  When POST /api/referrals/validate { }
  Then 400 Bad Request
  And error: "추천 코드를 입력해주세요"

Scenario: Rate Limit (Brute Force 방지)
  Given 분당 5회 이상 검증 시도
  When POST /api/referrals/validate 호출
  Then 429 Too Many Requests
```

### 5.4 마일스톤 보상 수령

**Endpoint:** `POST /api/referrals/claim`

**Requirement:**
> When an authenticated user claims a milestone reward, the API shall verify ownership and mark as claimed.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 보상 수령
  Given 사용자가 로그인됨
  And 달성된 마일스톤이 있음
  And 보상 미수령 상태
  When POST /api/referrals/claim { rewardId }
  Then 200 OK
  And { success: true, pointsAwarded } 반환
  And 포인트가 프로필에 추가됨

Scenario: 보상 ID 없음
  Given 사용자가 로그인됨
  When POST /api/referrals/claim { }
  Then 400 Bad Request
  And error: "보상 ID가 필요합니다"

Scenario: 다른 사용자의 보상
  Given 사용자가 로그인됨
  And 다른 사용자의 보상 ID
  When POST /api/referrals/claim { rewardId }
  Then 400 Bad Request
```

### 5.5 마일스톤 현황 조회

**Endpoint:** `GET /api/referrals/milestones`

**Requirement:**
> When an authenticated user requests milestones, the API shall return detailed status for each referral's milestone progress.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 마일스톤 현황 조회
  Given 사용자가 로그인됨
  When GET /api/referrals/milestones 호출
  Then 200 OK
  And {
    totalReferrals, activeReferrals, completedReferrals,
    totalPointsEarned, unclaimedPoints, maxPointsPerReferral,
    referrals: [{
      referee, status, subscriptionStartedAt, monthsSubscribed,
      milestones: [{ months, points, name, status }]
    }]
  } 반환

Scenario: 마일스톤 상태 유형
  Given 마일스톤 조회 시
  Then 각 마일스톤 status는 "pending" | "achieved" | "claimed" 중 하나
```

### 5.6 마일스톤 배치 체크 (Cron)

**Endpoint:** `POST /api/referrals/milestones/check`

**Requirement:**
> When triggered by authorized cron job, the API shall check all active referrals and award eligible milestones.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 마일스톤 체크 성공
  Given 유효한 CRON_SECRET
  When POST /api/referrals/milestones/check (Authorization: Bearer {CRON_SECRET})
  Then 200 OK
  And { success: true, message, duration } 반환

Scenario: 인증 실패
  Given 잘못된 CRON_SECRET
  When POST /api/referrals/milestones/check
  Then 401 Unauthorized

Scenario: CRON_SECRET 미설정
  Given CRON_SECRET 환경변수 없음
  When POST /api/referrals/milestones/check
  Then 500 Internal Server Error
```

### 5.7 앰버서더 상태 조회

**Endpoint:** `GET /api/referrals/ambassador`

**Requirement:**
> When an authenticated user requests ambassador status, the API shall return qualification status and available benefits.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 앰버서더 상태 조회
  Given 사용자가 로그인됨
  When GET /api/referrals/ambassador 호출
  Then 200 OK
  And {
    isAmbassador, status, totalReferrals, remainingForQualification,
    qualifiedAt, benefits: { newProductEarlyAccess, monthlyFreeShipping, freeShippingAvailable, nextFreeShippingAt }
  } 반환

Scenario: 앰버서더 자격 조건
  Given 추천 성공 10명 미만
  Then isAmbassador: false
  And remainingForQualification > 0

Scenario: 앰버서더 활성
  Given 추천 성공 10명 이상
  Then isAmbassador: true
  And status: "ACTIVE"
  And benefits 활성화
```

---

## 6. Ambassador (앰버서더)

### 6.1 무료 배송 가능 여부 조회

**Endpoint:** `GET /api/ambassador/free-shipping`

**Requirement:**
> When an authenticated ambassador requests availability, the API shall return current free shipping status.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 무료 배송 가능
  Given 사용자가 앰버서더
  And 이번 달 무료 배송 미사용
  When GET /api/ambassador/free-shipping 호출
  Then 200 OK
  And { available: true, nextAvailableAt: null }

Scenario: 무료 배송 이미 사용
  Given 사용자가 앰버서더
  And 이번 달 무료 배송 사용함
  When GET /api/ambassador/free-shipping 호출
  Then 200 OK
  And { available: false, nextAvailableAt: "다음달 1일" }
```

### 6.2 무료 배송 사용

**Endpoint:** `POST /api/ambassador/free-shipping`

**Requirement:**
> When an authenticated ambassador uses free shipping, the API shall mark it as consumed for the current month.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 무료 배송 사용
  Given 사용자가 앰버서더
  And 이번 달 무료 배송 가능
  When POST /api/ambassador/free-shipping 호출
  Then 200 OK
  And { success: true }
  And nextFreeShippingAt이 다음 달로 설정됨

Scenario: 무료 배송 불가
  Given 사용자가 앰버서더
  And 이번 달 이미 사용함
  When POST /api/ambassador/free-shipping 호출
  Then 400 Bad Request
  And { success: false, error }
```

---

## 7. Cron (자동화)

### 7.1 일일 추천 마일스톤 체크

**Endpoint:** `GET /api/cron/referral-milestones`

**Requirement:**
> When triggered daily, the API shall check all active referrals for milestone achievements and update ambassador statuses.

**Acceptance Criteria (TDD):**

```gherkin
Scenario: 크론 작업 실행
  Given 유효한 CRON_SECRET
  When GET /api/cron/referral-milestones (Authorization: Bearer {CRON_SECRET})
  Then 200 OK
  And {
    success: true, timestamp, duration,
    results: { milestones: "checked", ambassadors: { updated, newAmbassadors } }
  } 반환

Scenario: 인증 실패
  Given 잘못된 Authorization 헤더
  When GET /api/cron/referral-milestones 호출
  Then 401 Unauthorized

Scenario: 실행 시간 제한
  Given maxDuration = 60초
  When 크론 작업 실행
  Then 60초 이내에 완료되어야 함
```

---

## Cross-Cutting Requirements (공통 요구사항)

### C1. 인증 (Authentication)

**Requirement:**
> All protected endpoints shall require valid Supabase authentication.

**Acceptance Criteria:**

```gherkin
Scenario: 인증 필수 엔드포인트
  Given 보호된 엔드포인트 목록:
    - /api/users/me (GET, PATCH)
    - /api/users/me/measurements (GET, PATCH, DELETE)
    - /api/orders (GET, POST)
    - /api/referrals/* (code, stats, claim, milestones, ambassador)
    - /api/ambassador/free-shipping (GET, POST)
  When 인증 없이 호출
  Then 401 Unauthorized
  And { error: "Unauthorized" }
```

### C2. Rate Limiting

**Requirement:**
> The API shall enforce rate limits to prevent abuse.

**Acceptance Criteria:**

```gherkin
Scenario: 기본 Rate Limit
  Given 엔드포인트별 기본 제한: 분당 30회
  When 제한 초과
  Then 429 Too Many Requests

Scenario: 주문 생성 Rate Limit
  Given /api/orders POST: 분당 10회 제한
  When 제한 초과
  Then 429 Too Many Requests

Scenario: 추천 코드 검증 Rate Limit
  Given /api/referrals/validate: 분당 5회 제한 (Brute Force 방지)
  When 제한 초과
  Then 429 Too Many Requests
```

### C3. 입력 검증 (Input Validation)

**Requirement:**
> All user inputs shall be validated using Zod schemas.

**Acceptance Criteria:**

```gherkin
Scenario: JSON 파싱 실패
  Given 잘못된 JSON 형식
  When POST/PATCH 요청
  Then 400 Bad Request
  And error: "잘못된 JSON 형식입니다"

Scenario: 스키마 검증 실패
  Given 필수 필드 누락 또는 잘못된 타입
  When POST/PATCH 요청
  Then 400 Bad Request
  And 상세 검증 에러 메시지
```

### C4. 보안 (Security)

**Requirement:**
> The API shall implement security measures against common attacks.

**Acceptance Criteria:**

```gherkin
Scenario: XSS 방지
  Given 프로필 name 필드
  When HTML 태그 포함 입력 (<, >)
  Then 400 Bad Request

Scenario: SSRF 방지
  Given 아바타 URL
  When 비허용 도메인 입력
  Then 400 Bad Request
  And error: "허용되지 않은 이미지 호스트입니다"

Scenario: 에러 메시지 보안
  Given 서버 에러 발생
  When 응답 반환
  Then 상세 스택 트레이스는 로그에만 기록
  And 클라이언트에는 일반 에러 메시지만 전달
```

### C5. 응답 형식 (Response Format)

**Requirement:**
> All API responses shall follow consistent JSON format.

**Acceptance Criteria:**

```gherkin
Scenario: 성공 응답
  When API 호출 성공
  Then { success: true, data: ... }

Scenario: 에러 응답
  When API 호출 실패
  Then { success: false, error: "에러 메시지", code?: "ERROR_CODE" }
  And 적절한 HTTP 상태 코드 (400, 401, 404, 429, 500)
```

---

## Business Rules (비즈니스 규칙)

### B1. 마일스톤 보상 체계

```
┌─────────────────────────────────────────────────────────┐
│ 피추천인(B) 구독 유지 기간 → 추천인(A) 포인트 보상     │
├─────────────────────────────────────────────────────────┤
│ 3개월 유지  → 3,000P                                   │
│ 6개월 유지  → 5,000P                                   │
│ 12개월 유지 → 10,000P (최종)                           │
├─────────────────────────────────────────────────────────┤
│ 최대 획득 가능: 18,000P / 추천인                       │
└─────────────────────────────────────────────────────────┘
```

### B2. 앰버서더 자격 조건

```
┌─────────────────────────────────────────────────────────┐
│ 앰버서더 자격: 10명 이상 추천 성공                      │
├─────────────────────────────────────────────────────────┤
│ 혜택:                                                   │
│ - 신제품 먼저 체험                                     │
│ - 월 1회 무료 배송                                     │
└─────────────────────────────────────────────────────────┘
```

### B3. 포인트 정책

```
┌─────────────────────────────────────────────────────────┐
│ 포인트 만료: 12개월                                    │
│ 최소 사용 단위: 1,000P                                 │
│ 최소 사용 가능 잔액: 1,000P                            │
└─────────────────────────────────────────────────────────┘
```

---

## Data Models Summary

### Core Models (PascalCase - E-commerce)

| Model | Purpose |
|-------|---------|
| Profile | 사용자 프로필 (인증, 구독, 포인트, 추천) |
| Product | 상품 정보 |
| CartItem | 장바구니 항목 |
| WishlistItem | 위시리스트 항목 |
| Order | 주문 |
| OrderItem | 주문 항목 |
| Referral | 추천 관계 (A→B) |
| ReferralMilestone | 마일스톤 달성 기록 |
| ReferralMilestoneReward | 마일스톤 보상 기록 |
| AmbassadorStatus | 앰버서더 상태 |
| PointTransaction | 포인트 거래 내역 |

---

## Test Coverage Summary

### API 테스트 파일 (15개)

| 도메인 | 테스트 파일 | 테스트 수 |
|--------|-------------|----------|
| Auth | `auth-callback.test.ts` | 4 |
| Users | `users-me.test.ts` | 9 |
| Users | `users-me-measurements.test.ts` | 25 |
| Products | `products.test.ts` | 8 |
| Products | `products-detail.test.ts` | 4 |
| Orders | `orders.test.ts` | 10 |
| Referrals | `code.test.ts` | 3 |
| Referrals | `validate.test.ts` | 6 |
| Referrals | `stats.test.ts` | 5 |
| Referrals | `claim.test.ts` | 5 |
| Referrals | `milestones.test.ts` | 4 |
| Referrals | `milestones-check.test.ts` | 8 |
| Referrals | `ambassador.test.ts` | 10 |
| Ambassador | `free-shipping.test.ts` | 6 |
| Cron | `referral-milestones.test.ts` | 5 |

**총 테스트: ~112개** (모든 Acceptance Criteria 커버)

---

## Notes

- 이 문서는 `/kiro:spec-requirements backend-api-spec`으로 생성됨 (2025-12-25)
- `/kiro:spec-requirements`로 최신화됨 (2025-12-26)
- 모든 Acceptance Criteria는 TDD 방식으로 테스트 완료 ✅
- 구현 완료: 모든 API 엔드포인트 및 테스트 구현됨
