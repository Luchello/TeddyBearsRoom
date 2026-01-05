# Design: 성인인증 시스템 (Adult Verification)

> Generated: 2026-01-03
> Spec: adult-verification
> Version: 2.0.0
> Status: Generated (Pending Approval)

---

## 1. 시스템 아키텍처

### 1.1 핵심 설계 결정

**v2.0.0 핵심 변경**: 성인인증을 회원가입 과정에 통합

| 항목 | v1.x (이전) | v2.0 (현재) |
|------|-------------|-------------|
| 인증 시점 | 성인구역 첫 진입 시 | **회원가입 시 동시 인증** |
| 계정 생성 | 가입 → 인증 분리 | **인증 성공 시에만 가입 완료** |
| 미인증 계정 | PENDING_ADULT 상태 | **존재하지 않음** (가입 실패) |

### 1.2 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    회원가입 + 성인인증 통합 아키텍처 (v2.0)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                          회원가입 플로우                               │ │
│  │                                                                       │ │
│  │  [이메일/비밀번호]  →  [본인확인 SDK]  →  [서버 검증]  →  [회원 생성] │ │
│  │       입력              PortOne            PortOne API     Supabase   │ │
│  │                          팝업               + 연령 확인     Auth      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                     │                                       │
│                                     ▼                                       │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐ │
│  │   Client    │────▶│  Next.js    │────▶│  PortOne    │────▶│   PG사    │ │
│  │  (Browser)  │◀────│    API      │◀────│    API      │◀────│ (KCP/다날) │ │
│  └─────────────┘     └─────────────┘     └─────────────┘     └───────────┘ │
│         │                   │                                               │
│         │                   ▼                                               │
│         │            ┌─────────────┐                                        │
│         │            │  Supabase   │                                        │
│         └───────────▶│  Auth +     │                                        │
│                      │  PostgreSQL │                                        │
│                      └─────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 회원가입 + 성인인증 시퀀스 다이어그램

```
┌──────┐        ┌──────────┐        ┌──────────┐        ┌────────┐        ┌────────┐
│Client│        │Register  │        │Next.js   │        │PortOne │        │Supabase│
│      │        │ Form     │        │  API     │        │  API   │        │  Auth  │
└──┬───┘        └────┬─────┘        └────┬─────┘        └───┬────┘        └───┬────┘
   │                 │                   │                  │                 │
   │ 1. 이메일/PW 입력│                   │                  │                 │
   │────────────────▶│                   │                  │                 │
   │                 │                   │                  │                 │
   │                 │ 2. 인증 시작 요청  │                  │                 │
   │                 │──────────────────▶│                  │                 │
   │                 │                   │                  │                 │
   │                 │ 3. identityVerificationId + SDK 정보  │                 │
   │                 │◀──────────────────│                  │                 │
   │                 │                   │                  │                 │
   │ 4. PortOne SDK 호출 (팝업)           │                  │                 │
   │─────────────────────────────────────────────────────▶│                 │
   │                 │                   │                  │                 │
   │ 5. 사용자 휴대폰 본인확인              │                  │                 │
   │◀─────────────────────────────────────────────────────│                 │
   │                 │                   │                  │                 │
   │ 6. 인증 완료 (identityVerificationId)│                  │                 │
   │────────────────▶│                   │                  │                 │
   │                 │                   │                  │                 │
   │                 │ 7. 서버 검증 + 회원 생성 요청          │                 │
   │                 │──────────────────▶│                  │                 │
   │                 │                   │                  │                 │
   │                 │                   │ 8. 인증 결과 조회 │                 │
   │                 │                   │─────────────────▶│                 │
   │                 │                   │                  │                 │
   │                 │                   │ 9. verifiedCustomer (birthDate 포함)│
   │                 │                   │◀─────────────────│                 │
   │                 │                   │                  │                 │
   │                 │                   │ 10. 연령 확인 (만 19세+)            │
   │                 │                   │     ├── 미성년: 가입 거부           │
   │                 │                   │     └── 성인: 회원 생성            │
   │                 │                   │                  │                 │
   │                 │                   │ 11. 회원 생성 (성인만)              │
   │                 │                   │──────────────────────────────────▶│
   │                 │                   │                  │                 │
   │                 │                   │ 12. 사용자 + 세션│                 │
   │                 │                   │◀──────────────────────────────────│
   │                 │                   │                  │                 │
   │                 │ 13. 가입 완료 + 자동 로그인            │                 │
   │◀────────────────│                   │                  │                 │
   │                 │                   │                  │                 │
```

**Requirements 매핑**: AC3.1.1, AC3.1.2, AC3.1.3, AC3.1.4, AC3.2.1, AC3.2.2, AC3.2.3, AC3.2.4

---

## 2. 데이터 모델

### 2.1 Profile 모델 확장

**파일**: `web/prisma/schema.prisma`

```prisma
model Profile {
  // 기존 필드...
  id                    String           @id
  email                 String?

  // Adult Verification (성인인증) - v2.0
  isAdultVerified       Boolean          @default(false)
  adultVerifiedAt       DateTime?
  adultVerifyMethod     String?          // "PHONE"
  adultVerifyProvider   String?          // "PORTONE_KCP", "PORTONE_DANAL"
  adultVerifyTxid       String?          // 본인인증 거래 ID
  ciHash                String?          // SHA-256 해시된 CI (원문 저장 안 함)

  // 관계
  verificationLogs      AdultVerificationLog[]
}
```

**필드 설명 및 Requirement 매핑**:

| 필드 | 타입 | 설명 | Requirement |
|------|------|------|-------------|
| `isAdultVerified` | Boolean | 성인인증 완료 여부 (가입 시 true) | AC1.1.2, AC1.1.3 |
| `adultVerifiedAt` | DateTime? | 인증 완료 시각 | AC1.1.3, AC1.2.1 |
| `adultVerifyMethod` | String? | 인증 방식 ("PHONE") | AC4.1.1 |
| `adultVerifyProvider` | String? | 인증 제공사 | AC4.1.1 |
| `adultVerifyTxid` | String? | 거래 ID | AC4.1.1, AC3.2.3 |
| `ciHash` | String? | CI 해시 (SHA-256) | AC4.1.3 |

### 2.2 인증 이벤트 로그 모델

```prisma
model AdultVerificationLog {
  id            String   @id @default(cuid())
  profileId     String?  // 가입 실패 시 null 가능
  txid          String
  eventType     String   // INITIATED, SUCCESS, FAILED, UNDERAGE
  failureCode   String?  // 실패 시 에러 코드
  createdAt     DateTime @default(now())

  profile       Profile? @relation(fields: [profileId], references: [id])

  @@index([profileId])
  @@index([txid])
  @@index([createdAt])
  @@index([eventType])
}
```

**Requirement 매핑**: AC6.1.1, AC6.1.2, AC6.1.3, AC4.2.1

---

## 3. API 설계

### 3.1 API 엔드포인트 (v2.0)

| Method | Path | 설명 | Auth |
|--------|------|------|------|
| POST | `/api/auth/register/initiate` | 회원가입 + 인증 시작 | None |
| POST | `/api/auth/register/complete` | 인증 검증 + 회원 생성 | None |
| GET | `/api/auth/adult-verification/status` | 인증 상태 조회 | Required |
| POST | `/api/auth/adult-verification/reverify` | 재인증 (만료 시) | Required |

### 3.2 회원가입 시작 API

**POST** `/api/auth/register/initiate`

**설명**: 이메일/비밀번호 임시 저장 + 본인확인 ID 발급

```typescript
// Request
interface RegisterInitiateRequest {
  email: string;
  password: string;
}

// Response (Success)
interface RegisterInitiateResponse {
  success: true;
  data: {
    identityVerificationId: string;
    storeId: string;
    channelKey: string;
    registrationToken: string;  // 임시 등록 토큰 (15분 유효)
  };
}

// Response (Error)
interface RegisterInitiateErrorResponse {
  success: false;
  error: {
    code: "EMAIL_ALREADY_EXISTS" | "INVALID_EMAIL" | "WEAK_PASSWORD";
    message: string;
  };
}
```

**구현 로직**:

```typescript
// app/api/auth/register/initiate/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // 1. 이메일 중복 체크
  const existing = await supabase.auth.admin.getUserByEmail(email);
  if (existing.data.user) {
    return apiError("이미 사용 중인 이메일입니다.", 400, "EMAIL_ALREADY_EXISTS");
  }

  // 2. 비밀번호 강도 검증
  if (!isStrongPassword(password)) {
    return apiError("비밀번호가 너무 약합니다.", 400, "WEAK_PASSWORD");
  }

  // 3. 임시 등록 토큰 생성 (email+password 암호화)
  const registrationToken = await createRegistrationToken({ email, password });

  // 4. identityVerificationId 생성
  const identityVerificationId = `reg-${Date.now()}-${nanoid(8)}`;

  // 5. 인증 시작 로그
  await prisma.adultVerificationLog.create({
    data: {
      txid: identityVerificationId,
      eventType: "INITIATED",
    },
  });

  return apiSuccess({
    identityVerificationId,
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
    registrationToken,
  });
}
```

**Requirement 매핑**: AC2.3.1, AC3.1.1, AC3.1.2, AC6.1.1

### 3.3 회원가입 완료 API

**POST** `/api/auth/register/complete`

**설명**: 본인확인 검증 + 연령 확인 + 회원 생성

```typescript
// Request
interface RegisterCompleteRequest {
  registrationToken: string;
  identityVerificationId: string;
}

// Response (Success)
interface RegisterCompleteResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
    };
    session: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// Response (Error)
interface RegisterCompleteErrorResponse {
  success: false;
  error: {
    code: "UNDERAGE" | "VERIFICATION_FAILED" | "TOKEN_EXPIRED" | "ALREADY_VERIFIED";
    message: string;
  };
}
```

**구현 로직**:

```typescript
// app/api/auth/register/complete/route.ts
export async function POST(request: NextRequest) {
  const { registrationToken, identityVerificationId } = await request.json();

  // 1. 임시 등록 토큰 검증 및 복호화
  const registration = await decryptRegistrationToken(registrationToken);
  if (!registration) {
    return apiError("등록 세션이 만료되었습니다.", 400, "TOKEN_EXPIRED");
  }

  // 2. 중복 인증 체크
  const existingLog = await prisma.adultVerificationLog.findFirst({
    where: { txid: identityVerificationId, eventType: "SUCCESS" },
  });
  if (existingLog) {
    return apiError("이미 처리된 인증입니다.", 400, "ALREADY_VERIFIED");
  }

  // 3. PortOne API로 인증 결과 조회
  const verification = await fetchPortOneVerification(identityVerificationId);
  if (!verification || verification.status !== "VERIFIED") {
    await logVerificationEvent(identityVerificationId, "FAILED", "NOT_VERIFIED");
    return apiError("본인인증이 완료되지 않았습니다.", 400, "VERIFICATION_FAILED");
  }

  const { verifiedCustomer } = verification;

  // 4. 연령 확인 (만 19세 이상)
  if (!isAdult(verifiedCustomer.birthDate)) {
    await logVerificationEvent(identityVerificationId, "UNDERAGE");
    return apiError("만 19세 이상만 이용 가능합니다.", 403, "UNDERAGE");
  }

  // 5. CI 해시 생성
  const ciHash = hashCi(verifiedCustomer.ci);

  // 6. Supabase Auth로 사용자 생성
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: registration.email,
    password: registration.password,
    email_confirm: true,  // 이메일 확인 건너뛰기 (본인확인으로 대체)
  });

  if (authError) {
    await logVerificationEvent(identityVerificationId, "FAILED", "AUTH_ERROR");
    return apiError("회원가입에 실패했습니다.", 500, "REGISTRATION_FAILED");
  }

  // 7. Profile 생성 (성인인증 정보 포함)
  await prisma.profile.create({
    data: {
      id: authData.user.id,
      email: registration.email,
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      adultVerifyMethod: "PHONE",
      adultVerifyProvider: extractProvider(verification.channel),
      adultVerifyTxid: identityVerificationId,
      ciHash,
    },
  });

  // 8. 성공 로그
  await logVerificationEvent(identityVerificationId, "SUCCESS", null, authData.user.id);

  // 9. 세션 생성 (자동 로그인)
  const { data: sessionData } = await supabase.auth.signInWithPassword({
    email: registration.email,
    password: registration.password,
  });

  return apiSuccess({
    user: { id: authData.user.id, email: registration.email },
    session: {
      accessToken: sessionData.session?.access_token,
      refreshToken: sessionData.session?.refresh_token,
    },
  });
}
```

**Requirement 매핑**: AC1.1.1, AC1.1.2, AC1.1.4, AC2.3.2, AC2.3.3, AC3.1.3, AC3.2.1, AC3.2.2, AC3.2.3, AC3.2.4, AC3.3.2, AC4.1.1, AC4.1.2, AC4.1.3

### 3.4 재인증 API (만료 시)

**POST** `/api/auth/adult-verification/reverify`

```typescript
// 1년 만료 후 재인증용 - 기존 v1.x 로직과 유사
// AC1.2.1, AC1.2.2, AC1.2.3 충족
```

### 3.5 접근 제어 미들웨어

```typescript
// lib/api/auth.ts
export async function requireAdultVerification(): Promise<AdultVerificationResult> {
  const authResult = await requireAuth();
  if (!authResult.success) {
    return authResult;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: authResult.user.id },
    select: {
      isAdultVerified: true,
      adultVerifiedAt: true,
    },
  });

  // v2.0: 가입 = 인증이므로 isAdultVerified는 항상 true
  // 만료만 체크하면 됨
  if (isVerificationExpired(profile?.adultVerifiedAt)) {
    return {
      success: false,
      response: apiError("성인인증이 만료되었습니다. 재인증이 필요합니다.", 403, "ADULT_VERIFICATION_EXPIRED"),
    };
  }

  return { success: true, user: authResult.user };
}
```

**Requirement 매핑**: AC2.1.1, AC2.1.2, AC2.1.3, AC1.2.1, AC1.2.2

---

## 4. 서비스 레이어

### 4.1 AdultVerificationService

**파일**: `web/src/lib/services/adult-verification.service.ts`

```typescript
/**
 * Adult Verification Service v2.0
 * 회원가입 통합 성인인증 비즈니스 로직
 */

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// === Constants ===
export const VERIFICATION_EXPIRY_DAYS = 365;
export const ADULT_AGE = 19;
export const REGISTRATION_TOKEN_EXPIRY_MINUTES = 15;

// === Types ===
export type VerificationEventType = "INITIATED" | "SUCCESS" | "FAILED" | "UNDERAGE";

export interface RegistrationData {
  email: string;
  password: string;
  createdAt: number;
}

// === Core Functions ===

/**
 * 성인 여부 확인 (만 19세 이상)
 * @requirement AC3.2.1
 */
export function isAdult(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= ADULT_AGE;
}

/**
 * 인증 만료 여부 확인 (1년)
 * @requirement AC1.2.1
 */
export function isVerificationExpired(verifiedAt: Date | null): boolean {
  if (!verifiedAt) return true;

  const expiryDate = new Date(verifiedAt);
  expiryDate.setDate(expiryDate.getDate() + VERIFICATION_EXPIRY_DAYS);

  return new Date() > expiryDate;
}

/**
 * CI 해시 생성 (SHA-256 + salt)
 * @requirement AC4.1.3
 */
export function hashCi(ci: string): string {
  const salt = process.env.ADULT_VERIFICATION_CI_SALT!;
  return crypto
    .createHash("sha256")
    .update(ci + salt)
    .digest("hex");
}

/**
 * 등록 토큰 생성 (AES-256 암호화)
 * @requirement AC1.3.2
 */
export async function createRegistrationToken(data: RegistrationData): Promise<string> {
  const payload = JSON.stringify({ ...data, createdAt: Date.now() });
  const key = crypto.scryptSync(process.env.REGISTRATION_TOKEN_SECRET!, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * 등록 토큰 복호화
 */
export async function decryptRegistrationToken(token: string): Promise<RegistrationData | null> {
  try {
    const [ivHex, encrypted] = token.split(":");
    const key = crypto.scryptSync(process.env.REGISTRATION_TOKEN_SECRET!, "salt", 32);
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    const data = JSON.parse(decrypted) as RegistrationData & { createdAt: number };

    // 토큰 만료 체크 (15분)
    const elapsed = Date.now() - data.createdAt;
    if (elapsed > REGISTRATION_TOKEN_EXPIRY_MINUTES * 60 * 1000) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * PortOne 인증 결과 조회
 * @requirement AC3.1.3
 */
export async function fetchPortOneVerification(identityVerificationId: string) {
  const response = await fetch(
    `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
    {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * 인증 이벤트 로그 생성
 * @requirement AC6.1.1, AC6.1.2
 */
export async function logVerificationEvent(
  txid: string,
  eventType: VerificationEventType,
  failureCode?: string | null,
  profileId?: string
): Promise<void> {
  await prisma.adultVerificationLog.create({
    data: {
      txid,
      eventType,
      failureCode,
      profileId,
    },
  });
}
```

**Requirement 매핑**: AC3.2.1, AC1.2.1, AC4.1.3, AC1.3.2, AC3.1.3, AC6.1.1, AC6.1.2

---

## 5. 클라이언트 컴포넌트

### 5.1 통합 회원가입 폼

**파일**: `web/src/components/auth/register-form.tsx`

```typescript
"use client";

import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Step = "form" | "verification" | "complete";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1단계: 이메일/비밀번호 입력 후 제출
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 서버에 회원가입 시작 요청
      const response = await fetch("/api/auth/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error.message);
        return;
      }

      // 2단계: 본인확인 SDK 호출
      setStep("verification");
      await startVerification(data.data);
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: PortOne 본인확인
  const startVerification = async (initiateData: {
    identityVerificationId: string;
    storeId: string;
    channelKey: string;
    registrationToken: string;
  }) => {
    try {
      const response = await PortOne.requestIdentityVerification({
        storeId: initiateData.storeId,
        identityVerificationId: initiateData.identityVerificationId,
        channelKey: initiateData.channelKey,
        redirectUrl: `${window.location.origin}/auth/register/callback`,
      });

      // 에러 처리
      if (response.code !== undefined) {
        setError(getVerificationErrorMessage(response.code));
        setStep("form");
        return;
      }

      // 3단계: 서버에서 검증 + 회원 생성
      await completeRegistration(
        initiateData.registrationToken,
        response.identityVerificationId!
      );
    } catch (err) {
      setError("본인인증 중 오류가 발생했습니다.");
      setStep("form");
    }
  };

  // 3단계: 회원가입 완료
  const completeRegistration = async (
    registrationToken: string,
    identityVerificationId: string
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationToken, identityVerificationId }),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.error.code === "UNDERAGE") {
          setError("만 19세 이상만 이용 가능합니다.");
        } else {
          setError(data.error.message);
        }
        setStep("form");
        return;
      }

      // 성공: 자동 로그인 후 리다이렉트
      setStep("complete");
      router.push("/");
    } catch (err) {
      setError("회원가입 완료 중 오류가 발생했습니다.");
      setStep("form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === "form" && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
              {error}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>* 회원가입을 위해 휴대폰 본인확인이 필요합니다.</p>
            <p>* 만 19세 이상만 가입할 수 있습니다.</p>
            <p>* 인증 정보는 연령 확인 목적으로만 사용됩니다.</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "처리 중..." : "본인인증 후 가입하기"}
          </Button>
        </form>
      )}

      {step === "verification" && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">본인인증 진행 중...</p>
        </div>
      )}

      {step === "complete" && (
        <div className="text-center py-8">
          <p className="text-lg font-semibold">회원가입이 완료되었습니다!</p>
          <p className="mt-2 text-muted-foreground">자동 로그인 중...</p>
        </div>
      )}
    </div>
  );
}

function getVerificationErrorMessage(code: string): string {
  switch (code) {
    case "USER_CANCEL":
      return "본인인증이 취소되었습니다.";
    case "PG_PROVIDER":
      return "인증 서비스에 일시적인 오류가 발생했습니다.";
    default:
      return "본인인증에 실패했습니다. 다시 시도해주세요.";
  }
}
```

**Requirement 매핑**: AC2.3.1, AC2.3.2, AC2.3.3, AC3.1.1, AC3.3.1, AC3.3.2, AC3.3.3, AC7.3.1

### 5.2 모바일 콜백 페이지

**파일**: `web/src/app/(auth)/auth/register/callback/page.tsx`

```typescript
import { Suspense } from "react";
import { RegisterCallbackHandler } from "./callback-handler";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="p-4">인증 결과를 확인하는 중...</div>}>
      <RegisterCallbackHandler />
    </Suspense>
  );
}
```

**Requirement 매핑**: AC3.1.3 (모바일 콜백 처리)

---

## 6. 보안 설계

### 6.1 State/Nonce 검증

```typescript
// 임시 등록 토큰에 state 포함
// registrationToken 자체가 암호화된 state 역할
```

**Requirement 매핑**: AC5.1.1, AC5.1.2

### 6.2 중복 콜백 방지

```typescript
export async function isAlreadyVerified(txid: string): Promise<boolean> {
  const existing = await prisma.adultVerificationLog.findFirst({
    where: { txid, eventType: "SUCCESS" },
  });
  return existing !== null;
}
```

**Requirement 매핑**: AC5.1.3

### 6.3 CI 해시 처리

```typescript
// CI는 원문 저장하지 않음, 해시만 저장
// @requirement AC4.1.3
export function hashCi(ci: string): string {
  const salt = process.env.ADULT_VERIFICATION_CI_SALT!;
  return crypto.createHash("sha256").update(ci + salt).digest("hex");
}
```

**Requirement 매핑**: AC4.1.2, AC4.1.3

---

## 7. 접근 제어 통합

### 7.1 성인 상품 API 보호

```typescript
// app/api/products/[slug]/route.ts
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  // 성인 상품인 경우 인증 + 만료 체크
  if (product?.isAdultOnly) {
    const adultAuth = await requireAdultVerification();
    if (!adultAuth.success) {
      return adultAuth.response;
    }
  }

  return apiSuccess(product);
}
```

**Requirement 매핑**: AC2.1.2

### 7.2 장바구니/주문 API 보호

```typescript
// app/api/cart/route.ts
export async function POST(request: NextRequest) {
  const { productId, quantity } = await request.json();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { isAdultOnly: true },
  });

  if (product?.isAdultOnly) {
    const adultAuth = await requireAdultVerification();
    if (!adultAuth.success) {
      return apiError("성인인증이 만료되었습니다.", 403, "ADULT_VERIFICATION_EXPIRED");
    }
  }

  // 장바구니 추가 로직...
}
```

**Requirement 매핑**: AC2.2.1, AC2.2.2

---

## 8. 기능 플래그 설계

### 8.1 환경 변수 기반 플래그

```typescript
// lib/feature-flags.ts
export const featureFlags = {
  // 성인인증 기능 전체 활성화
  ADULT_VERIFICATION_ENABLED: process.env.ADULT_VERIFICATION_ENABLED === "true",

  // v2.0: 회원가입 통합 인증이 기본값, 플래그로 v1.x 방식 폴백 가능
  ADULT_VERIFICATION_AT_REGISTRATION:
    process.env.ADULT_VERIFICATION_AT_REGISTRATION !== "false",  // 기본값 true
};
```

**Requirement 매핑**: AC8.1.1, AC8.1.2

### 8.2 장애 대응

```typescript
// 장애 시 fail-secure: 인증 불가하면 가입 차단
// @requirement AC8.2.1
export async function checkProviderHealth(): Promise<boolean> {
  try {
    const response = await fetch("https://api.portone.io/health", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

**Requirement 매핑**: AC8.2.1, AC8.2.2, AC8.2.3

---

## 9. 모니터링 및 로깅

### 9.1 KPI 지표

```typescript
// lib/metrics/adult-verification.ts
export interface VerificationMetrics {
  initiatedCount: number;
  successCount: number;
  underageCount: number;   // v2.0: 미성년자 시도 수
  failedCount: number;
  successRate: number;
  underageRate: number;    // v2.0: 미성년자 비율
  dropoffRate: number;
}

export async function getVerificationMetrics(
  startDate: Date,
  endDate: Date
): Promise<VerificationMetrics> {
  const logs = await prisma.adultVerificationLog.groupBy({
    by: ["eventType"],
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    _count: true,
  });

  // 지표 계산...
}
```

**Requirement 매핑**: AC6.2.1, AC6.2.2, AC6.2.3, AC6.2.4

### 9.2 알림 임계치

```typescript
// @requirement AC6.3.1, AC6.3.2, AC6.3.3
if (metrics.successRate < 0.8) {
  await sendAlert("WARNING", "성인인증 성공률이 80% 미만입니다.");
}

if (metrics.errorRate > 0.1) {
  await sendAlert("CRITICAL", "성인인증 오류율이 10%를 초과했습니다.");
}
```

**Requirement 매핑**: AC6.3.1, AC6.3.2, AC6.3.3

---

## 10. 파일 구조 (v2.0)

```
web/src/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       └── register/
│   │           └── callback/
│   │               ├── page.tsx
│   │               └── callback-handler.tsx
│   └── api/
│       └── auth/
│           ├── register/
│           │   ├── initiate/
│           │   │   └── route.ts    # 회원가입 시작
│           │   └── complete/
│           │       └── route.ts    # 인증 검증 + 회원 생성
│           └── adult-verification/
│               ├── status/
│               │   └── route.ts    # 인증 상태 조회
│               └── reverify/
│                   └── route.ts    # 재인증 (만료 시)
├── components/
│   └── auth/
│       └── register-form.tsx       # 통합 회원가입 폼
├── lib/
│   ├── api/
│   │   └── auth.ts                 # requireAdultVerification 포함
│   └── services/
│       └── adult-verification.service.ts
├── constants/
│   └── adult-verification.ts
└── types/
    └── adult-verification.ts
```

---

## 11. 의존성

### 11.1 패키지

```json
{
  "@portone/browser-sdk": "^0.0.14"
}
```

### 11.2 환경 변수

```bash
# .env.local

# PortOne 설정 (필수)
NEXT_PUBLIC_PORTONE_STORE_ID=store-xxxx-xxxx
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-xxxx
PORTONE_API_SECRET=sk_live_xxxxxxxxxxxx

# 보안 설정 (필수)
ADULT_VERIFICATION_CI_SALT=random-32-char-salt
REGISTRATION_TOKEN_SECRET=another-32-char-secret   # v2.0 추가

# 기능 플래그 (선택)
ADULT_VERIFICATION_ENABLED=true
ADULT_VERIFICATION_AT_REGISTRATION=true  # v2.0 기본값
```

---

## 12. Requirement 매핑 요약

| 섹션 | 요구사항 | 설계 위치 |
|------|----------|----------|
| 1. 계정 상태 모델 | 1.1, 1.2, 1.3 | 2.1 데이터 모델, 4.1 서비스 |
| 2. 접근/구매 차단 | 2.1, 2.2, 2.3 | 3.5 미들웨어, 7 접근 제어 |
| 3. 회원가입 성인인증 플로우 | 3.1, 3.2, 3.3 | 3.2, 3.3 API, 5 컴포넌트 |
| 4. 데이터 저장 정책 | 4.1, 4.2 | 2.1, 2.2 데이터 모델, 4.1 서비스 |
| 5. 보안 | 5.1, 5.2 | 6 보안 설계 |
| 6. 모니터링/로깅 | 6.1, 6.2, 6.3 | 9 모니터링 |
| 7. 규정 준수 | 7.1, 7.2, 7.3 | 5.1 컴포넌트 (안내 UI) |
| 8. 런칭/롤백 | 8.1, 8.2 | 8 기능 플래그 |

---

## Notes

- 이 설계는 requirements.md **v2.0.0** 기준으로 작성됨
- **핵심 변경**: 성인인증을 회원가입 과정에 통합 (가입 = 인증)
- PortOne V2 Browser SDK 사용
- Next.js 16 App Router 패턴 준수
- 승인 후 `/kiro:spec-tasks adult-verification`으로 태스크 생성 진행
