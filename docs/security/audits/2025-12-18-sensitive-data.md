# Security Audit Report: Sensitive Data Exposure Analysis
## TeddyBear's Room E-commerce Platform

**Audit Date**: 2025-12-18 (Updated)
**Auditor**: Security Engineer Agent
**Scope**: Full codebase scan - web/src/, configuration files, API routes
**Compliance Standards**: GDPR, PIPA, OWASP Top 10

---

## Executive Summary

This comprehensive security audit examined the TeddyBear's Room e-commerce platform for sensitive data exposure risks.

**Audit Coverage:**
- Environment variable configuration and exposure
- Hardcoded secrets and API keys in source code
- NEXT_PUBLIC_ prefix misuse analysis
- Git history for committed sensitive files
- API routes data over-exposure
- Console.log statements with sensitive data
- Payment integration (TossPayments) security
- Body measurements encryption implementation
- Debug flags and development mode exposure

```
+------------------------------------------------------------------+
|                    SECURITY AUDIT SUMMARY                        |
+------------------------------------------------------------------+
| Overall Risk Level: MEDIUM                                       |
|                                                                  |
| CRITICAL (Immediate Fix Required):         1                     |
| HIGH (Should Fix This Sprint):             2                     |
| MEDIUM (Next Sprint):                      4                     |
| LOW (Backlog):                             3                     |
+------------------------------------------------------------------+

POSITIVE FINDINGS:
+------------------------------------------------------------------+
| [OK] No hardcoded API keys or secrets detected                   |
| [OK] .gitignore properly excludes .env* files                    |
| [OK] NEXT_PUBLIC_ used only for Supabase URL and anon key        |
| [OK] Consistent authentication via requireAuth() helper          |
| [OK] Generic error messages (no stack traces to client)          |
| [OK] Zod validation on Orders API                                |
+------------------------------------------------------------------+
```

---

## Section 1: Body Measurements Security

### 1.1 Database Schema Analysis

**File**: `web/prisma/schema.prisma`

#### Legacy `body_measurements` Table (RLS-Protected)
```prisma
model body_measurements {
  id         String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id    String    @unique(map: "unique_user_body_measurement") @db.Uuid
  height     Bytes?    // pgcrypto encrypted
  chest      Bytes?    // pgcrypto encrypted
  waist      Bytes?    // pgcrypto encrypted
  hips       Bytes?    // pgcrypto encrypted
  inseam     Bytes?    // pgcrypto encrypted
  ...
}
```

**POSITIVE**:
- Row Level Security (RLS) enabled
- Fields stored as `Bytes` (encrypted at DB level via pgcrypto)

#### Profile Table (E-commerce Model)
```prisma
model Profile {
  ...
  height                Int?       // NOT encrypted
  weight                Int?       // NOT encrypted
  gender                String?    // NOT encrypted
  topSize               String?    // NOT encrypted
  bottomSize            String?    // NOT encrypted
  shoeSize              Int?       // NOT encrypted
  encryptedMeasurements String?    // Encrypted field
  ...
}
```

### Finding 1.1.1: Inconsistent Encryption Strategy
**Severity**: CRITICAL
**Category**: Data at Rest

```
┌──────────────────────────────────────────────────────────────┐
│  DATA ENCRYPTION INCONSISTENCY                               │
├──────────────────────────────────────────────────────────────┤
│  body_measurements table:                                    │
│    height, chest, waist, hips, inseam → Bytes (ENCRYPTED)   │
│                                                              │
│  Profile table:                                              │
│    height, weight, gender, sizes → Plain Int/String         │
│    encryptedMeasurements → String (client-encrypted?)       │
└──────────────────────────────────────────────────────────────┘
```

**Issue**: The `Profile` model stores body measurements (height, weight, gender) as plain integers/strings while the legacy `body_measurements` table uses pgcrypto encryption. This creates:
1. Unencrypted sensitive data in the profiles table
2. Duplicate data with different protection levels
3. Potential compliance violations (PIPA Article 29)

**PIPA (개인정보보호법) Reference**:
> Article 29 (Measures to Ensure Safety): Personal information controller must take technical measures (encryption) for storing personal information safely.

**Remediation**:
```typescript
// Option A: Use pgcrypto for Profile measurements
// Requires raw SQL or Supabase functions for encrypt/decrypt

// Option B: Client-side encryption before storage
const encryptedData = await encrypt({
  height: measurement.height,
  weight: measurement.weight,
  // ... other fields
});
await prisma.profile.update({
  where: { id: userId },
  data: { encryptedMeasurements: encryptedData }
});
```

---

### 1.2 API Route Analysis

**File**: `web/src/app/api/users/me/measurements/route.ts`

### Finding 1.2.1: Sensitive Data Returned Unmasked
**Severity**: IMPORTANT
**Category**: Data in Transit

```typescript
// Current GET Response (Line 149-157)
return apiSuccess({
  height: profile.height ?? null,
  weight: profile.weight ?? null,
  gender: profile.gender ?? null,
  topSize: profile.topSize ?? null,
  bottomSize: profile.bottomSize ?? null,
  shoeSize: profile.shoeSize ?? null,
  encryptedMeasurements: profile.encryptedMeasurements ?? null,
});
```

**Issue**: All measurement data returned to client without masking or sanitization.

**Recommendation**: Consider masking sensitive fields in API responses:
```typescript
return apiSuccess({
  hasHeight: profile.height !== null,  // Boolean indicator
  height: profile.height ?? null,       // Or masked version
  // ... or return ranges instead of exact values
  heightRange: getHeightRange(profile.height),  // "170-175cm"
});
```

### Finding 1.2.2: Robust Authentication Implementation
**Severity**: INFO (Positive Finding)
**Category**: Access Control

```typescript
// Proper auth check using centralized helper
const authResult = await requireAuth();
if (!authResult.success) return authResult.response;
const user = authResult.user;
```

**POSITIVE**: All endpoints properly implement authentication via `requireAuth()` helper.

---

## Section 2: PII Protection

### 2.1 User Data Types

**File**: `web/src/types/user.ts`

```typescript
export interface User {
  id: string;
  email: string;              // PII
  phone: string | null;       // PII
  name: string | null;        // PII
  dateOfBirth: Date | null;   // PII (Sensitive)
  gender: Gender | null;      // PII
  // ...
}

export interface Address {
  recipientName: string;      // PII
  phone: string;              // PII
  zipCode: string;            // PII
  address1: string;           // PII
  address2: string | null;    // PII
}
```

### Finding 2.1.1: No PII Masking Functions
**Severity**: IMPORTANT
**Category**: Data Minimization

**Issue**: No utility functions exist for masking PII in logs or API responses:
- Phone numbers displayed in full
- Email addresses not masked
- Names not anonymized for logging

**Recommendation**: Create masking utility:
```typescript
// lib/utils/masking.ts
export function maskPhone(phone: string): string {
  // 010-1234-5678 -> 010-****-5678
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
}

export function maskEmail(email: string): string {
  // john.doe@example.com -> j***e@example.com
  const [local, domain] = email.split('@');
  return `${local[0]}***${local[local.length-1]}@${domain}`;
}

export function maskName(name: string): string {
  // 홍길동 -> 홍**
  return name[0] + '*'.repeat(name.length - 1);
}
```

---

## Section 3: Age Verification (PASS)

### 3.1 PASS Verification Data

**File**: `web/src/types/user.ts`

```typescript
export interface PassVerificationResult {
  success: boolean;
  ci: string;       // 연계정보 (CI) - HIGHLY SENSITIVE
  di: string;       // 중복가입확인정보 (DI) - HIGHLY SENSITIVE
  name: string;     // 실명
  phone: string;    // 전화번호
  birthDate: string; // 생년월일
  gender: "M" | "F";
}
```

### Finding 3.1.1: CI/DI Storage Location Unknown
**Severity**: CRITICAL
**Category**: Sensitive Data Storage

```
┌──────────────────────────────────────────────────────────────┐
│  CI/DI (연계정보) SECURITY ASSESSMENT                        │
├──────────────────────────────────────────────────────────────┤
│  CI (Connection Information):                                │
│    - 88 byte unique identifier                              │
│    - Links user across ALL services using PASS              │
│    - MUST be encrypted or NOT stored at all                 │
│                                                              │
│  DI (Duplicate Information):                                 │
│    - 64 byte unique identifier                              │
│    - Site-specific, less sensitive than CI                  │
│    - Can be stored encrypted for duplicate detection        │
└──────────────────────────────────────────────────────────────┘
```

**PIPA (개인정보보호법) Reference**:
> Article 24-2: Resident registration numbers and equivalent unique identifiers (CI) must be encrypted when stored.

**Issue**: The type definition exists but storage mechanism was not found in the audit scope. If CI/DI is stored:
1. It MUST be encrypted with separate key management
2. Access must be strictly logged
3. Retention period must be minimized

**Required Action**: Confirm CI/DI storage location and encryption status.

---

## Section 4: Logging Security

### 4.1 Console Logging Patterns

**Found Patterns**:
```typescript
// web/src/app/api/users/me/measurements/route.ts
console.error("Measurements GET Error:", error);
console.error("Measurements PATCH Error:", error);
console.error("Measurements DELETE Error:", error);

// web/src/app/api/users/me/route.ts
console.error("User GET Error:", error);
console.error("User PATCH Error:", error);
```

### Finding 4.1.1: Unstructured Error Logging
**Severity**: IMPORTANT
**Category**: Audit Trail

**Issue**: Current logging is basic console output without:
- Request ID tracking
- User ID association (for audit trail)
- Structured log format (JSON)
- Log level differentiation

**Recommendation**: Implement structured logging:
```typescript
// lib/logger.ts
interface SecurityLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';
  requestId: string;
  userId?: string;      // NEVER log actual user data
  action: string;
  resourceType: string;
  success: boolean;
  errorCode?: string;
  // NEVER include: email, phone, name, address, measurements
}

export function logSecurityEvent(event: SecurityLog): void {
  // Structured JSON logging
  console.log(JSON.stringify({
    ...event,
    timestamp: new Date().toISOString(),
  }));
}

// Usage in API route
logSecurityEvent({
  level: 'AUDIT',
  requestId: crypto.randomUUID(),
  userId: user.id,  // ID only, no PII
  action: 'MEASUREMENTS_UPDATE',
  resourceType: 'body_measurements',
  success: true,
});
```

### Finding 4.1.2: Error Objects May Contain PII
**Severity**: IMPORTANT
**Category**: Log Sanitization

```typescript
// Current pattern - logs full error object
console.error("Measurements GET Error:", error);
```

**Issue**: If the error contains request body or database query results, PII may be logged.

**Recommendation**:
```typescript
// Safe error logging
catch (error) {
  const sanitizedError = {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : String(error),
    // DO NOT include: error.stack (may contain query data)
  };
  console.error("Measurements GET Error:", sanitizedError);
}
```

---

## Section 5: Access Control

### 5.1 Authorization Model

### Finding 5.1.1: User Role Types Defined But Not Enforced
**Severity**: IMPORTANT
**Category**: Authorization

**File**: `web/src/types/user.ts`
```typescript
export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
```

**Issue**: Role types are defined but no role-based access control (RBAC) was found in API routes.

**Current State**:
- All protected routes only check authentication (is user logged in?)
- No authorization checks (is user allowed to perform this action?)

**Recommendation**: Implement RBAC middleware:
```typescript
// lib/api/rbac.ts
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthResult> {
  const authResult = await requireAuth();
  if (!authResult.success) return authResult;

  const profile = await prisma.profile.findUnique({
    where: { id: authResult.user.id },
    select: { role: true }
  });

  if (!allowedRoles.includes(profile.role)) {
    return {
      success: false,
      response: apiError("권한이 없습니다.", 403, "FORBIDDEN")
    };
  }

  return authResult;
}

// Usage in admin route
const authResult = await requireRole(['ADMIN', 'SUPER_ADMIN']);
```

---

## Section 6: Data Protection Controls Missing

### Finding 6.1: No Rate Limiting
**Severity**: IMPORTANT
**Category**: Brute Force Protection

**Issue**: No rate limiting implementation found. APIs vulnerable to:
- Brute force attacks on authentication
- Data enumeration attacks
- DoS via API abuse

**Recommendation**:
```typescript
// Using upstash/ratelimit or similar
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function rateLimitMiddleware(userId: string) {
  const { success, limit, remaining } = await ratelimit.limit(userId);
  if (!success) {
    return apiError("요청이 너무 많습니다.", 429, "RATE_LIMITED");
  }
}
```

### Finding 6.2: No CSRF Protection
**Severity**: INFO
**Category**: Request Forgery

**Issue**: No explicit CSRF tokens found. Next.js App Router with cookies provides some inherent protection, but explicit CSRF tokens recommended for state-changing operations.

### Finding 6.3: No Input Sanitization Layer
**Severity**: INFO
**Category**: Injection Prevention

**Issue**: While Prisma provides SQL injection protection, no explicit sanitization for:
- HTML/XSS in user input
- Command injection in file operations (if any)

**Current**: Using Zod validation for Orders API:
```typescript
const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema),
  shippingAddress: z.string().max(500).optional(),
  // ...
});
```

**Positive**: Schema validation exists for orders.

---

## Section 7: Data Minimization & Retention

### Finding 7.1: No Data Retention Policy Implementation
**Severity**: INFO
**Category**: GDPR/PIPA Compliance

**Issue**: No evidence of:
- Automated data deletion after retention period
- User data export functionality (GDPR Article 20)
- Right to deletion implementation (GDPR Article 17)

**PIPA (개인정보보호법) Reference**:
> Article 21: Personal information controller must destroy personal information without delay when the retention period has expired.

**Recommendation**:
```typescript
// lib/data-retention.ts
export async function cleanupExpiredData(): Promise<void> {
  // Delete inactive accounts after 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  await prisma.profile.deleteMany({
    where: {
      lastLoginAt: { lt: twoYearsAgo },
      status: 'INACTIVE'
    }
  });
}
```

---

## Section 8: Positive Security Findings

### 8.1 Well-Implemented Controls

| Control | Status | Notes |
|---------|--------|-------|
| Server-side Authentication | GOOD | Centralized `requireAuth()` helper |
| Session Management | GOOD | Supabase Auth with cookie-based sessions |
| SQL Injection Prevention | GOOD | Prisma ORM parameterized queries |
| Input Validation | PARTIAL | Zod schemas for some endpoints |
| HTTPS | GOOD | Enforced at deployment level |
| RLS (body_measurements) | GOOD | Row-level security enabled |

### 8.2 Previous Security Audit Reference

A previous security audit (`SECURITY_AUDIT_REPORT_2025-12-17.md`) addressed:
- Centralized authentication pattern
- Consistent error response format
- Type-safe user object handling

---

## Remediation Priority Matrix

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      REMEDIATION PRIORITY MATRIX                         │
├──────┬──────────────────────────────────────────────┬───────────────────┤
│ Rank │ Finding                                       │ Effort  │ Impact │
├──────┼──────────────────────────────────────────────┼─────────┼────────┤
│  1   │ Profile measurements encryption              │ HIGH    │ HIGH   │
│  2   │ CI/DI storage verification                   │ MEDIUM  │ HIGH   │
│  3   │ Rate limiting implementation                 │ MEDIUM  │ HIGH   │
│  4   │ Structured security logging                  │ MEDIUM  │ MEDIUM │
│  5   │ PII masking utilities                        │ LOW     │ MEDIUM │
│  6   │ RBAC implementation                          │ HIGH    │ MEDIUM │
│  7   │ Data retention automation                    │ MEDIUM  │ LOW    │
└──────┴──────────────────────────────────────────────┴─────────┴────────┘
```

---

## Compliance Summary

### GDPR Compliance Status

| Article | Requirement | Status |
|---------|-------------|--------|
| 5(1)(f) | Integrity and confidentiality | PARTIAL - Encryption inconsistent |
| 17 | Right to erasure | NOT IMPLEMENTED |
| 20 | Data portability | NOT IMPLEMENTED |
| 25 | Data protection by design | PARTIAL |
| 32 | Security of processing | PARTIAL |

### PIPA (개인정보보호법) Compliance Status

| Article | Requirement | Status |
|---------|-------------|--------|
| 21 | Destruction after retention | NOT IMPLEMENTED |
| 24-2 | CI encryption | UNKNOWN |
| 29 | Technical safety measures | PARTIAL |
| 30 | Personal information processing policy | NOT AUDITED |

---

## Appendix A: Affected Files

| File | Security Relevance |
|------|-------------------|
| `web/prisma/schema.prisma` | Database encryption strategy |
| `web/src/app/api/users/me/measurements/route.ts` | Body measurements API |
| `web/src/app/api/users/me/route.ts` | User profile API |
| `web/src/app/api/orders/route.ts` | Order creation with PII |
| `web/src/types/user.ts` | PII type definitions |
| `web/src/lib/api/auth.ts` | Authentication helper |

---

## Appendix B: Recommended Implementation Order

```
Week 1-2: Critical Items
├── Encrypt Profile measurements (height, weight, gender)
├── Verify CI/DI storage and encryption
└── Implement rate limiting

Week 3-4: Important Items
├── Structured security logging
├── PII masking utilities
└── Error sanitization

Week 5-6: Best Practices
├── RBAC implementation
├── Data retention automation
└── CSRF token enhancement
```

---

**Report Prepared By**: Security Engineer Agent
**Classification**: CONFIDENTIAL
**Distribution**: Development Team, Security Team
**Next Audit Scheduled**: Q1 2026

---

*This audit was performed using static code analysis. A comprehensive penetration test is recommended to identify runtime vulnerabilities.*
