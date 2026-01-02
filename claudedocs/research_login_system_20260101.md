# 로그인 시스템 구현 리서치 보고서

> Generated: 2026-01-01
> Project: TeddyBear's Room (성인용품 E-commerce)
> Confidence: High

---

## Executive Summary

TeddyBear's Room의 로그인 시스템은 **이미 70% 이상 구현**되어 있습니다. 현재 소셜 로그인(Kakao, Google)이 작동하며, 남은 핵심 작업은 다음 세 가지입니다:

1. **프로필 자동 생성** - 소셜 로그인 후 Profile 테이블 동기화
2. **PASS 성인인증** - 법적 필수 (청소년보호법)
3. **(선택) 이메일/비밀번호 회원가입** - 현재 mock 상태

**권장 접근법**: 소셜 로그인 기반으로 진행하고, 이메일 회원가입은 후순위로 미루거나 제거

---

## 1. 현재 구현 상태

### 1.1 완료된 부분

| 기능 | 상태 | 파일 |
|------|------|------|
| Supabase 클라이언트 설정 | ✅ | `lib/supabase/{client,server,middleware}.ts` |
| OAuth (Kakao, Google) | ✅ | `lib/auth/social.ts` |
| OAuth 콜백 처리 | ✅ | `app/api/auth/callback/route.ts` |
| Middleware 세션 갱신 | ✅ | `middleware.ts` |
| 인증 상태 훅 | ✅ | `hooks/use-auth.ts` |
| API 인증 헬퍼 | ✅ | `lib/api/auth.ts` |
| 로그인 UI | ✅ | `components/auth/login-form.tsx` |

### 1.2 미완료 부분

| 기능 | 우선순위 | 복잡도 |
|------|----------|--------|
| Profile 자동 생성 | High | Low |
| PASS 성인인증 | High (법적 필수) | Medium |
| 이메일/비밀번호 회원가입 | Low | Low |
| Naver 소셜 로그인 | Low | Low |

---

## 2. 기술 스택 분석

### 2.1 Next.js 16 + Supabase Auth 베스트 프랙티스

#### 핵심 변경사항 (2025-2026)

1. **`@supabase/auth-helpers` → `@supabase/ssr`로 마이그레이션 완료** (deprecated)
2. **`middleware.ts` → `proxy.ts`로 이름 변경** (Next.js 16)
3. **미들웨어에서 인증하지 말 것** - CVE-2025-29927 취약점 대응

#### 권장 패턴

```typescript
// Server Component에서 인증 검증
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

**핵심 원칙**:
- `getSession()` 대신 `getUser()` 사용 (JWT 서버 검증)
- 미들웨어는 세션 갱신만, 실제 인증은 Server Component/Action에서
- PKCE Flow 기본 활성화 (`@supabase/ssr`)

### 2.2 현재 프로젝트와의 일치도

| 베스트 프랙티스 | 현재 상태 |
|----------------|-----------|
| `@supabase/ssr` 사용 | ✅ |
| `getUser()` 사용 | ✅ |
| PKCE Flow | ✅ |
| 미들웨어 세션 갱신 | ✅ |
| Open Redirect 방지 | ✅ |

**결론**: 현재 구현이 최신 베스트 프랙티스와 일치함

---

## 3. 법적 요구사항 (청소년보호법)

### 3.1 필수 준수사항

| 요구사항 | 상태 | 근거 |
|----------|------|------|
| "19세 미만 이용 불가" 표시 | ⚠️ 확인 필요 | 청소년보호법 제16조 |
| 성인인증 기능 | ❌ 미구현 | 청소년보호법 제17조 |
| 판매 시 나이/본인 확인 | ❌ 미구현 | 청소년보호법 제17조 |

### 3.2 위반 시 처벌

- **청소년에게 판매**: 3년 이하 징역 또는 3,000만원 이하 벌금
- **유해 표시 미비**: 2년 이하 징역 또는 2,000만원 이하 벌금

### 3.3 성인인증 방법

현재 합법적인 온라인 성인인증 방법:
1. **휴대폰 본인인증** (다날, 나이스, KG이니시스)
2. **PASS 간편인증** (SKT/KT/LGU+ 공동)
3. **공동인증서** (구 공인인증서)

---

## 4. PASS 본인인증 연동 방안

### 4.1 연동 방식 비교

| 방식 | 장점 | 단점 | 비용 |
|------|------|------|------|
| **KG 이니시스** | TossPayments와 통합 가능, 다양한 인증서 지원 | 계약 필요 | 건당 과금 |
| **다날 (포트원)** | 간편한 연동, 포트원 통합 | 월정액제 | 5만원/1,200건~ |
| **SK Open API** | 직접 연동 가능 | 문서 부족 | 미정 |

### 4.2 권장 방안: KG 이니시스 (TossPayments 연계)

현재 TossPayments를 결제에 사용 중이므로, **KG 이니시스 통합인증**이 가장 효율적:

```
장점:
- 결제와 인증 계약 일원화
- 별도 모듈 설치 없이 웹호출 방식
- 성인인증(CI) + 본인확인 동시 처리
```

### 4.3 대안: 포트원 + 다날

포트원을 사용하면 다날 본인인증을 더 간편하게 연동 가능:

```typescript
// 포트원 V1 + 다날 본인인증 예시
const response = await PortOne.requestIdentityVerification({
  storeId: "store-xxx",
  identityVerificationId: `verification-${Date.now()}`,
})

// 서버에서 imp_uid로 인증 정보 조회
const { data } = await axios.get(`/api/verification/${response.imp_uid}`)
// data: { ci, di, name, birthday, gender }
```

---

## 5. 구현 권장안

### 5.1 Phase 1: 즉시 구현 (1-2일)

**Profile 자동 생성 로직 추가**

```typescript
// app/api/auth/callback/route.ts 수정
export async function GET(request: NextRequest) {
  // ... 기존 코드 ...

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Profile 자동 생성/업데이트
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        updatedAt: new Date(),
      },
      create: {
        id: user.id,
        email: user.email!,
        isAdultVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  // ... 리다이렉트 ...
}
```

### 5.2 Phase 2: 성인인증 연동 (3-5일)

**성인인증 플로우**:

```
1. 회원가입/첫 구매 시
   └── 성인인증 필요 여부 체크 (isAdultVerified)

2. 성인인증 팝업/페이지
   └── KG 이니시스 or 다날 API 호출

3. 인증 완료 콜백
   └── CI/DI 저장, isAdultVerified = true

4. 성인 전용 페이지 접근
   └── isAdultVerified 체크
```

**데이터베이스 스키마 수정**:

```prisma
model Profile {
  // 기존 필드...

  isAdultVerified  Boolean   @default(false)
  adultVerifiedAt  DateTime?
  ci               String?   // 암호화 저장
  di               String?   // 암호화 저장
}
```

### 5.3 Phase 3: (선택) 이메일 회원가입

현재 소셜 로그인이 작동하므로, 이메일 회원가입은 **후순위**로 미룰 것을 권장:

- 소셜 로그인만으로 충분한 사용자 커버리지
- 이메일 인증 플로우 추가 복잡도
- 비밀번호 관리 보안 부담

---

## 6. 보안 고려사항

### 6.1 필수 보안 조치

| 항목 | 현재 상태 | 권장 조치 |
|------|-----------|-----------|
| JWT 검증 | ✅ `getUser()` 사용 | 유지 |
| Open Redirect | ✅ 상대 URL만 허용 | 유지 |
| Rate Limiting | ✅ @upstash/ratelimit | 인증 API에도 적용 |
| CI/DI 저장 | ❌ 미구현 | pgcrypto 암호화 필수 |
| 세션 관리 | ✅ Supabase Auth | 유지 |

### 6.2 CVE-2025-29927 대응

Next.js 미들웨어 인증 우회 취약점 대응:

```typescript
// ❌ 잘못된 방법 - 미들웨어에서만 인증
export async function middleware(request: NextRequest) {
  const user = await getUser() // 우회 가능!
  if (!user) redirect('/login')
}

// ✅ 올바른 방법 - Server Component에서 재검증
export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  // ...
}
```

---

## 7. 결론 및 권장 로드맵

### 즉시 실행 (이번 주)

1. ✅ **Profile 자동 생성** - OAuth 콜백에 upsert 로직 추가
2. ✅ **isAdultVerified 필드 추가** - Prisma 스키마 수정

### 단기 (1-2주)

3. 📋 **성인인증 업체 계약** - KG 이니시스 or 다날
4. 📋 **성인인증 API 연동** - 테스트 환경 구축
5. 📋 **인증 UI 구현** - 팝업/페이지 개발

### 중기 (선택)

6. 📋 **Naver 소셜 로그인** - 한국 사용자 편의성
7. 📋 **이메일 회원가입** - 소셜 로그인 대안

---

## Sources

- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js 16: What's New for Authentication](https://auth0.com/blog/whats-new-nextjs-16/)
- [KG 이니시스 통합인증서비스](https://sign-service.inicis.com/)
- [다날 개발자센터](https://developers.danalpay.com/reference/server/header)
- [포트원 다날 본인인증 연동](https://www.hongreat.co.kr/blog/backend/포트원-다날-본인인증-api-연동하기)
- [방심위 성인용품 접속차단 (2024)](https://zdnet.co.kr/view/?no=20240314154754)
- [청소년보호법 나무위키](https://namu.wiki/w/청소년%20보호법)
