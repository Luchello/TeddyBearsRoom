/**
 * Cart Summary Component
 * TeddyBear's Room - Order Summary Panel
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores";

interface CartSummaryProps {
  className?: string;
  showCheckoutButton?: boolean;
  isInnerCircle?: boolean;
}

export function CartSummary({
  className,
  showCheckoutButton = true,
  isInnerCircle = false,
}: CartSummaryProps) {
  const { items, appliedCoupon, getTotals, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponCode, setCouponCode] = React.useState("");
  const [couponError, setCouponError] = React.useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);

  const totals = getTotals(isInnerCircle);
  const isEmpty = items.length === 0;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const success = await applyCoupon(couponCode.trim());
      if (success) {
        setCouponCode("");
      } else {
        setCouponError("유효하지 않은 쿠폰입니다.");
      }
    } catch {
      setCouponError("쿠폰 적용 중 오류가 발생했습니다.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6",
        className
      )}
    >
      <h2 className="font-bold text-lg mb-4">주문 요약</h2>

      {isEmpty ? (
        <p className="text-muted-foreground text-center py-8">
          장바구니가 비어 있습니다.
        </p>
      ) : (
        <>
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">상품 금액</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>

            {totals.innerCircleDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Badge variant="innerCircle" className="text-[10px] px-1.5">
                    이너 써클
                  </Badge>
                  <span className="text-muted-foreground">할인</span>
                </span>
                <span className="text-primary">
                  -{formatPrice(totals.innerCircleDiscount)}
                </span>
              </div>
            )}

            {totals.couponDiscount > 0 && appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">쿠폰 할인</span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-destructive hover:underline"
                  >
                    취소
                  </button>
                </span>
                <span className="text-primary">
                  -{formatPrice(totals.couponDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">배송비</span>
              <span>
                {totals.shipping === 0 ? (
                  <span className="text-primary">무료</span>
                ) : (
                  formatPrice(totals.shipping)
                )}
              </span>
            </div>

            {totals.shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(30000 - totals.subtotal)} 더 구매 시 무료배송
              </p>
            )}
          </div>

          <Separator className="my-4" />

          {/* Coupon Input */}
          {!appliedCoupon && (
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="쿠폰 코드"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                >
                  {isApplyingCoupon ? "적용 중..." : "적용"}
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-destructive mt-1">{couponError}</p>
              )}
            </div>
          )}

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{appliedCoupon.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {appliedCoupon.discountType === "PERCENTAGE"
                      ? `${appliedCoupon.discountValue}% 할인`
                      : appliedCoupon.discountType === "FREE_SHIPPING"
                      ? "무료배송"
                      : `${appliedCoupon.discountValue.toLocaleString()}원 할인`}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-baseline">
            <span className="font-semibold">총 결제금액</span>
            <span className="text-2xl font-bold">{formatPrice(totals.total)}</span>
          </div>

          {/* Savings */}
          {totals.savings > 0 && (
            <p className="text-sm text-primary text-right mt-1">
              {formatPrice(totals.savings)} 절약!
            </p>
          )}

          {/* Checkout Button */}
          {showCheckoutButton && (
            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">결제하기</Link>
            </Button>
          )}

          {/* Inner Circle Promotion */}
          {!isInnerCircle && (
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-lavender-50 dark:from-pink-950/20 dark:to-lavender-950/20">
              <p className="text-sm font-medium text-center">
                🎁 이너 써클 가입 시 추가{" "}
                <span className="text-primary font-bold">10% 할인</span>
              </p>
              <Link
                href="/inner-circle"
                className="block text-xs text-center text-muted-foreground hover:text-primary mt-1"
              >
                자세히 알아보기 →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartSummary;
