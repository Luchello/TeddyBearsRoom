// ====================================
// TeddyBear's Room - Type Definitions
// 프로젝트 전역 타입 정의 (Single Source of Truth)
// ====================================
//
// 🎯 설계 원칙:
// 1. 모든 타입은 이 파일에서 중앙 관리
// 2. 컴포넌트/store에서 import하여 사용
// 3. Skeleton 타입: 추후 Supabase/Prisma 타입으로 대체 예정
//
// 📁 타입 카테고리:
// - Navigation: 네비게이션 관련
// - Products: 상품 관련
// - Subscription: 구독 멤버십 (MVP Single Tier)
// - Cart/Wishlist: 장바구니/위시리스트
// - Auth: 인증 (Supabase Auth 연동)
// - Checkout/Order: 결제/주문 (TossPayments 연동 예정)
// - Filter: 상품 필터링
// - Size: 사이즈 추천 시스템 (pgcrypto 암호화)
// ====================================

// ──────────────────────────────────────
// Navigation (네비게이션)
// ──────────────────────────────────────

/** 네비게이션 메뉴 아이템 */
export interface NavItem {
  name: string;  // 표시 텍스트
  href: string;  // 링크 URL
}

// ──────────────────────────────────────
// Footer (푸터)
// ──────────────────────────────────────

/** 푸터 링크 아이템 */
export interface FooterLink {
  name: string;  // 표시 텍스트
  href: string;  // 링크 URL
}

/** 푸터 링크 그룹 (카테고리별 분류) */
export interface FooterLinks {
  shop: FooterLink[];     // 쇼핑 관련 링크
  support: FooterLink[];  // 고객 지원 링크
  company: FooterLink[];  // 회사 정보 링크
}

// ──────────────────────────────────────
// Products (상품)
// ──────────────────────────────────────

/**
 * 상품 정보 인터페이스
 * @description Prisma Product 모델과 동기화 필요 (prisma/schema.prisma)
 */
export interface Product {
  id: string;             // 고유 ID (UUID)
  name: string;           // 상품명
  price: number;          // 판매가 (원)
  originalPrice?: number; // 정가 (할인 전 가격, 없으면 할인 없음)
  imageUrl: string;       // 대표 이미지 URL
  category: string;       // 카테고리 (토이/케어/무드/라이프)
  isNew?: boolean;        // 신상품 여부 (NEW 뱃지 표시)
  isBest?: boolean;       // 베스트셀러 여부 (BEST 뱃지 표시)
}

// ──────────────────────────────────────
// Subscription (구독 멤버십)
// MVP: Single Tier (19,900원/월)
// ──────────────────────────────────────

/** 구독 혜택 아이템 */
export interface SubscriptionFeature {
  text: string;       // 혜택 설명 텍스트
  included: boolean;  // 포함 여부 (true: ✓, false: –)
}

/**
 * 구독 플랜 정보
 * @description MVP에서는 단일 티어만 사용 (TBR 멤버십 19,900원)
 * 향후 Premium 티어 추가 검토 예정
 */
export interface SubscriptionPlan {
  name: string;                   // 플랜 이름 (예: "TBR 멤버십")
  icon: string;                   // 아이콘 이모지 (예: "🐻")
  price: number;                  // 월 구독료 (원)
  period: string;                 // 결제 주기 (예: "월")
  description: string;            // 플랜 설명
  features: SubscriptionFeature[];// 혜택 목록
  popular: boolean;               // 인기 플랜 뱃지 표시 여부
  cta: string;                    // CTA 버튼 텍스트
}

// ──────────────────────────────────────
// Content Types (콘텐츠)
// ──────────────────────────────────────

/** FAQ (자주 묻는 질문) 아이템 */
export interface FAQ {
  q: string;  // 질문 (Question)
  a: string;  // 답변 (Answer)
}

/** 혜택 카드 (홈페이지 섹션용) */
export interface Benefit {
  icon: string;   // 아이콘 이모지
  title: string;  // 혜택 제목
  desc: string;   // 혜택 설명
}

/** 브랜드 가치 (About 페이지용) */
export interface BrandValue {
  icon: string;        // 아이콘 이모지
  title: string;       // 가치 제목
  description: string; // 상세 설명
}

/** 브랜드 타임라인 (About 페이지용) */
export interface TimelineItem {
  year: string;   // 연도 (예: "2025", "미래")
  event: string;  // 이벤트 설명
}

// ──────────────────────────────────────
// Cart & Wishlist (장바구니 & 위시리스트)
// Zustand store에서 사용 (localStorage persist)
// ──────────────────────────────────────

/** 장바구니 아이템 */
export interface CartItem {
  product: Product;  // 상품 정보
  quantity: number;  // 수량 (1 이상)
}

/** 위시리스트 아이템 */
export interface WishlistItem {
  product: Product;  // 상품 정보
  addedAt: number;   // 추가 시각 (Unix timestamp, 정렬용)
}

// ──────────────────────────────────────
// Toast (알림 토스트)
// ToastContext에서 사용
// ──────────────────────────────────────

/** 토스트 타입 (스타일 결정) */
export type ToastType = "success" | "error" | "info" | "warning";

/** 토스트 알림 메시지 */
export interface Toast {
  id: string;        // 고유 ID (UUID, 제거 시 사용)
  message: string;   // 표시 메시지
  type: ToastType;   // 타입 (색상/아이콘 결정)
}

// ──────────────────────────────────────
// Auth (인증)
// Supabase Auth + Zustand authStore 연동
// ──────────────────────────────────────

/**
 * 사용자 정보
 * @description Supabase User 메타데이터와 매핑됨
 * subscriptionTier: MVP에서는 "none" | "standard"만 사용
 */
export interface User {
  id: string;                                    // Supabase Auth UUID
  email: string;                                 // 이메일 (로그인 ID)
  name: string;                                  // 표시 이름
  avatar?: string;                               // 프로필 이미지 URL
  subscriptionTier: "none" | "standard" | "premium"; // 구독 티어
  points: number;                                // 보유 포인트
  createdAt: string;                             // 가입일 (ISO 8601)
}

/** 인증 상태 (authStore에서 관리) */
export interface AuthState {
  user: User | null;       // 현재 로그인 사용자 (null이면 비로그인)
  isAuthenticated: boolean; // 인증 여부
  isLoading: boolean;       // 로딩 중 여부 (초기화/로그인 시)
}

// ──────────────────────────────────────
// Checkout & Order (결제 & 주문)
// TossPayments 연동 예정 (Skeleton)
// ──────────────────────────────────────

/**
 * 주문 상태
 * @description TossPayments 결제 상태와 매핑
 * pending → paid → shipped → delivered
 *       ↘ cancelled (취소 가능)
 */
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

/** 주문 아이템 (주문 당시 가격 스냅샷) */
export interface OrderItem {
  product: Product;  // 상품 정보
  quantity: number;  // 주문 수량
  price: number;     // 주문 당시 가격 (가격 변동 대비)
}

/**
 * 주문 정보
 * @description Prisma Order 모델과 동기화 필요
 */
export interface Order {
  id: string;               // 주문 ID (UUID)
  items: OrderItem[];       // 주문 아이템 목록
  totalPrice: number;       // 총 결제 금액
  status: OrderStatus;      // 주문 상태
  shippingAddress?: string; // 배송 주소 (암호화 저장 고려)
  createdAt: string;        // 주문 생성일 (ISO 8601)
}

/** 결제 상태 (checkoutStore에서 관리) */
export interface CheckoutState {
  currentOrder: Order | null; // 현재 진행 중인 주문
  isProcessing: boolean;      // 결제 처리 중 여부
}

// ──────────────────────────────────────
// Filter (상품 필터링)
// useProductFilter 훅에서 사용
// ──────────────────────────────────────

/** 정렬 옵션 (URL query param과 매핑) */
export type SortOption = "latest" | "popular" | "price-low" | "price-high";

/** 필터 상태 (URL searchParams로 관리) */
export interface FilterState {
  category: string;    // 카테고리 필터 ("전체" 포함)
  sort: SortOption;    // 정렬 기준
  showNew: boolean;    // 신상품만 표시
  showBest: boolean;   // 베스트셀러만 표시
}

// ──────────────────────────────────────
// Size Measurements (사이즈 추천)
// 스마트 사이즈 추천 시스템용
// pgcrypto (AES-GCM) 암호화 적용
// ──────────────────────────────────────

/** 성별 타입 */
export type Gender = "MALE" | "FEMALE" | "OTHER";

/**
 * 사이즈 측정 정보 (기본 정보)
 * @description 비민감 정보 - 암호화 없이 저장 가능
 */
export interface SizeMeasurements {
  height?: number;     // 키 (cm, 100~250 범위)
  weight?: number;     // 체중 (kg, 30~200 범위)
  gender?: Gender;     // 성별
  topSize?: string;    // 상의 사이즈 (S/M/L/XL 또는 90/95/100/105)
  bottomSize?: string; // 하의 사이즈 (인치 28/30/32... 또는 S/M/L/XL)
  shoeSize?: number;   // 신발 사이즈 (mm, 230~290)
}

/**
 * 사용자 프로필 (사이즈 정보 포함)
 * @description 민감한 측정 정보는 encryptedMeasurements에 AES-GCM 암호화 저장
 * @see lib/encryption.ts - encryptMeasurements/decryptMeasurements
 */
export interface UserProfile extends User {
  measurements?: SizeMeasurements;    // 기본 사이즈 정보
  encryptedMeasurements?: string;     // 민감 정보 (AES-GCM 암호화, base64)
}
