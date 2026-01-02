# Implementation Tasks: 성인인증 시스템 (Adult Verification)

> Generated: 2026-01-02
> Spec: adult-verification
> Version: 1.0.0
> Status: Generated (Pending Approval)

---

## Overview

이 문서는 성인인증 시스템 구현을 위한 상세 태스크 목록입니다.
모든 태스크는 TDD 방식으로 진행하며, 요구사항과 설계 문서에 매핑됩니다.

**총 태스크**: 9개 Major Tasks, 35개 Sub-tasks
**예상 작업량**: Sub-task 당 1-3시간

---

## Task 1: 프로젝트 설정 및 의존성 구성

**목표**: PortOne SDK 설치 및 환경 변수 구성

**Requirements**: 없음 (인프라 설정)

### Sub-tasks

- [ ] 1.1 PortOne Browser SDK 패키지 설치 (`@portone/browser-sdk`)
- [ ] 1.2 환경 변수 정의 및 `.env.example` 업데이트
  - `NEXT_PUBLIC_PORTONE_STORE_ID`
  - `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
  - `PORTONE_API_SECRET`
  - `ADULT_VERIFICATION_CI_SALT`
  - `ADULT_VERIFICATION_ENABLED`
  - `ADULT_VERIFICATION_TRIGGER`
- [ ] 1.3 타입 정의 파일 생성 (`types/adult-verification.ts`)
- [ ] 1.4 상수 파일 생성 (`constants/adult-verification.ts`)

---

## Task 2: 데이터 모델 확장

**목표**: Profile 모델에 성인인증 필드 추가 및 로그 모델 생성

**Requirements**: 1.1, 1.2, 4.1, 4.2, 6.1

### Sub-tasks

- [ ] 2.1 Profile 모델에 성인인증 필드 추가
  - `adultVerifyMethod`, `adultVerifyProvider`, `adultVerifyTxid`, `ciHash` 필드 추가
  - 기존 `isAdultVerified`, `adultVerifiedAt` 필드 유지
- [ ] 2.2 AdultVerificationLog 모델 생성
  - `id`, `profileId`, `txid`, `eventType`, `failureCode`, `createdAt` 필드
  - 인덱스 설정 (profileId, txid, createdAt)
- [ ] 2.3 Prisma 마이그레이션 생성 및 적용
- [ ] 2.4 Profile 관계 설정 (AdultVerificationLog 연결)

---

## Task 3: 서비스 레이어 구현

**목표**: 성인인증 비즈니스 로직 서비스 구현

**Requirements**: 1.1, 1.2, 3.2, 4.1, 6.1

### Sub-tasks

- [ ] 3.1 `adult-verification.service.ts` 파일 생성
- [ ] 3.2 만 19세 이상 판정 함수 구현 (`isAdult`)
  - 생년월일 기반 만 나이 계산
  - 경계값 테스트 포함
- [ ] 3.3 인증 만료 여부 확인 함수 구현 (`isVerificationExpired`)
  - 1년(365일) 만료 정책
- [ ] 3.4 CI 해시 함수 구현 (`hashCi`)
  - SHA-256 + salt 처리
- [ ] 3.5 인증 상태 조회 함수 구현 (`getVerificationStatus`)
  - PENDING, VERIFIED, EXPIRED, FAILED 상태 반환
- [ ] 3.6 인증 완료 처리 함수 구현 (`completeVerification`)
  - Profile 업데이트
- [ ] 3.7 인증 이벤트 로그 생성 함수 구현 (`createVerificationLog`)
  - INITIATED, SUCCESS, FAILED 이벤트 기록

---

## Task 4: API 엔드포인트 구현

**목표**: 성인인증 관련 REST API 구현

**Requirements**: 3.1, 3.2, 3.3, 5.1

### Sub-tasks

- [ ] 4.1 인증 시작 API 구현 (`/api/auth/adult-verification/initiate`)
  - 로그인 필수 체크
  - 이미 인증된 경우 처리
  - identityVerificationId 생성
  - 인증 시작 로그 기록
- [ ] 4.2 인증 검증 API 구현 (`/api/auth/adult-verification/verify`)
  - PortOne API로 결과 조회
  - 상태 검증 (VERIFIED 확인)
  - 연령 확인 (만 19세 이상)
  - CI 해시 생성 및 저장
  - Profile 업데이트
  - 성공/실패 로그 기록
- [ ] 4.3 인증 상태 조회 API 구현 (`/api/auth/adult-verification/status`)
  - 현재 인증 상태 반환
  - 만료 여부 포함
- [ ] 4.4 모바일 콜백 처리 구현
  - 콜백 페이지 (`/auth/adult-verification/callback`)
  - Suspense boundary 적용
  - 쿼리 파라미터 파싱 및 검증

---

## Task 5: 접근 제어 헬퍼 및 통합

**목표**: 성인인증 필수 API 보호 미들웨어 구현

**Requirements**: 2.1, 2.2, 2.3

### Sub-tasks

- [ ] 5.1 `requireAdultVerification` 헬퍼 함수 구현
  - 로그인 체크 + 성인인증 체크
  - 만료 체크 포함
  - 에러 코드 정의 (`ADULT_VERIFICATION_REQUIRED`, `ADULT_VERIFICATION_EXPIRED`)
- [ ] 5.2 성인 상품 API 보호 적용
  - 상품 상세 API에 인증 체크 추가
  - 성인 카테고리 API 보호
- [ ] 5.3 장바구니 API 보호 적용
  - 성인 상품 추가 시 인증 체크
  - 성인 상품 포함 주문 차단
- [ ] 5.4 기능 플래그 기반 조건부 적용
  - `ADULT_VERIFICATION_ENABLED` 환경변수 체크
  - 트리거 방식 (A/B) 지원

---

## Task 6: 클라이언트 컴포넌트 구현

**목표**: 성인인증 UI 컴포넌트 구현

**Requirements**: 3.1, 3.3, 7.3

### Sub-tasks

- [ ] 6.1 AdultVerificationModal 컴포넌트 구현
  - Dialog 기반 UI
  - 인증 필요 사유, 소요 시간, 개인정보 처리 안내
  - 로딩 상태 및 에러 표시
- [ ] 6.2 PortOne SDK 호출 로직 구현
  - `requestIdentityVerification()` 호출
  - 성공/실패 처리
  - 서버 검증 연동
- [ ] 6.3 콜백 핸들러 컴포넌트 구현
  - `useSearchParams` + Suspense 적용
  - 인증 결과 처리
  - 리다이렉트 로직
- [ ] 6.4 에러 메시지 매핑 함수 구현
  - PortOne 에러 코드 → 사용자 친화적 메시지

---

## Task 7: 보안 기능 구현

**목표**: 요청 위조 방지 및 중복 처리 방지

**Requirements**: 5.1, 5.2

### Sub-tasks

- [ ] 7.1 State/Nonce 생성 및 검증 구현 (선택적, Redis 사용 시)
  - 10분 유효 기간
  - 일회성 사용
- [ ] 7.2 중복 콜백 방지 로직 구현
  - 동일 txid SUCCESS 로그 확인
  - 중복 요청 거부
- [ ] 7.3 관리자 권한 제어 구현
  - 인증 로그 조회: ADMIN 이상
  - 수동 상태 변경: SUPER_ADMIN만

---

## Task 8: 모니터링 및 로깅 구현

**목표**: KPI 지표 수집 및 알림 시스템 구현

**Requirements**: 6.1, 6.2, 6.3

### Sub-tasks

- [ ] 8.1 인증 이벤트 로깅 완성
  - 개인정보 제외 검증
  - timestamp, user_id, txid, event_type, failure_code 포함
- [ ] 8.2 KPI 지표 수집 함수 구현
  - 성공률, 이탈률, 오류율 계산
  - 기간별 조회 지원
- [ ] 8.3 알림 임계치 모니터링 구현
  - 성공률 80% 미만 경고
  - 오류율 10% 초과 긴급 알림
  - 5분간 콜백 실패 10건 이상 알림
- [ ]*8.4 관리자 대시보드 통계 API (선택적)
  - 일별/주별/월별 통계

---

## Task 9: 기능 플래그 및 장애 대응

**목표**: 점진적 롤아웃 및 장애 시 안전한 대응

**Requirements**: 8.1, 8.2

### Sub-tasks

- [ ] 9.1 기능 플래그 설정 구현
  - `ADULT_VERIFICATION_ENABLED`: 전체 기능 on/off
  - `ADULT_VERIFICATION_TRIGGER`: 옵션 A/B 전환
- [ ] 9.2 Fail-secure 로직 구현
  - 제공사 장애 시 접근 차단 유지
  - 장애 안내 공지 표시
- [ ] 9.3 자동 복구 확인 로직 구현
  - 장애 복구 후 정상 운영 전환
  - 재시도 가능 안내

---

## Task 10: 통합 테스트 및 문서화

**목표**: E2E 테스트 및 문서 작성

**Requirements**: 7.1, 7.2, 7.3, 1.3

### Sub-tasks

- [ ] 10.1 성인인증 플로우 E2E 테스트 작성
  - 인증 시작 → SDK 호출 → 검증 → 완료
  - 실패 시나리오 포함
- [ ] 10.2 접근 제어 통합 테스트 작성
  - 미인증 사용자 차단 확인
  - 만료 사용자 재인증 요청 확인
- [ ] 10.3 개인정보처리방침 업데이트 가이드 작성
  - 본인확인 수탁자 정보
  - 수집 항목 및 보관 기간
- [ ] 10.4 FAQ 콘텐츠 작성
  - 왜 필요한가
  - 인증이 안 될 때
  - 재인증이 필요한 경우
- [ ]*10.5 미완료 계정 자동 정리 배치 작업 구현 (선택적)
  - 7일 이상 PENDING_ADULT 계정 처리
  - 정리 전 이메일 알림

---

## Requirements Coverage

| 요구사항 ID | 설명 | 태스크 |
|------------|------|--------|
| 1.1 | 사용자 성인인증 상태 구분 | 2.1, 3.5 |
| 1.2 | 성인인증 유효기간 관리 | 3.3, 5.1 |
| 1.3 | 미완료 계정 자동 정리 | 10.5 |
| 2.1 | 성인구역 서버 레벨 차단 | 5.1, 5.2 |
| 2.2 | 장바구니/주문 차단 | 5.3 |
| 2.3 | 인증 트리거 방식 | 5.4, 9.1 |
| 3.1 | 본인확인 제공사 연동 | 4.1, 4.4, 6.2 |
| 3.2 | 성인 판정 기준 | 3.2, 4.2 |
| 3.3 | 인증 실패 처리 | 4.2, 6.4 |
| 4.1 | 최소 저장 원칙 | 2.1, 3.4 |
| 4.2 | 로그 보관 정책 | 2.2, 8.1 |
| 5.1 | 요청 위조 방지 | 7.1, 7.2 |
| 5.2 | 접근 권한 제어 | 7.3 |
| 6.1 | 인증 이벤트 로깅 | 3.7, 8.1 |
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
1. Task 1: 프로젝트 설정     ─┐
2. Task 2: 데이터 모델       ─┼─► 기반 구축
3. Task 3: 서비스 레이어     ─┘

4. Task 4: API 구현          ─┐
5. Task 6: 클라이언트 구현   ─┼─► 핵심 기능
6. Task 5: 접근 제어 통합    ─┘

7. Task 7: 보안 기능         ─┐
8. Task 8: 모니터링          ─┼─► 품질/보안
9. Task 9: 기능 플래그       ─┘

10. Task 10: 테스트/문서화   ─► 마무리
```

**병렬 가능 태스크**:
- Task 1, 2: 동시 진행 가능
- Task 4, 6: 동시 진행 가능 (API와 클라이언트 개별 개발)
- Task 7, 8, 9: 동시 진행 가능

---

## Notes

- `- [ ]*` 표시된 태스크는 MVP 이후 구현 가능 (선택적)
- 모든 태스크는 TDD 방식 (테스트 우선 작성)
- 각 태스크 완료 후 코드 리뷰 권장
- 환경 변수 설정은 실제 PortOne 계약 후 진행

---

## Next Steps

태스크 검토 후 실행:

```bash
# 특정 태스크 실행
/kiro:spec-impl adult-verification 1.1

# 여러 태스크 실행
/kiro:spec-impl adult-verification 1.1,1.2,1.3,1.4

# 전체 태스크 실행 (권장하지 않음)
/kiro:spec-impl adult-verification
```
