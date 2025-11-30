// ====================================
// TeddyBear's Room - Mock Data & Constants
// 정적 데이터 및 상수 중앙 관리
// ====================================
//
// 🎯 용도:
// 1. 네비게이션/푸터 링크 (정적)
// 2. 상품 Mock 데이터 (개발용, 추후 API로 대체)
// 3. 구독 플랜 정보 (MVP Single Tier)
// 4. FAQ, 브랜드 정보 (마케팅 콘텐츠)
//
// 📝 MVP 전략 (2025-11-30):
// - 2-Tier → Single Tier 전환
// - TBR 멤버십: 19,900원/월
// - 포인트 5%, 기부 5%, 무료배송 5만원↑
//
// ⚠️ 주의:
// - featuredProducts/allProducts는 개발용 Mock
// - 프로덕션에서는 Supabase API 사용
// ====================================

import type {
  NavItem,
  FooterLinks,
  Product,
  SubscriptionPlan,
  FAQ,
  Benefit,
  BrandValue,
  TimelineItem,
} from "./types";

// ──────────────────────────────────────
// Navigation (네비게이션)
// Header, MobileMenu에서 사용
// ──────────────────────────────────────

/** 메인 네비게이션 메뉴 */
export const navigation: NavItem[] = [
  { name: "홈", href: "/" },
  { name: "상품", href: "/products" },
  { name: "구독", href: "/subscribe" },
  { name: "기부", href: "/donation" },
  { name: "소개", href: "/about" },
];

// ──────────────────────────────────────
// Footer Links (푸터)
// Footer 컴포넌트에서 사용
// ──────────────────────────────────────

/** 푸터 링크 그룹 */
export const footerLinks: FooterLinks = {
  // 쇼핑 관련 링크
  shop: [
    { name: "전체 상품", href: "/products" },
    { name: "신상품", href: "/products?sort=new" },
    { name: "베스트셀러", href: "/products?sort=best" },
  ],
  // 고객 지원 링크
  support: [
    { name: "고객센터", href: "/support" },
    { name: "배송 안내", href: "/shipping" },
    { name: "교환/반품", href: "/returns" },
  ],
  // 회사 정보 링크
  company: [
    { name: "회사 소개", href: "/about" },
    { name: "기부 현황", href: "/donation" },
    { name: "이용약관", href: "/terms" },
    { name: "개인정보처리방침", href: "/privacy" },
  ],
};

// ──────────────────────────────────────
// Products (상품 Mock 데이터)
// ⚠️ 개발용 - 프로덕션에서는 API 사용
// ──────────────────────────────────────

/** 추천 상품 (홈페이지 섹션용) */
export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "파스텔 드림 컬렉션 - 소프트 터치",
    price: 39000,
    originalPrice: 49000,
    imageUrl: "/placeholder.jpg",
    category: "토이",
    isNew: true,
    isBest: true,
  },
  {
    id: "2",
    name: "코지 나이트 아로마 캔들 세트",
    price: 28000,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isNew: true,
  },
  {
    id: "3",
    name: "실크 터치 마사지 오일",
    price: 32000,
    originalPrice: 38000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
    isBest: true,
  },
  {
    id: "4",
    name: "베어 허그 쿠션 세트",
    price: 45000,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
  },
];

/** 전체 상품 목록 (개발용 Mock) */
export const allProducts: Product[] = [
  ...featuredProducts,
  {
    id: "5",
    name: "스윗 드림 슬립 마스크",
    price: 18000,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
    isNew: true,
  },
  {
    id: "6",
    name: "버블 베어 바스 솔트",
    price: 22000,
    originalPrice: 28000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
  },
  {
    id: "7",
    name: "로맨틱 무드등 세트",
    price: 35000,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isBest: true,
  },
  {
    id: "8",
    name: "허니 베어 립밤 세트",
    price: 15000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
  },
];

// ──────────────────────────────────────
// Product Categories (상품 카테고리)
// 필터링 UI에서 사용하는 카테고리 목록
// as const로 타입 안전성 보장
// ──────────────────────────────────────

/** 상품 카테고리 (타입: readonly tuple) */
export const productCategories = ["전체", "토이", "케어", "무드", "라이프"] as const;

// ──────────────────────────────────────
// Subscription Benefits (구독 혜택)
// 홈페이지 멤버십 섹션에서 표시
// ──────────────────────────────────────

/** 멤버십 혜택 카드 목록 (홈페이지용) */
export const subscriptionBenefits: Benefit[] = [
  { icon: "🎁", title: "포인트 5% 적립", desc: "모든 구매에 포인트 5% 적립" },
  { icon: "💝", title: "기부 참여", desc: "구매금액 일부가 기부됩니다" },
  { icon: "🚚", title: "무료 배송", desc: "5만원 이상 무료 배송" },
  { icon: "🎀", title: "회원 전용 할인", desc: "매월 특별 할인 쿠폰" },
];

// ──────────────────────────────────────
// Subscription Plans (구독 플랜)
// MVP: Single Tier 전략 (2025-11-30)
// ──────────────────────────────────────
//
// 📝 MVP 전략 변경 이력:
// - 이전: 2-Tier (스탠다드 19,900원 + 프리미엄 29,900원)
// - 현재: Single Tier (TBR 멤버십 19,900원)
//
// 🎯 변경 사유:
// - 선택의 역설 해결 → 고객 결정 단순화
// - YAGNI 원칙 → 필요한 것만 구현
// - 핵심 가치 검증 → MVP에서 빠른 피드백
//
// 💰 혜택 구조:
// - 포인트 적립: 비회원 0% → 멤버십 5%
// - 기부 비율: 멤버십 회원 5%
// - 무료 배송: 비회원 7만원↑ → 멤버십 5만원↑
//
// ──────────────────────────────────────

/**
 * 구독 플랜 목록
 * @description MVP에서는 단일 플랜만 제공 (향후 Premium 확장 검토)
 * @see types.ts - SubscriptionPlan 인터페이스
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "TBR 멤버십",
    icon: "🐻",
    price: 19900,
    period: "월",
    description: "TeddyBear's Room의 모든 혜택을 누려보세요",
    features: [
      { text: "포인트 5% 적립", included: true },
      { text: "구매금액 5% 기부", included: true },
      { text: "5만원 이상 무료 배송", included: true },
      { text: "매월 5% 할인 쿠폰", included: true },
      { text: "신상품 얼리 액세스", included: true },
      { text: "생일 특별 혜택", included: true },
    ],
    popular: true,
    cta: "멤버십 시작하기",
  },
];

// ──────────────────────────────────────
// FAQs (자주 묻는 질문)
// 구독 페이지 하단에서 사용
// 아코디언 UI로 표시
// ──────────────────────────────────────

/** 구독 관련 FAQ 목록 */
export const subscriptionFAQs: FAQ[] = [
  {
    q: "구독은 언제든지 취소할 수 있나요?",
    a: "네, 언제든지 취소 가능합니다. 취소 시 다음 결제일부터 자동 해지되며, 이미 결제된 기간의 혜택은 유지됩니다.",
  },
  {
    q: "기부는 어떻게 진행되나요?",
    a: "구독 회원의 구매금액 일부(스탠다드 5%, 프리미엄 10%)가 분기별로 선정된 기부 단체에 전달됩니다. 기부 내역은 '기부' 페이지에서 투명하게 공개됩니다.",
  },
  {
    q: "포인트는 어떻게 사용하나요?",
    a: "적립된 포인트는 1포인트 = 1원으로 모든 상품 구매 시 사용 가능합니다. 유효기간은 적립일로부터 1년입니다.",
  },
  {
    q: "배송은 어떻게 되나요?",
    a: "모든 배송은 무지 박스로 진행되어 프라이버시를 보장합니다. 주문 후 1-2일 내 출고됩니다.",
  },
];

// ──────────────────────────────────────
// Brand Values (브랜드 가치)
// About 페이지에서 브랜드 핵심 가치 표시
// 4개의 핵심 가치: 감성, 프라이버시, 사회공헌, 큐레이션
// ──────────────────────────────────────

/** 브랜드 핵심 가치 목록 (About 페이지용) */
export const brandValues: BrandValue[] = [
  {
    icon: "🧸",
    title: "파스텔 감성",
    description:
      "부드럽고 아늑한 분위기로 특별한 경험을 선사합니다. 귀여움과 고급스러움을 동시에 담았어요.",
  },
  {
    icon: "🔒",
    title: "프라이버시 우선",
    description:
      "무지 박스 배송, 안전한 결제, 철저한 개인정보 보호. 고객의 프라이버시를 최우선으로 생각합니다.",
  },
  {
    icon: "💝",
    title: "함께하는 가치",
    description:
      "매출의 일부를 사회에 환원합니다. 구독 회원의 구매금액 일부가 기부로 이어지며, 모든 내역을 투명하게 공개해요.",
  },
  {
    icon: "✨",
    title: "큐레이션",
    description:
      "엄격한 기준으로 선별된 고품질 상품만을 제공합니다. 안전하고 신뢰할 수 있는 제품만 만나보세요.",
  },
];

// ──────────────────────────────────────
// Timeline (브랜드 타임라인)
// About 페이지에서 브랜드 히스토리 표시
// 과거 → 현재 → 미래 순서
// ──────────────────────────────────────

/** 브랜드 타임라인 (About 페이지용) */
export const brandTimeline: TimelineItem[] = [
  { year: "2024", event: "TeddyBear's Room 브랜드 기획 시작" },
  { year: "2025", event: "온라인 쇼핑몰 런칭 예정" },
  { year: "2025", event: "스탠다드 & 프리미엄 멤버십 오픈" },
  { year: "미래", event: "오프라인 경험 공간 오픈 예정" },
];
