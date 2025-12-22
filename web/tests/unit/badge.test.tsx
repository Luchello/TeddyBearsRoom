/**
 * Badge Component Unit Tests
 * TDD: Testing Badge, StatusBadge, and DiscountBadge for TeddyBear's Room
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge, StatusBadge, DiscountBadge } from '@/components/ui/badge';

describe('Badge Component', () => {
    describe('Basic Rendering', () => {
        it('should render children content', () => {
            render(<Badge>New</Badge>);
            expect(screen.getByText('New')).toBeInTheDocument();
        });

        it('should render with default variant', () => {
            render(<Badge>Default</Badge>);
            const badge = screen.getByText('Default');
            expect(badge).toHaveClass('bg-primary');
        });
    });

    describe('Variants', () => {
        it('should render secondary variant', () => {
            render(<Badge variant="secondary">Secondary</Badge>);
            const badge = screen.getByText('Secondary');
            expect(badge).toHaveClass('bg-secondary');
        });

        it('should render accent variant', () => {
            render(<Badge variant="accent">Accent</Badge>);
            const badge = screen.getByText('Accent');
            expect(badge).toHaveClass('bg-accent');
        });

        it('should render destructive variant', () => {
            render(<Badge variant="destructive">Error</Badge>);
            const badge = screen.getByText('Error');
            expect(badge).toHaveClass('bg-destructive');
        });

        it('should render outline variant', () => {
            render(<Badge variant="outline">Outline</Badge>);
            const badge = screen.getByText('Outline');
            expect(badge).toHaveClass('border-border');
        });

        it('should render new variant', () => {
            render(<Badge variant="new">신상품</Badge>);
            const badge = screen.getByText('신상품');
            expect(badge).toHaveClass('bg-mint-200');
        });

        it('should render sale variant', () => {
            render(<Badge variant="sale">할인</Badge>);
            const badge = screen.getByText('할인');
            expect(badge).toHaveClass('bg-pink-200');
        });

        it('should render soldout variant', () => {
            render(<Badge variant="soldout">품절</Badge>);
            const badge = screen.getByText('품절');
            expect(badge).toHaveClass('bg-muted');
        });

        it('should render premium variant', () => {
            render(<Badge variant="premium">프리미엄</Badge>);
            const badge = screen.getByText('프리미엄');
            expect(badge).toHaveClass('bg-lavender-200');
        });

        it('should render innerCircle variant', () => {
            render(<Badge variant="innerCircle">이너 써클</Badge>);
            const badge = screen.getByText('이너 써클');
            expect(badge).toHaveClass('from-lavender-200');
        });
    });

    describe('Sizes', () => {
        it('should render default size', () => {
            render(<Badge>Default Size</Badge>);
            const badge = screen.getByText('Default Size');
            expect(badge).toHaveClass('text-xs');
        });

        it('should render small size', () => {
            render(<Badge size="sm">Small</Badge>);
            const badge = screen.getByText('Small');
            expect(badge).toHaveClass('text-[10px]');
        });

        it('should render large size', () => {
            render(<Badge size="lg">Large</Badge>);
            const badge = screen.getByText('Large');
            expect(badge).toHaveClass('text-sm');
        });
    });

    describe('Removable Badge', () => {
        it('should show remove button when removable', () => {
            render(<Badge removable>Removable</Badge>);
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should not show remove button when not removable', () => {
            render(<Badge>Not Removable</Badge>);
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('should call onRemove when remove button is clicked', () => {
            const handleRemove = vi.fn();
            render(
                <Badge removable onRemove={handleRemove}>
                    Click to Remove
                </Badge>
            );

            const removeButton = screen.getByRole('button');
            fireEvent.click(removeButton);

            expect(handleRemove).toHaveBeenCalledTimes(1);
        });

        it('should stop propagation when remove button is clicked', () => {
            const handleBadgeClick = vi.fn();
            const handleRemove = vi.fn();
            render(
                <div onClick={handleBadgeClick}>
                    <Badge removable onRemove={handleRemove}>
                        Nested
                    </Badge>
                </div>
            );

            const removeButton = screen.getByRole('button');
            fireEvent.click(removeButton);

            expect(handleRemove).toHaveBeenCalledTimes(1);
            expect(handleBadgeClick).not.toHaveBeenCalled();
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<Badge className="custom-class">Custom</Badge>);
            const badge = screen.getByText('Custom');
            expect(badge).toHaveClass('custom-class');
        });

        it('should forward other props to div', () => {
            render(<Badge data-testid="test-badge">Test</Badge>);
            expect(screen.getByTestId('test-badge')).toBeInTheDocument();
        });
    });
});

describe('StatusBadge Component', () => {
    describe('Status Rendering', () => {
        it('should render pending status', () => {
            render(<StatusBadge status="pending" />);
            expect(screen.getByText('대기중')).toBeInTheDocument();
        });

        it('should render processing status', () => {
            render(<StatusBadge status="processing" />);
            expect(screen.getByText('처리중')).toBeInTheDocument();
        });

        it('should render completed status', () => {
            render(<StatusBadge status="completed" />);
            expect(screen.getByText('완료')).toBeInTheDocument();
        });

        it('should render cancelled status', () => {
            render(<StatusBadge status="cancelled" />);
            expect(screen.getByText('취소됨')).toBeInTheDocument();
        });

        it('should render active status', () => {
            render(<StatusBadge status="active" />);
            expect(screen.getByText('활성')).toBeInTheDocument();
        });

        it('should render inactive status', () => {
            render(<StatusBadge status="inactive" />);
            expect(screen.getByText('비활성')).toBeInTheDocument();
        });
    });

    describe('Status Variants', () => {
        it('should use outline variant for pending', () => {
            render(<StatusBadge status="pending" />);
            const badge = screen.getByText('대기중');
            expect(badge).toHaveClass('border-border');
        });

        it('should use secondary variant for processing', () => {
            render(<StatusBadge status="processing" />);
            const badge = screen.getByText('처리중');
            expect(badge).toHaveClass('bg-secondary');
        });

        it('should use default variant for completed', () => {
            render(<StatusBadge status="completed" />);
            const badge = screen.getByText('완료');
            expect(badge).toHaveClass('bg-primary');
        });

        it('should use destructive variant for cancelled', () => {
            render(<StatusBadge status="cancelled" />);
            const badge = screen.getByText('취소됨');
            expect(badge).toHaveClass('bg-destructive');
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<StatusBadge status="active" className="custom" />);
            const badge = screen.getByText('활성');
            expect(badge).toHaveClass('custom');
        });
    });
});

describe('DiscountBadge Component', () => {
    describe('Percentage Discount', () => {
        it('should render percentage discount', () => {
            render(<DiscountBadge discountPercent={10} />);
            expect(screen.getByText('-10%')).toBeInTheDocument();
        });

        it('should render large percentage discount', () => {
            render(<DiscountBadge discountPercent={50} />);
            expect(screen.getByText('-50%')).toBeInTheDocument();
        });

        it('should use sale variant', () => {
            render(<DiscountBadge discountPercent={20} />);
            const badge = screen.getByText('-20%');
            expect(badge).toHaveClass('bg-pink-200');
        });
    });

    describe('Amount Discount', () => {
        it('should render amount discount', () => {
            render(<DiscountBadge discountAmount={5000} />);
            expect(screen.getByText('-₩5,000')).toBeInTheDocument();
        });

        it('should format large amounts with commas', () => {
            render(<DiscountBadge discountAmount={10000} />);
            expect(screen.getByText('-₩10,000')).toBeInTheDocument();
        });
    });

    describe('Priority', () => {
        it('should prioritize percentage over amount', () => {
            render(<DiscountBadge discountPercent={15} discountAmount={1000} />);
            expect(screen.getByText('-15%')).toBeInTheDocument();
            expect(screen.queryByText('-₩1,000')).not.toBeInTheDocument();
        });
    });

    describe('No Discount', () => {
        it('should render nothing when no discount provided', () => {
            const { container } = render(<DiscountBadge />);
            expect(container).toBeEmptyDOMElement();
        });

        it('should render nothing when both values are undefined', () => {
            const { container } = render(
                <DiscountBadge discountPercent={undefined} discountAmount={undefined} />
            );
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('Custom Props', () => {
        it('should accept custom className', () => {
            render(<DiscountBadge discountPercent={10} className="custom" />);
            const badge = screen.getByText('-10%');
            expect(badge).toHaveClass('custom');
        });
    });
});
