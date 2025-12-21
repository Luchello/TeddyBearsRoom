/**
 * Input Component
 * TeddyBear's Room Design System
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-11 w-full rounded-xl border bg-background px-4 py-2 text-sm transition-all duration-200",
            // Border & focus
            "border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
            // Placeholder
            "placeholder:text-muted-foreground",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            // Error state
            error && "border-destructive focus-visible:ring-destructive",
            // Icon padding
            hasLeftIcon && "pl-10",
            hasRightIcon && "pr-10",
            // File input specific
            type === "file" &&
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            className
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              onRightIconClick && "hover:text-foreground cursor-pointer"
            )}
          >
            {rightIcon}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Search Input variant
const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "leftIcon">
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="search"
      className={cn("pr-4", className)}
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      }
      {...props}
    />
  );
});
SearchInput.displayName = "SearchInput";

// Password Input with toggle visibility
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "rightIcon" | "onRightIconClick">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      className={className}
      rightIcon={
        showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      }
      onRightIconClick={() => setShowPassword(!showPassword)}
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export { Input, SearchInput, PasswordInput };
