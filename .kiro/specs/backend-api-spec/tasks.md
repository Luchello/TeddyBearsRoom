# Implementation Tasks: backend-api-spec

> Generated: 2025-12-25
> Status: Completed
> Completed: 2025-12-25
> Language: ko
> Total: 8 Major Tasks, 28 Sub-tasks

---

## Task 1: 테스트 인프라 구축

테스트 환경을 설정하고 TDD 워크플로우를 위한 기반을 마련한다.

**Covers:** C1, C2, C3, C5

### 1.1 테스트 환경 설정 (P) ✅

Vitest와 테스트 데이터베이스를 설정하여 통합 테스트 실행 환경을 구축한다.

- [x] Vitest 및 테스트 유틸리티 패키지 설치
- [x] 테스트 데이터베이스 연결 설정 (Supabase 테스트 프로젝트 또는 로컬 PostgreSQL)
- [x] 테스트 헬퍼 함수 생성: `createTestUser`, `createTestProduct`, `cleanupTestData`
- [x] 테스트 실행 스크립트 추가 (`npm run test`, `npm run test:coverage`)

### 1.2 Auth Helper 테스트 작성 (P) ✅

인증 헬퍼 함수들의 단위 테스트를 작성하여 기존 구현을 검증한다.

- [x] `requireAuth` 함수 테스트: 인증 성공/실패 케이스
- [x] `apiError` 함수 테스트: 다양한 상태 코드와 에러 메시지
- [x] `apiSuccess` 함수 테스트: 데이터 래핑 및 상태 코드
- [x] 테스트 실행하여 기존 구현 검증

### 1.3 Rate Limiter 테스트 작성 (P) ✅

Rate Limiting 로직의 단위 테스트를 작성한다.

- [x] `withRateLimit` 함수 테스트: 제한 내 요청 허용
- [x] Rate Limit 초과 시 차단 테스트
- [x] 윈도우 리셋 후 요청 허용 테스트
- [x] 설정별 제한 테스트 (auth: 5/min, orders: 10/min, default: 30/min)

---

## Task 2: Auth API 테스트 및 검증

OAuth 콜백 엔드포인트의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 1.1

### 2.1 OAuth 콜백 테스트 작성 ✅

OAuth 콜백 엔드포인트의 통합 테스트를 작성한다.

- [x] 성공적인 OAuth 콜백 테스트: 세션 생성 및 리다이렉트 확인
- [x] authorization code 없이 콜백 테스트: 에러 페이지로 리다이렉트
- [x] OAuth 에러 파라미터 처리 테스트
- [x] Open Redirect 방지 테스트: 외부 URL은 루트로 리다이렉트

---

## Task 3: Users API 테스트 및 검증

사용자 프로필 및 신체 측정 정보 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 2.1, 2.2, 2.3, 2.4, 2.5, C4

### 3.1 프로필 조회 테스트 작성 (P) ✅

`GET /api/users/me` 엔드포인트의 테스트를 작성한다.

- [x] 기존 프로필 조회 테스트: 200 OK와 프로필 데이터 반환
- [x] 프로필 자동 생성 테스트: 없으면 생성 후 반환
- [x] 미인증 사용자 테스트: 401 Unauthorized
- [x] Rate Limit 초과 테스트: 429 Too Many Requests

### 3.2 프로필 수정 테스트 작성 (P) ✅

`PATCH /api/users/me` 엔드포인트의 테스트를 작성한다.

- [x] 이름 수정 테스트: 유효한 이름으로 업데이트
- [x] 아바타 수정 테스트 (허용된 호스트): 업데이트 성공
- [x] SSRF 방지 테스트: 비허용 호스트 거부
- [x] XSS 방지 테스트: HTML 태그 포함 이름 거부
- [x] 빈 요청 테스트: 수정할 필드 없음 에러

### 3.3 신체 측정 정보 테스트 작성 (P) ✅

`/api/users/me/measurements` 엔드포인트의 테스트를 작성한다.

- [x] 측정 정보 조회 테스트 (GET): 200 OK와 데이터 반환
- [x] 측정 정보 없음 테스트 (GET): 404 Not Found
- [x] 측정 정보 수정 테스트 (PATCH): 유효한 값으로 업데이트
- [x] 키 범위 검증 테스트 (PATCH): 100-250 범위 외 거부
- [x] 신발 사이즈 범위 검증 테스트 (PATCH): 200-320 범위 외 거부
- [x] 성별 enum 검증 테스트 (PATCH): 유효하지 않은 값 거부
- [x] 측정 정보 삭제 테스트 (DELETE): 모든 필드 null로 설정

---

## Task 4: Products API 테스트 및 검증

상품 목록 및 상세 조회 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 3.1, 3.2

### 4.1 상품 목록 테스트 작성 (P) ✅

`GET /api/products` 엔드포인트의 테스트를 작성한다.

- [x] 기본 조회 테스트: 페이지네이션 기본값 (page=1, limit=20)
- [x] 카테고리 필터 테스트: category 파라미터로 필터링
- [x] 신상품 필터 테스트: new=true 필터링
- [x] 베스트상품 필터 테스트: best=true 필터링
- [x] 가격 정렬 테스트: price-low, price-high
- [x] 페이지네이션 테스트: page, limit 파라미터
- [x] 최대 limit 제한 테스트: 100 초과 시 100으로 제한

### 4.2 상품 상세 테스트 작성 (P) ✅

`GET /api/products/[id]` 엔드포인트의 테스트를 작성한다.

- [x] 상품 상세 조회 테스트: 존재하는 ID로 200 OK
- [x] 존재하지 않는 상품 테스트: 404 Not Found

---

## Task 5: Orders API 테스트 및 검증

주문 조회 및 생성 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 4.1, 4.2

### 5.1 주문 조회 테스트 작성 (P) ✅

`GET /api/orders` 엔드포인트의 테스트를 작성한다.

- [x] 주문 목록 조회 테스트: orderItems, product 포함 반환
- [x] 주문 없음 테스트: 빈 배열 반환
- [x] 최신순 정렬 테스트: createdAt desc

### 5.2 주문 생성 테스트 작성 (P) ✅

`POST /api/orders` 엔드포인트의 테스트를 작성한다.

- [x] 주문 생성 테스트: 유효한 상품으로 201 Created
- [x] totalPrice 계산 테스트: DB 가격 기준으로 계산
- [x] 빈 주문 항목 테스트: 400 Bad Request
- [x] 존재하지 않는 상품 테스트: 400 Bad Request
- [x] 수량 범위 검증 테스트: 1-99 범위 외 거부
- [x] 최대 상품 수 제한 테스트: 50개 초과 거부
- [x] Rate Limit 테스트: 분당 10회 초과 시 429

---

## Task 6: Referrals API 테스트 및 검증

추천 시스템 관련 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7

### 6.1 추천 코드 테스트 작성 (P) ✅

`GET /api/referrals/code` 엔드포인트의 테스트를 작성한다.

- [x] 추천 코드 조회/생성 테스트: TBR prefix + 6자리 코드 반환
- [x] 코드 형식 검증 테스트: 혼동 문자(0, O, I, L, 1) 제외

### 6.2 추천 통계 테스트 작성 (P) ✅

`GET /api/referrals/stats` 엔드포인트의 테스트를 작성한다.

- [x] 추천 통계 조회 테스트: totalReferrals, activeReferrals, totalPointsEarned 등 반환

### 6.3 추천 코드 검증 테스트 작성 (P) ✅

`POST /api/referrals/validate` 엔드포인트의 테스트를 작성한다.

- [x] 유효한 추천 코드 테스트: valid=true와 referrerName 반환
- [x] 존재하지 않는 코드 테스트: valid=false와 에러 반환
- [x] 코드 없음 테스트: 400 Bad Request
- [x] Rate Limit 테스트: 분당 5회 초과 시 429 (Brute Force 방지)

### 6.4 마일스톤 보상 수령 테스트 작성 (P) ✅

`POST /api/referrals/claim` 엔드포인트의 테스트를 작성한다.

- [x] 보상 수령 테스트: 포인트 적립 및 claimed 상태 변경
- [x] 보상 ID 없음 테스트: 400 Bad Request
- [x] 다른 사용자의 보상 테스트: 400 Bad Request (권한 검증)

### 6.5 마일스톤 현황 테스트 작성 (P) ✅

`GET /api/referrals/milestones` 엔드포인트의 테스트를 작성한다.

- [x] 마일스톤 현황 조회 테스트: referrals 배열과 milestones 상세 반환
- [x] 마일스톤 상태 유형 테스트: pending, achieved, claimed

### 6.6 마일스톤 배치 체크 테스트 작성 (P) ✅

`POST /api/referrals/milestones/check` 엔드포인트의 테스트를 작성한다.

- [x] 마일스톤 체크 성공 테스트: CRON_SECRET 인증 후 처리
- [x] 인증 실패 테스트: 401 Unauthorized
- [x] CRON_SECRET 미설정 테스트: 500 Internal Server Error

### 6.7 앰버서더 상태 테스트 작성 (P) ✅

`GET /api/referrals/ambassador` 엔드포인트의 테스트를 작성한다.

- [x] 앰버서더 상태 조회 테스트: isAmbassador, benefits 반환
- [x] 자격 미달 테스트: isAmbassador=false, remainingForQualification > 0
- [x] 앰버서더 활성 테스트: 10명 이상 시 status=ACTIVE

---

## Task 7: Ambassador API 테스트 및 검증

앰버서더 무료 배송 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 6.1, 6.2

### 7.1 무료 배송 가능 여부 테스트 작성 (P) ✅

`GET /api/ambassador/free-shipping` 엔드포인트의 테스트를 작성한다.

- [x] 무료 배송 가능 테스트: available=true, nextAvailableAt=null
- [x] 무료 배송 이미 사용 테스트: available=false, nextAvailableAt=다음달 1일

### 7.2 무료 배송 사용 테스트 작성 (P) ✅

`POST /api/ambassador/free-shipping` 엔드포인트의 테스트를 작성한다.

- [x] 무료 배송 사용 테스트: nextFreeShippingAt 업데이트
- [x] 무료 배송 불가 테스트: 이미 사용 시 400 Bad Request

---

## Task 8: Cron API 테스트 및 검증

일일 크론 작업 API의 테스트를 작성하고 기존 구현을 검증한다.

**Covers:** 7.1

### 8.1 일일 마일스톤 크론 테스트 작성 ✅

`GET /api/cron/referral-milestones` 엔드포인트의 테스트를 작성한다.

- [x] 크론 작업 실행 테스트: CRON_SECRET 인증 후 마일스톤 체크 및 앰버서더 상태 업데이트
- [x] 인증 실패 테스트: 401 Unauthorized
- [x] 실행 시간 제한 테스트: 60초 이내 완료 확인

---

## Requirements Coverage Matrix

| Req ID | Task | Sub-task |
|--------|------|----------|
| 1.1 | 2 | 2.1 |
| 2.1 | 3 | 3.1 |
| 2.2 | 3 | 3.2 |
| 2.3 | 3 | 3.3 |
| 2.4 | 3 | 3.3 |
| 2.5 | 3 | 3.3 |
| 3.1 | 4 | 4.1 |
| 3.2 | 4 | 4.2 |
| 4.1 | 5 | 5.1 |
| 4.2 | 5 | 5.2 |
| 5.1 | 6 | 6.1 |
| 5.2 | 6 | 6.2 |
| 5.3 | 6 | 6.3 |
| 5.4 | 6 | 6.4 |
| 5.5 | 6 | 6.5 |
| 5.6 | 6 | 6.6 |
| 5.7 | 6 | 6.7 |
| 6.1 | 7 | 7.1 |
| 6.2 | 7 | 7.2 |
| 7.1 | 8 | 8.1 |
| C1 | 1 | 1.2 |
| C2 | 1 | 1.3 |
| C3 | 1 | 1.1 |
| C4 | 3 | 3.2 |
| C5 | 1 | 1.2 |

---

## Parallel Execution Guide

**Phase 1 (인프라):** Task 1 완료 필수 (의존성 없음)
- 1.1, 1.2, 1.3은 병렬 실행 가능 (P)

**Phase 2 (핵심 도메인):** Task 1 완료 후 병렬 실행
- Task 2, 3, 4, 5는 병렬 실행 가능 (P)
- 각 Task 내 sub-task도 병렬 실행 가능

**Phase 3 (추천 시스템):** Task 1 완료 후 실행
- Task 6 내 모든 sub-task 병렬 실행 가능 (P)

**Phase 4 (앰버서더 & 크론):** Task 1 완료 후 실행
- Task 7, 8 병렬 실행 가능 (P)

---

## Notes

- 이 문서는 `/kiro:spec-tasks backend-api-spec -y`로 생성됨
- 모든 태스크는 TDD 방식으로 진행 (테스트 작성 → 검증)
- (P) 마커는 병렬 실행 가능한 태스크를 표시
- 다음 단계: `/kiro:spec-impl backend-api-spec [task]`로 구현 시작
