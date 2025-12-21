# Security Audit Report: API Endpoints
## TeddyBear's Room E-commerce Platform

**Audit Date**: 2025-12-19
**Auditor**: Security Engineer Agent
**Scope**: `web/src/app/api/**/*`
**Severity Levels**: CRITICAL | HIGH | MEDIUM | LOW | INFO

---

## Executive Summary

This security audit analyzed 5 API route files containing 8 HTTP endpoints. The analysis identified several security concerns ranging from CRITICAL to LOW severity that require immediate attention.

```
+------------------+-------+
| Severity         | Count |
+------------------+-------+
| CRITICAL         |   2   |
| HIGH             |   3   |
| MEDIUM           |   4   |
| LOW              |   2   |
+------------------+-------+
```

---

## API Endpoints Inventory

| Route | Method | Auth Required | Validation | Rate Limited | Issues |
|-------|--------|---------------|------------|--------------|--------|
| `/api/products` | GET | NO | NO | NO | PUBLIC - OK for product listing |
| `/api/products/[id]` | GET | NO | NO (path param only) | NO | PUBLIC - OK for product detail |
| `/api/orders` | GET | YES (requireAuth) | NO | NO | Missing rate limit |
| `/api/orders` | POST | YES (requireAuth) | YES (Zod) | NO | Missing rate limit |
| `/api/users/me` | GET | YES (requireAuth) | NO | NO | Missing rate limit |
| `/api/users/me` | PATCH | YES (requireAuth) | NO | NO | CRITICAL: No input validation |
| `/api/users/me/measurements` | GET | YES (requireAuth) | NO | NO | Missing rate limit |
| `/api/users/me/measurements` | PATCH | YES (requireAuth) | PARTIAL | NO | CRITICAL: Potential injection |
| `/api/users/me/measurements` | DELETE | YES (requireAuth) | NO | NO | Missing rate limit |

---

## Detailed Findings

### CRITICAL Severity

#### [CRIT-001] Missing Input Validation on Profile Update

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\users\me\route.ts` (Lines 152-161)

**Description**: The PATCH `/api/users/me` endpoint accepts `name` and `avatar` from request body without any validation.

```typescript
// VULNERABLE CODE
const body = await request.json();
const { name, avatar } = body;  // No validation!

const updateData: { name?: string; avatar?: string } = {};
if (name) updateData.name = name;        // Direct use
if (avatar) updateData.avatar = avatar;  // Direct use - potential SSRF
```

**Attack Vectors**:
1. **XSS via name field**: Malicious script injection through profile name
2. **SSRF via avatar URL**: Attacker could inject internal URLs (`http://localhost:...`, `http://169.254.169.254/...`)
3. **SQL Injection**: Although Prisma uses parameterized queries, no type checking is performed
4. **Prototype Pollution**: `body` is directly destructured without sanitization

**Recommendation**:
```typescript
// Add Zod schema validation
const UpdateProfileSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z0-9\s\uAC00-\uD7AF]+$/, "Invalid characters"),
  avatar: z.string()
    .url("Invalid URL format")
    .regex(/^https:\/\//, "Only HTTPS URLs allowed")
    .optional(),
});
```

---

#### [CRIT-002] Potential NoSQL/Data Injection in Measurements

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\users\me\measurements\route.ts` (Lines 204-267)

**Description**: While basic numeric validation exists for height/weight/shoeSize, string fields (`topSize`, `bottomSize`, `encryptedMeasurements`) are not validated.

```typescript
// PARTIALLY VALIDATED - Missing string field validation
const {
  height,          // Validated: number range check
  weight,          // Validated: number range check
  gender,          // Validated: enum check
  topSize,         // NOT VALIDATED - arbitrary string!
  bottomSize,      // NOT VALIDATED - arbitrary string!
  shoeSize,        // Validated: number range check
  encryptedMeasurements,  // NOT VALIDATED - arbitrary string!
} = body;

// Direct database write without sanitization
if (topSize !== undefined) updateData.topSize = topSize;
if (bottomSize !== undefined) updateData.bottomSize = bottomSize;
if (encryptedMeasurements !== undefined) {
  updateData.encryptedMeasurements = encryptedMeasurements;
}
```

**Attack Vectors**:
1. **XSS Storage**: Inject malicious scripts via topSize/bottomSize fields
2. **Encrypted Field Manipulation**: `encryptedMeasurements` accepts any string without validation
3. **Database Constraint Bypass**: No length limits on string fields

**Recommendation**:
```typescript
const MeasurementsSchema = z.object({
  topSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  bottomSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  encryptedMeasurements: z.string()
    .max(5000, "Encrypted data too large")
    .regex(/^[A-Za-z0-9+/=]+$/, "Invalid base64 format")
    .optional(),
  // ... other fields
});
```

---

### HIGH Severity

#### [HIGH-001] No Rate Limiting on Any Endpoint

**Location**: All API endpoints

**Description**: No rate limiting is implemented anywhere in the application. No middleware file exists (`middleware.ts`).

```
+------------------------+------------------+------------------+
| Attack Type            | Impact           | Likelihood       |
+------------------------+------------------+------------------+
| Brute Force Auth       | Account Takeover | High             |
| Order Flooding         | DoS / Fraud      | High             |
| API Abuse              | Resource Drain   | Medium           |
| Enumeration Attack     | Data Leak        | Medium           |
+------------------------+------------------+------------------+
```

**Recommendation**:
1. Implement rate limiting middleware using `@upstash/ratelimit` or similar
2. Apply different limits per endpoint:
   - Public endpoints: 100 requests/minute
   - Authenticated endpoints: 60 requests/minute
   - Write operations (POST/PATCH/DELETE): 10 requests/minute

---

#### [HIGH-002] Missing Security Headers

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\next.config.ts`

**Description**: No security headers are configured. API responses lack essential security headers.

**Missing Headers**:
```
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy
- Strict-Transport-Security
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
```

**Recommendation**:
Add to `next.config.ts`:
```typescript
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/api/:path*', headers: securityHeaders }];
  },
  // ...existing config
};
```

---

#### [HIGH-003] No CORS Configuration

**Location**: All API endpoints

**Description**: No CORS configuration exists. By default, Next.js API routes do not set CORS headers, which means:
1. Same-origin requests are allowed (good)
2. Cross-origin requests from malicious sites could be attempted

For a production e-commerce site, explicit CORS policy should be defined.

**Recommendation**:
Create middleware or API helpers with explicit CORS policy for sensitive endpoints.

---

### MEDIUM Severity

#### [MED-001] HTTP Methods Not Explicitly Restricted

**Location**: All API route files

**Description**: API routes only define handlers for specific methods but do not explicitly return 405 for unsupported methods. Next.js handles this, but explicit handling provides clearer security boundaries.

**Current Pattern**:
```typescript
// Only GET is defined
export async function GET() { ... }
// POST, PUT, DELETE, etc. will return 405 by Next.js framework
```

**Recommendation**: Consider adding explicit method handling for security auditing clarity.

---

#### [MED-002] Error Messages May Leak Implementation Details

**Location**: All API route files

**Description**: While user-friendly error messages are used, console.error logs full error objects which could be captured in server logs.

```typescript
// Example from orders/route.ts
console.error("Orders POST Error:", error);  // Full error object logged
```

**Risk**: If log aggregation is misconfigured, sensitive error details could be exposed.

**Recommendation**: Implement structured logging with PII redaction.

---

#### [MED-003] Product ID Not Validated as UUID

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\products\[id]\route.ts`

**Description**: The product ID path parameter is not validated as UUID format.

```typescript
const { id } = await params;  // No format validation

const product = await prisma.product.findUnique({
  where: { id },  // Could be any string
});
```

**Risk**: Potential for unexpected database behavior with malformed IDs.

**Recommendation**:
```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(id)) {
  return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
}
```

---

#### [MED-004] Pagination Parameters Could Enable Resource Exhaustion

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\products\route.ts` (Lines 91-97)

**Description**: While MAX_LIMIT (100) is enforced, malicious actors could still abuse pagination with extreme page numbers.

```typescript
const MAX_LIMIT = 100;
const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);  // No upper bound!
const limit = Math.min(MAX_LIMIT, ...);
const skip = (page - 1) * limit;  // Could be very large number
```

**Risk**: Requesting page=999999999 would cause `skip = 99999899900` which could stress the database.

**Recommendation**:
```typescript
const MAX_PAGE = 10000;  // Set reasonable upper bound
const page = Math.min(MAX_PAGE, Math.max(1, parseInt(pageParam || "1", 10) || 1));
```

---

### LOW Severity

#### [LOW-001] Category Parameter Not Sanitized

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\products\route.ts` (Line 113-115)

**Description**: Category filter is used directly in query without sanitization.

```typescript
if (category && category !== "전체") {
  where.category = category;  // Direct use
}
```

**Risk**: Low due to Prisma's parameterized queries, but defense-in-depth recommends validation.

---

#### [LOW-002] Sort Parameter Could Accept Invalid Values

**Location**: `C:\Users\pgoro\Desktop\Work\TeddyBear'sRoom\web\src\app\api\products\route.ts` (Lines 134-147)

**Description**: While invalid sort values fall through to default, explicit whitelist is better practice.

```typescript
switch (sort) {
  case "price-low": ...
  case "price-high": ...
  case "latest":
  default:  // Any invalid value hits default
    orderBy = { createdAt: "desc" };
}
```

---

## Positive Security Findings

1. **Authentication Helper Pattern**: The `requireAuth()` helper provides consistent authentication enforcement.

2. **Supabase Auth Integration**: Proper server-side session validation via `getUser()`.

3. **Zod Validation on Orders**: The POST `/api/orders` endpoint demonstrates proper input validation patterns.

4. **No Sensitive Data in Error Responses**: User-facing error messages are generic and safe.

5. **Prisma ORM**: Parameterized queries prevent SQL injection by default.

6. **Proper HTTP Status Codes**: Appropriate use of 400, 401, 404, 500 status codes.

---

## Remediation Priority Matrix

```
+----------+------------------------------------------+----------+--------+
| Priority | Finding                                  | Effort   | Risk   |
+----------+------------------------------------------+----------+--------+
| P0       | [CRIT-001] Profile input validation      | Low      | High   |
| P0       | [CRIT-002] Measurements string validation| Low      | High   |
| P1       | [HIGH-001] Rate limiting                 | Medium   | High   |
| P1       | [HIGH-002] Security headers              | Low      | Medium |
| P2       | [HIGH-003] CORS configuration            | Low      | Medium |
| P2       | [MED-001-004] Various medium issues      | Low-Med  | Medium |
| P3       | [LOW-001-002] Low severity issues        | Low      | Low    |
+----------+------------------------------------------+----------+--------+
```

---

## Architecture Diagram: Current Auth Flow

```
                                  +------------------+
                                  |   Client         |
                                  |   (Browser)      |
                                  +--------+---------+
                                           |
                                           | HTTP Request
                                           | (with Supabase session cookie)
                                           v
+--------------------------------------------------------------------------------------+
|                               Next.js Server                                          |
|                                                                                       |
|   +-------------------------+     +-------------------+     +----------------------+  |
|   |   /api/products         |     | /api/orders       |     | /api/users/me        |  |
|   |   (No Auth)             |     | (requireAuth)     |     | (requireAuth)        |  |
|   +------------+------------+     +---------+---------+     +----------+-----------+  |
|                |                            |                          |               |
|                |                            v                          v               |
|                |              +-------------+-------------+                            |
|                |              |        requireAuth()      |                            |
|                |              |   (lib/api/auth.ts)       |                            |
|                |              +-------------+-------------+                            |
|                |                            |                                          |
|                |                            v                                          |
|                |              +-------------+-------------+                            |
|                |              |   Supabase.auth.getUser() |                            |
|                |              +-------------+-------------+                            |
|                |                            |                                          |
|                |              Success?  ----+---- Failure?                             |
|                |                  |                  |                                 |
|                v                  v                  v                                 |
|   +------------------------+  +--------+       +---------+                             |
|   |   Prisma Query         |  | User   |       | 401     |                             |
|   |   (Parameterized)      |  | Object |       | Response|                             |
|   +------------------------+  +--------+       +---------+                             |
|                                                                                       |
+--------------------------------------------------------------------------------------+
                                           |
                                           v
                                  +------------------+
                                  |   Supabase       |
                                  |   PostgreSQL     |
                                  +------------------+
```

---

## Files Analyzed

| File Path | Size | Lines |
|-----------|------|-------|
| `web/src/app/api/products/route.ts` | 7.2KB | 205 |
| `web/src/app/api/products/[id]/route.ts` | 4.1KB | 119 |
| `web/src/app/api/orders/route.ts` | 10.3KB | 280 |
| `web/src/app/api/users/me/route.ts` | 7.0KB | 194 |
| `web/src/app/api/users/me/measurements/route.ts` | 14.2KB | 386 |
| `web/src/lib/api/auth.ts` | 4.8KB | 175 |

---

## Conclusion

The API endpoints demonstrate good foundational security practices with Supabase authentication and Prisma ORM. However, several CRITICAL and HIGH severity issues require immediate attention:

1. **Immediate Action Required**: Add input validation to profile and measurements PATCH endpoints
2. **Short-term**: Implement rate limiting and security headers
3. **Medium-term**: Add comprehensive CORS policy and improve logging

Total estimated remediation effort: 8-16 developer hours for critical and high severity issues.

---

*Report generated by Security Engineer Agent | TeddyBear's Room Security Audit*
