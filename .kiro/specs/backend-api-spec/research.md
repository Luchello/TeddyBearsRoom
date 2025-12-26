# Research: backend-api-spec

> Generated: 2025-12-25
> Status: Completed
> Language: ko

## 1. 개요

TeddyBear's Room 백엔드 API 코드베이스 분석 결과 문서. 기존 구현 패턴, 아키텍처 결정, 비즈니스 로직을 문서화한다.

### 분석 범위

| 항목 | 내용 |
|------|------|
| 도메인 | 7개 (Auth, Users, Products, Orders, Referrals, Ambassador, Cron) |
| 엔드포인트 | 15개 |
| 서비스 레이어 | 2개 (referral, ambassador) |
| 유틸리티 | 3개 (auth, rate-limit, prisma) |

---

## 2. 발견된 아키텍처 패턴

### 2.1 API Route 핸들러 패턴

모든 API 라우트는 동일한 구조를 따른다:

```typescript
export async function GET(request: NextRequest) {
  try {
    // 1. 인증 검사
    const { user, error } = await requireAuth();
    if (error) return apiError(error.message, error.status);

    // 2. Rate Limiting
    const rateLimitResult = await withRateLimit('default', user.id);
    if (!rateLimitResult.allowed) {
      return apiError('Too Many Requests', 429);
    }

    // 3. 비즈니스 로직
    const result = await service.doSomething(user.id);

    // 4. 응답
    return apiSuccess(result);
  } catch (error) {
    // 5. 에러 처리
    return apiError('서버 오류', 500);
  }
}
```

### 2.2 인증 헬퍼 패턴 (`lib/api/auth.ts`)

```typescript
// 인증 결과 타입
type AuthResult = {
  user: User | null;
  error: { message: string; status: number } | null;
};

// 표준 인증 함수
async function requireAuth(): Promise<AuthResult>;

// 표준 응답 함수
function apiError(message: string, status?: number, code?: string): NextResponse;
function apiSuccess<T>(data: T, status?: number): NextResponse;
```

**장점:**
- 일관된 인증 흐름
- 표준화된 응답 포맷
- 타입 안전성

### 2.3 Rate Limiting 패턴 (`lib/api/rate-limit.ts`)

메모리 기반 Rate Limiting 구현:

```typescript
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  auth: { maxRequests: 5, windowMs: 60 * 1000 },      // 인증: 5/분
  orders: { maxRequests: 10, windowMs: 60 * 1000 },   // 주문: 10/분
  default: { maxRequests: 30, windowMs: 60 * 1000 },  // 기본: 30/분
};
```

**특징:**
- 사용자 ID 기반 추적 (인증 필요)
- IP 기반 fallback
- 메모리 저장 (서버 재시작 시 초기화)

**제한사항:**
- 멀티 인스턴스 환경에서 동작 불가
- Redis 등 분산 저장소 필요 (스케일링 시)

### 2.4 Service Layer 패턴

비즈니스 로직을 서비스 클래스로 분리:

```typescript
// lib/services/referral.service.ts
class ReferralService {
  async generateReferralCode(userId: string): Promise<string>;
  async checkMilestonesForReferral(referralId: string): Promise<ReferralMilestone[]>;
  async claimMilestoneReward(userId: string, rewardId: string): Promise<ClaimResult>;
  async getReferralStats(userId: string): Promise<ReferralStats>;
}

// lib/services/ambassador.service.ts
class AmbassadorService {
  async checkAmbassadorQualification(userId: string): Promise<AmbassadorStatus>;
  async useFreeShipping(userId: string): Promise<boolean>;
  async getAmbassadorBenefits(userId: string): Promise<AmbassadorBenefits>;
}
```

**장점:**
- API 핸들러와 비즈니스 로직 분리
- 테스트 용이성
- 재사용성

### 2.5 Database Client 패턴 (`lib/prisma.ts`)

Prisma 7 + PrismaPg 어댑터 싱글톤:

```typescript
import { Pool } from '@neondatabase/serverless';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```

**특징:**
- Serverless 환경 최적화
- Connection pooling
- 개발 환경에서 Hot Reload 대응

---

## 3. 기술 스택

### 3.1 런타임 & 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15+ | App Router, API Routes |
| React | 19 | UI 렌더링 |
| TypeScript | 5.x | 타입 안전성 |

### 3.2 데이터베이스 & ORM

| 기술 | 버전 | 용도 |
|------|------|------|
| PostgreSQL | 15 | 메인 데이터베이스 |
| Supabase | - | 호스팅, Auth, RLS |
| Prisma | 7 | ORM |
| @prisma/adapter-pg | - | Serverless 어댑터 |

### 3.3 인증 & 보안

| 기술 | 용도 |
|------|------|
| Supabase Auth | OAuth PKCE 인증 |
| Zod | 스키마 검증 |
| CRON_SECRET | Cron 작업 인증 |

---

## 4. 비즈니스 로직 분석

### 4.1 추천 시스템 (Referral)

```
추천 흐름:
1. 추천인(A)가 추천 코드 생성 (TBR + 6자리)
2. 피추천인(B)이 코드 입력하여 가입
3. B가 구독 시작하면 추천 관계 활성화
4. B의 구독 유지 기간에 따라 마일스톤 달성
5. A가 마일스톤 보상 수령

마일스톤 보상:
├── 3개월 → 3,000P
├── 6개월 → 5,000P
└── 12개월 → 10,000P
```

### 4.2 앰버서더 시스템 (Ambassador)

```
자격 조건: 10명 이상 추천 성공

혜택:
├── 신제품 먼저 체험 (newProductEarlyAccess)
└── 월 1회 무료 배송 (monthlyFreeShipping)
    ├── 매월 1일 리셋
    └── nextFreeShippingAt으로 추적
```

### 4.3 추천 코드 생성 규칙

```typescript
const CODE_CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
// 제외: 0, O, I, L, 1 (혼동 방지)

function generateCode(): string {
  return 'TBR' + randomString(6, CODE_CHARSET);
}
// 예: TBR3K7HN2
```

---

## 5. 보안 구현

### 5.1 인증 (Authentication)

| 보호 수준 | 엔드포인트 | 구현 |
|-----------|-----------|------|
| 공개 | /api/products/* | 인증 불필요 |
| 인증 필수 | /api/users/*, /api/orders/*, /api/referrals/* | requireAuth() |
| Cron 전용 | /api/cron/*, /api/referrals/milestones/check | CRON_SECRET 검증 |

### 5.2 입력 검증 (Validation)

**Zod 스키마 예시:**
```typescript
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  avatar: z.string().url().optional(),
});

const measurementsSchema = z.object({
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  shoeSize: z.number().min(200).max(320).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});
```

### 5.3 공격 방어

| 공격 유형 | 방어 구현 |
|-----------|-----------|
| XSS | 프로필 name에 `<`, `>` 차단 |
| SSRF | 아바타 URL 허용 도메인 화이트리스트 |
| Open Redirect | OAuth 콜백 next 파라미터 검증 |
| Brute Force | Rate Limiting (특히 추천 코드 검증) |

---

## 6. 테스트 용이성 분석

### 6.1 현재 테스트 가능 영역

| 계층 | 테스트 용이성 | 이유 |
|------|--------------|------|
| Service | 높음 | 순수 비즈니스 로직, DI 가능 |
| API Route | 중간 | 통합 테스트 필요 |
| Auth Helper | 높음 | 함수 단위 테스트 가능 |
| Rate Limit | 중간 | 상태 의존, 시간 모킹 필요 |

### 6.2 TDD 적합성

Requirements 문서의 Gherkin 시나리오가 테스트 케이스로 직접 변환 가능:

```gherkin
# requirements.md
Scenario: 프로필 자동 생성
  Given 사용자가 로그인됨
  And 프로필이 존재하지 않음
  When GET /api/users/me 호출
  Then 프로필이 자동 생성됨

# 테스트 코드로 변환
describe('GET /api/users/me', () => {
  it('프로필이 없으면 자동 생성해야 한다', async () => {
    // Given
    const user = await createAuthenticatedUser();
    await prisma.profile.delete({ where: { userId: user.id } });

    // When
    const response = await GET('/api/users/me', { auth: user });

    // Then
    expect(response.status).toBe(200);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    expect(profile).toBeDefined();
  });
});
```

---

## 7. 개선 기회

### 7.1 단기 개선

| 영역 | 현재 | 개선안 |
|------|------|--------|
| Rate Limiting | 메모리 기반 | Redis 기반 분산 저장소 |
| 에러 로깅 | console.error | 구조화된 로깅 (Sentry, LogRocket) |
| API 문서 | 없음 | OpenAPI/Swagger 자동 생성 |

### 7.2 중기 개선

| 영역 | 현재 | 개선안 |
|------|------|--------|
| 캐싱 | 없음 | 상품 목록 Redis 캐싱 |
| 검색 | SQL LIKE | Elasticsearch/MeiliSearch |
| 이벤트 | 동기 처리 | 이벤트 기반 아키텍처 (마일스톤 체크) |

### 7.3 장기 개선

| 영역 | 현재 | 개선안 |
|------|------|--------|
| 마이크로서비스 | 모놀리식 | Referral, Order 서비스 분리 |
| API 버저닝 | 없음 | /api/v1/, /api/v2/ |
| GraphQL | REST | 선택적 GraphQL 레이어 |

---

## Notes

- 이 문서는 `/kiro:spec-design backend-api-spec` 실행 중 생성됨
- 코드베이스 분석 기준일: 2025-12-25
- 다음 단계: design.md 생성
