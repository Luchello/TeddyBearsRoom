# Security Audit Report: Error Handling & Information Leakage

**Project**: TeddyBear's Room E-commerce Platform
**Audit Date**: 2025-12-18
**Auditor**: Security Engineer Agent
**Scope**: API Routes, Library Files, React Components

---

## Executive Summary

```
+------------------------------------------------------------------+
|  SECURITY AUDIT OVERVIEW - Error Handling                        |
+------------------------------------------------------------------+
|  CRITICAL:  1   |  HIGH:  2   |  MEDIUM:  3   |  LOW:  2         |
+------------------------------------------------------------------+
|  Overall Risk Level: MEDIUM                                      |
|  Remediation Priority: HIGH for CRITICAL/HIGH findings           |
+------------------------------------------------------------------+
```

The audit identified several security concerns related to error handling practices. While the codebase demonstrates good use of helper functions (`apiError`, `apiSuccess`) for consistent API responses, there are notable gaps in error boundary implementation and potential information leakage through logging.

---

## Detailed Findings

### CRITICAL Severity

#### [CRIT-001] Missing Global Error Boundary for React Application

**Location**: `web/src/app/` (Missing `error.tsx`)

**Description**:
No global `error.tsx` file exists at the app root level. Next.js App Router requires `error.tsx` for proper error boundary functionality. Unhandled React errors could expose stack traces or crash the application without graceful degradation.

**Risk**:
- Stack traces could be exposed to end users in production
- Application crashes without recovery mechanism
- Poor user experience during unexpected errors

**ASCII Diagram - Error Flow Without Boundary**:
```
     User Request
          |
          v
    +-------------+
    | React Page  |
    +-------------+
          |
    [Unhandled Error]
          |
          v
    +------------------+
    | CRASH! No Catch  |  <-- No error.tsx
    +------------------+
          |
          v
    +------------------+
    | Raw Stack Trace  |  <-- Exposed to User
    | Visible in UI    |
    +------------------+
```

**Recommendation**:
Create `web/src/app/error.tsx`:
```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error server-side only (use error.digest for tracking)
  console.error("[App Error]:", error.digest);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>문제가 발생했습니다</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
```

---

### HIGH Severity

#### [HIGH-001] Console Logging of Full Error Objects in Production

**Locations**:
- `web/src/app/api/orders/route.ts` (lines 135, 276)
- `web/src/app/api/products/route.ts` (line 195)
- `web/src/app/api/products/[id]/route.ts` (line 109)
- `web/src/app/api/users/me/route.ts` (lines 108, 190)
- `web/src/app/api/users/me/measurements/route.ts` (lines 163, 318, 382)
- `web/src/lib/api/auth.ts` (line 91)
- `web/src/lib/query-client.ts` (line 35)

**Description**:
All API routes log the complete `error` object using `console.error("...", error)`. In serverless environments (Vercel), these logs may be accessible through log aggregation services. Full error objects can contain:
- Prisma query details and schema information
- Database connection strings
- Internal file paths
- Stack traces with internal code structure

**Current Pattern**:
```typescript
catch (error) {
  console.error("Orders GET Error:", error);  // VULNERABLE
  return apiError("...", 500, "...");
}
```

**Recommendation**:
Implement structured logging with sanitization:
```typescript
function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Never log stack in production
    return process.env.NODE_ENV === "production"
      ? error.message
      : `${error.message}\n${error.stack}`;
  }
  return String(error);
}

catch (error) {
  console.error({
    type: "API_ERROR",
    route: "orders/GET",
    message: sanitizeError(error),
    timestamp: new Date().toISOString(),
    // Add request ID for tracing without exposing sensitive data
  });
  return apiError("...", 500, "...");
}
```

---

#### [HIGH-002] Missing Not-Found Page Handler

**Location**: `web/src/app/` (Missing `not-found.tsx`)

**Description**:
No custom `not-found.tsx` exists. While Next.js provides a default 404 page, custom handling ensures:
- Consistent branding
- No accidental exposure of route structures
- Proper analytics tracking of 404 events

**Recommendation**:
Create `web/src/app/not-found.tsx`:
```typescript
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다</p>
      <a href="/">홈으로 돌아가기</a>
    </div>
  );
}
```

---

### MEDIUM Severity

#### [MED-001] Unhandled JSON Parsing Errors in API Routes

**Locations**:
- `web/src/app/api/orders/route.ts` (line 184)
- `web/src/app/api/users/me/route.ts` (line 152)
- `web/src/app/api/users/me/measurements/route.ts` (line 204)

**Description**:
`request.json()` can throw if the body is invalid JSON. While this is caught by the outer try-catch, the generic error message ("주문 생성에 실패했습니다") doesn't distinguish between malformed JSON and actual server errors.

**Current Pattern**:
```typescript
const body = await request.json();  // Can throw SyntaxError
const parseResult = Schema.safeParse(body);
```

**Recommendation**:
```typescript
let body;
try {
  body = await request.json();
} catch (e) {
  return apiError("잘못된 요청 형식입니다.", 400, "INVALID_JSON");
}
const parseResult = Schema.safeParse(body);
```

---

#### [MED-002] No Prisma Error Classification

**Locations**: All API routes

**Description**:
Prisma can throw different error types (`PrismaClientKnownRequestError`, `PrismaClientUnknownRequestError`, `PrismaClientValidationError`) with codes that reveal schema information. The current implementation treats all errors identically.

**Risk Matrix**:
```
+---------------------------+------------------+-------------------------+
| Prisma Error Type         | Code Example     | Information Leaked      |
+---------------------------+------------------+-------------------------+
| P2002 (Unique constraint) | email already    | Schema field names      |
| P2025 (Record not found)  | where condition  | Table/model structure   |
| P2003 (FK constraint)     | related model    | Relationship structure  |
+---------------------------+------------------+-------------------------+
```

**Recommendation**:
Create Prisma error handler utility:
```typescript
import { Prisma } from "@prisma/client";

export function handlePrismaError(error: unknown): { message: string; code: string; status: number } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return { message: "이미 존재하는 데이터입니다.", code: "DUPLICATE_ENTRY", status: 409 };
      case "P2025":
        return { message: "데이터를 찾을 수 없습니다.", code: "NOT_FOUND", status: 404 };
      case "P2003":
        return { message: "관련 데이터가 없습니다.", code: "FK_CONSTRAINT", status: 400 };
    }
  }
  return { message: "서버 오류가 발생했습니다.", code: "SERVER_ERROR", status: 500 };
}
```

---

#### [MED-003] Validation Error Details Exposed in Orders API

**Location**: `web/src/app/api/orders/route.ts` (line 192)

**Description**:
Zod validation errors expose field paths directly:
```typescript
`${firstIssue.message} (필드: ${firstIssue.path.join(".")})`
```

While this is useful for development, it reveals internal schema structure (field names like `items.0.productId`).

**Recommendation**:
Use generic field descriptions for production:
```typescript
const fieldMappings: Record<string, string> = {
  "items": "주문 상품",
  "items.productId": "상품 ID",
  "shippingAddress": "배송 주소",
};

const friendlyField = fieldMappings[firstIssue.path.join(".")] || "입력값";
return apiError(`${friendlyField}: ${firstIssue.message}`, 400, "VALIDATION_ERROR");
```

---

### LOW Severity

#### [LOW-001] Missing Error Event Analytics

**Description**:
No error tracking/analytics integration detected. Without proper error tracking:
- Security incidents may go undetected
- Recurring errors are not identified
- Attack patterns cannot be analyzed

**Recommendation**:
Integrate error monitoring service (Sentry, LogRocket, etc.):
```typescript
import * as Sentry from "@sentry/nextjs";

catch (error) {
  Sentry.captureException(error, {
    tags: { route: "orders", method: "POST" },
    extra: { userId: user?.id },  // Never log PII in production
  });
  return apiError("...", 500, "...");
}
```

---

#### [LOW-002] Client-Side Error Logging in Query Client

**Location**: `web/src/lib/query-client.ts` (line 35)

**Description**:
Mutation errors are logged to browser console:
```typescript
onError: (error) => {
  console.error("Mutation error:", error);
},
```

While browser console is less risky than server logs, sophisticated attackers could still analyze error patterns.

**Recommendation**:
Implement client-side error boundary with user notification:
```typescript
onError: (error) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Mutation error:", error);
  }
  // Show user-friendly toast instead
  toast.error("작업에 실패했습니다. 다시 시도해 주세요.");
},
```

---

## Positive Findings

### [POS-001] Consistent API Response Format
The codebase uses `apiSuccess()` and `apiError()` helper functions consistently across all API routes, preventing ad-hoc error responses that might leak information.

**Pattern**:
```
+------------------+     +------------------+     +------------------+
|   API Handler    | --> |   apiError()     | --> | Standardized     |
|   catch block    |     |   apiSuccess()   |     | JSON Response    |
+------------------+     +------------------+     +------------------+
                              |
                              v
                    { success: bool, error/data, code }
```

### [POS-002] User-Friendly Error Messages
All error messages use Korean localization and avoid technical jargon:
- "주문 목록을 불러오는데 실패했습니다." (not "Database query failed")
- "로그인이 필요합니다." (not "Unauthorized: No token provided")

### [POS-003] Authentication Error Isolation
The `requireAuth()` function in `web/src/lib/api/auth.ts` properly catches and sanitizes authentication errors, returning generic messages rather than exposing Supabase-specific error details.

---

## Remediation Priority Matrix

```
+----------+---------------+----------------+------------------+
| Priority | Finding ID    | Effort         | Impact           |
+----------+---------------+----------------+------------------+
| 1        | CRIT-001      | Low (1 file)   | Prevents crashes |
| 2        | HIGH-001      | Medium         | Data protection  |
| 3        | HIGH-002      | Low (1 file)   | UX & Security    |
| 4        | MED-002       | Medium         | Schema protect   |
| 5        | MED-001       | Low            | Better errors    |
| 6        | MED-003       | Low            | Schema protect   |
| 7        | LOW-001       | Medium         | Monitoring       |
| 8        | LOW-002       | Low            | Minor leak       |
+----------+---------------+----------------+------------------+
```

---

## Recommended Error Handling Architecture

```
                    +-------------------+
                    |   Client Request  |
                    +-------------------+
                            |
                            v
                    +-------------------+
                    |  Next.js Router   |
                    +-------------------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
     +----------------+          +----------------+
     |  React Pages   |          |   API Routes   |
     +----------------+          +----------------+
              |                           |
              v                           v
     +----------------+          +----------------+
     | error.tsx      |          | Try-Catch      |
     | ErrorBoundary  |          | handleError()  |
     +----------------+          +----------------+
              |                           |
              +-------------+-------------+
                            |
                            v
                    +-------------------+
                    | Error Monitoring  |
                    | (Sentry/LogRocket)|
                    +-------------------+
                            |
                            v
                    +-------------------+
                    | Sanitized Log     |
                    | (No PII/Stack)    |
                    +-------------------+
```

---

## Files Analyzed

| File Path | Status |
|-----------|--------|
| `web/src/app/api/orders/route.ts` | Reviewed |
| `web/src/app/api/products/route.ts` | Reviewed |
| `web/src/app/api/products/[id]/route.ts` | Reviewed |
| `web/src/app/api/users/me/route.ts` | Reviewed |
| `web/src/app/api/users/me/measurements/route.ts` | Reviewed |
| `web/src/lib/api/auth.ts` | Reviewed |
| `web/src/lib/prisma.ts` | Reviewed |
| `web/src/lib/query-client.ts` | Reviewed |
| `web/src/app/error.tsx` | Missing |
| `web/src/app/not-found.tsx` | Missing |

---

## Conclusion

The TeddyBear's Room codebase demonstrates several good security practices in error handling, particularly the consistent use of helper functions and user-friendly error messages. However, the absence of React error boundaries (`error.tsx`) is a critical gap that should be addressed immediately.

The primary risk is information leakage through verbose logging of complete error objects in production environments. Implementing the recommended sanitization and structured logging will significantly reduce this risk.

**Immediate Actions Required**:
1. Create `error.tsx` for global error boundary
2. Create `not-found.tsx` for 404 handling
3. Implement log sanitization for production builds

---

*Report generated by Security Engineer Agent*
*Framework: SuperClaude v3.0*
