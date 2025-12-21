/**
 * Badge Component
 * TeddyBear's Room Design System
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        accent:
          "border-transparent bg-accent text-accent-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        // TBR Specific variants
        new: "border-transparent bg-mint-200 text-mint-800",
        sale: "border-transparent bg-pink-200 text-pink-800",
        soldout: "border-transparent bg-muted text-muted-foreground",
        premium: "border-transparent bg-lavender-200 text-lavender-800",
        innerCircle:
          "border-transparent bg-gradient-to-r from-lavender-200 to-pink-200 text-foreground",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

function Badge({
  className,
  variant,
  size,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-foreground/20 inline-flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Status Badge - For order/subscription status
interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "active"
    | "inactive";
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusConfig = {
    pending: { label: "대기중", variant: "outline" as const },
    processing: { label: "처리중", variant: "secondary" as const },
    completed: { label: "완료", variant: "default" as const },
    cancelled: { label: "취소됨", variant: "destructive" as const },
    active: { label: "활성", variant: "secondary" as const },
    inactive: { label: "비활성", variant: "outline" as const },
  };

  const config = statusConfig[status];

  return (
    <Badge className={className} variant={config.variant} {...props}>
      {config.label}
    </Badge>
  );
}

// Discount Badge - Shows percentage or amount off
interface DiscountBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  discountPercent?: number;
  discountAmount?: number;
}

function DiscountBadge({
  discountPercent,
  discountAmount,
  className,
  ...props
}: DiscountBadgeProps) {
  const displayText = discountPercent
    ? `-${discountPercent}%`
    : discountAmount
    ? `-₩${discountAmount.toLocaleString()}`
    : null;

  if (!displayText) return null;

  return (
    <Badge className={className} variant="sale" {...props}>
      {displayText}
    </Badge>
  );
}

export { Badge, StatusBadge, DiscountBadge, badgeVariants };
