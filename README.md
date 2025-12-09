# TeddyBear's Room 🐻

**지뢰계 감성 프라이빗 셀프케어 E-commerce**

[![Live Site](https://img.shields.io/badge/Live-teddybearsroom.com-pink?style=for-the-badge)](https://teddybearsroom.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)

---

## Overview

```
     ╭───────────────────────────────────────╮
     │                                       │
     │   🐻 TeddyBear's Room                 │
     │   "Soft Outside, Wild Inside"         │
     │                                       │
     │   파스텔 귀여움 + 페티시 전문화       │
     │   프라이버시 최우선 셀프케어          │
     │                                       │
     ╰───────────────────────────────────────╯
```

TeddyBear's Room은 **지뢰계(Jirai-kei) 감성**의 프라이빗 셀프케어 이커머스 플랫폼입니다.

- **Light Mode**: 파스텔 코랄/피치/민트 (귀여움)
- **Dark Mode**: Matrix Neon 그린/시안/핫핑크 (성인 전용)

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5, Tailwind 4 |
| **UI** | shadcn/ui, lucide-react, next-themes |
| **State** | Zustand 5 (localStorage persist) |
| **Backend** | Supabase (PostgreSQL), Prisma 7 |
| **Auth** | Supabase Auth |
| **Infra** | Vercel, Custom Domain |

## Project Structure

```
TeddyBear'sRoom/
├── CLAUDE.md           # Claude Code 개발 가이드
├── claudedocs/         # 전략/기획/기술 문서
└── web/                # Full-stack Next.js 16 App
    ├── prisma/         # DB 스키마 & 마이그레이션
    └── src/
        ├── app/        # App Router (pages + API)
        ├── components/ # UI 컴포넌트 (재구현 예정)
        ├── lib/        # Prisma & Supabase 클라이언트
        └── store/      # Zustand 상태 관리
```

## Features

### Core E-commerce
- 상품 목록/상세/필터/정렬
- 장바구니 & 위시리스트 (persist)
- 체크아웃 프로세스
- 주문 관리

### 차별화 기능
- **🐻 TBR 멤버십**: 구독 기반 혜택 (포인트 5%, 기부 5%, 무료배송)
- **📏 스마트 사이즈 추천**: pgcrypto 암호화 기반 신체정보 보호
- **🎁 기부 투표**: 실시간 투표 시스템

### Design System
- **성인 인증 모달**: 19세 확인 후 진입
- **반응형 UI**: 모바일 우선 설계
- **다크모드**: Light/Dark 테마 전환

## Quick Start

```bash
# Clone
git clone https://github.com/your-repo/TeddyBearsRoom.git
cd TeddyBearsRoom/web

# Install
npm install

# Environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Development
npm run dev

# Build
npm run build
```

## Documentation

- **CLAUDE.md**: 개발 가이드 (기술 스택, 아키텍처, 워크플로우)
- **claudedocs/**: 프로젝트 문서 (전략, 리서치, 디자인, 구독 설계)
- **Notion**: [기술 스택 & 아키텍처](https://www.notion.so/2b877770ad4281c59a86f1bd40c74f38)

## License

Private - All rights reserved.

---

**Last Updated**: 2025-12-08 | **Status**: 🔄 UI Rebuild in Progress
