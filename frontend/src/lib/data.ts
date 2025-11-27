// ====================================
// TeddyBear's Room - Mock Data
// Centralized data for consistency
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

// Navigation
export const navigation: NavItem[] = [
  { name: "홈", href: "/" },
  { name: "상품", href: "/products" },
  { name: "구독", href: "/subscribe" },
  { name: "소개", href: "/about" },
];

// Footer Links
export const footerLinks: FooterLinks = {
  shop: [
    { name: "전체 상품", href: "/products" },
    { name: "신상품", href: "/products?sort=new" },
    { name: "베스트셀러", href: "/products?sort=best" },
  ],
  support: [
    { name: "고객센터", href: "/support" },
    { name: "배송 안내", href: "/shipping" },
    { name: "교환/반품", href: "/returns" },
  ],
  company: [
    { name: "회사 소개", href: "/about" },
    { name: "이용약관", href: "/terms" },
    { name: "개인정보처리방침", href: "/privacy" },
  ],
};

// Featured Products (Home)
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

// All Products
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

// Product Categories
export const productCategories = ["전체", "토이", "케어", "무드", "라이프"] as const;

// Subscription Benefits (Home)
export const subscriptionBenefits: Benefit[] = [
  { icon: "🎁", title: "포인트 2배 적립", desc: "모든 구매에 포인트 2배" },
  { icon: "💝", title: "기부 참여", desc: "매출의 5% 기부 투표 참여" },
  { icon: "🚚", title: "무료 배송", desc: "5만원 이상 무료 배송" },
  { icon: "🎀", title: "회원 전용 할인", desc: "매월 특별 할인 쿠폰" },
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "엔트리",
    icon: "🐻",
    price: 19900,
    period: "월",
    description: "TeddyBear's Room을 시작하는 분들을 위한 플랜",
    features: [
      { text: "포인트 2배 적립", included: true },
      { text: "기부 투표 참여 (5%)", included: true },
      { text: "5만원 이상 무료 배송", included: true },
      { text: "매월 5% 할인 쿠폰", included: true },
      { text: "신상품 얼리 액세스", included: false },
      { text: "전용 고객 상담", included: false },
    ],
    popular: false,
    cta: "엔트리 시작하기",
  },
  {
    name: "프리미엄",
    icon: "👑",
    price: 29900,
    period: "월",
    description: "혜택은 2배! 가격은 혜택의 절반만!",
    features: [
      { text: "포인트 4배 적립", included: true },
      { text: "기부 투표 참여 (10%)", included: true },
      { text: "전 상품 무료 배송", included: true },
      { text: "매월 10% 할인 쿠폰", included: true },
      { text: "신상품 얼리 액세스", included: true },
      { text: "전용 고객 상담", included: true },
    ],
    popular: true,
    cta: "프리미엄 시작하기",
  },
];

// FAQs
export const subscriptionFAQs: FAQ[] = [
  {
    q: "구독은 언제든지 취소할 수 있나요?",
    a: "네, 언제든지 취소 가능합니다. 취소 시 다음 결제일부터 자동 해지되며, 이미 결제된 기간의 혜택은 유지됩니다.",
  },
  {
    q: "기부 투표는 어떻게 진행되나요?",
    a: "매월 초 3개의 기부 단체가 선정되며, 구독자들의 투표로 최종 기부처가 결정됩니다. 투표 결과는 매월 말 공개됩니다.",
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

// Brand Values (About)
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
      "매출의 일부를 사회에 환원합니다. 구독자가 직접 기부처를 선택하는 참여형 기부 시스템을 운영해요.",
  },
  {
    icon: "✨",
    title: "큐레이션",
    description:
      "엄격한 기준으로 선별된 고품질 상품만을 제공합니다. 안전하고 신뢰할 수 있는 제품만 만나보세요.",
  },
];

// Timeline (About)
export const brandTimeline: TimelineItem[] = [
  { year: "2024", event: "TeddyBear's Room 브랜드 기획 시작" },
  { year: "2025", event: "온라인 쇼핑몰 런칭 예정" },
  { year: "2025", event: "엔트리 & 프리미엄 멤버십 오픈" },
  { year: "미래", event: "오프라인 경험 공간 오픈 예정" },
];
