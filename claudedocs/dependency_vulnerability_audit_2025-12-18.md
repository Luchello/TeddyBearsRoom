# Dependency Vulnerability Audit Report

**Project**: TeddyBear's Room E-commerce Platform
**Date**: 2025-12-18
**Auditor**: Security Engineer (Claude Code)
**Scope**: npm dependency analysis for `/web` directory

---

## Executive Summary

```
+------------------------------------------------------------------+
|  VULNERABILITY SUMMARY                                            |
+------------------------------------------------------------------+
|  CRITICAL: 0  |  HIGH: 3  |  MODERATE: 1  |  LOW: 0  |  INFO: 0  |
+------------------------------------------------------------------+
|  Total Dependencies: 752 (210 prod, 506 dev, 36 optional)         |
|  Outdated Packages: 17                                            |
|  Extraneous Packages: 5                                           |
+------------------------------------------------------------------+
```

### CRITICAL FINDING: Next.js 16.0.10 is PATCHED

Your Next.js version (16.0.10) is the **patched version** for CVE-2025-66478 and CVE-2025-55182 (React2Shell). This is a critical RCE vulnerability that was actively exploited in the wild. **No action required** for Next.js.

---

## Detailed Vulnerability Analysis

### HIGH SEVERITY (3 vulnerabilities)

#### 1. Hono - Improper Authorization (GHSA-m732-5p4w-x69g)

```
+------------------------------------------------------------------+
|  Package: hono                                                    |
|  Current: 4.7.10 (via prisma -> @prisma/dev)                     |
|  Fixed:   >= 4.10.3                                               |
|  CVSS:    8.1 (HIGH)                                              |
+------------------------------------------------------------------+
```

| Field | Value |
|-------|-------|
| CVE | GHSA-m732-5p4w-x69g |
| CWE | CWE-285 (Improper Authorization) |
| Attack Vector | Network |
| Description | Improper authorization vulnerability allowing unauthorized access |
| Affected Path | prisma -> @prisma/dev -> hono |

**Impact Assessment**:
```
                    +-----------------+
                    |     prisma      |  <-- Direct dependency
                    |    (7.0.1)      |
                    +--------+--------+
                             |
                    +--------v--------+
                    |  @prisma/dev    |  <-- Dev dependency (CLI tool)
                    |    (0.13.0)     |
                    +--------+--------+
                             |
                    +--------v--------+
                    |      hono       |  <-- VULNERABLE
                    |    (4.7.10)     |
                    +-----------------+
```

**Risk**: LOW for production. Hono is used by Prisma CLI tools (prisma studio, etc.) and not exposed in production runtime.

---

#### 2. Hono - CORS Bypass (GHSA-q7jf-gf43-6x6p)

```
+------------------------------------------------------------------+
|  Package: hono                                                    |
|  Current: 4.7.10                                                  |
|  Fixed:   >= 4.10.3                                               |
|  CVSS:    4.2 (MODERATE - aggregated to HIGH)                     |
+------------------------------------------------------------------+
```

| Field | Value |
|-------|-------|
| CVE | GHSA-q7jf-gf43-6x6p |
| CWE | CWE-444 (Vary Header Injection) |
| Description | Vary Header Injection leading to potential CORS Bypass |

---

#### 3. Valibot - ReDoS Vulnerability (GHSA-vqpr-j7v3-hqw9)

```
+------------------------------------------------------------------+
|  Package: valibot                                                 |
|  Current: 1.1.0 (via prisma -> @prisma/dev)                      |
|  Fixed:   >= 1.2.0                                                |
|  CVSS:    7.5 (HIGH)                                              |
+------------------------------------------------------------------+
```

| Field | Value |
|-------|-------|
| CVE | GHSA-vqpr-j7v3-hqw9 |
| CWE | CWE-1333 (Regular Expression Denial of Service) |
| Description | ReDoS vulnerability in EMOJI_REGEX pattern |
| Affected Path | prisma -> @prisma/dev -> valibot |

**Impact Assessment**:
```
Attack Pattern:
  Malicious Input --> EMOJI_REGEX --> Exponential Backtracking --> DoS
                                              |
                          CPU exhaustion, application freeze
```

**Risk**: LOW for production. Valibot is used in Prisma dev tooling, not production code.

---

### MODERATE SEVERITY (1 vulnerability)

#### 4. Hono - Body Limit Bypass (GHSA-92vj-g62v-jqhh)

```
+------------------------------------------------------------------+
|  Package: hono                                                    |
|  Current: 4.7.10                                                  |
|  Fixed:   >= 4.9.7                                                |
|  CVSS:    5.3 (MODERATE)                                          |
+------------------------------------------------------------------+
```

| Field | Value |
|-------|-------|
| CVE | GHSA-92vj-g62v-jqhh |
| CWE | CWE-400, CWE-770 (Resource Exhaustion) |
| Description | Body Limit Middleware can be bypassed |

---

## Authentication/Authorization Package Analysis

### Supabase Auth Stack

```
@supabase/supabase-js@2.86.0
    |
    +-- @supabase/auth-js@2.86.0       <-- CHECK REQUIRED
    +-- @supabase/postgrest-js@2.86.0
    +-- @supabase/realtime-js@2.86.0
    +-- @supabase/storage-js@2.86.0
    +-- @supabase/functions-js@2.86.0
```

#### CVE-2025-48370 - Directory Traversal in auth-js

| Field | Value |
|-------|-------|
| Severity | MEDIUM (5.3) |
| Affected | @supabase/auth-js < 2.69.1 |
| Current Version | 2.86.0 |
| Status | **PATCHED** (version > 2.69.1) |

**Recommendation**: No action required. Your version is patched.

---

## Critical Package Version Status

| Package | Current | Latest | Status | Notes |
|---------|---------|--------|--------|-------|
| next | 16.0.10 | 16.0.10 | PATCHED | CVE-2025-66478, CVE-2025-55182 fixed |
| prisma | 7.0.1 | 7.2.0 | UPDATE RECOMMENDED | Fixes hono/valibot vulns |
| @prisma/client | 7.0.1 | 7.2.0 | UPDATE RECOMMENDED | Match prisma version |
| @supabase/supabase-js | 2.86.0 | 2.88.0 | UPDATE AVAILABLE | Minor improvements |
| zod | 4.1.13 | 4.2.1 | UPDATE AVAILABLE | Bug fixes |
| react | 19.2.0 | 19.2.3 | UPDATE AVAILABLE | Stability fixes |
| react-dom | 19.2.0 | 19.2.3 | UPDATE AVAILABLE | Match react version |

---

## Typosquatting Risk Analysis

### Package Name Verification

All direct dependencies verified against npm registry:

| Package | Registry Match | Risk |
|---------|---------------|------|
| @hookform/resolvers | Verified | LOW |
| @prisma/adapter-pg | Verified | LOW |
| @prisma/client | Verified | LOW |
| @radix-ui/* | Verified | LOW |
| @supabase/ssr | Verified | LOW |
| @supabase/supabase-js | Verified | LOW |
| @tanstack/react-query | Verified | LOW |
| class-variance-authority | Verified | LOW |
| clsx | Verified | LOW |
| lucide-react | Verified | LOW |
| next | Verified | LOW |
| pg | Verified | LOW |
| prisma | Verified | LOW |
| react | Verified | LOW |
| react-dom | Verified | LOW |
| react-hook-form | Verified | LOW |
| tailwind-merge | Verified | LOW |
| tailwindcss-animate | Verified | LOW |
| zod | Verified | LOW |
| zustand | Verified | LOW |

**Result**: No typosquatting risks detected.

---

## Dependency Tree Depth Analysis

```
Max Depth: 12 levels (within acceptable range)

Production Dependencies Path Examples:
  next -> @next/swc-win32-x64-msvc (platform binary)
  prisma -> @prisma/engines -> platform binaries
  @radix-ui/* -> react-remove-scroll -> tslib (deep but stable)

Extraneous Packages Detected:
  - @emnapi/core@1.7.1
  - @emnapi/runtime@1.7.1
  - @emnapi/wasi-threads@1.1.0
  - @napi-rs/wasm-runtime@0.2.12
  - @tybys/wasm-util@0.10.1

These are WASM runtime helpers, likely orphaned from previous builds.
```

---

## Remediation Plan

### Immediate Actions (Priority 1)

```bash
# Update Prisma to fix hono/valibot vulnerabilities
cd web
npm install prisma@7.2.0 @prisma/client@7.2.0 @prisma/adapter-pg@7.2.0

# Regenerate Prisma client
npx prisma generate
```

### Recommended Updates (Priority 2)

```bash
# Update Supabase for latest improvements
npm install @supabase/supabase-js@2.88.0

# Update Zod for bug fixes
npm install zod@4.2.1

# Update React/React-DOM for stability
npm install react@19.2.3 react-dom@19.2.3
```

### Cleanup Actions (Priority 3)

```bash
# Clean extraneous packages
npm prune

# Verify no vulnerabilities remain
npm audit
```

---

## Breaking Change Warnings

### Prisma 7.0.1 -> 7.2.0

| Area | Breaking Changes | Migration Required |
|------|-----------------|-------------------|
| Schema | None expected | No |
| Client API | None expected | No |
| CLI | Minor changes | No |

**Safe to upgrade**: Yes, patch version update.

### React 19.2.0 -> 19.2.3

Patch version, no breaking changes expected.

---

## Security Recommendations

### 1. Enable npm Audit in CI/CD

```yaml
# .github/workflows/security.yml
- name: Security Audit
  run: |
    cd web
    npm audit --audit-level=high
```

### 2. Consider Dependency Lock Policy

```bash
# Ensure exact versions in production
npm config set save-exact true
```

### 3. Regular Vulnerability Scanning

Schedule weekly `npm audit` runs and monitor GitHub Dependabot alerts.

---

## Conclusion

| Risk Level | Finding |
|------------|---------|
| **CRITICAL** | None (Next.js is patched for React2Shell) |
| **HIGH** | 3 vulnerabilities in dev dependencies (prisma tooling) |
| **MODERATE** | 1 vulnerability in dev dependencies |
| **Production Risk** | LOW - All vulnerabilities are in dev/CLI tools |

### Action Items

1. **PRIORITY 1**: Update Prisma stack to 7.2.0 (fixes all 4 vulnerabilities)
2. **PRIORITY 2**: Update Supabase, Zod, React for latest patches
3. **PRIORITY 3**: Clean extraneous packages with `npm prune`

---

## Sources

- [Hono Improper Authorization - GHSA-m732-5p4w-x69g](https://github.com/advisories/GHSA-m732-5p4w-x69g)
- [Hono CORS Bypass - GHSA-q7jf-gf43-6x6p](https://github.com/advisories/GHSA-q7jf-gf43-6x6p)
- [Valibot ReDoS - GHSA-vqpr-j7v3-hqw9](https://github.com/advisories/GHSA-vqpr-j7v3-hqw9)
- [Next.js CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)
- [React2Shell CVE-2025-55182](https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182)
- [Supabase auth-js CVE-2025-48370](https://security.snyk.io/vuln/SNYK-JS-SUPABASEAUTHJS-10255365)
- [Prisma Hono Dependency Issue #28660](https://github.com/prisma/prisma/issues/28660)

---

**Report Generated**: 2025-12-18
**Audit Tool**: npm audit v11.x
**Framework**: SuperClaude Security Agent
