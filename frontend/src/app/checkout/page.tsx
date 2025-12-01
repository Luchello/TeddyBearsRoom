"use client";

// ====================================
// TeddyBear's Room - Checkout Page
// Order checkout flow (Skeleton)
// ====================================

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, Building2, Receipt, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";

const paymentMethods = [
  { id: "card", label: "신용/체크카드", icon: CreditCard, description: "카드 결제" },
  { id: "bank", label: "계좌이체", icon: Building2, description: "실시간 계좌이체" },
  { id: "virtual", label: "가상계좌", icon: Receipt, description: "무통장입금" },
] as const;

const shippingMemos = [
  "배송 전 연락 바랍니다",
  "부재 시 경비실에 맡겨주세요",
  "부재 시 문 앞에 놓아주세요",
  "직접 입력",
];

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const {
    shippingAddress,
    paymentMethod,
    isProcessing,
    setShippingAddress,
    setShippingMemo,
    setPaymentMethod,
    createOrder,
    processPayment,
    clearCheckout,
  } = useCheckoutStore();
  const { isAuthenticated, openLoginModal } = useAuthStore();
  const { addToast } = useToast();

  const [customMemo, setCustomMemo] = useState("");
  const [selectedMemoOption, setSelectedMemoOption] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const totalPrice = getTotalPrice();
  const shippingFee = totalPrice >= 50000 ? 0 : 3000;
  const finalPrice = totalPrice + shippingFee;

  const handleMemoChange = (memo: string) => {
    setSelectedMemoOption(memo);
    if (memo !== "직접 입력") {
      setShippingMemo(memo);
      setCustomMemo("");
    }
  };

  const handleCustomMemoChange = (value: string) => {
    setCustomMemo(value);
    setShippingMemo(value);
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      addToast("로그인이 필요해요", "warning");
      openLoginModal();
      return;
    }

    if (!shippingAddress.trim()) {
      addToast("배송지를 입력해주세요", "warning");
      return;
    }

    if (!paymentMethod) {
      addToast("결제 수단을 선택해주세요", "warning");
      return;
    }

    createOrder(items);
    const success = await processPayment();

    if (success) {
      setOrderComplete(true);
      clearCart();
      addToast("주문이 완료되었어요! 🎉", "success");
    } else {
      addToast("결제에 실패했어요. 다시 시도해주세요.", "error");
    }
  };

  // Empty cart state
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-16">
        <span className="text-6xl mb-4">🛒</span>
        <h1 className="text-2xl font-bold mb-2">장바구니가 비어있어요</h1>
        <p className="text-muted-foreground mb-6">
          주문할 상품을 먼저 담아주세요
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/products">상품 둘러보기</Link>
        </Button>
      </div>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">주문이 완료되었어요! 🎉</h1>
        <p className="text-muted-foreground mb-2">
          주문해주셔서 감사합니다.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          배송 정보는 마이페이지에서 확인할 수 있어요.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setOrderComplete(false);
              clearCheckout();
            }}
            asChild
          >
            <Link href="/products">쇼핑 계속하기</Link>
          </Button>
          <Button className="rounded-xl" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <nav className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>쇼핑 계속하기</span>
          </Link>
        </nav>

        <h1 className="text-2xl font-bold mb-8">주문/결제</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="rounded-2xl dark:bg-black/40 dark:backdrop-blur-md dark:border-primary/30">
              <CardHeader className="pb-3">
                <h2 className="font-semibold dark:text-white">주문 상품 ({items.length})</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl bg-muted/50 dark:bg-white/5"
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative dark:bg-black/50">
                      <img
                        src="/tbr_logo.png"
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2 dark:hidden"
                      />
                      <img
                        src="/tbr_logo_dark.png"
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2 hidden dark:block"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1 dark:text-gray-200">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        수량: {item.quantity}개
                      </p>
                      <p className="text-primary font-bold mt-1 dark:text-primary">
                        {(item.product.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="rounded-2xl dark:bg-black/40 dark:backdrop-blur-md dark:border-primary/30">
              <CardHeader className="pb-3">
                <h2 className="font-semibold dark:text-white">배송지 정보</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">
                    배송지 주소
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="주소를 입력해주세요"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary dark:bg-black/50 dark:border-primary/30 dark:text-white dark:placeholder-gray-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
                    🔒 프라이버시 포장으로 안전하게 배송됩니다
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">
                    배송 메모
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {shippingMemos.map((memo) => (
                      <button
                        key={memo}
                        type="button"
                        onClick={() => handleMemoChange(memo)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedMemoOption === memo
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                          }`}
                      >
                        {memo}
                      </button>
                    ))}
                  </div>
                  {selectedMemoOption === "직접 입력" && (
                    <input
                      type="text"
                      value={customMemo}
                      onChange={(e) => handleCustomMemoChange(e.target.value)}
                      placeholder="배송 메모를 입력해주세요"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary dark:bg-black/50 dark:border-primary/30 dark:text-white"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="rounded-2xl dark:bg-black/40 dark:backdrop-blur-md dark:border-primary/30">
              <CardHeader className="pb-3">
                <h2 className="font-semibold dark:text-white">결제 수단</h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === method.id
                        ? "border-primary bg-primary/5 dark:bg-primary/20 dark:border-primary"
                        : "border-border hover:border-primary/50 dark:border-white/10 dark:hover:border-primary/50 dark:bg-black/30"
                        }`}
                    >
                      <method.icon className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium dark:text-gray-200">{method.label}</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-500">
                          {method.description}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 dark:text-gray-500">
                  🔜 TossPayments 연동 준비 중
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary */}
          <div>
            <Card className="rounded-2xl sticky top-24 dark:bg-black/40 dark:backdrop-blur-md dark:border-primary/30">
              <CardHeader className="pb-3">
                <h2 className="font-semibold dark:text-white">결제 금액</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span className="text-muted-foreground dark:text-gray-400">상품 금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span className="text-muted-foreground dark:text-gray-400">배송비</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 dark:text-green-400">무료</span>
                    ) : (
                      `${shippingFee.toLocaleString()}원`
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-muted-foreground dark:text-gray-500">
                    💡 {(50000 - totalPrice).toLocaleString()}원 더 담으면 무료배송!
                  </p>
                )}
                <div className="border-t border-border pt-3 dark:border-white/10">
                  <div className="flex justify-between font-bold dark:text-white">
                    <span>총 결제 금액</span>
                    <span className="text-primary text-lg">
                      {finalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:text-black dark:hover:bg-primary/80 dark:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      결제 처리 중...
                    </>
                  ) : (
                    `${finalPrice.toLocaleString()}원 결제하기`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground dark:text-gray-500">
                  주문 내용을 확인했으며, 결제에 동의합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
