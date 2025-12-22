import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartSummary } from '@/components/cart/cart-summary';
import { useCartStore } from '@/stores/cart-store';

// Mock the cart store
vi.mock('@/stores/cart-store', () => ({
    useCartStore: vi.fn(),
}));

describe('CartSummary Component', () => {
    const mockTotals = {
        subtotal: 20000,
        discount: 0,
        innerCircleDiscount: 0,
        couponDiscount: 0,
        shipping: 3000,
        freeShippingThreshold: 30000,
        isFreeShipping: false,
        amountToFreeShipping: 10000,
        tax: 0,
        total: 23000,
        savings: 0,
    };

    const mockApplyCoupon = vi.fn();
    const mockRemoveCoupon = vi.fn();

    const mockCartStore = {
        items: [{ id: '1', quantity: 1, price: 20000 }],
        appliedCoupon: null,
        getTotals: () => mockTotals,
        applyCoupon: mockApplyCoupon,
        removeCoupon: mockRemoveCoupon,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockApplyCoupon.mockResolvedValue(true);
    });

    describe('Basic Rendering', () => {
        it('should render correct totals and shipping info', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            expect(screen.getByText(/20,000/)).toBeInTheDocument();
            expect(screen.getByText(/23,000/)).toBeInTheDocument();
            expect(screen.getByText(/무료배송/)).toBeInTheDocument();
            expect(screen.getByText(/10,000/)).toBeInTheDocument();
        });

        it('should render order summary title', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            expect(screen.getByText(/주문 요약/)).toBeInTheDocument();
        });

        it('should show checkout button by default', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            expect(screen.getByRole('link', { name: /결제하기/ })).toBeInTheDocument();
        });

        it('should hide checkout button when showCheckoutButton is false', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary showCheckoutButton={false} />);

            expect(screen.queryByRole('link', { name: /결제하기/ })).not.toBeInTheDocument();
        });
    });

    describe('Empty Cart', () => {
        it('should show empty cart message when cart is empty', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                items: [],
            });
            render(<CartSummary />);

            expect(screen.getByText(/장바구니가 비어 있습니다/)).toBeInTheDocument();
        });

        it('should not show checkout button when cart is empty', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                items: [],
            });
            render(<CartSummary />);

            expect(screen.queryByRole('link', { name: /결제하기/ })).not.toBeInTheDocument();
        });
    });

    describe('Shipping', () => {
        it('should show free shipping when threshold is reached', () => {
            const freeMockTotals = {
                ...mockTotals,
                subtotal: 40000,
                shipping: 0,
                isFreeShipping: true,
                amountToFreeShipping: 0,
                total: 40000,
            };
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                getTotals: () => freeMockTotals,
            });
            render(<CartSummary />);

            expect(screen.getByText('무료')).toBeInTheDocument();
        });

        it('should show shipping fee when below threshold', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            // Check that shipping fee is displayed (₩3,000)
            const shippingTexts = screen.getAllByText(/3,000/);
            expect(shippingTexts.length).toBeGreaterThan(0);
        });
    });

    describe('Inner Circle Discount', () => {
        it('should show Inner Circle discount when applicable', () => {
            const icTotals = {
                ...mockTotals,
                innerCircleDiscount: 2000,
                total: 21000,
            };
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                getTotals: () => icTotals,
            });
            render(<CartSummary isInnerCircle={true} />);

            expect(screen.getByText(/이너 써클/)).toBeInTheDocument();
            expect(screen.getByText(/2,000/)).toBeInTheDocument();
        });

        it('should show Inner Circle promotion when not a member', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary isInnerCircle={false} />);

            expect(screen.getByText(/이너 써클 가입 시/)).toBeInTheDocument();
            expect(screen.getByText(/10% 할인/)).toBeInTheDocument();
        });

        it('should not show Inner Circle promotion when already a member', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary isInnerCircle={true} />);

            expect(screen.queryByText(/이너 써클 가입 시/)).not.toBeInTheDocument();
        });
    });

    describe('Coupon Functionality', () => {
        it('should show coupon input when no coupon is applied', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            expect(screen.getByPlaceholderText('쿠폰 코드')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '적용' })).toBeInTheDocument();
        });

        it('should apply coupon when button is clicked', async () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            const input = screen.getByPlaceholderText('쿠폰 코드');
            const button = screen.getByRole('button', { name: '적용' });

            fireEvent.change(input, { target: { value: 'TESTCOUPON' } });
            fireEvent.click(button);

            await waitFor(() => {
                expect(mockApplyCoupon).toHaveBeenCalledWith('TESTCOUPON');
            });
        });

        it('should disable apply button when input is empty', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            const button = screen.getByRole('button', { name: '적용' });
            expect(button).toBeDisabled();
        });

        it('should show error message when coupon is invalid', async () => {
            mockApplyCoupon.mockResolvedValue(false);
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            const input = screen.getByPlaceholderText('쿠폰 코드');
            const button = screen.getByRole('button', { name: '적용' });

            fireEvent.change(input, { target: { value: 'INVALID' } });
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText(/유효하지 않은 쿠폰/)).toBeInTheDocument();
            });
        });

        it('should show error on coupon apply failure', async () => {
            mockApplyCoupon.mockRejectedValue(new Error('Network error'));
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            const input = screen.getByPlaceholderText('쿠폰 코드');
            const button = screen.getByRole('button', { name: '적용' });

            fireEvent.change(input, { target: { value: 'TEST' } });
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText(/쿠폰 적용 중 오류/)).toBeInTheDocument();
            });
        });

        it('should display applied coupon info', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'SAVE10',
                    discountType: 'PERCENTAGE',
                    discountValue: 10,
                },
                getTotals: () => ({
                    ...mockTotals,
                    couponDiscount: 2000,
                }),
            });
            render(<CartSummary isInnerCircle={true} />);

            expect(screen.getByText('SAVE10')).toBeInTheDocument();
            expect(screen.getByText(/10% 할인/)).toBeInTheDocument();
        });

        it('should display fixed amount coupon', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'FLAT5000',
                    discountType: 'FIXED',
                    discountValue: 5000,
                },
                getTotals: () => ({
                    ...mockTotals,
                    couponDiscount: 5000,
                }),
            });
            render(<CartSummary />);

            expect(screen.getByText('FLAT5000')).toBeInTheDocument();
            expect(screen.getByText(/5,000원 할인/)).toBeInTheDocument();
        });

        it('should display free shipping coupon', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'FREESHIP',
                    discountType: 'FREE_SHIPPING',
                    discountValue: 0,
                },
                getTotals: () => ({
                    ...mockTotals,
                    shipping: 0,
                }),
            });
            render(<CartSummary />);

            expect(screen.getByText('FREESHIP')).toBeInTheDocument();
            expect(screen.getByText('무료배송')).toBeInTheDocument();
        });

        it('should remove coupon when cancel button is clicked', async () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'TEST',
                    discountType: 'PERCENTAGE',
                    discountValue: 10,
                },
                getTotals: () => ({
                    ...mockTotals,
                    couponDiscount: 2000,
                }),
            });
            render(<CartSummary />);

            const cancelButtons = screen.getAllByText('×');
            fireEvent.click(cancelButtons[0]);

            expect(mockRemoveCoupon).toHaveBeenCalled();
        });
    });

    describe('Savings Display', () => {
        it('should show savings when there are discounts', () => {
            const savingsTotals = {
                ...mockTotals,
                savings: 5000,
            };
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                getTotals: () => savingsTotals,
            });
            render(<CartSummary />);

            expect(screen.getByText(/5,000/)).toBeInTheDocument();
            expect(screen.getByText(/절약/)).toBeInTheDocument();
        });

        it('should not show savings when there are no discounts', () => {
            (useCartStore as Mock).mockReturnValue(mockCartStore);
            render(<CartSummary />);

            expect(screen.queryByText(/절약/)).not.toBeInTheDocument();
        });
    });

    describe('Coupon Discount Display', () => {
        it('should show coupon discount amount with cancel button', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'DISCOUNT',
                    discountType: 'FIXED',
                    discountValue: 3000,
                },
                getTotals: () => ({
                    ...mockTotals,
                    couponDiscount: 3000,
                    total: 20000,
                }),
            });
            render(<CartSummary />);

            expect(screen.getByText(/쿠폰 할인/)).toBeInTheDocument();
            expect(screen.getByText('취소')).toBeInTheDocument();
        });

        it('should call removeCoupon when cancel link is clicked', () => {
            (useCartStore as Mock).mockReturnValue({
                ...mockCartStore,
                appliedCoupon: {
                    code: 'DISCOUNT',
                    discountType: 'FIXED',
                    discountValue: 3000,
                },
                getTotals: () => ({
                    ...mockTotals,
                    couponDiscount: 3000,
                }),
            });
            render(<CartSummary />);

            const cancelButton = screen.getByText('취소');
            fireEvent.click(cancelButton);

            expect(mockRemoveCoupon).toHaveBeenCalled();
        });
    });
});
