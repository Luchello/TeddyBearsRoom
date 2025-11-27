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
