/**
 * Contact Page
 * TeddyBear's Room - 1:1 문의
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: "📧",
    title: "이메일 문의",
    description: "help@teddybearsroom.com",
    note: "영업일 기준 24시간 내 답변",
    color: "from-[#FFB5C5] to-[#E8A8C8]",
  },
  {
    icon: "💬",
    title: "카카오톡 채널",
    description: "@teddybearsroom",
    note: "평일 10:00 - 18:00 운영",
    color: "from-[#C9A8E2] to-[#8BD4C0]",
  },
];

const inquiryTypes = [
  { id: "order", label: "주문/결제 문의", icon: "🛒" },
  { id: "shipping", label: "배송 문의", icon: "📦" },
  { id: "return", label: "교환/반품 문의", icon: "🔄" },
  { id: "product", label: "상품 문의", icon: "🧸" },
  { id: "member", label: "회원/계정 문의", icon: "👤" },
  { id: "other", label: "기타 문의", icon: "💬" },
];

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <section className="relative py-32 lg:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />

          <div className="container relative z-10 px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#7DD3C0] to-[#5BC4B0] flex items-center justify-center text-white text-5xl shadow-lg">
                ✓
              </div>
              <h1 className="text-3xl font-bold text-[#2D2D2D] mb-4">
                문의가 접수되었습니다!
              </h1>
              <p className="text-[#6B6B6B] mb-8">
                영업일 기준 24시간 내에 답변드리겠습니다.
                <br />
                답변은 입력하신 이메일로 발송됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  홈으로 가기
                </Link>
                <Link
                  href="/support/faq"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#6B6B6B] px-8 py-3 rounded-2xl font-medium border border-[#FFE8EE] hover:bg-[#FFF5F7] transition-all"
                >
                  FAQ 보기
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#FFD6E0] opacity-30 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">💌</span>
              <span className="text-sm font-medium text-[#E8879C]">Contact</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              1:1 문의
            </h1>
            <p className="text-[#6B6B6B]">
              무엇이든 물어보세요. 친절하게 답변드릴게요.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            {/* Contact Methods */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-[#FFE8EE]/50 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${method.color} text-3xl mb-4`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-[#2D2D2D] mb-1">
                    {method.title}
                  </h3>
                  <p className="text-[#E8879C] font-medium mb-1">
                    {method.description}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">{method.note}</p>
                </div>
              ))}
            </div>

            {/* Inquiry Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">
                문의하기
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-3">
                    문의 유형 <span className="text-[#E8879C]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          "px-4 py-3 rounded-2xl border text-left transition-all duration-300",
                          selectedType === type.id
                            ? "bg-gradient-to-r from-[#FFE8EE] to-[#F3E8FF] border-[#FFB5C5]"
                            : "bg-white border-[#FFE8EE] hover:border-[#FFB5C5]"
                        )}
                      >
                        <span className="text-xl mr-2">{type.icon}</span>
                        <span
                          className={cn(
                            "text-sm",
                            selectedType === type.id
                              ? "text-[#E8879C] font-medium"
                              : "text-[#6B6B6B]"
                          )}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                      이름 <span className="text-[#E8879C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-[#FFE8EE] focus:border-[#FFB5C5] focus:ring-2 focus:ring-[#FFB5C5]/20 outline-none transition-all bg-white"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                      이메일 <span className="text-[#E8879C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-[#FFE8EE] focus:border-[#FFB5C5] focus:ring-2 focus:ring-[#FFB5C5]/20 outline-none transition-all bg-white"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Order Number (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    주문번호{" "}
                    <span className="text-[#8B8B8B] font-normal">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-[#FFE8EE] focus:border-[#FFB5C5] focus:ring-2 focus:ring-[#FFB5C5]/20 outline-none transition-all bg-white"
                    placeholder="주문 관련 문의 시 입력해주세요"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    제목 <span className="text-[#E8879C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-[#FFE8EE] focus:border-[#FFB5C5] focus:ring-2 focus:ring-[#FFB5C5]/20 outline-none transition-all bg-white"
                    placeholder="문의 제목을 입력해주세요"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    문의 내용 <span className="text-[#E8879C]">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border border-[#FFE8EE] focus:border-[#FFB5C5] focus:ring-2 focus:ring-[#FFB5C5]/20 outline-none transition-all bg-white resize-none"
                    placeholder="문의하실 내용을 자세히 적어주세요"
                  />
                </div>

                {/* Privacy Notice */}
                <div className="bg-[#FFF5F7] rounded-2xl p-4">
                  <p className="text-xs text-[#6B6B6B]">
                    문의 접수 및 답변을 위해 개인정보(이름, 이메일)를 수집합니다.
                    수집된 정보는 문의 처리 후 1년간 보관되며, 이후 안전하게 파기됩니다.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedType}
                  className="w-full bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] hover:from-[#FFA5B8] hover:to-[#D898B8] text-white py-6 rounded-2xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      전송 중...
                    </span>
                  ) : (
                    "문의 접수하기"
                  )}
                </Button>
              </form>
            </div>

            {/* FAQ Link */}
            <div className="mt-8 text-center">
              <p className="text-[#6B6B6B] mb-2">
                자주 묻는 질문에서 먼저 답을 찾아보세요
              </p>
              <Link
                href="/support/faq"
                className="inline-flex items-center gap-2 text-[#E8879C] hover:text-[#D87790] font-medium transition-colors"
              >
                FAQ 바로가기
                <span>→</span>
              </Link>
            </div>

            {/* Back to Home */}
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#E8879C] hover:text-[#D87790] transition-colors"
              >
                <span>←</span>
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
