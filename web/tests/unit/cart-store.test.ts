/**
 * Cart Store Unit Tests
 * TeddyBear's Room - Zustand Cart Store Testing
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/stores/cart-store';
import type { Product, ProductVariant } from '@/types/product';
import type { AddToCartInput } from '@/types/cart';
import { SHIPPING_FEE } from '@/config/cart';

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      expect(totals.shipping).toBe(SHIPPING_FEE);
      expect(totals.total).toBe(40000 + SHIPPING_FEE);
    });

    it('should calculate totals for Inner Circle member', () => {
      const { result } = renderHook(() => useCartStore());

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
      expect(totals.shipping).toBe(SHIPPING_FEE);
      expect(totals.total).toBe(20000 - 2000 + SHIPPING_FEE);
    });

    it('should apply free shipping for regular user above threshold', () => {
      const { result } = renderHook(() => useCartStore());

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
      expect(totals.shipping).toBe(0); // >= FREE_SHIPPING_THRESHOLD
      expect(totals.isFreeShipping).toBe(true);
    });

    it('should apply free shipping for Inner Circle above threshold', () => {
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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
      const { result } = renderHook(() => useCartStore());

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

  describe('addSimpleItem', () => {
    it('should add a simple item to cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addSimpleItem({
          productId: 'prod-1',
          quantity: 2,
          name: 'Simple Product',
          price: 15000,
          imageUrl: '/simple.jpg',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        productId: 'prod-1',
        quantity: 2,
        price: 15000,
        name: 'Simple Product',
      });
    });

    it('should add simple item with variant', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addSimpleItem({
          productId: 'prod-1',
          variantId: 'var-1',
          quantity: 1,
          name: 'Product',
          variantName: 'Red / Medium',
          price: 20000,
          imageUrl: '/product.jpg',
        });
      });

      expect(result.current.items[0].name).toBe('Product - Red / Medium');
      expect(result.current.items[0].variantId).toBe('var-1');
    });

    it('should increase quantity for existing simple item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addSimpleItem({
          productId: 'prod-1',
          quantity: 1,
          name: 'Product',
          price: 10000,
          imageUrl: '/img.jpg',
        });
        result.current.addSimpleItem({
          productId: 'prod-1',
          quantity: 3,
          name: 'Product',
          price: 10000,
          imageUrl: '/img.jpg',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(4);
    });
  });

  describe('Ambassador Free Shipping', () => {
    it('should check ambassador free shipping availability', async () => {
      const { result } = renderHook(() => useCartStore());

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          available: true,
          nextAvailableAt: null,
        }),
      });

      await act(async () => {
        await result.current.checkAmbassadorFreeShipping('profile-123');
      });

      expect(result.current.ambassadorShipping.available).toBe(true);
      expect(result.current.ambassadorShipping.isLoading).toBe(false);
    });

    it('should handle ambassador check failure', async () => {
      const { result } = renderHook(() => useCartStore());

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      await act(async () => {
        await result.current.checkAmbassadorFreeShipping('profile-123');
      });

      expect(result.current.ambassadorShipping.available).toBe(false);
      expect(result.current.ambassadorShipping.isLoading).toBe(false);
    });

    it('should handle ambassador check network error', async () => {
      const { result } = renderHook(() => useCartStore());

      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await result.current.checkAmbassadorFreeShipping('profile-123');
      });

      expect(result.current.ambassadorShipping.available).toBe(false);
      expect(result.current.ambassadorShipping.isLoading).toBe(false);
    });

    it('should apply ambassador free shipping when available', () => {
      const { result } = renderHook(() => useCartStore());

      // Set available first
      act(() => {
        useCartStore.setState({
          ambassadorShipping: {
            available: true,
            applied: false,
            isLoading: false,
            nextAvailableAt: null,
          },
        });
      });

      act(() => {
        result.current.applyAmbassadorFreeShipping(true);
      });

      expect(result.current.ambassadorShipping.applied).toBe(true);
    });

    it('should not apply ambassador free shipping when not available', () => {
      const { result } = renderHook(() => useCartStore());

      // Not available
      act(() => {
        useCartStore.setState({
          ambassadorShipping: {
            available: false,
            applied: false,
            isLoading: false,
            nextAvailableAt: null,
          },
        });
      });

      act(() => {
        result.current.applyAmbassadorFreeShipping(true);
      });

      expect(result.current.ambassadorShipping.applied).toBe(false);
    });

    it('should reset ambassador shipping state', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        useCartStore.setState({
          ambassadorShipping: {
            available: true,
            applied: true,
            isLoading: false,
            nextAvailableAt: new Date(),
          },
        });
      });

      act(() => {
        result.current.resetAmbassadorShipping();
      });

      expect(result.current.ambassadorShipping.available).toBe(false);
      expect(result.current.ambassadorShipping.applied).toBe(false);
    });
  });

  describe('getTotals with coupon types', () => {
    it('should calculate FIXED_AMOUNT coupon discount', () => {
      const { result } = renderHook(() => useCartStore());

      const mockProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        price: 30000,
        compareAtPrice: null,
        images: [],
      } as Product;

      act(() => {
        result.current.addItem({ productId: 'prod-1', quantity: 1 }, mockProduct);
        useCartStore.setState({
          appliedCoupon: {
            code: 'FLAT5000',
            discountType: 'FIXED_AMOUNT',
            discountValue: 5000,
          },
        });
      });

      const totals = result.current.getTotals(false);

      expect(totals.couponDiscount).toBe(5000);
      expect(totals.total).toBe(30000 - 5000 + SHIPPING_FEE);
    });

    it('should apply FREE_SHIPPING coupon', () => {
      const { result } = renderHook(() => useCartStore());

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
        useCartStore.setState({
          appliedCoupon: {
            code: 'FREESHIP',
            discountType: 'FREE_SHIPPING',
            discountValue: 0,
          },
        });
      });

      const totals = result.current.getTotals(false);

      expect(totals.isFreeShipping).toBe(true);
      expect(totals.freeShippingReason).toBe('coupon');
      expect(totals.shipping).toBe(0);
    });

    it('should apply ambassador free shipping in totals', () => {
      const { result } = renderHook(() => useCartStore());

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
        useCartStore.setState({
          ambassadorShipping: {
            available: true,
            applied: true,
            isLoading: false,
            nextAvailableAt: null,
          },
        });
      });

      const totals = result.current.getTotals(false);

      expect(totals.isFreeShipping).toBe(true);
      expect(totals.freeShippingReason).toBe('ambassador');
      expect(totals.shipping).toBe(0);
    });
  });

  describe('clearCart with ambassador shipping', () => {
    it('should reset ambassador shipping when clearing cart', () => {
      const { result } = renderHook(() => useCartStore());

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
        useCartStore.setState({
          ambassadorShipping: {
            available: true,
            applied: true,
            isLoading: false,
            nextAvailableAt: null,
          },
        });
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.ambassadorShipping.available).toBe(false);
      expect(result.current.ambassadorShipping.applied).toBe(false);
    });
  });
});
