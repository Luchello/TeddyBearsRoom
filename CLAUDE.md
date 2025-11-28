# CLAUDE.md

프로젝트 가이드 for Claude Code (claude.ai/code)

## Project Overview

**TeddyBear'sRoom** - Next.js 기반 E-commerce & Notion 문서 관리 통합 프로젝트

- **🌐 Live**: https://teddybearsroom.com
- **목적**: 테디베어즈룸 쇼핑몰 + Notion 기반 문서 SSOT 관리
- **전략**: Next.js Full Stack 직접 개발 (WordPress 전략 폐기)
- **차별화**: 구독 멤버십, 스마트 사이즈 추천, 기부 투표 시스템

## Repository Structure

```
TeddyBear'sRoom/
├── .claude/                    # Claude Code 설정 디렉토리
├── .gitignore                  # Git ignore 규칙
├── CLAUDE.md                   # 본 파일 (Claude Code 가이드)
├── claudedocs/                 # Claude 생성 문서 (전략, 리서치, 가이드, 구독설계)
│   ├── README.md
│   ├── brand_marketing_guidelines_2025-11-22.md
│   ├── customer_interview_guide_2025-11-20.md
│   ├── figma_design_guide_2025-11-21.md
│   ├── interview_recruiting_action_plan_2025-11-20.md
│   ├── market_research_strategy_2025-11-20.md
│   ├── project_briefing_2025-11-21.md
│   ├── subscription_briefing_2025-11-22.md
│   ├── subscription_standard.md
│   ├── tech_stack_summary_2025-11-19.md
│   ├── tech_stack_summary_2025-11-27.md  # 최신 버전
│   ├── 구독_시스템_개선_방안.txt
│   └── 구독_시스템_최종_설계안.txt
└── frontend/                   # Next.js 16 프론트엔드 애플리케이션
    ├── prisma.config.ts        # Prisma 7 설정 (defineConfig, dotenv)
    ├── prisma/
    │   ├── schema.prisma       # 데이터베이스 스키마 (9개 모델)
    │   └── migrations/         # Migration 히스토리
    ├── src/
    │   ├── app/                # App Router 페이지
    │   │   ├── api/            # API Routes (products, orders, users)
    │   │   ├── layout.tsx      # 루트 레이아웃 (Header/Footer)
    │   │   ├── page.tsx        # 홈페이지
    │   │   ├── globals.css     # TBR 디자인 시스템 (색상, 유틸리티)
    │   │   ├── about/          # 소개 페이지
    │   │   ├── products/       # 상품 목록 페이지
    │   │   └── subscribe/      # 구독 멤버십 페이지
    │   ├── components/         # 재사용 컴포넌트
    │   │   ├── ui/             # shadcn/ui 컴포넌트
    │   │   ├── Header.tsx      # 반응형 헤더 (모바일 메뉴 + ThemeToggle)
    │   │   ├── Footer.tsx      # 푸터
    │   │   ├── ProductCard.tsx # 상품 카드
    │   │   ├── ThemeProvider.tsx # next-themes Provider
    │   │   └── ThemeToggle.tsx # Light/Dark 모드 토글
    │   └── lib/
    │       ├── supabase/       # Supabase 클라이언트 (client, server, middleware)
    │       ├── prisma.ts       # Prisma 싱글톤
    │       └── utils.ts        # 유틸리티 함수
    ├── .env.local              # 환경변수 (gitignore)
    ├── package.json            # 의존성 관리
    ├── tailwind.config.ts      # Tailwind 설정
    └── tsconfig.json           # TypeScript 설정
```

> ✅ **Frontend MVP 완료** (2025-11-26): Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui 기반 프론트엔드 구축 완료

## Notion Integration

### 주요 페이지
- **🔧 기술 스택**: `2ac77770-ad42-8193-bd55-df8586d12aa7`
- **🐻 구독 멤버십**: Notion > 브랜딩 > 구독 멤버십 시스템
- **업무 허브**: 12개 통합 페이지 (브랜드&디자인, 마케팅&콘텐츠 등)

### Workflow
```bash
# Notion → Repository 동기화
1. mcp__notion__API-post-search → 페이지 검색
2. mcp__notion__API-retrieve-a-page → 내용 읽기
3. 분석 → claudedocs/ 저장
4. mcp__notion__API-patch-page → 업데이트 (필요시)
```

## Technology Stack (Latest: 2025-11-27)

> 📌 **상세 내용**: [Notion 기술 스택 페이지](https://www.notion.so/2ac77770ad428193bd55df8586d12aa7) | [claudedocs/tech_stack_summary_2025-11-27.md](./claudedocs/tech_stack_summary_2025-11-27.md)

### ⚠️ 주요 변경사항
- **TanStack Query 제거** (이유: Next.js 16 Server Components 완벽 호환)
- Zustand 5.0.8로 Cart, Wishlist, Auth, Checkout 상태 관리

### Core Stack
```yaml
Frontend: Next.js 16.0.4 (App Router) + React 19.2.0 + TypeScript 5 + Tailwind 4 + shadcn/ui
State: Zustand 5.0.8 (localStorage persist)
UI: lucide-react 0.555.0 + next-themes 0.4.6
Backend: Supabase (PostgreSQL) + Prisma 7 + Supabase Auth (✅ 완료)
Database: Supabase Project (bwbqtknwfslviwqophtc) + Migration 완료
Payments: TossPayments SDK (빌링키) (⏳ 미착수)
Infra: Vercel (✅ 완료) + Vercel 환경변수 (⏳ 설정 대기)
```

### Design System
- **Light Mode** (Coral/Peach/Mint):
  - Background: `#FFF8F5` (크림)
  - Primary: `#D4856B` (코랄)
  - Secondary: `#F5D4C0` (피치)
  - Accent: `#A8E0D0` (민트)
- **Dark Mode** (Matrix Neon):
  - Background: `#0a0a10` (매트릭스 블랙)
  - Primary: `#00FF88` (네온 그린)
  - Accent: `#00FFFF` (시안), `#FF3399` (핫핑크)
- **Concept**: 파스텔 + 귀여움 + 페티시 전문화
- **Shape**: `border-radius: 1rem+` (둥근 UI)
- **Font**: Noto Sans KR (next/font 최적화)

## Key Architecture Decisions

### 1. 보안: pgcrypto 암호화
- PostgreSQL `pgcrypto` 확장으로 신체정보 DB 레벨 암호화
- 클라이언트에서만 복호화 (Privacy-First)

### 2. 단순화: Pass/Fail 추천 로직
- 복잡한 점수제 대신 범위 기반 단순 매칭
- OK (green) / TIGHT/LOOSE (yellow) / NO (red)

### 3. 자동화: Vercel Cron 스케줄러
- 직접 결제 엔진 구현 X → 스케줄러만 구현
- 매일 자정 TossPayments API 호출

## Implementation Checklist

> 📌 **상세 내용**: Notion 성인용품 페이지 > ✅ 실행 체크리스트

시간 기반 로드맵 대신 실행 가능한 체크리스트로 관리합니다.

### 주요 카테고리
1. **🏗️ 사업 준비**: 법률/행정, 도메인/브랜딩
2. **🛍️ 상품 & 소싱**: 공급처 확보, 상품 큐레이션
3. **💻 기술 개발**: 인프라 구축, 핵심 기능, 차별화 기능
4. **🎨 디자인 & UX**: 디자인 시스템, 프라이버시 강화
5. **📦 물류 & 운영**: 택배, 포장, 배송 정책
6. **📣 마케팅 & 런칭**: 페르소나, 경쟁사 분석, 콘텐츠 제작
7. **💰 재무 & 분석**: 예산 관리, KPI 대시보드
8. **🤝 고객 서비스**: CS 채널, FAQ, 응대 매뉴얼

### 우선순위 Phase
- **Phase 0**: 법률/도메인/사업자등록 (개발 전)
- **Phase 1**: 기술 인프라 + 핵심 기능 (1~2개월)
- **Phase 2**: 상품 소싱 + 디자인 완성 (2~3개월)
- **Phase 3**: 물류 + CS 구축 (3~4개월)
- **Phase 4**: 마케팅 + 런칭 (4개월+)

## Business Context

### Subscription Model
- 👤 **비회원**: 포인트 적립 0%
- 🐻 **스탠다드**: 19,900원/월 (기부 5%, 포인트 5% 적립)
- 👑 **프리미엄**: 29,900원/월 (기부 10%, 포인트 10% 적립)
- 💡 **메시지**: "혜택은 스탠다드의 두 배! 가격은 혜택의 절반만!"

### 차별화 기능
1. **구독 멤버십**: TossPayments 빌링키 기반 정기결제
2. **스마트 사이즈 추천**: pgcrypto 암호화 + Pass/Fail 로직
3. **기부 투표**: Supabase Realtime 기반 실시간 투표

## MCP Server Usage

### Notion MCP (필수)
- `API-post-search`: 페이지 검색
- `API-retrieve-a-page`: 페이지 읽기
- `API-patch-page`: 페이지 업데이트
- `API-patch-block-children`: 블록 추가/수정

### Sequential MCP (복잡한 분석)
- 다중 페이지 비교 분석
- 불일치 사항 체계적 식별

## Development Guidelines

### Frontend Development Commands
```bash
cd frontend

# 개발 서버 실행
npm run dev          # http://localhost:3000

# 프로덕션 빌드
npm run build        # 정적 페이지 생성

# 코드 품질 검사
npm run lint         # ESLint 검사
```

### Claude Code Workflow
```
1. Feature Request → /sc:research (best practices)
2. /sc:brainstorm → /sc:workflow → /sc:design
3. /sc:implement → /sc:test → /sc:improve
4. /sc:document
```

### Best Practices
- TypeScript strict mode 사용
- 복잡한 로직은 주석 필수
- 보안 고려사항 항상 체크
- 상세 문서는 `claudedocs/` 저장
- Feature branch workflow 사용 (main branch 직접 수정 지양)

## File Management

### Conventions
- **Reports**: `{topic}_{action}_report.md`
- **Analysis**: `{scope}_{subject}_{type}.md`
- **Standards**: `{subject}_standard.md`
- **위치**: 모두 `claudedocs/` 디렉토리

### Version Control
- 각 파일에 timestamp 포함
- 중복 파일 생성 지양 (기존 파일 업데이트 선호)
- **Feature Branch Workflow**: main branch 직접 수정 지양
  - 새 기능 개발 시: `git checkout -b feature/[feature-name]`
  - 커밋 후 merge 또는 PR 생성

## References

### Notion Pages
- [🔧 기술 스택](https://www.notion.so/2ac77770ad428193bd55df8586d12aa7) - 최신 업데이트: 2025-11-28
- 🎨 브랜드 & 디자인: `2af77770-ad42-8162-bcd3-dd1ffd8e96a5`
- 📣 마케팅 & 콘텐츠: `2af77770-ad42-816c-b6d0-c089f0139da3`
- 📊 운영 & 분석: `2af77770-ad42-81ff-b7b8-cc6f89767d4e`

### Documentation (주요 문서)
- **전략 & 기획**
  - `brand_marketing_guidelines_2025-11-22.md` - 브랜드 마케팅 가이드라인
  - `project_briefing_2025-11-21.md` - 프로젝트 브리핑
  - `market_research_strategy_2025-11-20.md` - 시장 조사 전략
- **디자인**
  - `figma_design_guide_2025-11-21.md` - Figma 디자인 가이드
- **리서치**
  - `customer_interview_guide_2025-11-20.md` - 고객 인터뷰 가이드
  - `interview_recruiting_action_plan_2025-11-20.md` - 인터뷰 모집 액션 플랜
- **기술 & 표준**
  - `tech_stack_summary_2025-11-27.md` - 기술 스택 요약 (최신)
  - `tech_stack_summary_2025-11-19.md` - 기술 스택 초기 버전
  - `subscription_standard.md` - 구독 멤버십 표준
- **구독 설계**
  - `subscription_briefing_2025-11-22.md` - 구독 시스템 브리핑
  - `구독_시스템_개선_방안.txt` - 구독 시스템 개선안
  - `구독_시스템_최종_설계안.txt` - 구독 시스템 최종 설계

> 📁 **전체 문서**: `claudedocs/` 디렉토리에 13개 문서 보관 중 (전략/리서치/가이드/구독설계/기술스택)

---

**Last Updated**: 2025-11-28
**Status**: 🚀 **PRODUCTION LIVE** at https://teddybearsroom.com + Backend Active
**Recent Changes**:
- ✅ **Database Migration 완료** (2025-11-28): Supabase + Prisma 7 연동
  - Supabase Project: `bwbqtknwfslviwqophtc` (ap-southeast-2)
  - Migration: `20251128085948_init` (9개 테이블 생성)
  - API 테스트 통과: products ✅, users/me ✅, orders ✅
  - 다음 단계: Vercel 환경변수 설정 필요
- ✅ **Backend Integration** (2025-11-28): Supabase + Prisma + API Routes
  - Supabase Auth: authStore.ts 연동 완료
  - Prisma 7: PostgreSQL ORM 설정 완료 (prisma.config.ts)
  - API Routes: /api/products, /api/orders, /api/users/me
  - Middleware: Session 자동 갱신 + Protected Routes
- ✅ **Production Deployment** (2025-11-28): Vercel + Custom Domain
  - Live URL: https://teddybearsroom.com / https://www.teddybearsroom.com
  - Vercel URL: https://teddy-bears-room.vercel.app
  - SSL: Let's Encrypt (자동 발급)
  - GitHub Auto-Deploy: Luchello/TeddyBearsRoom (master branch)
- ✅ **Hyper-Parallel Swarm 5개 모듈** (2025-11-27): WAVE 1+2 병렬 구현
  - Module A: Wishlist Store + WishlistButton + WishlistDrawer + ProductCard 통합
  - Module B: Product Filter/Sort (URL-based, useProductFilter hook)
  - Module C: Subscribe Page Enhancement (FAQAccordion + PlanComparisonTable)
  - Module D: Auth Skeleton (authStore + AuthModal, Supabase 연동 준비)
  - Module E: Payment Skeleton (checkoutStore + checkout page, TossPayments 준비)
- ✅ **E-commerce 핵심 기능** (2025-11-27): 4개 모듈 병렬 구현
  - 상품 상세 페이지: /products/[id] Dynamic Route
  - 장바구니: Zustand persist + CartButton + CartDrawer
  - Toast 알림: React Context + auto-dismiss
  - 스켈레톤: ProductCardSkeleton 로딩 UI
- ✅ **코드 최적화** (2025-11-27): 폰트, 아이콘, 데이터 중앙화
- ✅ **Neon Dark Mode 완료** (2025-11-27): Matrix 클럽씬 스타일
- ✅ **Frontend MVP 완료** (2025-11-26): Next.js 16 + shadcn/ui

**Micro-Lessons**:
- Zustand persist로 localStorage 장바구니 자동 저장
- React Context + setTimeout으로 Toast auto-dismiss 구현
- Next.js 15+ params는 Promise로 use() 훅 필요
- useSearchParams + useRouter로 URL 기반 필터 상태 관리
- Skeleton 패턴: 외부 서비스(Supabase, TossPayments) 연동 전 UI 먼저 구현
- useEffect 내 setState는 setTimeout으로 비동기화하여 lint 에러 방지
- Vercel monorepo 배포: Root Directory를 "frontend"로 설정, Framework Preset 확인 필수
- Cloudflare DNS: Vercel 연결 시 A record (76.76.21.21) + CNAME (cname.vercel-dns.com)
- Prisma 7: @prisma/adapter-pg 필수, tsconfig에서 prisma 폴더 exclude 필요
- Prisma 7 Config: prisma.config.ts는 프로젝트 루트에 위치, defineConfig 사용
- Prisma 7 dotenv: .env.local 로드를 위해 dotenv.config({ path: '.env.local' }) 명시 필요
- Supabase SSR: createBrowserClient (client) vs createServerClient (server) 구분 사용
- API Routes 인증: supabase.auth.getUser()로 서버사이드 인증 확인
- Supabase Connection: DATABASE_URL(port 6543, pgbouncer) vs DIRECT_URL(port 5432) 구분
