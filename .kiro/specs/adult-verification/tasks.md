# Implementation Tasks: 성인인증 시스템 (Adult Verification)

> Generated: 2026-01-03
> Spec: adult-verification
> Version: 2.0.0
> Status: Implementation In Progress

---

## Overview

이 문서는 성인인증 시스템 v2.0 (회원가입 통합 인증) 구현을 위한 상세 태스크 목록입니다.
모든 태스크는 TDD 방식으로 진행하며, 요구사항 및 설계 문서에 매핑됩니다.

**v2.0 핵심 변경**: 성인인증을 회원가입 과정에 통합 (가입 = 인증)

**총 태스크**: 10개 Major Tasks, 38개 Sub-tasks
**예상 작업량**: Sub-task 당 1-3시간

---

## Task 1: 프로젝트 설정 및 의존성 구성

**목표**: PortOne SDK 설치 및 환경 변수 구성

**Requirements**: 인프라 설정 (선행 작업)

### Sub-tasks

- [x] 1.1 (P) PortOne Browser SDK 패키지 설치 (`@portone/browser-sdk`) ✅ 이미 설치됨
- [x] 1.2 (P) 환경 변수 정의 및 `.env.example` 업데이트 ✅
  - `NEXT_PUBLIC_PORTONE_STORE_ID`, `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
  - `PORTONE_API_SECRET`
  - `ADULT_VERIFICATION_CI_SALT`, `REGISTRATION_TOKEN_SECRET` (v2.0 추가)
  - `ADULT_VERIFICATION_ENABLED`, `ADULT_VERIFICATION_AT_REGISTRATION`
- [x] 1.3 (P) 타입 정의 파일 생성 (`types/adult-verification.ts`) ✅
  - `VerificationStatus`, `VerificationEventType`, `RegistrationData` 타입
  - `RegisterInitiateRequest`, `RegisterInitiateResponse` 타입
  - `RegisterCompleteRequest`, `RegisterCompleteResponse` 타입
- [x] 1.4 (P) 상수 파일 생성 (`constants/adult-verification.ts`) ✅
  - `ADULT_AGE = 19`, `EXPIRY_DAYS = 365`, `REGISTRATION_TOKEN_EXPIRY_MINUTES = 15`
  - 에러 코드, 메서드, 제공사 상수

---

## Task 2: 데이터 모델 확장

**목표**: Profile 모델에 성인인증 필드 추가 및 로그 모델 생성

**Requirements**: 1.1, 1.2, 4.1, 4.2, 6.1

### Sub-tasks

- [x] 2.1 Profile 모델에 성인인증 필드 추가 (Prisma 스키마) ✅ 이미 존재
  - 기존: `isAdultVerified`, `adultVerifiedAt`
  - 추가: `adultVerifyMethod`, `adultVerifyProvider`, `adultVerifyTxid`, `ciHash`
- [x] 2.2 AdultVerificationLog 모델 생성 ✅ 이미 존재
  - `id`, `profileId` (nullable, 가입 실패 시 null), `txid`, `eventType`, `failureCode`, `createdAt`
  - 인덱스: `profileId`, `txid`, `createdAt`, `eventType`
- [x] 2.3 Prisma 마이그레이션 생성 및 적용 ✅ profileId optional로 변경
  - `npx prisma migrate dev --name add_adult_verification_v2`

---

## Task 3: 서비스 레이어 구현

**목표**: 성인인증 비즈니스 로직 서비스 및 등록 토큰 관리 구현

**Requirements**: 1.1, 1.2, 1.3, 3.2, 4.1, 6.1

### Sub-tasks

- [x] 3.1 `adult-verification.service.ts` 파일 생성 및 기본 구조 ✅ 이미 존재
- [x] 3.2 (P) 만 19세 이상 판정 함수 구현 (`isAdult`) ✅ 이미 존재
  - 생년월일 기반 만 나이 정확 계산
  - 생일 전/후 경계값 테스트 포함
- [x] 3.3 (P) 인증 만료 여부 확인 함수 구현 (`isVerificationExpired`) ✅ 이미 존재
  - 1년(365일) 만료 정책 적용
- [x] 3.4 (P) CI 해시 함수 구현 (`hashCi`) ✅ 이미 존재
  - SHA-256 + salt 처리, 원문 미저장
- [x] 3.5 (P) 등록 토큰 생성 함수 구현 (`createRegistrationToken`) ✅
  - AES-256-CBC 암호화
  - email + password + createdAt 포함
  - 15분 유효기간
- [x] 3.6 (P) 등록 토큰 복호화 함수 구현 (`decryptRegistrationToken`) ✅
  - 복호화 및 만료 체크
  - 실패 시 null 반환
- [x] 3.7 (P) PortOne 인증 결과 조회 함수 구현 (`fetchPortOneVerification`) ✅
  - `https://api.portone.io/identity-verifications/{id}` 호출
  - `Authorization: PortOne {API_SECRET}` 헤더
- [x] 3.8 (P) 인증 이벤트 로그 생성 함수 구현 (`logVerificationEvent`) ✅ UNDERAGE 지원 추가
  - INITIATED, SUCCESS, FAILED, UNDERAGE 이벤트 기록

---

## Task 4: 회원가입 API 구현 (v2.0 핵심)

**목표**: 회원가입 + 성인인증 통합 REST API 구현

**Requirements**: 1.1, 2.3, 3.1, 3.2, 3.3, 5.1

### Sub-tasks

- [x] 4.1 회원가입 시작 API 구현 (`/api/auth/register/initiate`) ✅
  - 이메일 중복 체크 (Supabase Admin API)
  - 비밀번호 강도 검증
  - 등록 토큰 생성 (email + password 암호화)
  - identityVerificationId 생성
  - INITIATED 로그 기록
  - storeId, channelKey, registrationToken 반환
- [x] 4.2 회원가입 완료 API 구현 (`/api/auth/register/complete`) ✅
  - 등록 토큰 검증 및 복호화
  - 중복 인증 체크 (동일 txid SUCCESS 로그)
  - PortOne API로 인증 결과 조회
  - 연령 확인 (만 19세 이상)
  - CI 해시 생성
  - Supabase Auth 사용자 생성 (`email_confirm: true`)
  - Profile 생성 (성인인증 정보 포함)
  - 성공 로그 기록
  - 자동 로그인 (세션 반환)
- [x] 4.3 인증 상태 조회 API 구현 (`/api/auth/adult-verification/status`) ✅ 이미 존재
  - 로그인 필수 체크
  - 현재 인증 상태 반환 (VERIFIED, EXPIRED)
  - 만료 여부 포함
- [ ] 4.4 재인증 API 구현 (`/api/auth/adult-verification/reverify`) 🔄 추후 구현
  - 만료된 사용자용 재인증 플로우
  - 기존 인증 방식과 유사하게 처리

---

## Task 5: 접근 제어 헬퍼 및 통합

**목표**: 성인인증 필수 API 보호 및 성인 상품 접근 제어

**Requirements**: 2.1, 2.2

### Sub-tasks

- [x] 5.1 `requireAdultVerification` 헬퍼 함수 구현 (`lib/api/adult-auth.ts`) ✅ 이미 존재
  - 로그인 체크 (`requireAuth()` 활용)
  - 인증 상태 체크 (v2.0: 가입 = 인증이므로 isAdultVerified 항상 true)
  - 만료 체크 (`isVerificationExpired`)
  - 에러 코드: `ADULT_VERIFICATION_EXPIRED`
- [ ] 5.2 (P) 성인 상품 API 보호 적용 🔄 추후 통합
  - 상품 상세 API: `isAdultOnly` 상품 접근 시 인증 체크
  - 성인 카테고리 API: 카테고리 전체 보호
- [ ] 5.3 (P) 장바구니/주문 API 보호 적용 🔄 추후 통합
  - 성인 상품 장바구니 추가 시 인증 체크
  - 성인 상품 포함 주문 시 인증 체크
- [x] 5.4 (P) 기능 플래그 기반 조건부 적용 ✅ 이미 존재
  - `ADULT_VERIFICATION_ENABLED` 환경변수 체크
  - `ADULT_VERIFICATION_AT_REGISTRATION` 플래그 지원

---

## Task 6: 클라이언트 컴포넌트 구현 (v2.0 통합 폼)

**목표**: 회원가입 + 성인인증 통합 UI 컴포넌트 구현

**Requirements**: 2.3, 3.1, 3.3, 7.3

### Sub-tasks

- [x] 6.1 RegisterForm 컴포넌트 업데이트 (3단계 통합 플로우) ✅
  - Step 1: 이메일/비밀번호 입력 폼
  - Step 2: 본인확인 진행 중 (로딩 UI)
  - Step 3: 완료/자동 로그인
  - 안내 문구: 인증 필요 사유, 만 19세 이상 조건, 개인정보 처리
- [x] 6.2 PortOne SDK 호출 로직 구현 ✅
  - `requestIdentityVerification()` 호출
  - storeId, identityVerificationId, channelKey 전달
  - redirectUrl 설정 (모바일용)
  - 에러 처리 (`response.code !== undefined`)
- [x] 6.3 (P) 모바일 콜백 페이지 구현 (`/auth/register/callback`) ✅
  - `useSearchParams` + Suspense boundary 적용
  - 쿼리 파라미터에서 identityVerificationId, code 파싱
  - 서버 검증 API 호출
  - 성공/실패 리다이렉트
- [x] 6.4 (P) 에러 메시지 매핑 함수 구현 ✅
  - PortOne 에러 코드 → 사용자 친화적 메시지
  - USER_CANCEL, PG_PROVIDER, 기타 에러 처리
- [x] 6.5 (P) 재인증 모달 컴포넌트 구현 (만료 사용자용) ✅ 이미 존재
  - 기존 AdultVerificationModal 활용
  - 만료 안내 및 재인증 버튼

---

## Task 7: 보안 기능 구현

**목표**: 요청 위조 방지 및 중복 처리 방지

**Requirements**: 5.1, 5.2

### Sub-tasks

- [x] 7.1 State 검증 구현 (등록 토큰 기반) ✅
  - v2.0: registrationToken 자체가 암호화된 state 역할
  - 토큰 만료 시 거부
- [x] 7.2 중복 콜백 방지 로직 구현 ✅ isDuplicateCallback 함수
  - 동일 txid로 SUCCESS 로그 존재 시 거부
  - `ALREADY_VERIFIED` 에러 반환
- [ ] 7.3 (P) 관리자 권한 제어 구현 🔄 추후 구현
  - 인증 로그 조회: ADMIN 이상만 가능
  - 수동 상태 변경: SUPER_ADMIN만 가능

---

## Task 8: 모니터링 및 로깅 구현

**목표**: KPI 지표 수집 및 알림 시스템 구현

**Requirements**: 6.1, 6.2, 6.3

### Sub-tasks

- [x] 8.1 인증 이벤트 로깅 완성 ✅
  - 개인정보 미포함 검증 (이름, 전화번호, 생년월일 제외)
  - 필수 필드: timestamp, profileId, txid, eventType, failureCode
- [x] 8.2 (P) KPI 지표 수집 함수 구현 (`getVerificationStats`) ✅ verification-metrics.service.ts
  - 성공률: SUCCESS / INITIATED
  - 미성년자 비율: UNDERAGE / INITIATED (v2.0 추가)
  - 이탈률: 1 - (SUCCESS + UNDERAGE) / INITIATED
  - 오류율: FAILED / INITIATED
- [x] 8.3 (P) 알림 임계치 모니터링 구현 ✅ verification-alerts.service.ts
  - 성공률 80% 미만: 경고 알림
  - 오류율 10% 초과: 긴급 알림
  - 5분간 콜백 실패 10건 이상: 알림
- [ ]*8.4 관리자 대시보드 통계 API (선택적) 🔄 추후 구현
  - 일별/주별/월별 통계 조회
  - 미성년자 시도 현황

---

## Task 9: 기능 플래그 및 장애 대응

**목표**: 점진적 롤아웃 및 장애 시 안전한 대응

**Requirements**: 8.1, 8.2

### Sub-tasks

- [x] 9.1 기능 플래그 설정 구현 (`lib/feature-flags.ts`) ✅ 이미 존재
  - `ADULT_VERIFICATION_ENABLED`: 전체 기능 on/off
  - `ADULT_VERIFICATION_AT_REGISTRATION`: v2.0 모드 (기본값 true)
- [x] 9.2 (P) Fail-secure 로직 구현 ✅ verification-failsafe.service.ts
  - 제공사 장애 시 회원가입 불가 (인증 불가 = 가입 불가)
  - 장애 안내 공지 표시
- [ ] 9.3 (P) 자동 복구 확인 로직 구현
  - 장애 복구 후 정상 운영 자동 전환
  - 재시도 가능 안내

---

## Task 10: 통합 테스트 및 문서화

**목표**: E2E 테스트 및 문서 작성

**Requirements**: 1.3, 7.1, 7.2, 7.3

### Sub-tasks

- [ ] 10.1 회원가입 + 성인인증 E2E 테스트 작성
  - 성인 사용자: 폼 제출 → SDK 호출 → 검증 → 가입 완료 → 자동 로그인
  - 미성년자: 폼 제출 → SDK 호출 → 검증 → 가입 거부
  - 인증 취소: 폼 제출 → SDK 취소 → 폼 복귀
- [ ] 10.2 (P) 접근 제어 통합 테스트 작성
  - 만료 사용자: 성인 상품 접근 → 재인증 요청
  - 비로그인 사용자: 성인 상품 접근 → 로그인 필요
- [ ] 10.3 (P) 개인정보처리방침 업데이트 가이드 작성
  - 본인확인 수탁자 정보 (KCP/다날)
  - 수집 항목 및 보관 기간
- [ ] 10.4 (P) FAQ 콘텐츠 작성
  - 왜 필요한가 (법적 요건)
  - 인증이 안 될 때 (통신사 문제, 명의 불일치)
  - 재인증이 필요한 경우 (1년 만료)
- [ ]*10.5 등록 토큰 자동 정리 구현 (선택적)
  - 15분 이상 만료된 임시 데이터 정리
  - (v2.0에서는 토큰 자체에 만료가 내장되어 있으므로 선택적)

---

## Requirements Coverage

| 요구사항 ID | 설명 | 태스크 |
|------------|------|--------|
| 1.1 | 사용자 성인인증 상태 구분 | 2.1, 3.2, 4.2 |
| 1.2 | 성인인증 유효기간 관리 | 3.3, 4.3, 4.4, 5.1 |
| 1.3 | 인증 실패 시 가입 취소 | 4.2, 6.1, 10.5 |
| 2.1 | 성인구역 서버 레벨 차단 | 5.1, 5.2 |
| 2.2 | 장바구니/주문 차단 | 5.3 |
| 2.3 | 회원가입 통합 인증 | 4.1, 4.2, 6.1, 6.2 |
| 3.1 | 회원가입 플로우 통합 | 4.1, 4.2, 6.2 |
| 3.2 | 성인 판정 및 회원 생성 | 3.2, 4.2 |
| 3.3 | 인증 실패 및 미성년자 처리 | 4.2, 6.4 |
| 4.1 | 최소 저장 원칙 | 2.1, 3.4 |
| 4.2 | 로그 보관 정책 | 2.2, 8.1 |
| 5.1 | 요청 위조 방지 | 7.1, 7.2 |
| 5.2 | 접근 권한 제어 | 7.3 |
| 6.1 | 인증 이벤트 로깅 | 3.8, 8.1 |
| 6.2 | KPI 지표 수집 | 8.2 |
| 6.3 | 알림 임계치 | 8.3 |
| 7.1 | 개인정보처리방침 반영 | 10.3 |
| 7.2 | 청소년보호정책 반영 | 10.3 |
| 7.3 | 사용자 안내 | 6.1, 10.4 |
| 8.1 | 기능 플래그 | 9.1 |
| 8.2 | 장애 대응 | 9.2, 9.3 |

---

## Execution Order

**권장 순서** (의존성 기반):

```
Phase 1: 기반 구축 (병렬 가능)
├── Task 1: 프로젝트 설정 (P)
├── Task 2: 데이터 모델
└── Task 3: 서비스 레이어 (P)

Phase 2: 핵심 기능 (순차)
├── Task 4: 회원가입 API ← 핵심 v2.0 변경
└── Task 6: 클라이언트 컴포넌트 (4 이후)

Phase 3: 통합 (의존성 후)
└── Task 5: 접근 제어 통합

Phase 4: 품질/보안 (병렬 가능)
├── Task 7: 보안 기능 (P)
├── Task 8: 모니터링 (P)
└── Task 9: 기능 플래그 (P)

Phase 5: 마무리
└── Task 10: 테스트/문서화
```

**병렬 가능 태스크** (`(P)` 표시):
- Task 1 전체: 1.1, 1.2, 1.3, 1.4 동시 진행 가능
- Task 3: 3.2-3.8 순수 함수들 동시 진행 가능
- Task 5: 5.2, 5.3, 5.4 동시 진행 가능
- Task 6: 6.3, 6.4, 6.5 동시 진행 가능
- Task 7, 8, 9: Phase 4 전체 동시 진행 가능
- Task 10: 10.2, 10.3, 10.4 동시 진행 가능

---

## v2.0 vs v1.0 Task 차이점

| 항목 | v1.0 (성인구역 진입 시) | v2.0 (회원가입 시) |
|------|------------------------|-------------------|
| 인증 API | `/adult-verification/initiate` | `/register/initiate` |
| 완료 API | `/adult-verification/verify` | `/register/complete` |
| 임시 저장 | 세션 기반 state | **등록 토큰 (AES 암호화)** |
| 미인증 계정 | PENDING_ADULT 상태 | **존재하지 않음** |
| Task 4 | 인증 API 구현 | **회원가입 API 구현** |
| Task 6 | 인증 모달 | **통합 RegisterForm** |
| Task 10.5 | 미완료 계정 정리 | 등록 토큰 정리 (선택적) |

---

## Notes

- `(P)` 표시된 태스크는 병렬 실행 가능
- `- [ ]*` 표시된 태스크는 MVP 이후 구현 가능 (선택적)
- 모든 태스크는 TDD 방식 (테스트 우선 작성)
- 각 태스크 완료 후 코드 리뷰 권장
- 환경 변수 설정은 실제 PortOne 계약 후 진행
- v2.0 핵심: 가입 = 인증, 미성년자 가입 원천 차단

---

## Next Steps

태스크 검토 후 실행:

```bash
# 컨텍스트 정리 후 실행 권장
# 특정 태스크 실행
/kiro:spec-impl adult-verification 1.1

# 병렬 태스크 실행 (Phase 1)
/kiro:spec-impl adult-verification 1.1,1.2,1.3,1.4

# 핵심 v2.0 태스크 실행
/kiro:spec-impl adult-verification 4.1
/kiro:spec-impl adult-verification 4.2
```
