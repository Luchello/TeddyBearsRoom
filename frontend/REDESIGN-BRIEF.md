# TeddyBear's Room 프론트엔드 리디자인 — Design Brief

## 레퍼런스 분석 (8개 사이트 심층 분석)

### Tier 1: 직접 경쟁사 (성인 웰니스)
1. **LELO** — 럭셔리 바이브레이터 브랜드
   - 다크 배경 + 골드, Red Dot 수상 강조, ISO 인증 전면 배치
   - 교훈: 프리미엄 = 다크 톤 + 넉넉한 여백 + 수상/인증 배지
   
2. **Dame** — 여성 중심 셀프케어
   - 밝은 톤, 의료진 자문, "Find Your Vibe" 퀴즈
   - 교훈: 퀴즈형 개인화 추천 = 전환율 킬러
   
3. **Maude (getmaude.com)** — 모던 인티머시 에센셜
   - 극도로 미니멀, 뉴트럴 톤(베이지/토프)
   - 영화 콜라보, 캔들/오일 등 라이프스타일 확장
   - 교훈: "성인용품" 아닌 "인티머시 웰니스" 포지셔닝

4. **Unbound** — 펀 & 컬러풀
   - 밝고 대담, 매거진 콘텐츠
   - 교훈: 콘텐츠 마케팅 + 커뮤니티

### Tier 2: 프리미엄 이커머스 (디자인 벤치마크)
5. **Glossier** — 뷰티 D2C 킹
   - 밀레니얼 핑크 → 지금은 더 세련된 톤
   - 제품이 주인공, 여백 많음, 리뷰가 자연스럽게 통합
   - 교훈: 깔끔한 제품 사진 + 사용자 리뷰 = 신뢰

6. **KITH** — 하이엔드 스트리트웨어
   - 풀블리드 이미지, 미니멀 네비, 타이포 중심
   - 교훈: 큰 비주얼 + 적은 텍스트 = 럭셔리 느낌

7. **SSENSE** — 럭셔리 패션 이커머스
   - 초미니멀, 흑백 기반, 극도의 타이포그래피
   - 교훈: 타이포 + 여백 = 고급

8. **Hardgraft** — 럭셔리 레더 굿즈
   - 어두운 톤, 크리스피한 제품 사진, 브랜드 스토리
   - 교훈: 소재 질감이 느껴지는 사진 = 프리미엄

### Shopify 2026 Best Practices
- 50ms 안에 첫인상 결정
- 신뢰 요소: 리뷰, 반품정책, 결제보안
- 모바일 60%+ → 모바일 퍼스트 필수
- 명확한 네비 (Shop, About, Bestsellers)
- 제품 사진이 브랜드 대사

## 디자인 방향

### 포지셔닝 변경
기존 "지뢰계 감성 + Whimsyshire" → **"프리미엄 인티머시 웰니스 부티크"**
- Maude의 미니멀 + LELO의 럭셔리 + Dame의 웰니스 = TeddyBear's Room
- "Soft Outside, Wild Inside" 태그라인 유지 (좋음!)

### 컬러 시스템
**Light Mode (기본):**
- Background: #FAFAF7 (웜 오프화이트)
- Surface: #FFFFFF
- Text Primary: #1A1A2E (딥 네이비블랙)
- Text Secondary: #6B6B7B
- Accent Primary: #C8A2C8 (소프트 라벤더, 지뢰계 에센스 유지)
- Accent Secondary: #E8B4B8 (로즈골드)
- Border: #E8E6E3
- CTA: #2D2D3D (다크 버튼) / hover #E8B4B8 (로즈골드)

**Dark Mode:**
- Background: #0F0F1A (딥 미드나이트)
- Surface: #1A1A2E
- Text: #F0EDE8
- Accent: #D4C5E2 (라이트 라벤더)
- CTA: #E8B4B8

### 타이포그래피
- **Display/H1:** Playfair Display (세리프) — Luchello가 좋아한 것!
- **H2-H4:** Noto Sans KR Bold
- **Body:** Noto Sans KR Regular
- **Price/Number:** DM Sans

### 핵심 디자인 원칙
1. **여백이 럭셔리** — 빽빽하지 않게, Maude/SSENSE급 여백
2. **사진이 왕** — 제품 사진이 가장 크게, 나머지는 서포트
3. **타이포가 브랜드** — Playfair Display 세리프로 프리미엄 느낌
4. **마이크로 인터랙션** — 호버, 스크롤, 전환 모두 부드럽게
5. **신뢰가 전환** — 비밀배송, 안전소재, 리뷰 곳곳에

## 페이지별 리디자인

### 1. 홈페이지 (page.tsx) — 가장 중요!
- **Hero:** 풀스크린 무드 이미지 + Playfair Display 대형 카피 + CTA
- **Trust Bar:** 비밀배송 / 안전인증 / 당일출고 / 무료반품
- **Featured Categories:** 비대칭 벤토 그리드 (큰/작은 교차)
- **Bestsellers:** 가로 스크롤 캐러셀 + 호버 시 Quick Add
- **Brand Story:** 2컬럼 (라이프스타일 이미지 + 텍스트)
- **Social Proof:** 리뷰 + 미디어 로고
- **Subscription CTA:** 구독 혜택 배너
- **Newsletter:** 이메일 가입

### 2. 상품 목록 (products/page.tsx)
- 사이드바 필터 (카테고리, 가격, 정렬)
- 3컬럼 그리드 (모바일 2컬럼)
- ProductCard 리디자인: 여백 + 가격 + Quick Add

### 3. 상품 상세 (products/[id]/page.tsx)
- 2컬럼: 큰 이미지 갤러리 + 정보 패널
- 탭: 상세설명 / 리뷰 / 배송정보
- "함께 구매" 추천

### 4. Header
- 글래스모피즘 스틱 네비
- 로고 + 네비 링크 + 검색 + 장바구니 + 위시리스트 + 계정

### 5. Footer
- 다크 배경
- 4컬럼: 브랜드 / 쇼핑 / 고객지원 / SNS
- 결제수단 아이콘
- 사업자 정보

### 6. Cart/Wishlist Drawer
- 오른쪽 슬라이드 패널
- 깔끔한 아이템 목록 + 수량 조절 + 삭제
- 총액 + 체크아웃 버튼

## 기술 제약
- Next.js 16 + React 19 + TypeScript 유지
- Tailwind CSS v4 유지
- shadcn/ui 컴포넌트 유지 (스타일만 변경)
- Zustand 스토어 유지
- Supabase/Prisma 유지
- API 라우트 유지
- **프론트엔드 UI/스타일만 변경, 로직은 보존**

## 빌드 순서
1. globals.css (디자인 시스템, 컬러, 타이포)
2. Header + Footer (공통)
3. 홈페이지 (page.tsx) — 가장 중요
4. ProductCard + ProductFilter
5. 상품 목록/상세 페이지
6. Cart/Wishlist Drawer
7. 나머지 페이지들
