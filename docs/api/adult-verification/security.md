# PASS 성인인증 보안 아키텍처 설계

**문서 버전**: 1.0
**작성일**: 2025-12-21
**프로젝트**: TeddyBear's Room
**작성자**: Security Engineer Agent

---

## 목차

1. [개요](#1-개요)
2. [위협 모델 (STRIDE)](#2-위협-모델-stride)
3. [CI/DI 처리 전략](#3-cidi-처리-전략)
4. [암호화 전략](#4-암호화-전략)
5. [인증 보안 설계](#5-인증-보안-설계)
6. [감사 로깅](#6-감사-로깅)
7. [인시던트 대응](#7-인시던트-대응)
8. [컴플라이언스 체크리스트](#8-컴플라이언스-체크리스트)

---

## 1. 개요

### 1.1 배경

TeddyBear's Room은 성인용품 E-commerce 플랫폼으로, 청소년보호법에 따라 모든 구매자에 대한 성인인증이 필수입니다.
PASS 본인확인 서비스를 도입하여 법적 요구사항을 충족하면서 사용자 개인정보를 안전하게 보호해야 합니다.

### 1.2 규정 요구사항

| 법규 | 요구사항 | 위반 시 제재 |
|------|----------|--------------|
| 청소년보호법 | 19세 미만 판매 금지, 성인인증 필수 | 2년 이하 징역 또는 2천만원 이하 벌금 |
| 개인정보보호법(PIPA) | 최소 수집, 목적 외 이용 금지, 안전성 확보조치 | 5년 이하 징역 또는 5천만원 이하 벌금 |
| 정보통신망법 | 개인정보 암호화, 접근 제어 | 2천만원 이하 과태료 |

### 1.3 민감 데이터 식별

```
┌─────────────────────────────────────────────────────────────────┐
│                     민감 데이터 분류                             │
├─────────────────────────────────────────────────────────────────┤
│  [Critical - 절대 저장 금지]                                    │
│  ├── CI (Connecting Information): 88자 - 개인 고유 식별자       │
│  ├── DI (Duplication Information): 서비스별 중복확인 정보       │
│  └── 주민등록번호 (RRN): 절대 수집 금지                         │
│                                                                 │
│  [High - 해시/암호화 후 저장]                                   │
│  ├── CI Hash: SHA-256(CI + Salt)                               │
│  └── 휴대폰번호: 인증 시점에만 사용, 별도 저장 시 암호화        │
│                                                                 │
│  [Medium - 최소 정보만 저장]                                    │
│  ├── 연령대: "20s", "30s" 등 (정확한 생년월일 X)               │
│  └── 인증 시점: TIMESTAMPTZ                                    │
│                                                                 │
│  [Low - 일반 저장]                                              │
│  ├── is_adult_verified: BOOLEAN                                │
│  └── verified_at: TIMESTAMPTZ                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 위협 모델 (STRIDE)

STRIDE 프레임워크를 적용하여 PASS 본인확인 시스템의 위협을 식별하고 대응 방안을 수립합니다.

### 2.1 위협 매트릭스

```
┌─────────────┬─────────────────────────────────┬─────────────────────────────────┐
│   위협      │           공격 벡터              │           대응 방안              │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ S-Spoofing  │ - 타인 휴대폰으로 인증          │ - PASS 앱 생체/PIN 2FA          │
│ (위장)      │ - 콜백 URL 스푸핑               │ - 콜백 URL 화이트리스트          │
│             │ - 세션 토큰 탈취                │ - Secure Cookie + SameSite      │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ T-Tampering │ - 콜백 응답 데이터 변조         │ - PASS 서명 검증                 │
│ (변조)      │ - 클라이언트 측 나이 검증 우회  │ - 서버 측 검증 필수              │
│             │ - DB 직접 조작                  │ - RLS + 감사 로그                │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ R-Repudiation│ - 성인인증 수행 사실 부인      │ - 타임스탬프 포함 감사 로그      │
│ (부인)      │ - 인증 시점 부인                │ - CI 해시 저장 (법적 증거)       │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ I-Information│ - CI/DI 원문 유출              │ - 해시만 저장, 원본 즉시 폐기    │
│ Disclosure  │ - 민감정보 로그 노출            │ - 민감정보 마스킹                │
│ (정보노출)  │ - 중간자 공격                   │ - TLS 1.3 필수                   │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ D-Denial of │ - 인증 요청 폭주                │ - Rate Limiting (10 req/min)    │
│ Service     │ - 콜백 처리 지연                │ - Circuit Breaker               │
│ (서비스거부)│ - PASS API 장애                 │ - 큐 기반 처리                   │
├─────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ E-Elevation │ - 미성년자 성인 권한 획득       │ - 결제 전 재검증                 │
│ of Privilege│ - 인증 없이 구매 완료           │ - API 인증 필수                  │
│ (권한상승)  │ - 관리자 API 악용               │ - RBAC 적용                      │
└─────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

### 2.2 공격 시나리오 상세

#### Scenario 1: Callback URL Spoofing

```
공격자 ──► 가짜 PASS 콜백 응답 전송 ──► /api/pass/callback
           │
           └── 조작된 데이터: { "ci": "fake", "birthDate": "1990-01-01" }

대응:
1. PASS 제공자의 공개키로 서명 검증
2. State Token HMAC 검증
3. Callback Origin 화이트리스트 확인
```

#### Scenario 2: Replay Attack

```
정상 사용자 인증 ──► 콜백 응답 캡처 ──► 동일 응답 재전송
                         │
                         └── State Token: "abc123"

대응:
1. State Token 일회성 검증 (Redis/DB)
2. Timestamp 유효성 검사 (5분 TTL)
3. 사용된 Token 즉시 삭제
```

---

## 3. CI/DI 처리 전략

### 3.1 데이터 흐름 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/DI 처리 흐름도                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [1. PASS 앱 인증]                                                         │
│   User ──► PASS App ──► 생체/PIN 인증 ──► 본인확인 완료                    │
│                                              │                              │
│                                              ▼                              │
│   [2. Callback 수신]                                                        │
│   PASS Server ──► /api/pass/callback                                       │
│                      │                                                      │
│                      ├── Raw CI (88 chars)                                 │
│                      ├── 생년월일                                          │
│                      ├── 이름                                              │
│                      ├── 성별                                              │
│                      └── 휴대폰번호                                        │
│                              │                                              │
│                              ▼                                              │
│   [3. 서버 측 처리]                                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  Step 1: 나이 계산                                                  │  │
│   │  ────────────────────                                               │  │
│   │  const age = calculateAge(birthDate);                              │  │
│   │  if (age < 19) return reject("UNDERAGE");                          │  │
│   │                                                                     │  │
│   │  Step 2: CI 해싱                                                    │  │
│   │  ────────────────────                                               │  │
│   │  const userSalt = crypto.randomBytes(16).toString('hex');          │  │
│   │  const ciHash = SHA256(ci + SYSTEM_SALT + userSalt);               │  │
│   │                                                                     │  │
│   │  Step 3: 중복 확인                                                  │  │
│   │  ────────────────────                                               │  │
│   │  const existing = await db.profile.findFirst({                     │  │
│   │    where: { ciHash }                                               │  │
│   │  });                                                                │  │
│   │  if (existing && existing.id !== userId) {                         │  │
│   │    return reject("DUPLICATE_CI");                                  │  │
│   │  }                                                                  │  │
│   │                                                                     │  │
│   │  Step 4: 연령대 추출                                                │  │
│   │  ────────────────────                                               │  │
│   │  const ageGroup = getAgeGroup(age); // "20s", "30s", etc.          │  │
│   │                                                                     │  │
│   │  Step 5: 원본 데이터 폐기                                           │  │
│   │  ────────────────────                                               │  │
│   │  ci = null; birthDate = null; name = null; // 메모리에서 제거       │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                              │                                              │
│                              ▼                                              │
│   [4. DB 저장]                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  profiles 테이블 UPDATE:                                            │  │
│   │  - ci_hash: VARCHAR(64)                                             │  │
│   │  - ci_salt: VARCHAR(32)                                             │  │
│   │  - is_adult_verified: true                                          │  │
│   │  - adult_verified_at: NOW()                                         │  │
│   │  - age_group: "20s"                                                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 원본 CI 저장 금지 근거

| 근거 | 설명 |
|------|------|
| **개인정보보호법 제15조** | 목적 달성 후 지체 없이 파기 |
| **최소 수집 원칙** | CI는 중복확인 목적 -> 해시로 충분 |
| **침해 시 피해 최소화** | 해시만 유출 시 원본 복원 불가 |
| **OWASP 권장** | 민감 데이터는 필요한 형태로만 저장 |

### 3.3 해시 알고리즘 선택: SHA-256

| 고려사항 | SHA-256 선택 이유 |
|----------|-------------------|
| **속도** | 인증 시 빠른 해시 비교 필요 (Argon2id는 의도적으로 느림) |
| **충돌 저항성** | 2^128 수준의 보안성 |
| **표준화** | FIPS 180-4 승인 알고리즘 |
| **호환성** | pgcrypto, Node.js crypto 모듈 지원 |

> **참고**: 패스워드 해싱에는 Argon2id를 사용하지만, CI 해싱은 무차별 대입 공격 대상이 아니므로 SHA-256이 적합합니다.

### 3.4 Salt 전략

```javascript
// Salt 구조
const SYSTEM_SALT = process.env.CI_HASH_SALT;  // 32자, 환경변수
const userSalt = crypto.randomBytes(16).toString('hex');  // 32자, 사용자별

// 해싱
const ciHash = crypto
  .createHash('sha256')
  .update(ci + SYSTEM_SALT + userSalt)
  .digest('hex');

// DB 저장
await db.profile.update({
  where: { id: userId },
  data: {
    ciHash,
    ciSalt: userSalt,  // userSalt만 저장 (SYSTEM_SALT는 환경변수)
  }
});
```

---

## 4. 암호화 전략

### 4.1 계층별 암호화 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         암호화 계층 아키텍처                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Layer 1: 전송 구간 (Transport Layer)                               │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Protocol: TLS 1.3                                                  │   │
│  │  Cipher Suite: TLS_AES_256_GCM_SHA384                               │   │
│  │  Key Exchange: ECDHE (Forward Secrecy)                              │   │
│  │  Certificate: Let's Encrypt (Vercel 자동 관리)                      │   │
│  │                                                                     │   │
│  │  Security Headers:                                                  │   │
│  │  - Strict-Transport-Security: max-age=31536000; includeSubDomains   │   │
│  │  - X-Content-Type-Options: nosniff                                  │   │
│  │  - X-Frame-Options: DENY                                            │   │
│  │  - Content-Security-Policy: default-src 'self'                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Layer 2: 애플리케이션 계층 (Application Layer)                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  PASS Callback 처리:                                                │   │
│  │  - 서버 측에서만 복호화/처리                                        │   │
│  │  - 클라이언트로 민감정보 전송 금지                                  │   │
│  │  - API 응답: { isAdultVerified: true } (최소 정보)                  │   │
│  │                                                                     │   │
│  │  Session/Token:                                                     │   │
│  │  - Supabase Auth JWT (RS256)                                        │   │
│  │  - HttpOnly Cookie                                                  │   │
│  │  - SameSite=Strict                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Layer 3: 저장 구간 (Storage Layer)                                 │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  PostgreSQL + Supabase:                                             │   │
│  │                                                                     │   │
│  │  [단방향 해시]                                                      │   │
│  │  - CI Hash: SHA-256(CI + System_Salt + User_Salt)                   │   │
│  │  - IP Hash: SHA-256(IP) for audit logs                              │   │
│  │                                                                     │   │
│  │  [양방향 암호화 - 기존 패턴 활용]                                   │   │
│  │  - 추가 민감 데이터 (필요 시): pgcrypto AES-256-GCM                 │   │
│  │  - 기존 예시: body_measurements 테이블 (Bytes 타입)                 │   │
│  │                                                                     │   │
│  │  [DB 수준 보안]                                                     │   │
│  │  - RLS (Row Level Security) 적용                                    │   │
│  │  - SSL 연결 필수 (sslmode=require)                                  │   │
│  │  - 암호화된 백업 (Supabase 자동)                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 키 관리 전략

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Key Management                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [환경변수 기반 키 저장]                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  # .env.local (로컬) / Vercel Environment Variables (프로덕션)       │   │
│  │                                                                     │   │
│  │  # PASS API 연동                                                    │   │
│  │  PASS_API_KEY=<PASS 제공자 발급>                                    │   │
│  │  PASS_API_SECRET=<PASS 제공자 발급>                                 │   │
│  │  PASS_MERCHANT_ID=<상점 ID>                                         │   │
│  │                                                                     │   │
│  │  # CI 해싱                                                          │   │
│  │  CI_HASH_SALT=<32자 랜덤 문자열>                                    │   │
│  │                                                                     │   │
│  │  # 추가 암호화 (필요 시)                                            │   │
│  │  ENCRYPTION_KEY=<64자 hex, AES-256>                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [키 생성 가이드]                                                           │
│  $ openssl rand -hex 32  # CI_HASH_SALT, ENCRYPTION_KEY                    │
│                                                                             │
│  [키 로테이션 정책]                                                         │
│  ┌──────────────────┬────────────────┬─────────────────────────────────┐   │
│  │  키 유형         │  로테이션 주기  │  주의사항                        │   │
│  ├──────────────────┼────────────────┼─────────────────────────────────┤   │
│  │  PASS API Key    │  90일          │  PASS 제공자 정책 따름          │   │
│  │  ENCRYPTION_KEY  │  연 1회        │  버전 관리, 마이그레이션 필요    │   │
│  │  CI_HASH_SALT    │  변경 불가     │  변경 시 기존 해시 무효화        │   │
│  │  JWT Secret      │  Supabase 관리 │  자동 로테이션                   │   │
│  └──────────────────┴────────────────┴─────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. 인증 보안 설계

### 5.1 PASS 인증 Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PASS 본인확인 인증 Flow                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Phase 1: 인증 요청 시작]                                                  │
│  ─────────────────────────                                                  │
│                                                                             │
│  Client ──────────────────────────────────────────────► API                 │
│     │    POST /api/pass/initiate                           │                │
│     │    Headers: {                                        │                │
│     │      "X-CSRF-Token": "<csrf_token>",                 │                │
│     │      "Authorization": "Bearer <jwt>"                 │                │
│     │    }                                                 │                │
│     │                                                      │                │
│     │                                                      ▼                │
│     │                                            ┌─────────────────┐        │
│     │                                            │  Validations:   │        │
│     │                                            │  1. CSRF Token  │        │
│     │                                            │  2. JWT Auth    │        │
│     │                                            │  3. Rate Limit  │        │
│     │                                            │  4. Gen State   │        │
│     │                                            └─────────────────┘        │
│     │                                                      │                │
│     │  ◄───────────────────────────────────────────────────┘                │
│     │  Response: { stateToken, passUrl }                                    │
│     │                                                                       │
│  [Phase 2: PASS 앱 인증]                                                    │
│  ───────────────────────                                                    │
│                                                                             │
│  Client ──► Redirect to PASS App ──► 생체/PIN 인증 ──► 본인확인 완료       │
│                                                             │               │
│                                                             ▼               │
│  [Phase 3: Callback 처리]                                                   │
│  ─────────────────────────                                                  │
│                                                                             │
│  PASS Server ──────────────────────────────────────────► API                │
│     │    POST /api/pass/callback                           │                │
│     │    Body: {                                           │                │
│     │      "state": "<state_token>",                       │                │
│     │      "ci": "<88_chars>",                             │                │
│     │      "di": "<di_value>",                             │                │
│     │      "birthDate": "1990-01-01",                      │                │
│     │      "name": "홍길동",                               │                │
│     │      "gender": "M",                                  │                │
│     │      "phone": "010-1234-5678",                       │                │
│     │      "signature": "<pass_signature>"                 │                │
│     │    }                                                 │                │
│     │                                                      ▼                │
│     │                                            ┌─────────────────┐        │
│     │                                            │  Validations:   │        │
│     │                                            │  1. Signature   │        │
│     │                                            │  2. State Token │        │
│     │                                            │  3. Timestamp   │        │
│     │                                            │  4. Age >= 19   │        │
│     │                                            │  5. CI Hash     │        │
│     │                                            └─────────────────┘        │
│     │                                                      │                │
│     │  ◄───────────────────────────────────────────────────┘                │
│     │  Redirect to: /verification-complete                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 CSRF 방어: Double Submit Cookie Pattern

```javascript
// ========================================
// Server: CSRF Token 생성 및 검증
// ========================================

// 1. 토큰 생성 (로그인 시)
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// 2. 쿠키 설정
res.cookies.set('csrf_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24, // 24시간
});

// 3. 검증 미들웨어
async function validateCsrf(req: NextRequest): Promise<boolean> {
  const cookieToken = req.cookies.get('csrf_token')?.value;
  const headerToken = req.headers.get('X-CSRF-Token');

  if (!cookieToken || !headerToken) return false;

  // Timing-safe 비교
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// ========================================
// Client: CSRF Token 전송
// ========================================

// X-CSRF-Token 헤더에 포함
const response = await fetch('/api/pass/initiate', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 쿠키 포함
});
```

### 5.3 Replay Attack 방지: State Token

```javascript
// ========================================
// State Token 생성 및 검증
// ========================================

interface StateToken {
  id: string;           // UUID v4
  userId: string;       // Supabase User ID
  timestamp: number;    // Unix timestamp
  hmac: string;         // HMAC-SHA256 서명
}

// 1. 생성
function generateStateToken(userId: string): StateToken {
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const payload = `${id}:${userId}:${timestamp}`;
  const hmac = crypto
    .createHmac('sha256', process.env.STATE_TOKEN_SECRET!)
    .update(payload)
    .digest('hex');

  return { id, userId, timestamp, hmac };
}

// 2. 저장 (Redis 또는 DB)
await redis.setex(
  `pass_state:${stateToken.id}`,
  300,  // TTL: 5분
  JSON.stringify(stateToken)
);

// 3. 검증 (Callback에서)
async function validateStateToken(state: string): Promise<boolean> {
  // 3.1 존재 여부 확인
  const stored = await redis.get(`pass_state:${state}`);
  if (!stored) return false;

  const token: StateToken = JSON.parse(stored);

  // 3.2 HMAC 서명 검증
  const payload = `${token.id}:${token.userId}:${token.timestamp}`;
  const expectedHmac = crypto
    .createHmac('sha256', process.env.STATE_TOKEN_SECRET!)
    .update(payload)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(token.hmac),
    Buffer.from(expectedHmac)
  )) return false;

  // 3.3 시간 유효성 (5분 이내)
  if (Date.now() - token.timestamp > 5 * 60 * 1000) return false;

  // 3.4 일회성 보장: 즉시 삭제
  await redis.del(`pass_state:${state}`);

  return true;
}
```

### 5.4 Rate Limiting

```javascript
// ========================================
// Rate Limiting 설정
// ========================================

const rateLimits = {
  // 인증 요청: IP당 10회/분
  'pass/initiate': {
    key: (req) => `ratelimit:pass:${getClientIp(req)}`,
    limit: 10,
    window: 60, // 60초
  },

  // 콜백: State Token당 1회 (이미 일회성)
  'pass/callback': {
    key: (req) => `ratelimit:callback:${req.body.state}`,
    limit: 1,
    window: 300, // 5분
  },

  // 전체 API: IP당 100회/분
  'global': {
    key: (req) => `ratelimit:global:${getClientIp(req)}`,
    limit: 100,
    window: 60,
  },
};

// 미들웨어
async function rateLimit(req: NextRequest, type: string): Promise<boolean> {
  const config = rateLimits[type];
  const key = config.key(req);

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, config.window);
  }

  return current <= config.limit;
}
```

---

## 6. 감사 로깅

### 6.1 로그 스키마

```sql
-- ========================================
-- adult_verification_logs 테이블
-- ========================================

CREATE TABLE adult_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- 이벤트 정보
  event_type VARCHAR(50) NOT NULL,
  -- VERIFICATION_INITIATED, VERIFICATION_SUCCESS, VERIFICATION_FAILED,
  -- VERIFICATION_EXPIRED, DUPLICATE_CI_DETECTED, UNDERAGE_ATTEMPT,
  -- REPLAY_ATTACK_DETECTED, RATE_LIMIT_EXCEEDED

  -- 요청 정보 (개인정보 보호)
  ip_address_hash VARCHAR(64),  -- SHA-256(IP)
  user_agent VARCHAR(500),

  -- 상태 정보
  state_token_hash VARCHAR(64),

  -- 결과
  result JSONB NOT NULL DEFAULT '{}',
  -- { "success": true, "reason": null }
  -- { "success": false, "reason": "UNDERAGE", "error_code": "AGE_01" }

  -- 타임스탬프
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 인덱스
  INDEX idx_avl_user_id (user_id),
  INDEX idx_avl_event_type (event_type),
  INDEX idx_avl_created_at (created_at DESC)
);

-- RLS 정책: 관리자만 조회 가능
ALTER TABLE adult_verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view logs"
  ON adult_verification_logs
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'ADMIN')
  );

-- INSERT는 Service Role만 가능 (RLS 우회)
-- DELETE 정책 없음 (Immutable)
```

### 6.2 보관 및 파기 정책

| 로그 유형 | 보관 기간 | 근거 |
|-----------|-----------|------|
| 인증 성공 | 5년 | 청소년보호법 증빙, 분쟁 대비 |
| 인증 실패 | 1년 | 이상 탐지, 보안 분석 |
| 시스템 로그 | 90일 | 디버깅, 성능 모니터링 |

```sql
-- 자동 파기 Cron Job (Supabase Edge Function)
-- 매일 새벽 3시 실행

CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- 5년 이상 성공 로그 삭제
  DELETE FROM adult_verification_logs
  WHERE event_type = 'VERIFICATION_SUCCESS'
    AND created_at < NOW() - INTERVAL '5 years';

  -- 1년 이상 실패 로그 삭제
  DELETE FROM adult_verification_logs
  WHERE event_type != 'VERIFICATION_SUCCESS'
    AND created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;
```

### 6.3 로그 샘플

```json
// 성공 케이스
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-uuid-here",
  "event_type": "VERIFICATION_SUCCESS",
  "ip_address_hash": "a1b2c3d4e5f6...",
  "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...",
  "state_token_hash": "f6e5d4c3b2a1...",
  "result": {
    "success": true,
    "age_verified": true,
    "age_group": "20s"
  },
  "created_at": "2025-12-21T10:30:00Z"
}

// 실패 케이스 (미성년자)
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "user-uuid-here",
  "event_type": "UNDERAGE_ATTEMPT",
  "ip_address_hash": "b2c3d4e5f6a1...",
  "user_agent": "Mozilla/5.0 (Android 14; ...",
  "state_token_hash": "e5d4c3b2a1f6...",
  "result": {
    "success": false,
    "reason": "UNDERAGE",
    "error_code": "AGE_01"
  },
  "created_at": "2025-12-21T10:35:00Z"
}
```

---

## 7. 인시던트 대응

### 7.1 인증 실패 시 대응

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        인증 실패 대응 매트릭스                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Case 1: PASS API 장애]                                                    │
│  ─────────────────────────                                                  │
│  탐지: PASS API 응답 5xx 또는 timeout (3초 초과)                           │
│                                                                             │
│  대응 Flow:                                                                 │
│  1. Circuit Breaker 활성화 (5분간 요청 차단)                               │
│  2. 사용자 메시지: "본인확인 서비스가 일시적으로 지연되고 있습니다.        │
│                    잠시 후 다시 시도해 주세요."                            │
│  3. Slack 알림: #alerts 채널                                               │
│  4. PASS 제공자 상태 페이지 확인                                           │
│  5. 5분 후 자동 복구 시도                                                  │
│                                                                             │
│  [Case 2: 미성년자 인증 시도]                                               │
│  ─────────────────────────────                                              │
│  탐지: calculateAge(birthDate) < 19                                        │
│                                                                             │
│  대응 Flow:                                                                 │
│  1. 인증 거부: { success: false, reason: "UNDERAGE" }                      │
│  2. 사용자 메시지: "만 19세 이상만 이용 가능한 서비스입니다."              │
│  3. 감사 로그: event_type = "UNDERAGE_ATTEMPT"                             │
│  4. 세션에 성인 컨텐츠 접근 차단 플래그 설정                               │
│  5. 개인정보 즉시 폐기 (메모리에서 제거)                                   │
│                                                                             │
│  [Case 3: 중복 CI 탐지]                                                     │
│  ───────────────────────                                                    │
│  탐지: ciHash 충돌 && existingUserId != currentUserId                      │
│                                                                             │
│  대응 Flow:                                                                 │
│  1. 신규 인증 거부                                                         │
│  2. 사용자 메시지: "이미 인증된 계정이 있습니다.                           │
│                    기존 계정으로 로그인해 주세요."                         │
│  3. 감사 로그: event_type = "DUPLICATE_CI_DETECTED"                        │
│  4. 기존 계정 정보 일부 제공 (마스킹된 이메일)                             │
│  5. 반복 시도 시 Rate Limit 강화                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 이상 탐지 시나리오

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          이상 탐지 및 대응                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Anomaly 1: 단일 IP 다수 인증 시도]                                        │
│  ───────────────────────────────────                                        │
│  임계치: 동일 IP에서 10회/시간 초과                                        │
│                                                                             │
│  탐지 쿼리:                                                                 │
│  SELECT ip_address_hash, COUNT(*)                                          │
│  FROM adult_verification_logs                                               │
│  WHERE created_at > NOW() - INTERVAL '1 hour'                               │
│  GROUP BY ip_address_hash                                                   │
│  HAVING COUNT(*) > 10;                                                      │
│                                                                             │
│  대응:                                                                      │
│  1. 해당 IP 임시 차단 (1시간)                                              │
│  2. 보안팀 알림                                                            │
│  3. 패턴 분석 후 영구 차단 여부 결정                                       │
│                                                                             │
│  [Anomaly 2: Replay Attack 탐지]                                            │
│  ─────────────────────────────────                                          │
│  탐지: 이미 소비된 state token으로 callback 요청                           │
│                                                                             │
│  대응:                                                                      │
│  1. 요청 즉시 거부 (HTTP 400)                                              │
│  2. 감사 로그: event_type = "REPLAY_ATTACK_DETECTED"                       │
│  3. 관련 세션 무효화                                                       │
│  4. 보안팀 즉시 알림 (Slack + Email)                                       │
│  5. 해당 IP/User 집중 모니터링                                             │
│                                                                             │
│  [Anomaly 3: 서명 검증 실패]                                                │
│  ───────────────────────────                                                │
│  탐지: PASS 서명이 공개키로 검증되지 않음                                  │
│                                                                             │
│  대응:                                                                      │
│  1. 요청 즉시 거부 (HTTP 400)                                              │
│  2. 감사 로그: event_type = "SIGNATURE_VERIFICATION_FAILED"                │
│  3. 보안팀 즉시 알림                                                       │
│  4. 침해 가능성 분석                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 에스컬레이션 매트릭스

| 심각도 | 예시 | 대응 시간 | 담당 | 알림 채널 |
|--------|------|-----------|------|-----------|
| **Critical** | CI 유출 의심, 대규모 데이터 침해 | 즉시 (15분 내) | CTO + 법무팀 | 전화 + Slack + Email |
| **High** | Replay Attack 다수, 서명 검증 실패 | 1시간 내 | 보안팀 | Slack + Email |
| **Medium** | Rate Limit 초과 다수, API 장애 | 24시간 내 | 개발팀 | Slack |
| **Low** | 개별 인증 실패, 미성년자 시도 | 모니터링 | 자동화 | 로그만 |

---

## 8. 컴플라이언스 체크리스트

### 8.1 개인정보보호법(PIPA) 준수

| 항목 | 요구사항 | 구현 방안 | 상태 |
|------|----------|-----------|------|
| 최소 수집 | 목적에 필요한 최소 정보만 수집 | CI 해시만 저장, 원본 즉시 폐기 | [ ] |
| 목적 외 이용 금지 | 수집 목적 외 사용 금지 | 성인인증 목적으로만 사용, 마케팅 활용 금지 | [ ] |
| 동의 획득 | 수집 전 명확한 동의 | 인증 시작 전 개인정보 수집 동의 UI | [ ] |
| 안전성 확보조치 | 암호화, 접근 제어 | TLS 1.3, SHA-256, RLS, RBAC | [ ] |
| 처리방침 고지 | 수집 항목, 목적, 보유기간 명시 | 개인정보처리방침 업데이트 | [ ] |
| 보유기간 준수 | 명시된 기간 후 파기 | 5년 보관 후 자동 삭제 Cron Job | [ ] |
| 파기 | 복구 불가능한 방법으로 파기 | DELETE + VACUUM, 암호화된 백업 삭제 | [ ] |
| 접근 제한 | 권한 있는 자만 접근 | 관리자만 감사 로그 조회 가능 | [ ] |
| 처리 기록 | 접근 및 처리 이력 관리 | 감사 로그 테이블 운영 | [ ] |

### 8.2 청소년보호법 준수

| 항목 | 요구사항 | 구현 방안 | 상태 |
|------|----------|-----------|------|
| 성인인증 필수 | 성인용 상품 구매 전 인증 | 결제 전 is_adult_verified 검증 | [ ] |
| 연령 검증 | 만 19세 이상 확인 | 생년월일 기준 만 나이 계산 | [ ] |
| 유해 표시 | "19세 미만 구매 불가" 표시 | 상품 상세, 카트, 결제 페이지에 표시 | [ ] |
| 접근 제한 | 미인증자 성인 컨텐츠 차단 | 미인증 시 상품 상세 접근 차단 | [ ] |
| 기록 보관 | 인증 기록 5년 보관 | audit_logs 5년 보관 정책 | [ ] |
| 중복 방지 | 동일인 다중 계정 방지 | CI 해시로 중복 확인 | [ ] |

### 8.3 OWASP Top 10 대응

| OWASP | 위협 | 대응 방안 | 상태 |
|-------|------|-----------|------|
| A01 | Broken Access Control | API 인증 필수, RBAC 적용, RLS | [ ] |
| A02 | Cryptographic Failures | TLS 1.3, SHA-256, AES-256-GCM | [ ] |
| A03 | Injection | Prisma ORM (Parameterized Query) | [ ] |
| A04 | Insecure Design | STRIDE 위협 모델링 | [ ] |
| A05 | Security Misconfiguration | HSTS, CSP, 보안 헤더 설정 | [ ] |
| A06 | Vulnerable Components | 정기 의존성 업데이트 (Dependabot) | [ ] |
| A07 | Identification Failures | State Token, Rate Limit, MFA | [ ] |
| A08 | Integrity Failures | PASS 서명 검증, CSRF 토큰 | [ ] |
| A09 | Logging Failures | 감사 로그, 알림 시스템 | [ ] |
| A10 | SSRF | 콜백 URL 화이트리스트 | [ ] |

---

## 부록

### A. 참고 자료

- [PASS 본인확인 서비스](https://www.passauth.co.kr/) - KT PASS 개인정보처리방침
- [개인정보보호위원회](https://www.pipc.go.kr/) - 2025년 개인정보 처리 통합 안내서
- [청소년보호법](https://www.law.go.kr/법령/청소년보호법) - 법제처
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) - Authentication, Password Storage
- [STRIDE Threat Model](https://en.wikipedia.org/wiki/STRIDE_model) - Wikipedia

### B. 관련 코드 파일

| 파일 | 경로 | 설명 |
|------|------|------|
| Schema | `web/prisma/schema.prisma` | DB 스키마 (Profile, body_measurements) |
| Auth API | `web/src/lib/api/auth.ts` | 인증 헬퍼 함수 |
| Auth Hook | `web/src/hooks/use-auth.ts` | 클라이언트 인증 상태 관리 |
| Social Login | `web/src/lib/auth/social.ts` | OAuth 소셜 로그인 |

### C. 환경변수 템플릿

```bash
# .env.local

# PASS API
PASS_API_KEY=
PASS_API_SECRET=
PASS_MERCHANT_ID=
PASS_CALLBACK_URL=https://teddybearsroom.com/api/pass/callback

# CI 해싱
CI_HASH_SALT=  # openssl rand -hex 32

# State Token
STATE_TOKEN_SECRET=  # openssl rand -hex 32

# 추가 암호화 (필요 시)
ENCRYPTION_KEY=  # openssl rand -hex 32

# Redis (Rate Limit, State Token 저장)
REDIS_URL=

# 알림
SLACK_WEBHOOK_URL=
```

---

**문서 끝**
