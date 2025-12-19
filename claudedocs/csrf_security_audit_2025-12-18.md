# CSRF Security Audit Report

**Project**: TeddyBear's Room E-commerce
**Date**: 2025-12-18
**Auditor**: Security Engineer (Claude Code)
**Scope**: API Routes, Auth Components, Checkout Forms, Cart Operations, Middleware Configuration

---

## Executive Summary

```
+------------------------------------------------------------------+
|                    CSRF PROTECTION STATUS                         |
+------------------------------------------------------------------+
|  Overall Risk Level: MEDIUM-HIGH                                 |
|                                                                   |
|  CRITICAL Findings:  0                                            |
|  HIGH Findings:      3                                            |
|  MEDIUM Findings:    2                                            |
|  LOW Findings:       2                                            |
+------------------------------------------------------------------+
```

The application relies primarily on **Supabase cookie-based authentication** without explicit CSRF token validation. While Supabase SSR handles session management, the lack of dedicated CSRF protection creates potential vulnerabilities for state-changing operations.

---

## Architecture Overview

```
                     CURRENT AUTH FLOW
+------------------------------------------------------------+
|                                                             |
|  Browser                                                    |
|    |                                                        |
|    |  1. Login Request                                      |
|    v                                                        |
|  Supabase Auth --> Sets Session Cookies                     |
|    |              (sb-access-token, sb-refresh-token)       |
|    |                                                        |
|    |  2. API Requests (auto-attach cookies)                 |
|    v                                                        |
|  Next.js Middleware --> Validates Session                   |
|    |                    (updateSession)                     |
|    |                                                        |
|    |  3. Protected Route Access                             |
|    v                                                        |
|  API Route --> requireAuth() --> Supabase getUser()         |
|    |                                                        |
|    v                                                        |
|  Database Operations                                        |
|                                                             |
+------------------------------------------------------------+
```

---

## Detailed Findings

### [HIGH-001] Missing CSRF Token Validation on State-Changing API Endpoints

**Severity**: HIGH
**CVSS Score**: 7.5 (High)
**Location**:
- `web/src/app/api/orders/route.ts` (POST)
- `web/src/app/api/users/me/route.ts` (PATCH)
- `web/src/app/api/users/me/measurements/route.ts` (PATCH, DELETE)

**Description**:
State-changing API endpoints (POST, PATCH, DELETE) accept requests without CSRF token validation. These endpoints only verify the Supabase session cookie, making them potentially vulnerable to CSRF attacks.

**Evidence**:
```typescript
// web/src/app/api/orders/route.ts (Line 175-195)
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();  // Only session validation
    if (!authResult.success) return authResult.response;

    const body = await request.json();  // No CSRF token check
    // ... order creation logic
  }
}
```

**Attack Scenario**:
```
1. Victim is logged into TeddyBear's Room
2. Victim visits attacker's malicious site
3. Malicious site sends forged POST request to /api/orders
4. Browser automatically attaches session cookies
5. Order is created without victim's consent
```

**Remediation**:
1. Implement Double Submit Cookie pattern
2. Or use Synchronizer Token Pattern with hidden form fields
3. Validate Origin/Referer headers on all state-changing requests

---

### [HIGH-002] Forms Missing CSRF Token Fields

**Severity**: HIGH
**CVSS Score**: 6.8 (Medium-High)
**Location**:
- `web/src/components/auth/login-form.tsx`
- `web/src/components/auth/register-form.tsx`
- `web/src/components/checkout/checkout-form.tsx`

**Description**:
All forms submit data without CSRF tokens. While login/register forms rely on Supabase OAuth flow (which has built-in CSRF protection), the checkout form directly submits sensitive payment and shipping data.

**Evidence**:
```typescript
// web/src/components/checkout/checkout-form.tsx (Line 127-140)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const submitData = {
      ...formData,
      shippingMemo: formData.shippingMemo === "custom"
        ? customMemo
        : formData.shippingMemo,
    };
    await onSubmit?.(submitData);  // No CSRF token included
  } finally {
    setIsLoading(false);
  }
};
```

**Remediation**:
```typescript
// Recommended: Add CSRF token to form data
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const csrfToken = getCsrfToken(); // From cookie or meta tag
  await onSubmit?.({ ...submitData, _csrf: csrfToken });
};
```

---

### [HIGH-003] No Origin/Referer Header Validation

**Severity**: HIGH
**CVSS Score**: 6.5 (Medium-High)
**Location**: All API routes in `web/src/app/api/`

**Description**:
API routes do not validate Origin or Referer headers. This allows cross-origin requests from any domain as long as the victim has valid session cookies.

**Evidence**:
Search results show zero instances of Origin/Referer validation in API routes:
```
Pattern search for "headers\s*\(|request\.headers|Origin|Referer"
in web/src/app/api: No matches found
```

**Remediation**:
```typescript
// Add to requireAuth or individual routes
function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://teddybearsroom.com',
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }

  return true;
}
```

---

### [MEDIUM-001] Cookie Configuration Delegated to Supabase SSR

**Severity**: MEDIUM
**CVSS Score**: 5.0 (Medium)
**Location**:
- `web/src/lib/supabase/middleware.ts`
- `web/src/lib/supabase/server.ts`

**Description**:
Cookie security settings (SameSite, Secure, HttpOnly) are entirely managed by `@supabase/ssr` library. While this library generally uses secure defaults, explicit control is not visible in the codebase.

**Evidence**:
```typescript
// web/src/lib/supabase/middleware.ts (Line 71-85)
setAll(cookiesToSet) {
  cookiesToSet.forEach(({ name, value }) =>
    request.cookies.set(name, value)  // Options passed through
  );

  supabaseResponse = NextResponse.next({ request });

  cookiesToSet.forEach(({ name, value, options }) =>
    supabaseResponse.cookies.set(name, value, options)  // Options from Supabase
  );
}
```

**Current Supabase SSR Default Cookie Settings**:
```
SameSite: Lax (default)    - Partially mitigates CSRF
Secure: true (in production)
HttpOnly: true
Path: /
```

**Risk**:
- `SameSite=Lax` allows cookies on top-level GET navigations
- Does not protect against POST-based CSRF attacks from same-site subdomains

**Remediation**:
Consider enforcing `SameSite=Strict` for maximum CSRF protection:
```typescript
cookieOptions: {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
}
```

---

### [MEDIUM-002] Missing CORS Configuration

**Severity**: MEDIUM
**CVSS Score**: 4.5 (Medium)
**Location**: `web/next.config.ts`

**Description**:
No explicit CORS headers are configured. Next.js API routes are same-origin by default, but explicit CORS configuration provides defense-in-depth.

**Evidence**:
```typescript
// web/next.config.ts - Complete file
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [/* ... */],
  },
};

export default nextConfig;
// No headers or CORS configuration
```

**Remediation**:
```typescript
// web/next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || '' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-CSRF-Token' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

---

### [LOW-001] Cart Operations Without Server-Side Validation

**Severity**: LOW
**CVSS Score**: 3.5 (Low)
**Location**:
- `web/src/hooks/use-cart.ts`
- `web/src/stores/cart-store.ts`

**Description**:
Cart operations (add, update, remove) call `/api/cart` endpoint. While these endpoints should exist but were not found during audit (possibly not yet implemented), the client-side code sends requests without CSRF tokens.

**Evidence**:
```typescript
// web/src/hooks/use-cart.ts (Line 31-35)
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  // No CSRF header
  body: JSON.stringify(item),
});
```

**Impact**:
If cart persists server-side, attacker could add unwanted items to victim's cart.

**Remediation**:
Include CSRF token in request headers:
```typescript
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken(),
  },
  body: JSON.stringify(item),
});
```

---

### [LOW-002] Middleware Only Handles Session Refresh

**Severity**: LOW
**CVSS Score**: 2.5 (Low)
**Location**: `web/middleware.ts`

**Description**:
The middleware only handles Supabase session refresh and protected route redirection. It does not implement any CSRF protection layer.

**Evidence**:
```typescript
// web/middleware.ts (Complete file)
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);  // Only session update
}
```

**Remediation**:
Extend middleware to validate CSRF tokens for state-changing requests:
```typescript
export async function middleware(request: NextRequest) {
  // CSRF validation for mutating requests
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const csrfCookie = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || csrfToken !== csrfCookie) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  return await updateSession(request);
}
```

---

## Vulnerability Matrix

```
+-------------------+----------+--------+--------------+------------------+
| Finding ID        | Severity | Status | Component    | Exploitability   |
+-------------------+----------+--------+--------------+------------------+
| HIGH-001          | HIGH     | OPEN   | API Routes   | Medium           |
| HIGH-002          | HIGH     | OPEN   | Forms        | Medium           |
| HIGH-003          | HIGH     | OPEN   | API Routes   | Medium           |
| MEDIUM-001        | MEDIUM   | OPEN   | Cookies      | Low              |
| MEDIUM-002        | MEDIUM   | OPEN   | CORS         | Low              |
| LOW-001           | LOW      | OPEN   | Cart API     | Low              |
| LOW-002           | LOW      | OPEN   | Middleware   | Low              |
+-------------------+----------+--------+--------------+------------------+
```

---

## Recommended CSRF Protection Implementation

### Option 1: Double Submit Cookie Pattern (Recommended for SPA)

```
Implementation Steps:
+------------------------------------------------------------+
|                                                             |
|  1. Server generates random CSRF token                      |
|     |                                                       |
|     v                                                       |
|  2. Token stored in HttpOnly=false cookie                   |
|     (so JS can read it)                                     |
|     |                                                       |
|     v                                                       |
|  3. Client reads cookie, sends token in header              |
|     X-CSRF-Token: <token_value>                             |
|     |                                                       |
|     v                                                       |
|  4. Server compares header value with cookie value          |
|     Match = Valid, Mismatch = 403 Forbidden                 |
|                                                             |
+------------------------------------------------------------+
```

### Option 2: Next.js CSRF Library Integration

```bash
npm install @edge-csrf/nextjs
```

```typescript
// middleware.ts
import { createCsrf } from '@edge-csrf/nextjs';

const csrf = createCsrf({
  cookie: {
    name: '__csrf',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function middleware(request: NextRequest) {
  const csrfResponse = await csrf(request);
  if (csrfResponse) return csrfResponse;

  return await updateSession(request);
}
```

---

## Mitigating Factors

1. **Supabase Session Cookies**:
   - Default `SameSite=Lax` provides partial CSRF mitigation
   - Blocks cross-origin POST requests in modern browsers

2. **No Sensitive GET Endpoints**:
   - All state-changing operations use POST/PATCH/DELETE
   - GET endpoints are read-only

3. **User Session Required**:
   - All sensitive endpoints require authentication
   - Reduces opportunistic attacks

---

## Action Items (Priority Order)

| Priority | Action                                        | Effort | Impact |
|----------|-----------------------------------------------|--------|--------|
| P0       | Implement CSRF token validation in middleware | Medium | High   |
| P0       | Add Origin header validation to API routes    | Low    | High   |
| P1       | Configure explicit CORS headers               | Low    | Medium |
| P1       | Add CSRF tokens to all forms                  | Medium | High   |
| P2       | Set SameSite=Strict for session cookies       | Low    | Medium |
| P2       | Add X-CSRF-Token header to fetch utilities    | Low    | Medium |

---

## Compliance Notes

- **OWASP Top 10 2021**: A01:2021 - Broken Access Control (related)
- **CWE-352**: Cross-Site Request Forgery (CSRF)
- **PCI-DSS 6.5.1**: Application Security Requirements

---

## Files Audited

| File Path                                          | Status    |
|----------------------------------------------------|-----------|
| `web/src/app/api/orders/route.ts`                  | Reviewed  |
| `web/src/app/api/products/route.ts`                | Reviewed  |
| `web/src/app/api/products/[id]/route.ts`           | Reviewed  |
| `web/src/app/api/users/me/route.ts`                | Reviewed  |
| `web/src/app/api/users/me/measurements/route.ts`   | Reviewed  |
| `web/src/components/auth/login-form.tsx`           | Reviewed  |
| `web/src/components/auth/register-form.tsx`        | Reviewed  |
| `web/src/components/checkout/checkout-form.tsx`    | Reviewed  |
| `web/src/components/cart/cart-drawer.tsx`          | Reviewed  |
| `web/src/lib/supabase/middleware.ts`               | Reviewed  |
| `web/src/lib/supabase/server.ts`                   | Reviewed  |
| `web/src/lib/supabase/client.ts`                   | Reviewed  |
| `web/src/lib/api/auth.ts`                          | Reviewed  |
| `web/middleware.ts`                                | Reviewed  |
| `web/next.config.ts`                               | Reviewed  |

---

**Report Generated**: 2025-12-18
**Next Review Date**: Upon CSRF protection implementation
