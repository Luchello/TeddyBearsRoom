# PASS 성인인증 시스템 통합 설계 문서

**Version**: 1.0
**Date**: 2025-12-21
**Status**: Design Complete - Ready for Implementation

---

## Executive Summary

TeddyBear's Room 성인용품 E-commerce 플랫폼에 PASS 본인확인 기반 성인인증 시스템을 도입합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    핵심 설계 결정                            │
├─────────────────────────────────────────────────────────────┤
│  제공업체    →  KG이니시스 통합본인인증 (40원/건)           │
│  인증 시점   →  회원가입 시 (법적 리스크 최소화)            │
│  인증 방식   →  팝업 우선 + Redirect Fallback               │
│  CI 저장     →  HMAC-SHA256 해시 (개인정보 최소화)          │
│  개발 기간   →  2-3주                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM CONTEXT                                  │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐         ┌─────────────────┐         ┌──────────────┐
    │  User   │◄───────►│  TeddyBear's    │◄───────►│   Supabase   │
    │ Browser │         │     Room        │         │    Auth      │
    └─────────┘         │   (Next.js)     │         └──────────────┘
         │              └────────┬────────┘                │
         │                       │                         │
         │              ┌────────▼────────┐         ┌──────▼──────┐
         │              │   KG이니시스     │         │  PostgreSQL │
         └─────────────►│  통합본인인증    │         │  (Supabase) │
                        └─────────────────┘         └─────────────┘
                                │
                        ┌───────▼───────┐
                        │   PASS App    │
                        │ (SKT/KT/LGU+) │
                        └───────────────┘
```

### 1.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REGISTRATION + VERIFICATION FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

User ──▶ OAuth Login (Kakao/Google)
              │
              ▼
        Supabase Auth (Session)
              │
              ▼
        Profile Check (isAdultVerified?)
              │
       ┌──────┴──────┐
       │             │
     true          false
       │             │
       ▼             ▼
     Home       /verify-age
                     │
                     ▼
               KG이니시스 팝업
                     │
                     ▼
               PASS 앱 인증
                     │
                     ▼
               Callback (CI, birthDate)
                     │
                     ▼
               CI 해시 저장 + 성인확인
                     │
                     ▼
                  Home
```

---

## 2. API Specification

### 2.1 Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/verification/adult/request` | POST | 인증 요청 생성 (txId 발급) |
| `/api/verification/adult/callback` | POST | 이니시스 인증 결과 수신 |
| `/api/verification/adult/status` | GET | 인증 상태 확인 |
| `/api/verification/adult/verify` | POST | CI값 검증 및 Profile 업데이트 |

### 2.2 Type Definitions

```typescript
// Request/Response Types
type VerificationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'VERIFIED' | 'FAILED' | 'EXPIRED';

interface AdultVerificationRequest {
  returnUrl: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

interface AdultVerificationResponse {
  success: boolean;
  transactionId: string;
  authUrl: string;
  expiresAt: string;
}

interface VerificationResult {
  status: VerificationStatus;
  isAdult: boolean;
  verifiedAt: string | null;
  errorCode?: string;
  errorMessage?: string;
}
```

### 2.3 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| `UNAUTHORIZED` | 401 | 로그인이 필요합니다 |
| `UNDERAGE` | 400 | 19세 미만은 성인인증을 완료할 수 없습니다 |
| `CI_ALREADY_USED` | 400 | 이미 다른 계정에서 사용된 CI입니다 |
| `VERIFICATION_EXPIRED` | 400 | 인증 세션이 만료되었습니다 |
| `PROVIDER_ERROR` | 502 | 인증 제공사 오류가 발생했습니다 |

### 2.4 Rate Limiting

| Endpoint | Limit | Window | Scope |
|----------|-------|--------|-------|
| `/request` | 3 req | 1 hour | Per User |
| `/callback` | 10 req | 1 min | Per IP |
| `/status` | 30 req | 1 min | Per User |
| `/verify` | 5 req | 1 hour | Per User |

---

## 3. Database Schema

### 3.1 Profile Extension

```prisma
model Profile {
  // ... existing fields ...

  // Adult Verification Fields
  isAdultVerified       Boolean   @default(false)
  adultVerifiedAt       DateTime?
  adultVerificationCI   String?   @unique  // HMAC-SHA256 hash
  encryptedBirthDate    String?            // AES-256-GCM encrypted
  lastVerificationRenewedAt DateTime?

  // Relations
  adultVerificationLogs AdultVerificationLog[]

  @@index([isAdultVerified])
  @@index([adultVerifiedAt])
  @@map("profiles")
}
```

### 3.2 Verification Log

```prisma
model AdultVerificationLog {
  id              String                    @id @default(uuid())
  profileId       String
  requestId       String                    @unique
  provider        AdultVerificationProvider @default(PASS)
  status          AdultVerificationStatus
  failureReason   String?
  carrierCode     String?
  nationalityCode String?
  ipAddress       String?
  userAgent       String?
  requestedAt     DateTime                  @default(now())
  respondedAt     DateTime?
  expiresAt       DateTime

  profile         Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId, requestedAt(sort: Desc)])
  @@index([status])
  @@index([expiresAt])
  @@map("adult_verification_logs")
}

enum AdultVerificationProvider {
  PASS
  NICE
  KCB
  TOSS
}

enum AdultVerificationStatus {
  PENDING
  SUCCESS
  FAILED
  EXPIRED
  CANCELLED
  DUPLICATE
}
```

### 3.3 ERD

```
┌───────────────────────────────┐
│           Profile             │
├───────────────────────────────┤
│ PK  id                  UUID  │
│     email               UNIQUE│
│     isAdultVerified     BOOL  │
│     adultVerifiedAt     TS?   │
│     adultVerificationCI UNIQUE│◄── HMAC-SHA256 해시
│     encryptedBirthDate  TEXT? │    AES-256-GCM 암호화
└───────────────┬───────────────┘
                │ 1:N
                ▼
┌───────────────────────────────┐
│   AdultVerificationLog        │
├───────────────────────────────┤
│ PK  id            UUID        │
│ FK  profileId     UUID        │──► Profile.id
│     requestId     UNIQUE      │
│     provider      ENUM        │
│     status        ENUM        │
│     requestedAt   TIMESTAMP   │
│     expiresAt     TIMESTAMP   │◄── 로그 보관 만료
└───────────────────────────────┘
```

---

## 4. Security Architecture

### 4.1 Threat Model (STRIDE)

| Threat | Attack Vector | Mitigation |
|--------|---------------|------------|
| **S**poofing | 콜백 URL 스푸핑 | 화이트리스트, State Token |
| **T**ampering | 응답 데이터 변조 | 서명 검증, 서버 측 검증 |
| **R**epudiation | 인증 사실 부인 | 감사 로그, CI 해시 |
| **I**nfo Disclosure | CI/DI 유출 | 해시만 저장, TLS 1.3 |
| **D**oS | 인증 요청 폭주 | Rate Limiting |
| **E**levation | 미성년자 권한 획득 | 결제 전 재검증 |

### 4.2 CI/DI Processing

```
┌─────────────────────────────────────────────────────────────┐
│                    CI HASHING STRATEGY                       │
└─────────────────────────────────────────────────────────────┘

  [Raw CI: 88 chars]
         │
         ▼
  HMAC-SHA256(CI, PEPPER_SECRET)
         │
         ▼
  [Hash: 64 hex chars] ──► DB Storage
         │
         ▼
  [Raw CI: Immediately Discarded]
```

**Environment Variables:**
```bash
# CI 해시용 PEPPER (32 bytes = 64 hex chars)
ADULT_VERIFICATION_PEPPER=your_64_char_hex_pepper

# 생년월일 암호화 키 (32 bytes = 64 hex chars)
BIRTHDATE_ENCRYPTION_KEY=your_64_char_hex_key
```

### 4.3 Encryption Strategy

| Layer | Method | Purpose |
|-------|--------|---------|
| Transit | TLS 1.3 + HSTS | 전송 구간 암호화 |
| Application | HttpOnly Secure Cookie | 세션 보호 |
| Storage (CI) | HMAC-SHA256 | 중복 검사용 해시 |
| Storage (BirthDate) | AES-256-GCM | 개인정보 암호화 |

### 4.4 Compliance Checklist

- [x] 개인정보보호법(PIPA) - 최소 수집, 암호화, 보관 기간
- [x] 청소년보호법 - 19세 미만 판매 금지 검증
- [x] OWASP Top 10 - 인증, 주입, XSS 대응

---

## 5. Frontend Components

### 5.1 Component Hierarchy

```
components/verification/
├── index.ts                        # Barrel export
├── adult-verification-button.tsx   # 인증 시작 버튼
├── adult-verification-modal.tsx    # 팝업/모달 래퍼
├── adult-verification-status.tsx   # 인증 상태 표시
└── adult-verification-guard.tsx    # 라우트 보호

hooks/
└── use-adult-verification.ts       # 인증 상태/액션 훅

stores/
└── verification-store.ts           # Zustand store (optional)
```

### 5.2 Component Interfaces

```typescript
// AdultVerificationButton
interface AdultVerificationButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  onSuccess?: (result: VerificationResult) => void;
  onError?: (error: VerificationError) => void;
  successRedirect?: string;
  children?: React.ReactNode;
}

// AdultVerificationGuard
interface AdultVerificationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  required?: boolean;
}
```

### 5.3 Hook: useAdultVerification

```typescript
interface UseAdultVerificationReturn {
  // State
  status: VerificationStatus;
  isVerified: boolean;
  isLoading: boolean;
  error: VerificationError | null;

  // Actions
  startVerification: (options?: StartOptions) => Promise<void>;
  refreshStatus: () => Promise<void>;
  clearError: () => void;
}
```

### 5.4 User Flow States

```
┌─────────────────────────────────────────────────────────────┐
│                VERIFICATION BUTTON STATES                    │
├─────────────────────────────────────────────────────────────┤
│  [1] Default      →  [성인인증 하기]                        │
│  [2] Loading      →  [인증 중...]        (disabled)         │
│  [3] Verified     →  [인증 완료]         (success)          │
│  [4] Error        →  [인증 실패 - 다시 시도]                │
│  [5] Expired      →  [인증 만료 - 재인증 필요]              │
└─────────────────────────────────────────────────────────────┘
```

### 5.5 Accessibility (a11y)

- ARIA labels for all interactive elements
- Keyboard navigation (Tab, Escape, Enter)
- Focus management (trap in modal)
- Screen reader announcements (aria-live)
- Color contrast WCAG 2.1 AA compliance

---

## 6. Implementation Roadmap

### 6.1 Phase Overview

```
Week 1          Week 2          Week 3
────────────────────────────────────────
[계약/계정발급 ]
     [스키마/API 구조    ]
               [연동 구현          ]
                    [테스트/QA     ]
                              [배포]
```

### 6.2 Detailed Tasks

| Phase | Task | Duration | Owner |
|-------|------|----------|-------|
| **1. Setup** | KG이니시스 계약 | 3-5일 | Business |
| | 환경변수 설정 | 1시간 | DevOps |
| | Prisma 스키마 확장 | 2시간 | Backend |
| **2. Backend** | API Routes 생성 | 4시간 | Backend |
| | 암호화/해시 유틸 | 4시간 | Backend |
| | 이니시스 연동 | 8시간 | Backend |
| **3. Frontend** | 인증 Hook 구현 | 4시간 | Frontend |
| | UI 컴포넌트 | 6시간 | Frontend |
| | 회원가입 통합 | 4시간 | Fullstack |
| **4. QA** | Unit/Integration Tests | 6시간 | QA |
| | E2E Tests | 4시간 | QA |
| | 보안 검토 | 4시간 | Security |
| **5. Deploy** | Staging | 2시간 | DevOps |
| | Production | 2시간 | DevOps |

### 6.3 Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 이니시스 심사 지연 | Medium | High | 조기 신청, NICE 백업 |
| 팝업 차단 | High | Medium | Redirect fallback |
| PASS 앱 미설치 | Medium | Low | 타 인증수단 안내 |
| CI 해시 충돌 | Very Low | High | 모니터링, 수동 검토 |

---

## 7. Cost Analysis

### 7.1 Operational Costs

| 월 인증 건수 | 비용 (40원/건) |
|-------------|---------------|
| 100건 | 4,000원 |
| 500건 | 20,000원 |
| 1,000건 | 40,000원 |
| 5,000건 | 200,000원 |

### 7.2 ROI

```
┌─────────────────────────────────────────────────────────────┐
│                      ROI ANALYSIS                            │
├─────────────────────────────────────────────────────────────┤
│  비용:                                                       │
│  ├── 개발: ~40시간 내부 인건비                               │
│  └── 운영: ~4만원/월 (1,000건 기준)                          │
│                                                              │
│  이익:                                                       │
│  ├── 법적 리스크 제거 (3천만원 벌금 회피)                    │
│  ├── 사이트 접속차단 방지 (사업 연속성)                      │
│  └── 고객 신뢰도 향상                                        │
│                                                              │
│  결론: 필수 투자 (법적 compliance)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Generated Design Documents

| Document | Path |
|----------|------|
| System Architecture | `claudedocs/architecture_pass_adult_verification.md` |
| API Specification | `claudedocs/api_spec_adult_verification.md` |
| Security Architecture | `claudedocs/security_architecture_pass_verification.md` |

---

## 9. Next Steps

1. **즉시 Action Items**
   - [ ] KG이니시스 계약 진행 (Business Owner)
   - [ ] 환경변수 Vault 설정 (DevOps)
   - [ ] Prisma 마이그레이션 준비 (Backend)

2. **구현 시작**
   ```bash
   # 구현 명령어
   /sc:implement adult-verification-system
   ```

3. **담당자 배정**
   - Backend: API Routes + 이니시스 연동
   - Frontend: 컴포넌트 + Hook
   - QA: 테스트 케이스 작성

---

**Document Author**: Claude Code (Opus 4.5)
**Design Status**: Complete
**Review Status**: Pending Team Review
**Next Action**: `/sc:implement` for implementation
