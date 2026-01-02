# Design: 성인인증 시스템 (Adult Verification)

> Generated: 2026-01-02
> Spec: adult-verification
> Version: 1.0.0
> Status: Generated (Pending Approval)

---

## 1. 시스템 아키텍처

### 1.1 전체 흐름

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            성인인증 시스템 아키텍처                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐ │
│  │   Client    │────▶│  Next.js    │────▶│  PortOne    │────▶│   PG사    │ │
│  │  (Browser)  │◀────│    API      │◀────│    API      │◀────│ (KCP/다날) │ │
│  └─────────────┘     └─────────────┘     └─────────────┘     └───────────┘ │
│         │                   │                                               │
│         │                   ▼                                               │
│         │            ┌─────────────┐                                        │
│         │            │  Supabase   │                                        │
│         └───────────▶│  PostgreSQL │                                        │
│                      │  (Profile)  │                                        │
│                      └─────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 인증 시퀀스 다이어그램

```
┌──────┐          ┌──────────┐          ┌──────────┐          ┌────────┐
│Client│          │Next.js   │          │PortOne   │          │ PG사   │
└──┬───┘          └────┬─────┘          └────┬─────┘          └───┬────┘
   │                   │                     │                    │
   │ 1. 인증 시작 요청  │                     │                    │
   │──────────────────▶│                     │                    │
   │                   │                     │                    │
   │ 2. txid 생성/저장  │                     │                    │
   │◀──────────────────│                     │                    │
   │                   │                     │                    │
   │ 3. SDK 호출       │                     │                    │
   │ requestIdentity   │                     │                    │
   │ Verification()    │                     │                    │
   │───────────────────────────────────────▶│                    │
   │                   │                     │                    │
   │                   │                     │ 4. 본인확인 요청    │
   │                   │                     │───────────────────▶│
   │                   │                     │                    │
   │ 5. 인증 팝업/리다이렉트                   │                    │
   │◀──────────────────────────────────────────────────────────────│
   │                   │                     │                    │
   │ 6. 사용자 인증 완료 │                     │                    │
   │───────────────────────────────────────────────────────────────▶
   │                   │                     │                    │
   │ 7. 인증 결과      │                     │◀───────────────────│
   │◀───────────────────────────────────────│                    │
   │                   │                     │                    │
   │ 8. 서버 검증 요청  │                     │                    │
   │──────────────────▶│                     │                    │
   │                   │                     │                    │
   │                   │ 9. 인증 결과 조회    │                    │
   │                   │────────────────────▶│                    │
   │                   │                     │                    │
   │                   │ 10. verifiedCustomer│                    │
   │                   │◀────────────────────│                    │
   │                   │                     │                    │
   │                   │ 11. 연령 확인       │                    │
   │                   │     Profile 업데이트 │                    │
   │                   │                     │                    │
   │ 12. 인증 완료     │                     │                    │
   │◀──────────────────│                     │                    │
   │                   │                     │                    │
```

---

## 2. 데이터 모델

### 2.1 Profile 모델 확장

**파일**: `web/prisma/schema.prisma`

```prisma
model Profile {
  // 기존 필드...

  // Adult Verification (성인인증)
  isAdultVerified       Boolean          @default(false)
  adultVerifiedAt       DateTime?
  adultVerifyMethod     String?          // "PHONE"
  adultVerifyProvider   String?          // "PORTONE_KCP", "PORTONE_DANAL"
  adultVerifyTxid       String?          // 본인인증 거래 ID
  ciHash                String?          // SHA-256 해시된 CI (원문 저장 안 함)

  // 기존 ci, di 필드는 제거하거나 사용 안 함
}
```

**필드 설명**:

| 필드 | 타입 | 설명 | Requirements |
|------|------|------|--------------|
| `isAdultVerified` | Boolean | 성인인증 완료 여부 | AC1.1.3 |
| `adultVerifiedAt` | DateTime? | 인증 완료 시각 | AC1.1.3 |
| `adultVerifyMethod` | String? | 인증 방식 (PHONE) | AC4.1.1 |
| `adultVerifyProvider` | String? | 인증 제공사 | AC4.1.1 |
| `adultVerifyTxid` | String? | 거래 ID | AC4.1.1 |
| `ciHash` | String? | CI 해시 (SHA-256) | AC4.1.3 |

### 2.2 인증 이벤트 로그 모델

```prisma
model AdultVerificationLog {
  id            String   @id @default(cuid())
  profileId     String
  txid          String
  eventType     String   // INITIATED, SUCCESS, FAILED
  failureCode   String?  // 실패 시 에러 코드
  createdAt     DateTime @default(now())

  profile       Profile  @relation(fields: [profileId], references: [id])

  @@index([profileId])
  @@index([txid])
  @@index([createdAt])
}
```

**Requirement 매핑**: AC6.1.1, AC6.1.2, AC6.1.3, AC4.2.1

---

## 3. API 설계

### 3.1 API 엔드포인트

| Method | Path | 설명 | Auth |
|--------|------|------|------|
| POST | `/api/auth/adult-verification/initiate` | 인증 시작 | Required |
| POST | `/api/auth/adult-verification/verify` | 인증 결과 검증 | Required |
| GET | `/api/auth/adult-verification/status` | 인증 상태 조회 | Required |

### 3.2 인증 시작 API

**POST** `/api/auth/adult-verification/initiate`

```typescript
// Request
interface InitiateRequest {
  // 파라미터 없음 (인증된 사용자 기반)
}

// Response (Success)
interface InitiateResponse {
  success: true;
  data: {
    identityVerificationId: string;
    storeId: string;
    channelKey: string;
  };
}

// Response (Error)
interface InitiateErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

**구현**:

```typescript
// app/api/auth/adult-verification/initiate/route.ts
export async function POST(request: NextRequest) {
  // 1. 인증 확인
  const authResult = await requireAuth();
  if (!authResult.success) {
    return authResult.response;
  }

  // 2. 이미 인증된 경우 체크
  const profile = await prisma.profile.findUnique({
    where: { id: authResult.user.id },
    select: { isAdultVerified: true, adultVerifiedAt: true },
  });

  if (profile?.isAdultVerified && !isVerificationExpired(profile.adultVerifiedAt)) {
    return apiError("이미 성인인증이 완료되었습니다.", 400, "ALREADY_VERIFIED");
  }

  // 3. identityVerificationId 생성
  const identityVerificationId = `adult-${authResult.user.id}-${Date.now()}`;

  // 4. 인증 시작 로그
  await createVerificationLog(authResult.user.id, identityVerificationId, "INITIATED");

  // 5. 응답
  return apiSuccess({
    identityVerificationId,
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
  });
}
```

**Requirement 매핑**: AC3.1.1, AC3.1.2, AC6.1.1

### 3.3 인증 검증 API

**POST** `/api/auth/adult-verification/verify`

```typescript
// Request
interface VerifyRequest {
  identityVerificationId: string;
}

// Response (Success)
interface VerifyResponse {
  success: true;
  data: {
    verified: boolean;
    verifiedAt: string;
  };
}
```

**구현**:

```typescript
// app/api/auth/adult-verification/verify/route.ts
export async function POST(request: NextRequest) {
  // 1. 인증 확인
  const authResult = await requireAuth();
  if (!authResult.success) return authResult.response;

  // 2. Request body 파싱
  const { identityVerificationId } = await request.json();

  // 3. PortOne API로 결과 조회
  const response = await fetch(
    `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
    {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
      },
    }
  );

  if (!response.ok) {
    await createVerificationLog(authResult.user.id, identityVerificationId, "FAILED", "API_ERROR");
    return apiError("본인인증 정보를 조회할 수 없습니다.", 400, "VERIFICATION_NOT_FOUND");
  }

  const verification = await response.json();

  // 4. 상태 확인
  if (verification.status !== "VERIFIED") {
    await createVerificationLog(authResult.user.id, identityVerificationId, "FAILED", "NOT_VERIFIED");
    return apiError("본인인증이 완료되지 않았습니다.", 400, "NOT_VERIFIED");
  }

  const { verifiedCustomer } = verification;

  // 5. 연령 확인 (만 19세 이상)
  if (!isAdult(verifiedCustomer.birthDate)) {
    await createVerificationLog(authResult.user.id, identityVerificationId, "FAILED", "UNDERAGE");
    return apiError("만 19세 이상만 이용 가능합니다.", 403, "UNDERAGE");
  }

  // 6. CI 해시 생성
  const ciHash = hashCi(verifiedCustomer.ci);

  // 7. Profile 업데이트
  await prisma.profile.update({
    where: { id: authResult.user.id },
    data: {
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      adultVerifyMethod: "PHONE",
      adultVerifyProvider: "PORTONE_KCP",  // 또는 채널에서 추출
      adultVerifyTxid: identityVerificationId,
      ciHash: ciHash,
    },
  });

  // 8. 성공 로그
  await createVerificationLog(authResult.user.id, identityVerificationId, "SUCCESS");

  return apiSuccess({
    verified: true,
    verifiedAt: new Date().toISOString(),
  });
}
```

**Requirement 매핑**: AC3.2.1, AC3.2.2, AC3.2.3, AC4.1.1, AC4.1.2, AC4.1.3

### 3.4 접근 제어 미들웨어

**POST/GET** 성인 콘텐츠 API

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

  // 미인증
  if (!profile?.isAdultVerified) {
    return {
      success: false,
      response: apiError("성인인증이 필요합니다.", 403, "ADULT_VERIFICATION_REQUIRED"),
    };
  }

  // 만료 (1년)
  if (isVerificationExpired(profile.adultVerifiedAt)) {
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
 * Adult Verification Service
 *
 * PASS 본인인증 비즈니스 로직
 */

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// === Constants ===
const VERIFICATION_EXPIRY_DAYS = 365;
const ADULT_AGE = 19;

// === Types ===
export type VerificationStatus = "PENDING" | "VERIFIED" | "EXPIRED" | "FAILED";

export interface VerificationResult {
  success: boolean;
  status: VerificationStatus;
  message?: string;
}

// === Core Functions ===

/**
 * 성인 여부 확인 (만 19세 이상)
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
 * 인증 만료 여부 확인
 */
export function isVerificationExpired(verifiedAt: Date | null): boolean {
  if (!verifiedAt) return true;

  const expiryDate = new Date(verifiedAt);
  expiryDate.setDate(expiryDate.getDate() + VERIFICATION_EXPIRY_DAYS);

  return new Date() > expiryDate;
}

/**
 * CI 해시 생성 (SHA-256 + salt)
 */
export function hashCi(ci: string): string {
  const salt = process.env.ADULT_VERIFICATION_CI_SALT || "default-salt";
  return crypto
    .createHash("sha256")
    .update(ci + salt)
    .digest("hex");
}

/**
 * 사용자 인증 상태 조회
 */
export async function getVerificationStatus(
  profileId: string
): Promise<VerificationResult> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      isAdultVerified: true,
      adultVerifiedAt: true,
    },
  });

  if (!profile) {
    return { success: false, status: "FAILED", message: "프로필을 찾을 수 없습니다." };
  }

  if (!profile.isAdultVerified) {
    return { success: true, status: "PENDING" };
  }

  if (isVerificationExpired(profile.adultVerifiedAt)) {
    return { success: true, status: "EXPIRED" };
  }

  return { success: true, status: "VERIFIED" };
}

/**
 * 인증 완료 처리
 */
export async function completeVerification(
  profileId: string,
  txid: string,
  ciHash: string,
  provider: string
): Promise<void> {
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      adultVerifyMethod: "PHONE",
      adultVerifyProvider: provider,
      adultVerifyTxid: txid,
      ciHash: ciHash,
    },
  });
}

/**
 * 인증 이벤트 로그 생성
 */
export async function createVerificationLog(
  profileId: string,
  txid: string,
  eventType: "INITIATED" | "SUCCESS" | "FAILED",
  failureCode?: string
): Promise<void> {
  await prisma.adultVerificationLog.create({
    data: {
      profileId,
      txid,
      eventType,
      failureCode,
    },
  });
}
```

**Requirement 매핑**: AC3.2.1, AC1.2.1, AC4.1.3, AC6.1.1, AC6.1.2

---

## 5. 클라이언트 컴포넌트

### 5.1 AdultVerificationModal

**파일**: `web/src/components/auth/adult-verification-modal.tsx`

```typescript
"use client";

import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdultVerificationModal({ open, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 서버에서 인증 정보 요청
      const initiateResponse = await fetch("/api/auth/adult-verification/initiate", {
        method: "POST",
      });
      const initiateData = await initiateResponse.json();

      if (!initiateData.success) {
        setError(initiateData.error.message);
        return;
      }

      const { identityVerificationId, storeId, channelKey } = initiateData.data;

      // 2. PortOne SDK 호출
      const response = await PortOne.requestIdentityVerification({
        storeId,
        identityVerificationId,
        channelKey,
        redirectUrl: `${window.location.origin}/auth/adult-verification/callback`,
      });

      // 3. 에러 처리
      if (response.code !== undefined) {
        setError(getErrorMessage(response.code));
        return;
      }

      // 4. 서버 검증
      const verifyResponse = await fetch("/api/auth/adult-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityVerificationId: response.identityVerificationId,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        onSuccess();
        onClose();
      } else {
        setError(verifyData.error.message);
      }
    } catch (err) {
      console.error("Adult verification error:", err);
      setError("본인인증 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>성인인증</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            성인용 상품 열람 및 구매를 위해 본인인증이 필요합니다.
            휴대폰 본인확인을 통해 만 19세 이상임을 인증해주세요.
          </p>

          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>인증 정보는 연령 확인 목적으로만 사용됩니다.</li>
            <li>개인정보는 최소한으로 수집하며, 1년 후 재인증이 필요합니다.</li>
            <li>인증 완료까지 약 1-2분이 소요됩니다.</li>
          </ul>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button onClick={handleVerification} disabled={isLoading}>
              {isLoading ? "처리 중..." : "본인인증 시작"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getErrorMessage(code: string): string {
  switch (code) {
    case "IDENTITY_VERIFICATION_ALREADY_VERIFIED":
      return "이미 완료된 본인인증입니다.";
    case "PG_PROVIDER":
      return "인증 서비스에 일시적인 오류가 발생했습니다.";
    default:
      return "본인인증에 실패했습니다. 다시 시도해주세요.";
  }
}
```

**Requirement 매핑**: AC7.3.1, AC3.1.1, AC3.3.1, AC3.3.2

### 5.2 모바일 콜백 페이지

**파일**: `web/src/app/(auth)/auth/adult-verification/callback/page.tsx`

```typescript
import { Suspense } from "react";
import { AdultVerificationCallbackHandler } from "./callback-handler";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="p-4">인증 결과를 확인하는 중...</div>}>
      <AdultVerificationCallbackHandler />
    </Suspense>
  );
}
```

**Requirement 매핑**: AC3.1.3 (콜백 처리)

---

## 6. 보안 설계

### 6.1 State/Nonce 검증

```typescript
// Redis를 활용한 state 검증 (선택적)
import { redis } from "@/lib/redis";

export async function generateState(profileId: string): Promise<string> {
  const state = crypto.randomBytes(32).toString("hex");
  await redis.set(`adult-verification:state:${state}`, profileId, { ex: 600 }); // 10분 유효
  return state;
}

export async function validateState(state: string): Promise<string | null> {
  const profileId = await redis.get(`adult-verification:state:${state}`);
  if (profileId) {
    await redis.del(`adult-verification:state:${state}`);
  }
  return profileId;
}
```

**Requirement 매핑**: AC5.1.1, AC5.1.2

### 6.2 중복 콜백 방지

```typescript
export async function preventDuplicateCallback(txid: string): Promise<boolean> {
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
export function hashCi(ci: string): string {
  const salt = process.env.ADULT_VERIFICATION_CI_SALT!;
  return crypto.createHash("sha256").update(ci + salt).digest("hex");
}
```

**Requirement 매핑**: AC4.1.3

---

## 7. 접근 제어 통합

### 7.1 성인 상품 API 보호

```typescript
// app/api/products/[slug]/route.ts
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  // 성인 상품인 경우 인증 체크
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

  // 성인 상품 추가 시 인증 체크
  if (product?.isAdultOnly) {
    const adultAuth = await requireAdultVerification();
    if (!adultAuth.success) {
      return apiError("성인인증이 필요한 상품입니다.", 403, "ADULT_VERIFICATION_REQUIRED");
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

  // 인증 트리거 방식 (A: 회원가입 직후, B: 성인구역 진입 시)
  ADULT_VERIFICATION_TRIGGER: (process.env.ADULT_VERIFICATION_TRIGGER || "B") as "A" | "B",
};
```

**Requirement 매핑**: AC8.1.1, AC8.1.2, AC2.3.3

### 8.2 장애 대응

```typescript
// 장애 시 fail-secure: 인증 불가하면 접근 차단 유지
export async function handleProviderOutage(): Promise<void> {
  // 장애 감지 시
  // 1. 성인구역 접근 차단 유지 (fail-secure)
  // 2. 안내 공지 표시
}
```

**Requirement 매핑**: AC8.2.1, AC8.2.2

---

## 9. 모니터링 및 로깅

### 9.1 KPI 지표

```typescript
// lib/metrics/adult-verification.ts
export interface VerificationMetrics {
  initiatedCount: number;
  successCount: number;
  failedCount: number;
  successRate: number;        // successCount / initiatedCount
  dropoffRate: number;        // (initiated - success - failed) / initiated
  errorRate: number;          // failedCount / initiatedCount
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

**Requirement 매핑**: AC6.2.1, AC6.2.2, AC6.2.3

### 9.2 알림 임계치

```typescript
// 성공률 80% 미만 시 경고
if (metrics.successRate < 0.8) {
  await sendAlert("WARNING", "성인인증 성공률이 80% 미만입니다.");
}

// 오류율 10% 초과 시 긴급 알림
if (metrics.errorRate > 0.1) {
  await sendAlert("CRITICAL", "성인인증 오류율이 10%를 초과했습니다.");
}
```

**Requirement 매핑**: AC6.3.1, AC6.3.2, AC6.3.3

---

## 10. 파일 구조

```
web/src/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       └── adult-verification/
│   │           └── callback/
│   │               ├── page.tsx
│   │               └── callback-handler.tsx
│   └── api/
│       └── auth/
│           └── adult-verification/
│               ├── initiate/
│               │   └── route.ts
│               ├── verify/
│               │   └── route.ts
│               └── status/
│                   └── route.ts
├── components/
│   └── auth/
│       └── adult-verification-modal.tsx
├── lib/
│   ├── api/
│   │   └── auth.ts  (requireAdultVerification 추가)
│   ├── services/
│   │   └── adult-verification.service.ts
│   └── portone/
│       └── identity.ts  (PortOne API 래퍼)
├── constants/
│   └── adult-verification.ts
└── types/
    └── adult-verification.ts
```

---

## 11. 의존성

### 11.1 새로 추가할 패키지

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

# 기능 플래그 (선택)
ADULT_VERIFICATION_ENABLED=true
ADULT_VERIFICATION_TRIGGER=B
```

---

## 12. Requirement 매핑 요약

| 섹션 | 요구사항 | 설계 위치 |
|------|----------|----------|
| 1. 계정 상태 모델 | 1.1, 1.2, 1.3 | 2.1 데이터 모델, 4.1 서비스 |
| 2. 접근/구매 차단 | 2.1, 2.2, 2.3 | 3.4 미들웨어, 7 접근 제어 |
| 3. 성인인증 플로우 | 3.1, 3.2, 3.3 | 3.2, 3.3 API, 5 컴포넌트 |
| 4. 데이터 저장 정책 | 4.1, 4.2 | 2.1, 2.2 데이터 모델 |
| 5. 보안 | 5.1, 5.2 | 6 보안 설계 |
| 6. 모니터링/로깅 | 6.1, 6.2, 6.3 | 9 모니터링 |
| 7. 규정 준수 | 7.1, 7.2, 7.3 | 5.1 컴포넌트 (안내 UI) |
| 8. 런칭/롤백 | 8.1, 8.2 | 8 기능 플래그 |

---

## Notes

- 이 설계는 requirements.md v1.0.1 기준으로 작성됨
- PortOne V2 Browser SDK 사용
- Next.js 16 App Router 패턴 준수
- 승인 후 `/kiro:spec-tasks adult-verification`으로 태스크 생성 진행
