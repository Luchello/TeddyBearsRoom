"use client";

// ====================================
// TeddyBear's Room - Checkout Store
// Zustand store for checkout (Skeleton)
// TossPayments integration will be added later
// ====================================

import { create } from "zustand";
import type { Order, OrderItem, OrderStatus, CheckoutState } from "@/lib/types";
import type { CartItem } from "@/lib/types";

interface CheckoutStore extends CheckoutState {
  // Shipping info
  shippingAddress: string;
  shippingMemo: string;
  // Payment
  paymentMethod: "card" | "bank" | "virtual" | null;
  // Actions
  setShippingAddress: (address: string) => void;
  setShippingMemo: (memo: string) => void;
  setPaymentMethod: (method: "card" | "bank" | "virtual") => void;
  createOrder: (cartItems: CartItem[]) => Order;
  processPayment: () => Promise<boolean>;
  completeOrder: () => void;
  cancelOrder: () => void;
  clearCheckout: () => void;
}

const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TBR-${timestamp}-${random}`.toUpperCase();
};

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // State
  currentOrder: null,
  isProcessing: false,
  shippingAddress: "",
  shippingMemo: "",
  paymentMethod: null,

  // Setters
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setShippingMemo: (memo) => set({ shippingMemo: memo }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  // Create order from cart items
  createOrder: (cartItems) => {
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price * item.quantity,
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

    const order: Order = {
      id: generateOrderId(),
      items: orderItems,
      totalPrice,
      status: "pending",
      shippingAddress: get().shippingAddress,
      createdAt: new Date().toISOString(),
    };

    set({ currentOrder: order });
    return order;
  },

  // Process payment (Skeleton - will connect to TossPayments)
  processPayment: async () => {
    const order = get().currentOrder;
    const paymentMethod = get().paymentMethod;

    if (!order || !paymentMethod) {
      return false;
    }

    set({ isProcessing: true });

    // TODO: Replace with TossPayments SDK integration
    // Simulating payment API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success (replace with actual payment)
    const success = true;

    if (success) {
      set({
        currentOrder: { ...order, status: "paid" as OrderStatus },
        isProcessing: false,
      });
    } else {
      set({ isProcessing: false });
    }

    return success;
  },

  // Complete order
  completeOrder: () => {
    const order = get().currentOrder;
    if (order) {
      set({
        currentOrder: { ...order, status: "shipped" as OrderStatus },
      });
    }
  },

  // Cancel order
  cancelOrder: () => {
    const order = get().currentOrder;
    if (order) {
      set({
        currentOrder: { ...order, status: "cancelled" as OrderStatus },
      });
    }
  },

  // Clear checkout state
  clearCheckout: () => {
    set({
      currentOrder: null,
      isProcessing: false,
      shippingAddress: "",
      shippingMemo: "",
      paymentMethod: null,
    });
  },
}));
