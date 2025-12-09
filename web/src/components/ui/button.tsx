/**
 * Button Component
 * TeddyBear's Room Design System
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Beige brand color
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5 active:translate-y-0",
        // Secondary - Mint accent
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5 active:translate-y-0",
        // Accent - Pink
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5 active:translate-y-0",
        // Destructive - Error/Delete actions
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // Outline - Bordered style
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent",
        // Ghost - Minimal style
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link - Text only
        link: "text-primary underline-offset-4 hover:underline",
        // Soft - Muted background
        soft: "bg-muted text-muted-foreground hover:bg-muted/80",
        // Premium - For Inner Circle / special actions
        premium:
          "bg-gradient-to-r from-lavender-300 to-pink-300 text-foreground shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>로딩 중...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
