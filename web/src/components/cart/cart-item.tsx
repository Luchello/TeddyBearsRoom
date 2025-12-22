/**
 * Cart Item Component
 * TeddyBear's Room - Individual Cart Item
 */

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores";
import type { CartItem as CartItemType } from "@/types";

// Icons
const MinusIcon = () => (
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
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
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
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const TrashIcon = () => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

interface CartItemProps {
  item: CartItemType;
  className?: string;
  compact?: boolean;
}

export function CartItem({ item, className, compact = false }: CartItemProps) {
  const { updateItem, removeItem } = useCartStore();
  const [imageError, setImageError] = React.useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      removeItem(item.id);
    } else if (newQuantity <= 99) {
      updateItem(item.id, newQuantity);
    }
  };

  const itemTotal = item.price * item.quantity;

  if (compact) {
    return (
      <div className={cn("flex gap-3 py-3", className)}>
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
          {!imageError && item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="64px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.productId}`}
            className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
          {item.variantName && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.variantName}
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              {formatPrice(item.price)} × {item.quantity}
            </span>
            <span className="text-sm font-medium">{formatPrice(itemTotal)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-4 py-4 border-b border-[var(--color-border)] last:border-b-0",
        className
      )}
    >
      {/* Image */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[var(--color-love-50)] shrink-0 border border-[var(--color-border)]">
        {!imageError && item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Product Info */}
        <div className="flex-1">
          <Link
            href={`/products/${item.productId}`}
            className="font-medium hover:text-[var(--color-primary)] transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          {item.variantName && (
            <p className="text-sm text-muted-foreground mt-1">
              {item.variantName}
            </p>
          )}
        </div>

        {/* Price & Actions */}
        <div className="flex items-end justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-r-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon />
                <span className="sr-only">수량 감소</span>
              </Button>
              <span className="w-10 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 rounded-l-none"
                onClick={() => handleQuantityChange(1)}
                disabled={item.quantity >= 99}
              >
                <PlusIcon />
                <span className="sr-only">수량 증가</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <TrashIcon />
              <span className="sr-only">삭제</span>
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-bold">{formatPrice(itemTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} / 개
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
