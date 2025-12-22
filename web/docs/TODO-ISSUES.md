# TODO Issues Tracker

> 자동 생성됨 - 코드베이스의 TODO 주석에서 추출

## 📋 이슈 목록

### 🔐 인증 (Authentication)

#### [AUTH-001] PASS 성인인증 구현
- **파일**: `src/components/auth/register-form.tsx:82`
- **우선순위**: 🔴 High
- **설명**: 성인 전용 서비스를 위한 PASS 본인인증 연동 필요
- **작업 내용**:
  - [ ] SKT PASS API 연동
  - [ ] 성인 확인 로직 구현
  - [ ] 인증 실패 시 에러 처리

#### [AUTH-002] Supabase Auth 회원가입 구현
- **파일**: `src/app/(auth)/register/page.tsx:18, 29`
- **우선순위**: 🔴 High
- **설명**: 실제 회원가입 로직 구현 필요
- **작업 내용**:
  - [ ] Supabase Auth로 사용자 생성
  - [ ] users 테이블에 추가 정보 저장 (name, phone)
  - [ ] 이메일 인증 플로우

---

### 💳 결제 (Checkout)

#### [CHECKOUT-001] Daum 주소 API 연동
- **파일**: `src/components/checkout/checkout-form.tsx:143`
- **우선순위**: 🟡 Medium
- **설명**: 배송지 입력 시 Daum 우편번호 API 연동
- **작업 내용**:
  - [ ] Daum Postcode 스크립트 로드
  - [ ] 주소 검색 모달 구현
  - [ ] 상세 주소 자동 입력

#### [CHECKOUT-002] Auth Context에서 Inner Circle 상태 가져오기
- **파일**: `src/app/(shop)/checkout/page.tsx:22`
- **우선순위**: 🟡 Medium
- **설명**: 현재 하드코딩된 isInnerCircle 값을 auth context에서 가져오기
- **작업 내용**:
  - [ ] useAuth hook 연동
  - [ ] 구독 상태 확인 로직

#### [CHECKOUT-003] TossPayments 결제 연동
- **파일**: `src/app/(shop)/checkout/page.tsx:26`
- **우선순위**: 🔴 High
- **설명**: 실제 결제 처리 구현
- **작업 내용**:
  - [ ] 주문 데이터베이스 저장
  - [ ] TossPayments SDK 연동
  - [ ] 결제 확인 및 완료 처리
  - [ ] 결제 실패 시 복구 로직

---

### 🛒 장바구니 (Cart)

#### [CART-001] 쿠폰 유효성 검사 API
- **파일**: `src/stores/cart-store.ts:239`
- **우선순위**: 🟡 Medium
- **설명**: 쿠폰 코드 검증 API 구현
- **작업 내용**:
  - [ ] `/api/coupons/validate` 엔드포인트 구현
  - [ ] 쿠폰 만료, 사용 조건 검증
  - [ ] 에러 메시지 처리

---

### 📦 상품 (Products)

#### [PRODUCT-001] 상품 목록 API 연동
- **파일**: `src/app/(shop)/products/page.tsx:170`
- **우선순위**: 🟡 Medium
- **설명**: Mock 데이터를 실제 API로 교체
- **작업 내용**:
  - [ ] `/api/products` 호출로 변경
  - [ ] 필터링, 정렬, 페이지네이션 파라미터 전달

#### [PRODUCT-002] 장바구니 담기 기능
- **파일**: `src/app/(shop)/products-section.tsx:128`
- **우선순위**: 🟢 Low
- **설명**: 홈페이지 상품 섹션에서 장바구니 담기
- **작업 내용**:
  - [ ] useCartStore 연동
  - [ ] 옵션 선택 모달 (필요시)
  - [ ] 성공 토스트 표시

#### [PRODUCT-003] Quick View 모달
- **파일**: `src/app/(shop)/products-section.tsx:182`
- **우선순위**: 🟢 Low
- **설명**: 상품 빠른 보기 모달 구현
- **작업 내용**:
  - [ ] 모달 컴포넌트 생성
  - [ ] 상품 상세 정보 표시
  - [ ] 장바구니 담기 연동

---

### 📋 주문 (Orders)

#### [ORDER-001] 주문 상세 API 연동
- **파일**: `src/app/(shop)/orders/confirmation/page.tsx:66`
- **우선순위**: 🟡 Medium
- **설명**: Mock 주문 데이터를 실제 API로 교체
- **작업 내용**:
  - [ ] `GET /api/orders/${orderId}` 호출
  - [ ] 로딩 상태 처리
  - [ ] 주문 없음 에러 처리

---

### ❤️ 위시리스트 (Wishlist)

#### [WISHLIST-001] 위시리스트 삭제 API
- **파일**: `src/app/(shop)/wishlist/page.tsx:101`
- **우선순위**: 🟢 Low
- **설명**: 위시리스트 아이템 삭제 API 연동
- **작업 내용**:
  - [ ] `DELETE /api/wishlist/${id}` 구현
  - [ ] 낙관적 업데이트 적용

---

## 📊 통계

| 우선순위 | 개수 |
|----------|------|
| 🔴 High | 3 |
| 🟡 Medium | 5 |
| 🟢 Low | 4 |
| **총계** | **12** |

---

## 🗓️ 권장 구현 순서

1. **Phase 1 (MVP 완성)**
   - AUTH-001, AUTH-002 (회원가입)
   - CHECKOUT-003 (결제)

2. **Phase 2 (핵심 기능)**
   - CHECKOUT-001, CHECKOUT-002
   - CART-001
   - PRODUCT-001

3. **Phase 3 (UX 개선)**
   - ORDER-001
   - PRODUCT-002, PRODUCT-003
   - WISHLIST-001

---

*Generated: 2025-12-22*
