# CLAUDE.md

프로젝트 가이드 for Claude Code

## Project Overview

**TeddyBear's Room** - 성인용품 E-commerce 플랫폼

| 항목 | 내용 |
|------|------|
| **Live** | https://teddybearsroom.com |
| **Stack** | Next.js 16 + Supabase + Prisma 7 |
| **Status** | Frontend Clean Slate (2025-12-05) |

## Repository Structure

```
TeddyBear'sRoom/
├── CLAUDE.md                 # 본 파일
├── claudedocs/
│   └── subscription_standard.md  # 구독 비즈니스 로직
└── frontend/
    ├── prisma/
    │   ├── schema.prisma     # DB 스키마 (9개 모델)
    │   └── migrations/       # Migration 히스토리
    ├── src/
    │   ├── app/
    │   │   ├── api/          # ✅ Backend API (보존)
    │   │   │   ├── products/
    │   │   │   ├── orders/
    │   │   │   └── users/
    │   │   ├── layout.tsx    # 🆕 최소 레이아웃
    │   │   ├── page.tsx      # 🆕 최소 홈페이지
    │   │   └── globals.css   # 🆕 최소 CSS
    │   └── lib/
    │       ├── prisma.ts     # Prisma 싱글톤
    │       └── supabase/     # Supabase 클라이언트
    ├── middleware.ts         # Auth 미들웨어
    └── .env.local            # 환경변수
```

## Tech Stack

```yaml
# Backend (보존됨)
Database: Supabase PostgreSQL (bjnjbbdcwkooswvexiuh)
ORM: Prisma 7 with @prisma/adapter-pg
Auth: Supabase Auth + PASS 본인확인
Payment: TossPayments (빌링키 정기결제)
Deploy: Vercel

# Frontend (재구현 예정)
Framework: Next.js 16.0.4 (App Router)
Styling: Tailwind CSS 4
State: 미정 (Zustand 또는 기타)
```

## Architecture Decisions

### 1. 보안: pgcrypto 암호화
- 신체정보 DB 레벨 암호화
- 클라이언트에서만 복호화

### 2. 성인인증: PASS 본인확인
- SKT CI/DI 기반 실명 인증
- 회원가입 시 1회 인증

### 3. 결제: TossPayments
- 구독: 빌링키(Billing Key) 정기결제
- 일반: 카드/계좌이체/간편결제
- 스케줄: Vercel Cron → TossPayments API

### 4. 사이즈 추천: Pass/Fail 로직
- 복잡한 점수제 X → 범위 기반 단순 매칭
- OK / TIGHT·LOOSE / NO

## Business Context

### 이너 서클 (Inner Circle) 구독 시스템

```
이너 서클 = 구독 프로그램 브랜드
└── Roommate 🏠 = 구독 상품 (9,900원/월)
    ├── 10% 상시 할인
    ├── 1% 기부 참여
    └── 3만원↑ 무료배송
```

> 📌 상세: `claudedocs/subscription_standard.md`

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | 상품 목록 |
| `/api/products/[id]` | GET | 상품 상세 |
| `/api/orders` | POST | 주문 생성 |
| `/api/users/me` | GET | 내 정보 |
| `/api/users/me/measurements` | GET/POST | 신체 정보 |

## Development

```bash
cd frontend
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

### 규칙
- TypeScript strict mode
- Feature branch workflow
- 문서는 `claudedocs/`에 저장

---

**Last Updated**: 2025-12-05 | **Status**: Clean Slate - Frontend 재구현 대기
