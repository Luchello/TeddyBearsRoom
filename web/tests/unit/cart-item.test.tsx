import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '@/components/cart/cart-item';
import { useCartStore } from '@/stores/cart-store';
import type { CartItem as CartItemType } from '@/types/cart';

// Mock the cart store
vi.mock('@/stores/cart-store', () => ({
    useCartStore: vi.fn(),
}));

describe('CartItem Component', () => {
    const mockItem: CartItemType = {
        id: 'item-1',
        productId: 'prod-1',
        variantId: 'var-1',
        name: 'Test Teddy',
        price: 15000,
        originalPrice: 20000,
        quantity: 2,
        imageUrl: '/test.jpg',
        variantName: 'Pink / Small',
        variant: null,
    };

    const mockUpdateItem = vi.fn();
    const mockRemoveItem = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCartStore as Mock).mockReturnValue({
            updateItem: mockUpdateItem,
            removeItem: mockRemoveItem,
        });
    });

    describe('Default (Full) View', () => {
        it('should render item information correctly', () => {
            render(<CartItem item={mockItem} />);

            expect(screen.getByText('Test Teddy')).toBeInTheDocument();
            expect(screen.getByText('Pink / Small')).toBeInTheDocument();
            expect(screen.getByText(/30,000/)).toBeInTheDocument(); // total for 2 items
        });

        it('should render quantity display', () => {
            render(<CartItem item={mockItem} />);

            expect(screen.getByText('2')).toBeInTheDocument();
        });

        it('should show per-unit price when quantity > 1', () => {
            render(<CartItem item={mockItem} />);

            expect(screen.getByText(/15,000.*\/.*개/)).toBeInTheDocument();
        });

        it('should not show per-unit price when quantity is 1', () => {
            const singleItem = { ...mockItem, quantity: 1 };
            render(<CartItem item={singleItem} />);

            expect(screen.queryByText(/\/.*개/)).not.toBeInTheDocument();
        });

        it('should render product link', () => {
            render(<CartItem item={mockItem} />);

            const link = screen.getByRole('link', { name: 'Test Teddy' });
            expect(link).toHaveAttribute('href', '/products/prod-1');
        });
    });

    describe('Compact View', () => {
        it('should render compact layout when compact prop is true', () => {
            render(<CartItem item={mockItem} compact />);

            expect(screen.getByText('Test Teddy')).toBeInTheDocument();
            expect(screen.getByText('Pink / Small')).toBeInTheDocument();
        });

        it('should show price calculation in compact view', () => {
            render(<CartItem item={mockItem} compact />);

            // Format: "15,000원 × 2"
            expect(screen.getByText(/15,000.*×.*2/)).toBeInTheDocument();
        });

        it('should not show quantity controls in compact view', () => {
            render(<CartItem item={mockItem} compact />);

            expect(screen.queryByRole('button', { name: /수량 증가/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /수량 감소/i })).not.toBeInTheDocument();
        });
    });

    describe('Quantity Controls', () => {
        it('should call updateItem when quantity is increased', () => {
            render(<CartItem item={mockItem} />);

            const incrementButton = screen.getByRole('button', { name: /수량 증가/i });
            fireEvent.click(incrementButton);

            expect(mockUpdateItem).toHaveBeenCalledWith('item-1', 3);
        });

        it('should call updateItem when quantity is decreased', () => {
            render(<CartItem item={mockItem} />);

            const decrementButton = screen.getByRole('button', { name: /수량 감소/i });
            fireEvent.click(decrementButton);

            expect(mockUpdateItem).toHaveBeenCalledWith('item-1', 1);
        });

        // Note: "should call removeItem when quantity goes to 0" 테스트 제거
        // 이유: 수량이 1일 때 감소 버튼이 비활성화되므로 UI를 통해 0으로 감소 불가
        // updateItem(id, 0) 경로는 cart-store.test.ts에서 테스트됨

        it('should disable decrement button when quantity is 1', () => {
            const singleItem = { ...mockItem, quantity: 1 };
            render(<CartItem item={singleItem} />);

            const decrementButton = screen.getByRole('button', { name: /수량 감소/i });
            expect(decrementButton).toBeDisabled();
        });

        it('should disable increment button when quantity is 99', () => {
            const maxItem = { ...mockItem, quantity: 99 };
            render(<CartItem item={maxItem} />);

            const incrementButton = screen.getByRole('button', { name: /수량 증가/i });
            expect(incrementButton).toBeDisabled();
        });

        it('should not increase quantity beyond 99', () => {
            const maxItem = { ...mockItem, quantity: 99 };
            render(<CartItem item={maxItem} />);

            const incrementButton = screen.getByRole('button', { name: /수량 증가/i });
            fireEvent.click(incrementButton);

            expect(mockUpdateItem).not.toHaveBeenCalled();
        });
    });

    describe('Remove Item', () => {
        it('should call removeItem when remove button is clicked', () => {
            render(<CartItem item={mockItem} />);

            const removeButton = screen.getByRole('button', { name: /삭제/i });
            fireEvent.click(removeButton);

            expect(mockRemoveItem).toHaveBeenCalledWith('item-1');
        });
    });

    describe('Image Handling', () => {
        it('should render image when imageUrl is provided', () => {
            render(<CartItem item={mockItem} />);

            const image = screen.getByRole('img', { name: 'Test Teddy' });
            expect(image).toBeInTheDocument();
        });

        it('should render fallback when no imageUrl', () => {
            const noImageItem = { ...mockItem, imageUrl: '' };
            render(<CartItem item={noImageItem} />);

            // Check that the fallback SVG is rendered (no img element)
            expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
    });

    describe('Without Variant', () => {
        it('should not show variant name when variantName is not provided', () => {
            const noVariantItem = { ...mockItem, variantName: undefined };
            render(<CartItem item={noVariantItem} />);

            expect(screen.queryByText('Pink / Small')).not.toBeInTheDocument();
        });
    });
});
