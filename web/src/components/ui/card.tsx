/**
 * Card Component
 * TeddyBear's Room Design System
 */

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "outlined" | "elevated";
    hover?: boolean;
  }
>(({ className, variant = "default", hover = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl bg-card text-card-foreground transition-all duration-300",
      // Variants
      variant === "default" && "border border-border shadow-[var(--shadow-soft)]",
      variant === "glass" && "glass-card",
      variant === "outlined" && "border-2 border-border",
      variant === "elevated" && "shadow-[var(--shadow-medium)]",
      // Hover effect
      hover && "hover:shadow-[var(--shadow-large)] hover:-translate-y-1 cursor-pointer",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Base Product Card - Simple container variant for product display
const BaseProductCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "product-card group relative rounded-2xl bg-card overflow-hidden",
      "border border-transparent hover:border-border",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
BaseProductCard.displayName = "BaseProductCard";

const ProductCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    aspectRatio?: "product" | "square" | "video";
  }
>(({ className, aspectRatio = "product", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden bg-muted",
      aspectRatio === "product" && "aspect-[3/4]",
      aspectRatio === "square" && "aspect-square",
      aspectRatio === "video" && "aspect-video",
      className
    )}
    {...props}
  />
));
ProductCardImage.displayName = "ProductCardImage";

const ProductCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 space-y-2", className)} {...props} />
));
ProductCardContent.displayName = "ProductCardContent";

const ProductCardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "new" | "sale" | "soldout" | "limited";
  }
>(({ className, variant = "new", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full",
      variant === "new" && "bg-secondary text-secondary-foreground",
      variant === "sale" && "bg-accent text-accent-foreground",
      variant === "soldout" && "bg-muted text-muted-foreground",
      variant === "limited" && "bg-lavender-300 text-foreground",
      className
    )}
    {...props}
  />
));
ProductCardBadge.displayName = "ProductCardBadge";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  BaseProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardBadge,
};
