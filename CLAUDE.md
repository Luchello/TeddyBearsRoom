# CLAUDE.md

프로젝트 가이드 for Claude Code (claude.ai/code)

## Project Overview

**TeddyBear'sRoom** - Next.js 기반 E-commerce & Notion 문서 관리 통합 프로젝트

- **목적**: 테디베어즈룸 쇼핑몰 + Notion 기반 문서 SSOT 관리
- **전략**: Next.js Full Stack 직접 개발 (WordPress 전략 폐기)
- **차별화**: 구독 멤버십, 스마트 사이즈 추천, 기부 투표 시스템

## Repository Structure

```
TeddyBear'sRoom/
├── .claude/                    # Claude Code 설정 디렉토리
├── .env.example                # 환경 변수 템플릿
├── .gitignore                  # Git ignore 규칙
├── CLAUDE.md                   # 본 파일 (Claude Code 가이드)
└── claudedocs/                 # Claude 생성 문서 (전략, 리서치, 가이드)
    ├── README.md                                            # 문서 디렉토리 설명
    ├── brand_marketing_guidelines_2025-11-22.md             # 브랜드 마케팅 가이드라인
    ├── customer_interview_guide_2025-11-20.md               # 고객 인터뷰 가이드
    ├── figma_design_guide_2025-11-21.md                     # Figma 디자인 가이드
    ├── interview_recruiting_action_plan_2025-11-20.md       # 인터뷰 모집 액션 플랜
    ├── market_research_strategy_2025-11-20.md               # 시장 조사 전략
    ├── project_briefing_2025-11-21.md                       # 프로젝트 브리핑
    ├── subscription_standard.md                             # 구독 멤버십 표준
    └── tech_stack_summary_2025-11-19.md                     # 기술 스택 요약
```

> ✅ **Note**: Git repository 초기화 완료. 개발 코드는 모두 제거되었으며, 전략/리서치 문서만 보관 중입니다.

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

## Technology Stack (Latest: 2025-11-19)

> 📌 **상세 내용**: [Notion 기술 스택 페이지](https://www.notion.so/2ac77770ad428193bd55df8586d12aa7)

### ⚠️ 주요 변경사항
- **TanStack Query 제거** (이유: Next.js 14 Server Components 완벽 호환)
- Zustand는 장바구니 등 클라이언트 상태만 조건부 사용

### Core Stack
```yaml
Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
Backend: Supabase (PostgreSQL) + Prisma + Supabase Auth
Payments: TossPayments SDK (빌링키)
Infra: Vercel + Vercel Edge CDN
```

### Design System
- **Color**: 라떼 베이지 `#F5E6D3`, 코코아 브라운 `#8D6E63`
- **Shape**: `border-radius: 1rem+` (둥근 UI)
- **Font**: Pretendard Rounded

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
- 🐻 **엔트리**: 19,900원/월 (기부 5%, 포인트 2배)
- 👑 **프리미엄**: 29,900원/월 (기부 10%, 포인트 4배)
- 💡 **메시지**: "혜택은 엔트리의 두 배! 가격은 혜택의 절반만!"

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
- [🔧 기술 스택](https://www.notion.so/2ac77770ad428193bd55df8586d12aa7) - 최신 업데이트: 2025-11-19
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
  - `tech_stack_summary_2025-11-19.md` - 기술 스택 요약
  - `subscription_standard.md` - 구독 멤버십 표준

> 📁 **전체 문서**: `claudedocs/` 디렉토리에 9개 문서 보관 중 (전략/리서치/가이드)

---

**Last Updated**: 2025-11-22
**Status**: Clean Slate - Ready for Development
**Recent Changes**:
- 모든 개발 코드 제거 (website/, scripts/ 디렉토리)
- outdated 문서 정리 (기술/Notion 관련 보고서 삭제)
- 전략/리서치/가이드 문서만 보존 (9개 파일)
- Git repository 정리 완료
- 새로운 개발 시작 준비 완료
