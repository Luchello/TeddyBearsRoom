// ====================================
// TeddyBear's Room - Type Definitions
// Centralized types for type safety
// ====================================

// Navigation
export interface NavItem {
  name: string;
  href: string;
}

// Footer Links
export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinks {
  shop: FooterLink[];
  support: FooterLink[];
  company: FooterLink[];
}

// Products
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isBest?: boolean;
}

// Subscription
export interface SubscriptionFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlan {
  name: string;
  icon: string;
  price: number;
  period: string;
  description: string;
  features: SubscriptionFeature[];
  popular: boolean;
  cta: string;
}

// FAQ
export interface FAQ {
  q: string;
  a: string;
}

// Benefits
export interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

// Brand Values
export interface BrandValue {
  icon: string;
  title: string;
  description: string;
}

// Timeline
export interface TimelineItem {
  year: string;
  event: string;
}

// Cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Toast
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Wishlist
export interface WishlistItem {
  product: Product;
  addedAt: number; // timestamp
}

// Auth (Skeleton)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: "none" | "standard" | "premium";
  points: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Checkout (Skeleton)
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
}

export interface CheckoutState {
  currentOrder: Order | null;
  isProcessing: boolean;
}

// Filter
export type SortOption = "latest" | "popular" | "price-low" | "price-high";

export interface FilterState {
  category: string;
  sort: SortOption;
  showNew: boolean;
  showBest: boolean;
}

// Size Measurements
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface SizeMeasurements {
  height?: number;     // cm
  weight?: number;     // kg
  gender?: Gender;
  topSize?: string;    // S/M/L/XL or 90/95/100/105
  bottomSize?: string; // inches (28/30/32...) or S/M/L/XL
  shoeSize?: number;   // mm (250/260/270...)
}

export interface UserProfile extends User {
  measurements?: SizeMeasurements;
  encryptedMeasurements?: string; // AES encrypted sensitive data
}
