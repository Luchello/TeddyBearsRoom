/**
 * User Types for TeddyBear's Room
 */

export interface User {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  isAdultVerified: boolean;
  adultVerifiedAt: Date | null;
  marketingConsent: boolean;
  marketingConsentAt: Date | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  addresses?: Address[];
  subscription?: Subscription | null;
  measurements?: UserMeasurement | null;
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";

export interface Address {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string;
  phone: string;
  zipCode: string;
  address1: string;
  address2: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt: Date | null;
  cancelReason: string | null;
  billingKeyId: string | null;
  createdAt: Date;
  updatedAt: Date;
  plan?: SubscriptionPlan;
}

export type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "PAUSED"
  | "TRIAL";

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  billingInterval: BillingInterval;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BillingInterval = "MONTHLY" | "YEARLY";

export interface UserMeasurement {
  id: string;
  userId: string;
  // Encrypted fields (only decrypted client-side)
  length: string | null;
  girth: string | null;
  measuredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Decrypted measurement data
export interface DecryptedMeasurement {
  length: number | null;
  girth: number | null;
  measuredAt: Date | null;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isAdultVerified: boolean;
  role: UserRole;
}

export interface Session {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Profile Update Types
export interface UpdateProfileInput {
  name?: string;
  nickname?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  avatarUrl?: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Address Types
export interface CreateAddressInput {
  label?: string;
  recipientName: string;
  phone: string;
  zipCode: string;
  address1: string;
  address2?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

// PASS 본인인증 Types
export interface PassVerificationRequest {
  returnUrl: string;
  errorUrl: string;
}

export interface PassVerificationResult {
  success: boolean;
  ci: string; // 연계정보 (CI)
  di: string; // 중복가입확인정보 (DI)
  name: string;
  phone: string;
  birthDate: string;
  gender: "M" | "F";
}

// Inner Circle (Subscription) Types
export interface InnerCircleMember {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  subscription: Subscription | null;
  benefits: InnerCircleBenefits;
}

export interface InnerCircleBenefits {
  discountRate: number; // 10%
  freeShippingThreshold: number; // 3만원
  donationRate: number; // 1%
  exclusiveAccess: boolean;
}

export const DEFAULT_INNER_CIRCLE_BENEFITS: InnerCircleBenefits = {
  discountRate: 0.1,
  freeShippingThreshold: 30000,
  donationRate: 0.01,
  exclusiveAccess: true,
};
