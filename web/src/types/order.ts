/**
 * Order Types for TeddyBear's Room
 */

import type { Address } from "./user";
import type { CartItem } from "./cart";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  // Pricing
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;

  // Shipping
  shippingAddressId: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;

  // Payment
  paymentMethod: string | null;
  paymentId: string | null;
  paidAt: Date | null;

  // Coupon
  couponId: string | null;
  couponCode: string | null;
  couponDiscount: number;

  // Inner Circle
  isInnerCircleOrder: boolean;
  innerCircleDiscount: number;

  // Notes
  customerNote: string | null;
  adminNote: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  cancelReason: string | null;

  // Relations
  items?: OrderItem[];
  shippingAddress?: Address | null;
  payment?: Payment | null;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type FulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "RETURNED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  imageUrl: string | null;
  options: OrderItemOption[];
  createdAt: Date;
}

export interface OrderItemOption {
  name: string;
  value: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId: string | null;
  receiptUrl: string | null;
  failReason: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentProvider = "TOSS_PAYMENTS" | "KAKAO_PAY" | "NAVER_PAY";

export type PaymentMethod =
  | "CARD"
  | "VIRTUAL_ACCOUNT"
  | "TRANSFER"
  | "MOBILE"
  | "EASY_PAY";

// Checkout Types
export interface CheckoutInput {
  items: CartItem[];
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNote?: string;
  useInnerCircleDiscount: boolean;
}

export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentKey: string;
  customerKey: string;
  successUrl: string;
  failUrl: string;
}

// TossPayments Types
export interface TossPaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerEmail: string;
  customerName: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
}

export interface TossPaymentConfirm {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  method: string;
  totalAmount: number;
  approvedAt: string;
  receipt: {
    url: string;
  };
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
  };
  virtualAccount?: {
    bank: string;
    accountNumber: string;
    dueDate: string;
  };
}

// Order List Types
export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

// Order Summary for Display
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  firstItemName: string;
  firstItemImage: string | null;
  createdAt: Date;
}

// Refund Types
export interface RefundRequest {
  orderId: string;
  reason: string;
  amount?: number; // Partial refund amount
  items?: string[]; // Item IDs for partial refund
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  refundAmount: number;
  refundedAt: Date;
}
