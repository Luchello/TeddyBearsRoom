# Research: 성인인증 시스템 Discovery 결과

> Generated: 2026-01-02
> Spec: adult-verification
> Phase: Design Discovery

---

## 1. 코드베이스 패턴 분석

### 1.1 Profile 모델 (현재 상태)

**파일**: `web/prisma/schema.prisma`

```prisma
model Profile {
  // Adult Verification (PASS 본인인증)
  isAdultVerified       Boolean          @default(false)
  adultVerifiedAt       DateTime?
  ci                    String?          // 연계정보 (CI) - pgcrypto 암호화 권장
  di                    String?          // 중복가입확인정보 (DI)
}
```

**분석**:
- 기본 필드 구조 이미 정의됨
- CI/DI 암호화 로직 미구현 (주석으로만 언급)
- 인증 방식, 제공사, 거래ID 필드 없음 (requirements에서 요구)

**필요한 확장**:
```prisma
// 추가 필요 필드 (requirements 4.1.1 기준)
adultVerifyMethod      String?          // PHONE (휴대폰 본인인증)
adultVerifyProvider    String?          // PORTONE_KCP, PORTONE_DANAL 등
adultVerifyTxid        String?          // 인증 거래 고유 ID
```

### 1.2 타입 정의 (현재 상태)

**파일**: `web/src/types/user.ts`

```typescript
// 이미 정의됨
export interface PassVerificationRequest {
  returnUrl: string;
  errorUrl: string;
}

export interface PassVerificationResult {
  success: boolean;
  ci: string;
  di: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: "M" | "F";
}
```

**분석**:
- 기본 타입 구조 존재
- PortOne V2 API 응답과 호환 필요 (gender enum 차이: `MALE/FEMALE` vs `M/F`)
- 에러 타입 미정의

### 1.3 인증 관련 코드 패턴

**현재 구현**:
- `web/src/app/api/auth/callback/route.ts`: OAuth 콜백 처리, `ensureProfile()` 패턴
- `web/src/lib/api/auth.ts`: `requireAuth()`, `apiError()`, `apiSuccess()` 헬퍼
- `web/src/lib/supabase/middleware.ts`: 로그인 필수 경로 보호

**서비스 레이어 패턴** (`web/src/lib/services/`):
```typescript
// 일관된 패턴
export async function serviceFunctionName(param: string): Promise<ReturnType> {
  // 1. 검증 로직
  // 2. 비즈니스 로직
  // 3. Prisma 트랜잭션 (필요시)
  // 4. 결과 반환
}
```

### 1.4 컴포넌트 상태

**파일**: `web/src/components/auth/register-form.tsx`

```typescript
const handleVerification = async () => {
  // TODO: Implement PASS adult verification
  await onSubmit?.(formData);
}
```

- 2단계 UI 흐름 구현됨 (form -> verification)
- 실제 PASS 연동 미구현

---

## 2. PortOne V2 본인인증 API 분석

### 2.1 SDK 정보

| 항목 | 값 |
|------|-----|
| 패키지 | `@portone/browser-sdk` |
| Import | `import * as PortOne from "@portone/browser-sdk/v2"` |
| 함수 | `PortOne.requestIdentityVerification()` |

### 2.2 클라이언트 API 스펙

```typescript
interface IdentityVerificationRequest {
  // 필수
  storeId: string;                    // 상점 ID
  identityVerificationId: string;      // 본인인증 건 고유 ID
  channelKey: string;                  // 채널 키

  // 선택
  redirectUrl?: string;                // 모바일 리다이렉트 URL
  customData?: string;                 // 사용자 정의 데이터
}

// 성공 응답
interface IdentityVerificationSuccess {
  identityVerificationId: string;
}

// 실패 응답
interface IdentityVerificationError {
  code: string;
  message: string;
}
```

### 2.3 서버 REST API 스펙

**Base URL**: `https://api.portone.io`
**인증**: `Authorization: PortOne {API_SECRET}`

| Method | Endpoint | 용도 |
|--------|----------|------|
| GET | `/identity-verifications/{id}` | 단건 조회 |
| POST | `/identity-verifications/{id}/send` | 요청 전송 (API 방식) |
| POST | `/identity-verifications/{id}/confirm` | OTP 확인 |

### 2.4 인증 결과 데이터 (verifiedCustomer)

```typescript
interface VerifiedCustomer {
  ci: string;              // 연계정보 (88바이트, Base64)
  di: string | null;       // 중복가입확인정보 (64바이트, Base64)
  name: string;            // 이름
  gender: "MALE" | "FEMALE";
  birthDate: string;       // YYYY-MM-DD
  phoneNumber?: string;    // 전화번호 (PG사별 제공 다름)
  operator?: string;       // 통신사
  isForeigner?: boolean;   // 외국인 여부
}
```

### 2.5 PG사별 제공 정보

| 필드 | 다날 | KCP | KG이니시스 |
|------|------|-----|-----------|
| ci | O | O | O (카카오 제외) |
| di | O | O | X |
| name | O | O | O |
| gender | O | O | 조건부 |
| birthDate | O | O | O |
| phoneNumber | 추가계약 | O | O |

### 2.6 에러 코드

| 코드 | 설명 |
|------|------|
| `IDENTITY_VERIFICATION_NOT_FOUND` | 본인인증 건 없음 |
| `IDENTITY_VERIFICATION_ALREADY_VERIFIED` | 이미 완료된 인증 |
| `PG_PROVIDER` | PG사 오류 |
| `CHANNEL_NOT_FOUND` | 채널 없음 |
| `INVALID_REQUEST` | 잘못된 요청 |

---

## 3. 아키텍처 결정 사항

### 3.1 인증 플로우 방식

**선택**: Browser SDK 팝업 방식 + 서버 검증

**이유**:
- PortOne V2 SDK가 팝업 처리 담당 (PG사별 차이 추상화)
- 서버에서 최종 검증으로 보안 확보
- 모바일 환경 자동 대응 (리다이렉트 지원)

### 3.2 데이터 저장 전략

| 항목 | 저장 여부 | 처리 방식 |
|------|----------|----------|
| adult_verified | O | Boolean |
| adult_verified_at | O | DateTime |
| adult_verify_method | O | String ("PHONE") |
| adult_verify_provider | O | String ("PORTONE_KCP") |
| adult_verify_txid | O | String |
| CI | O | SHA-256 해시 후 저장 |
| DI | X | 저장 안 함 (1인1계정 불필요) |
| 이름/전화번호/생년월일 | X | 저장 안 함 (최소 수집) |

### 3.3 성인 판정 로직

```typescript
function isAdult(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();

  // 만 나이 계산
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 19;
}
```

### 3.4 재인증 만료 체크

```typescript
function isVerificationExpired(verifiedAt: Date | null): boolean {
  if (!verifiedAt) return true;

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return verifiedAt < oneYearAgo;
}
```

---

## 4. 기존 코드와의 통합 포인트

### 4.1 Profile 모델 확장

```prisma
// 추가 필드
adultVerifyMethod      String?
adultVerifyProvider    String?
adultVerifyTxid        String?
ciHash                 String?          // SHA-256 해시된 CI
```

### 4.2 새로 생성할 파일

| 파일 | 용도 |
|------|------|
| `lib/services/adult-verification.service.ts` | 비즈니스 로직 |
| `lib/portone/identity.ts` | PortOne SDK 래퍼 |
| `app/api/auth/adult-verification/initiate/route.ts` | 인증 시작 API |
| `app/api/auth/adult-verification/verify/route.ts` | 인증 검증 API |
| `app/api/auth/adult-verification/callback/route.ts` | 모바일 콜백 |
| `components/auth/adult-verification-modal.tsx` | 인증 UI |
| `constants/adult-verification.ts` | 상수 정의 |

### 4.3 기존 파일 수정

| 파일 | 수정 내용 |
|------|----------|
| `prisma/schema.prisma` | Profile 모델 필드 추가 |
| `types/user.ts` | 타입 확장 |
| `lib/api/auth.ts` | `requireAdultVerification()` 추가 |
| `components/auth/register-form.tsx` | PASS 연동 구현 |

---

## 5. 환경 변수 요구사항

```bash
# .env.local
NEXT_PUBLIC_PORTONE_STORE_ID=store-xxxx-xxxx
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-xxxx

# 서버 전용
PORTONE_API_SECRET=sk_live_xxxxxxxxxxxx
ADULT_VERIFICATION_CI_SALT=random-salt-for-ci-hash
```

---

## 6. 주요 고려사항

### 6.1 Next.js 16 호환성

- `useSearchParams()` 사용 시 Suspense boundary 필수
- 모바일 콜백 페이지에서 주의 필요

### 6.2 보안

- CI는 SHA-256 + salt로 해시 후 저장
- API Secret은 서버 환경변수로만 관리
- state/nonce로 CSRF 방지

### 6.3 UX

- 팝업 차단 시 안내 메시지
- 모바일 리다이렉트 처리
- 인증 실패 시 재시도 안내

---

## 7. 리스크 및 미해결 사항

| 항목 | 리스크 수준 | 설명 |
|------|------------|------|
| PG사 업종 승인 | 높음 | 성인용품 업종 계약 가능 여부 사전 확인 필요 |
| KCP vs 다날 선택 | 중간 | KCP가 정보 제공 범위 넓음, 다날은 추가 계약 필요 |
| CI 해시 충돌 | 낮음 | SHA-256 충돌 확률 무시 가능 |
| 인증 이탈률 | 중간 | 복잡한 인증 플로우로 인한 이탈 우려 |

---

## 8. 참고 자료

- [PortOne V2 본인인증 문서](https://developers.portone.io/docs/ko/v2-payment/identity-verification)
- [PortOne REST API](https://api.portone.io)
- [청소년보호법 제17조](https://www.law.go.kr)
- [프로젝트 연구 보고서](../../claudedocs/research_adult_verification_20260102.md)
