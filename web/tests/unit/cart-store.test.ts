/**
 * Cart Store Unit Tests
 * TeddyBear's Room - Zustand Cart Store Testing
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/stores/cart-store';
import type { Product, ProductVariant } from '@/types/product';
import type { AddToCartInput } from '@/types/cart';

// Mock fetch for coupon API
global.fetch = vi.fn() as Mock;

describe('Cart Store', () => {
  // 각 테스트 전에 store 초기화
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset store state
    useCartStore.setState({ items: [], appliedCoupon: null, isOpen: false });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [{ id: '1', url: '/test.jpg', productId: 'prod-1', displayOrder: 0 }],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        productId: 'prod-1',
        quantity: 1,
        price: 10000,
        name: 'Test Product',
      });
    });

    it('should increase quantity if item already exists', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
        result.current.addItem(input, mockProduct);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should handle variant correctly', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const mockVariant: ProductVariant = {
        id: 'var-1',
        productId: 'prod-1',
        name: 'Blue / Large',
        price: 12000,
        compareAtPrice: null,
        options: { color: 'Blue', size: 'Large' },
        sku: 'TEST-BL-LG',
        stock: 10,
        isAvailable: true,
        displayOrder: 0,
      };

      const input: AddToCartInput = {
        productId: 'prod-1',
        variantId: 'var-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct, mockVariant);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        productId: 'prod-1',
        variantId: 'var-1',
        price: 12000,
        name: 'Test Product - Blue / Large',
      });
    });
  });

  describe('updateItem', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
      });

      const itemId = result.current.items[0].id;

      act(() => {
        result.current.updateItem(itemId, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
      });

      const itemId = result.current.items[0].id;

      act(() => {
        result.current.updateItem(itemId, 0);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
      });

      const itemId = result.current.items[0].id;

      act(() => {
        result.current.removeItem(itemId);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items and coupon', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const input: AddToCartInput = {
        productId: 'prod-1',
        quantity: 1,
      };

      act(() => {
        result.current.addItem(input, mockProduct);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.appliedCoupon).toBeNull();
    });
  });

  describe('getItemCount', () => {
    it('should return total quantity of all items', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct1: Product = {
        id: 'prod-1',
        name: 'Product 1',
        slug: 'product-1',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const mockProduct2: Product = {
        id: 'prod-2',
        name: 'Product 2',
        slug: 'product-2',
        price: 20000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 2 }, mockProduct1);
        result.current.addItem({ productId: 'prod-2', quantity: 3 }, mockProduct2);
      });

      expect(result.current.getItemCount()).toBe(5);
    });
  });

  describe('getSubtotal', () => {
    it('should calculate correct subtotal', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct1: Product = {
        id: 'prod-1',
        name: 'Product 1',
        slug: 'product-1',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      const mockProduct2: Product = {
        id: 'prod-2',
        name: 'Product 2',
        slug: 'product-2',
        price: 20000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 2 }, mockProduct1);
        result.current.addItem({ productId: 'prod-2', quantity: 1 }, mockProduct2);
      });

      // (10000 * 2) + (20000 * 1) = 40000
      expect(result.current.getSubtotal()).toBe(40000);
    });
  });

  describe('getTotals', () => {
    it('should calculate totals for regular user', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 40000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
      });

      const totals = result.current.getTotals(false);

      expect(totals.subtotal).toBe(40000);
      expect(totals.innerCircleDiscount).toBe(0);
      expect(totals.shipping).toBe(3000); // < 50000원이므로 배송비 부과
      expect(totals.total).toBe(43000);
    });

    it('should calculate totals for Inner Circle member', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 20000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
      });

      const totals = result.current.getTotals(true);

      // 10% 할인
      expect(totals.subtotal).toBe(20000);
      expect(totals.innerCircleDiscount).toBe(2000); // 20000 * 0.1
      expect(totals.shipping).toBe(3000); // < 30000원이므로 배송비 부과
      expect(totals.total).toBe(21000); // 20000 - 2000 + 3000
    });

    it('should apply free shipping for regular user above threshold', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 60000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
      });

      const totals = result.current.getTotals(false);

      expect(totals.subtotal).toBe(60000);
      expect(totals.shipping).toBe(0); // >= 50000원이므로 무료배송
      expect(totals.isFreeShipping).toBe(true);
    });

    it('should apply free shipping for Inner Circle above threshold', () => {
      const { result } = renderHook(() => useCartStore);

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 35000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
      });

      const totals = result.current.getTotals(true);

      // 35000 - 3500 (10% discount) = 31500 >= 30000 (Inner Circle threshold)
      expect(totals.subtotal).toBe(35000);
      expect(totals.innerCircleDiscount).toBe(3500);
      expect(totals.shipping).toBe(0);
      expect(totals.isFreeShipping).toBe(true);
    });
  });

  describe('applyCoupon', () => {
    it('should apply coupon successfully', async () => {
      const { result } = renderHook(() => useCartStore);

      const mockCoupon = {
        code: 'SUMMER10',
        discountType: 'PERCENTAGE' as const,
        discountValue: 10,
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCoupon,
      });

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 10000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
      });

      let success = false;
      await act(async () => {
        success = await result.current.applyCoupon('SUMMER10');
      });

      expect(success).toBe(true);
      expect(result.current.appliedCoupon).toEqual(mockCoupon);
    });

    it('should handle coupon validation failure', async () => {
      const { result } = renderHook(() => useCartStore);

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      let success = false;
      await act(async () => {
        success = await result.current.applyCoupon('INVALID');
      });

      expect(success).toBe(false);
      expect(result.current.appliedCoupon).toBeNull();
    });
  });

  describe('removeCoupon', () => {
    it('should remove applied coupon', () => {
      const { result } = renderHook(() => useCartStore);

      // Manually set coupon for testing
      act(() => {
        useCartStore.setState({
          appliedCoupon: {
            code: 'TEST',
            discountType: 'PERCENTAGE',
            discountValue: 10,
          },
        });
      });

      act(() => {
        result.current.removeCoupon();
      });

      expect(result.current.appliedCoupon).toBeNull();
    });
  });

  describe('setIsOpen', () => {
    it('should toggle cart drawer state', () => {
      const { result } = renderHook(() => useCartStore);

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.setIsOpen(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });
});
