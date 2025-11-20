# Notion 기술 스택 페이지 최신 상태 요약

**작성일**: 2025-11-19
**마지막 수정**: 2025-11-19 04:21:00 UTC
**페이지 ID**: `2ac77770-ad42-8193-bd55-df8586d12aa7`

---

## 📋 최신 추가 내용 (2025-11-19)

Notion 🔧 기술 스택 페이지에 5개 신규 섹션이 추가되었습니다:

### 1. 🎨 디자인 컨셉: "디지털 테디베어 하우스"
- **Color Palette**:
  - Primary: 라떼 베이지 `#F5E6D3`
  - Secondary: 코코아 브라운 `#8D6E63`
  - Accent: 파스텔 핑크 `#FFCDD2` & 민트 `#B2DFDB`
- **UI Shape**: `border-radius: 1rem+` (동글동글)
- **Font**: Pretendard Rounded

### 2. 🛠 간소화된 기술 스택 (Lite Version)
**⚠️ 주요 변경**: TanStack Query 제거
- Reason: Next.js 14 Server Components와 완벽 호환
- Zustand는 장바구니 등 클라이언트 상태만 조건부 사용

**Stack**:
- Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Supabase (PostgreSQL) + Prisma
- Payments: TossPayments SDK (빌링키 방식)

### 3. 🗄️ 데이터베이스 설계
**보안 강화**: PostgreSQL `pgcrypto` 확장 사용

**주요 테이블**:
- `user_body_profiles`: 신체정보 DB 레벨 암호화
- `product_size_specs`: 제품 사이즈 범위 저장
- `subscriptions`: TossPayments 빌링키 + 구독 상태 관리

### 4. ⚙️ 핵심 로직
**A. 스마트 사이즈 추천**:
- 복잡한 점수제 대신 **Pass/Fail + 여유 로직**
- OK (green) / TIGHT/LOOSE (yellow) / NO (red)

**B. 구독 결제 시스템**:
- 직접 결제 엔진 X → **스케줄러만 구현**
- Vercel Cron으로 매일 자정 자동 결제
- 결제는 토스에 위임

### 5. 🗓️ 4주 개발 로드맵
- **Week 1**: 집 짓기 (Setup & Design)
- **Week 2**: 옷장 채우기 (Product & DB)
- **Week 3**: 마법 거울 (Size Tech)
- **Week 4**: 계산대 (Payment & Subscription)

---

## 🔄 CLAUDE.md 업데이트 필요사항

### 추가할 내용
1. **디자인 시스템**: 파스텔톤 컬러 팔레트 및 둥근 UI 컨셉
2. **TanStack Query 제거 결정**: State management 단순화
3. **보안 강화**: pgcrypto 기반 신체정보 암호화
4. **단순화된 로직**: Pass/Fail 방식의 사이즈 추천
5. **4주 로드맵**: 주차별 명확한 목표 설정

### 제거/간소화할 내용
- 기존 기술 스택 섹션의 중복 제거
- 너무 상세한 로드맵 (Week 1-7 → 4주로 통합)
- 중복된 비용 분석 정보

### 정리 원칙
- **핵심만 남기기**: 실제 개발에 필요한 정보만
- **중복 제거**: Notion과 CLAUDE.md 간 중복 최소화
- **참조 링크**: 상세 내용은 Notion 페이지 링크로 대체
- **버전 정보**: 최신 업데이트 날짜 명시

---

## ✅ 권장 CLAUDE.md 구조 (간소화)

```markdown
# CLAUDE.md

## Project Overview
- 프로젝트 목적 및 역할 (간략)

## Notion Integration
- 주요 페이지 ID 참조
- 업데이트 workflow 요약

## Technology Stack (Latest: 2025-11-19)
- ⚠️ TanStack Query 제거 (Server Components 우선)
- 핵심 스택만 나열 (상세는 Notion 참조)
- 디자인 시스템 컨셉 요약

## Key Architecture Decisions
- pgcrypto 암호화 (보안)
- Pass/Fail 추천 로직 (단순화)
- Vercel Cron 스케줄러 (자동화)

## Development Roadmap
- 4주 로드맵 요약 (상세는 Notion 참조)

## Workflows
- Notion 업데이트 프로세스 (간략)
- MCP Server 사용법 (핵심만)

## References
- Notion 기술 스택 페이지: [링크]
- claudedocs/ 폴더의 상세 보고서들
```

---

**요약**: CLAUDE.md는 **빠른 참조 가이드** 역할만 하고, 상세 내용은 Notion과 claudedocs/에 위임
