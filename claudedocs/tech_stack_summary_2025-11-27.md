# TeddyBear'sRoom - 기술 스택 및 구현 현황

**작성일**: 2025-11-27
**최종 업데이트**: 2025-11-29
**상태**: ✅ Production Ready
**버전**: v3.2 (CSS @layer base Fix)

---

## 📊 구현 현황 요약

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    IMPLEMENTATION STATUS: 2025-11-29                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ✅ Frontend MVP           │  완료 (11-26)                                ║
║  ✅ E-commerce Core        │  완료 (11-27)                                ║
║  ✅ State Management       │  완료 (Zustand 5.0.8)                        ║
║  ✅ UI Components          │  완료 (18개)                                 ║
║  ✅ Backend Integration    │  완료 (11-28)                                ║
║  ✅ Vercel Deployment      │  완료 (teddybearsroom.com)                   ║
║  ✅ Domain + SSL           │  완료 (Let's Encrypt)                        ║
║  ✅ Supabase Migration     │  완료 (11-29) → bjnjbbdcwkooswvexiuh        ║
║  ✅ Database Schema        │  완료 (9개 테이블)                           ║
║  ✅ Product Seed           │  완료 (8개 상품)                             ║
║  ⏳ Payment Integration    │  Skeleton Only (TossPayments 대기)          ║
║  ⏳ 차별화 기능            │  스마트추천, 기부투표 (미착수)               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 🌐 Production Environment

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🚀 LIVE DEPLOYMENT                                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  Primary URL:     https://teddybearsroom.com                              ║
║  WWW URL:         https://www.teddybearsroom.com                          ║
║  Vercel URL:      https://teddy-bears-room.vercel.app                     ║
║                                                                           ║
║  Platform:        Vercel (Hobby Plan)                                     ║
║  Repository:      Luchello/TeddyBearsRoom (master)                        ║
║  Root Directory:  frontend                                                ║
║  Framework:       Next.js 16                                              ║
║  SSL:             Let's Encrypt (Auto-renewed)                            ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  📦 SUPABASE PROJECT                                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  Project ID:      bjnjbbdcwkooswvexiuh                                    ║
║  Region:          ap-south-1 (Mumbai)                                     ║
║  Status:          ✅ Active (Production)                                  ║
║                                                                           ║
║  Connection:                                                              ║
║  ├── Pooled:      port 6543 (pgbouncer) - for queries                    ║
║  └── Direct:      port 5432 - for migrations                              ║
║                                                                           ║
║  OLD Project:     bwbqtknwfslviwqophtc (DEPRECATED)                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Frontend Stack

### Core Framework
| 기술 | 버전 | 상태 | 비고 |
|------|------|------|------|
| Next.js | 16.0.4 | ✅ | App Router |
| React | 19.2.0 | ✅ | Server Components |
| TypeScript | 5.x | ✅ | Strict Mode |
| Tailwind CSS | 4.x | ✅ | Custom Design System |
| Zustand | 5.0.8 | ✅ | localStorage persist |
| next-themes | 0.4.6 | ✅ | Dark/Light Mode |
| lucide-react | 0.555.0 | ✅ | Icon System |

### 변경 사항
- **TanStack Query**: ❌ **제거** (Server Components와 중복)
- **React Hook Form + Zod**: ⏳ 필요시 추가 예정

---

## 📁 프로젝트 구조

```
frontend/src/
├── app/                          # App Router 페이지 (7개)
│   ├── layout.tsx               # 루트 레이아웃 (Noto Sans KR)
│   ├── page.tsx                 # 홈페이지
│   ├── globals.css              # TBR 디자인 시스템
│   ├── api/                     # API Routes
│   │   ├── products/            # GET (목록, 필터, 정렬)
│   │   ├── orders/              # GET, POST (인증 필요)
│   │   └── users/me/            # GET, PATCH (프로필)
│   ├── about/page.tsx           # 소개 페이지
│   ├── products/
│   │   ├── page.tsx             # 상품 목록 + 필터/정렬
│   │   └── [id]/page.tsx        # 상품 상세 (Dynamic Route)
│   ├── subscribe/page.tsx       # 구독 멤버십
│   └── checkout/page.tsx        # 결제 페이지 (Skeleton)
│
├── components/                   # 컴포넌트 (18개)
│   ├── ui/                      # shadcn/ui
│   ├── Header.tsx               # 반응형 헤더 + 모바일 메뉴
│   ├── Footer.tsx               # 푸터 (Wave Divider + Newsletter)
│   ├── Testimonials.tsx         # 고객 후기 캐러셀
│   ├── ThemeProvider.tsx        # Dark Mode Provider
│   ├── ThemeToggle.tsx          # Light/Dark 토글
│   ├── ProductCard.tsx          # 상품 카드
│   ├── ProductCardSkeleton.tsx  # 로딩 스켈레톤
│   ├── ProductFilter.tsx        # 필터/정렬 UI
│   ├── CartButton.tsx           # 장바구니 버튼 (Badge)
│   ├── CartDrawer.tsx           # 장바구니 Drawer
│   ├── WishlistButton.tsx       # 위시리스트 버튼
│   ├── WishlistDrawer.tsx       # 위시리스트 Drawer
│   ├── AuthModal.tsx            # 로그인/회원가입 모달
│   ├── FAQAccordion.tsx         # FAQ 아코디언
│   └── PlanComparisonTable.tsx  # 구독 플랜 비교표
│
├── store/                        # Zustand Stores (4개)
│   ├── cartStore.ts             # 장바구니 (persist)
│   ├── wishlistStore.ts         # 위시리스트 (persist)
│   ├── authStore.ts             # 인증 (Supabase 연동)
│   └── checkoutStore.ts         # 결제 (Skeleton)
│
├── contexts/
│   └── ToastContext.tsx         # Toast 알림 시스템
│
├── hooks/
│   └── useProductFilter.ts      # 필터/정렬 훅
│
└── lib/
    ├── supabase/                # Supabase 클라이언트
    │   ├── client.ts            # Browser Client
    │   ├── server.ts            # Server Client
    │   └── middleware.ts        # Middleware Client
    ├── prisma.ts                # Prisma Singleton
    ├── utils.ts                 # cn() 유틸리티
    ├── data.ts                  # 중앙화된 데이터
    └── types.ts                 # TypeScript 타입
```

---

## 🗄️ Database Schema (Prisma 7)

### 모델 (9개)
```
Profile         │ 사용자 프로필 (Supabase Auth 연동)
Product         │ 상품 (8개 seed됨)
CartItem        │ 장바구니 아이템
WishlistItem    │ 위시리스트 아이템
Order           │ 주문
OrderItem       │ 주문 상품
Subscription    │ 구독 멤버십
DonationOrg     │ 기부 단체
DonationVote    │ 기부 투표
```

### Seed된 상품 (8개)
| 카테고리 | 상품 수 |
|----------|---------|
| 토이 | 1개 |
| 무드 | 2개 |
| 케어 | 3개 |
| 라이프 | 2개 |

---

## 🎨 디자인 시스템

### Color Palette

**Light Mode (Coral/Peach/Mint)**
```css
--background: #FFF8F5    /* 크림 */
--primary: #D4856B       /* 코랄 */
--secondary: #F5D4C0     /* 피치 */
--accent: #A8E0D0        /* 민트 */
```

**Dark Mode (Matrix Neon)**
```css
--background: #0a0a10    /* 매트릭스 블랙 */
--primary: #00FF88       /* 네온 그린 */
--neon-cyan: #00FFFF     /* 시안 */
--neon-pink: #FF3399     /* 핫핑크 */
```

### Typography
- **Font**: Noto Sans KR (next/font 최적화)
- **Weights**: 300, 400, 500, 700

### UI 특징
- `border-radius: 1rem+` (둥근 UI)
- 파스텔 + 네온 대비
- 애니메이션 효과 (hover, transition)

### CSS Architecture (Tailwind 4)

**⚠️ 주요 변경사항 (2025-11-29)**

Tailwind 4에서 `@layer utilities` 및 `@layer base` 내 `@apply` 사용 제한으로 인해 직접 CSS로 변환:

```css
/* Before (에러 발생) - @layer utilities */
.cute-card {
  @apply rounded-3xl bg-card border-2 border-primary/20;
}

/* After (수정됨) */
.cute-card {
  border-radius: 1.5rem;
  background-color: var(--card);
  border: 2px solid color-mix(in srgb, var(--primary) 20%, transparent);
}
```

```css
/* Before (에러 발생) - @layer base */
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground antialiased; }
}

/* After (수정됨) */
@layer base {
  * {
    border-color: var(--border);
    outline-color: color-mix(in srgb, var(--ring) 50%, transparent);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

**영향받은 영역**:
- `@layer utilities`: `.cute-card`, `.cute-button`, `.cute-input`, `.cute-badge`, `.tbr-card`, `.tbr-button`, `.dark .neon-card`
- `@layer base`: `*` 선택자 (border, outline), `body` (background, color, antialiased)

**Micro-interactions 추가**:
```css
@keyframes rubber-band { ... }   /* 탄성 효과 */
@keyframes heart-beat { ... }    /* 심장박동 */
@keyframes jello { ... }         /* 젤리 흔들림 */
@keyframes pop-in { ... }        /* 팝업 등장 */
```

**Background Patterns**:
- `.particles-bg`: 파티클 애니메이션
- `.dots-pattern`: 도트 패턴
- `.grid-pattern`: 그리드 패턴
- `.blob-bg`: 유동적 블롭

---

## 🚀 다음 단계

### Phase 2: Payment 연동 ⏳
1. TossPayments SDK 설치
2. 테스트 결제 연동
3. 정기결제(빌링키) 구현

### Phase 3: 차별화 기능 ⏳
1. 스마트 사이즈 추천 (pgcrypto 암호화)
2. 기부 투표 시스템 (Supabase Realtime)
3. 구독 멤버십 백엔드 연동

---

## 📈 Git Commit History

```
03fc180 feat: Add product seed script with Prisma 7 adapter
1c6fa36 fix: Add prisma generate to build script for Vercel deployment
2638289 feat: Add Supabase backend integration with Prisma 7
0b82d07 feat: Implement 5 parallel e-commerce modules
d525566 feat: Add e-commerce core features (cart, toast, product detail)
854bc69 refactor: Optimize frontend with next/font, lucide-react
3ffb32e style: Update light mode palette to coral/peach/mint
d34e9d2 feat: Add Matrix neon dark mode with theme toggle
```

---

**작성자**: Claude Code
**마지막 업데이트**: 2025-11-29
**문서 버전**: v3.2 (CSS @layer base Fix)
