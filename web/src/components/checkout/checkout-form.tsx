/**
 * Checkout Form Component
 * TeddyBear's Room - Checkout Process
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioCard } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
const TruckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

interface CheckoutFormData {
  // Shipping
  shippingName: string;
  shippingPhone: string;
  shippingZipcode: string;
  shippingAddress: string;
  shippingAddressDetail: string;
  shippingMethod: "standard" | "express";
  shippingMemo: string;
  // Billing
  sameAsShipping: boolean;
  billingName: string;
  billingPhone: string;
  billingZipcode: string;
  billingAddress: string;
  billingAddressDetail: string;
  // Payment
  paymentMethod: "card" | "bank" | "kakao" | "naver" | "toss";
  // Agreements
  agreeTerms: boolean;
  agreeRefund: boolean;
}

interface CheckoutFormProps {
  className?: string;
  onSubmit?: (data: CheckoutFormData) => Promise<void>;
  isInnerCircle?: boolean;
}

const shippingMemos = [
  { value: "", label: "배송 메모 선택 (선택사항)" },
  { value: "door", label: "문 앞에 놓아주세요" },
  { value: "security", label: "경비실에 맡겨주세요" },
  { value: "call", label: "배송 전 연락 부탁드립니다" },
  { value: "box", label: "무인 택배함에 넣어주세요" },
  { value: "custom", label: "직접 입력" },
];

export function CheckoutForm({
  className,
  onSubmit,
  isInnerCircle = false,
}: CheckoutFormProps) {
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    shippingName: "",
    shippingPhone: "",
    shippingZipcode: "",
    shippingAddress: "",
    shippingAddressDetail: "",
    shippingMethod: "standard",
    shippingMemo: "",
    sameAsShipping: true,
    billingName: "",
    billingPhone: "",
    billingZipcode: "",
    billingAddress: "",
    billingAddressDetail: "",
    paymentMethod: "card",
    agreeTerms: false,
    agreeRefund: false,
  });
  const [customMemo, setCustomMemo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        shippingMemo:
          formData.shippingMemo === "custom" ? customMemo : formData.shippingMemo,
      };
      await onSubmit?.(submitData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSearch = (type: "shipping" | "billing") => {
    // TODO: Integrate Daum Postcode API
    void type; // Placeholder until Daum Postcode integration
  };

  const canSubmit = formData.agreeTerms && formData.agreeRefund;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Shipping Information */}
      <section>
        <h2 className="text-lg font-bold mb-4">배송 정보</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shippingName" required>
                받는 분
              </Label>
              <Input
                id="shippingName"
                value={formData.shippingName}
                onChange={(e) =>
                  setFormData({ ...formData, shippingName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingPhone" required>
                연락처
              </Label>
              <Input
                id="shippingPhone"
                type="tel"
                placeholder="010-0000-0000"
                value={formData.shippingPhone}
                onChange={(e) =>
                  setFormData({ ...formData, shippingPhone: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress" required>
              배송지
            </Label>
            <div className="flex gap-2">
              <Input
                id="shippingZipcode"
                placeholder="우편번호"
                value={formData.shippingZipcode}
                onChange={(e) =>
                  setFormData({ ...formData, shippingZipcode: e.target.value })
                }
                className="w-32"
                required
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddressSearch("shipping")}
              >
                주소 검색
              </Button>
            </div>
            <Input
              placeholder="주소"
              value={formData.shippingAddress}
              onChange={(e) =>
                setFormData({ ...formData, shippingAddress: e.target.value })
              }
              required
              readOnly
            />
            <Input
              placeholder="상세 주소 (선택)"
              value={formData.shippingAddressDetail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingAddressDetail: e.target.value,
                })
              }
            />
          </div>

          {/* Shipping Method */}
          <div className="space-y-2">
            <Label required>배송 방법</Label>
            <RadioGroup
              value={formData.shippingMethod}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  shippingMethod: value as "standard" | "express",
                })
              }
              orientation="horizontal"
            >
              <RadioCard
                value="standard"
                label="일반 배송"
                description="3~5일 소요 (30,000원 이상 무료)"
                icon={<TruckIcon />}
              />
              <RadioCard
                value="express"
                label="빠른 배송"
                description="1~2일 소요 (+3,000원)"
                icon={<PackageIcon />}
              />
            </RadioGroup>
          </div>

          {/* Shipping Memo */}
          <div className="space-y-2">
            <Label htmlFor="shippingMemo">배송 메모</Label>
            <Select
              value={formData.shippingMemo}
              onValueChange={(value) =>
                setFormData({ ...formData, shippingMemo: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="배송 메모 선택 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                {shippingMemos.map((memo) => (
                  <SelectItem key={memo.value} value={memo.value || "none"}>
                    {memo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.shippingMemo === "custom" && (
              <Input
                placeholder="배송 메모를 입력해주세요"
                value={customMemo}
                onChange={(e) => setCustomMemo(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Payment Method */}
      <section>
        <h2 className="text-lg font-bold mb-4">결제 수단</h2>
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              paymentMethod: value as CheckoutFormData["paymentMethod"],
            })
          }
          orientation="horizontal"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          <RadioCard value="card" label="신용/체크카드" />
          <RadioCard value="bank" label="계좌이체" />
          <RadioCard value="kakao" label="카카오페이" />
          <RadioCard value="naver" label="네이버페이" />
          <RadioCard value="toss" label="토스페이" />
        </RadioGroup>

        {/* Inner Circle Benefits */}
        {isInnerCircle && (
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-primary">
              🎁 이너 써클 회원 혜택이 적용됩니다
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• 상품 가격 10% 할인</li>
              <li>• 3만원 이상 구매 시 무료배송</li>
              <li>• 구매 금액의 1% 기부</li>
            </ul>
          </div>
        )}
      </section>

      <Separator />

      {/* Agreements */}
      <section>
        <h2 className="text-lg font-bold mb-4">약관 동의</h2>
        <div className="space-y-3">
          <Checkbox
            label="주문 내용을 확인했으며, 결제에 동의합니다 (필수)"
            checked={formData.agreeTerms}
            onChange={(e) =>
              setFormData({ ...formData, agreeTerms: e.target.checked })
            }
          />
          <Checkbox
            label="환불/교환 정책에 동의합니다 (필수)"
            description="제품 특성상 개봉 후 반품이 불가합니다."
            checked={formData.agreeRefund}
            onChange={(e) =>
              setFormData({ ...formData, agreeRefund: e.target.checked })
            }
          />
        </div>
      </section>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!canSubmit || isLoading}
      >
        {isLoading ? "처리 중..." : "결제하기"}
      </Button>
    </form>
  );
}

export default CheckoutForm;
