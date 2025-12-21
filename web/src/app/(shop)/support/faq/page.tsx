/**
 * FAQ Page
 * TeddyBear's Room - 자주 묻는 질문
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    id: "order",
    name: "주문/결제",
    icon: "🛒",
    faqs: [
      {
        question: "주문 취소는 어떻게 하나요?",
        answer:
          "주문 취소는 마이페이지 > 주문내역에서 '주문 취소' 버튼을 클릭하여 진행할 수 있습니다. 단, 배송 준비 중인 상품은 취소가 불가능할 수 있으니 고객센터로 문의해 주세요.",
      },
      {
        question: "결제 수단은 무엇이 있나요?",
        answer:
          "신용카드, 체크카드, 카카오페이, 토스페이, 네이버페이 등 다양한 결제 수단을 지원합니다. 무통장입금도 가능합니다.",
      },
      {
        question: "영수증/세금계산서 발급이 가능한가요?",
        answer:
          "네, 현금영수증 및 세금계산서 발급이 가능합니다. 주문 시 요청하시거나, 주문 완료 후 고객센터로 문의해 주세요.",
      },
    ],
  },
  {
    id: "shipping",
    name: "배송",
    icon: "📦",
    faqs: [
      {
        question: "배송은 얼마나 걸리나요?",
        answer:
          "일반적으로 결제 완료 후 1-3일 내에 배송됩니다. 주문량에 따라 배송이 지연될 수 있으며, 자세한 내용은 배송조회를 통해 확인하실 수 있습니다.",
      },
      {
        question: "무료배송 조건은 무엇인가요?",
        answer:
          "일반 고객은 5만원 이상 구매 시 무료배송됩니다. Roommate(이너 서클) 회원은 3만원 이상 구매 시 무료배송 혜택을 받으실 수 있습니다.",
      },
      {
        question: "배송 포장은 어떻게 되나요?",
        answer:
          "고객님의 프라이버시를 위해 무지박스로 배송됩니다. 외부에 상품명이나 브랜드명이 노출되지 않으며, 송장에도 '생활용품'으로 표기됩니다.",
      },
    ],
  },
  {
    id: "return",
    name: "교환/반품",
    icon: "🔄",
    faqs: [
      {
        question: "교환/반품 신청은 어떻게 하나요?",
        answer:
          "마이페이지 > 주문내역에서 교환/반품 신청이 가능합니다. 상품 수령 후 7일 이내에 신청해 주세요.",
      },
      {
        question: "교환/반품이 불가능한 경우는 언제인가요?",
        answer:
          "위생상의 이유로 포장을 개봉했거나 사용한 상품은 교환/반품이 불가합니다. 또한 고객 부주의로 인한 상품 훼손 시에도 교환/반품이 제한됩니다.",
      },
      {
        question: "교환/반품 배송비는 어떻게 되나요?",
        answer:
          "단순 변심의 경우 왕복 배송비(5,000원)가 발생합니다. 상품 하자나 오배송의 경우에는 무료로 교환/반품이 가능합니다.",
      },
    ],
  },
  {
    id: "member",
    name: "회원/계정",
    icon: "👤",
    faqs: [
      {
        question: "회원가입 시 성인인증이 필요한가요?",
        answer:
          "네, TeddyBear's Room은 성인용품을 판매하므로 만 19세 이상만 가입 가능합니다. 회원가입 시 PASS 본인인증을 통해 성인인증을 진행합니다.",
      },
      {
        question: "비밀번호를 잊어버렸어요.",
        answer:
          "로그인 페이지에서 '비밀번호 찾기'를 클릭하시면 가입 시 등록한 이메일로 비밀번호 재설정 링크가 발송됩니다.",
      },
      {
        question: "회원 탈퇴는 어떻게 하나요?",
        answer:
          "마이페이지 > 계정 설정에서 회원 탈퇴를 진행할 수 있습니다. 탈퇴 시 모든 개인정보와 구매 내역이 삭제되며, 복구가 불가능합니다.",
      },
    ],
  },
  {
    id: "roommate",
    name: "이너 서클",
    icon: "🏠",
    faqs: [
      {
        question: "Roommate(이너 서클)란 무엇인가요?",
        answer:
          "Roommate는 TeddyBear's Room의 멤버십 프로그램입니다. 월 9,900원에 10% 상시 할인, 3만원 이상 무료배송, 전용 할인 등 다양한 혜택을 받으실 수 있습니다.",
      },
      {
        question: "구독 해지는 어떻게 하나요?",
        answer:
          "마이페이지 > 멤버십 관리에서 언제든 구독을 해지할 수 있습니다. 해지 후에도 결제일까지는 혜택을 이용하실 수 있습니다.",
      },
      {
        question: "구독료 결제일은 언제인가요?",
        answer:
          "최초 가입일을 기준으로 매월 같은 날에 자동 결제됩니다. 결제 예정일 3일 전에 알림을 보내드립니다.",
      },
    ],
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#FFE8EE]/50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-[#FFF5F7]/50 px-4 -mx-4 rounded-xl transition-colors"
      >
        <span className="font-medium text-[#2D2D2D]">{faq.question}</span>
        <span
          className={cn(
            "text-[#E8879C] text-xl transition-transform duration-300",
            isOpen && "rotate-45"
          )}
        >
          +
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-[#6B6B6B] leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("order");
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  const currentCategory = faqCategories.find((c) => c.id === activeCategory);

  const toggleFAQ = (question: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(question)) {
      newOpenFAQs.delete(question);
    } else {
      newOpenFAQs.add(question);
    }
    setOpenFAQs(newOpenFAQs);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBF5] via-[#FFE8EE] to-[#F3E8FF]" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#FFD6E0] opacity-30 blur-[100px]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-sm border border-[#FFE8EE]">
              <span className="text-xl">❓</span>
              <span className="text-sm font-medium text-[#E8879C]">FAQ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2D2D]">
              자주 묻는 질문
            </h1>
            <p className="text-[#6B6B6B]">
              궁금하신 점이 있으신가요? 아래에서 답을 찾아보세요.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white shadow-lg"
                      : "bg-white/80 text-[#6B6B6B] hover:bg-[#FFF5F7] border border-[#FFE8EE]"
                  )}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            {currentCategory && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-[#FFE8EE]/50">
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 flex items-center gap-2">
                  <span className="text-2xl">{currentCategory.icon}</span>
                  {currentCategory.name}
                </h2>
                <div className="space-y-1">
                  {currentCategory.faqs.map((faq) => (
                    <FAQItem
                      key={faq.question}
                      faq={faq}
                      isOpen={openFAQs.has(faq.question)}
                      onToggle={() => toggleFAQ(faq.question)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-gradient-to-r from-[#FFE8EE] via-[#F3E8FF] to-[#E8FFF5] rounded-3xl p-8">
              <p className="text-[#6B6B6B] mb-4">
                원하시는 답변을 찾지 못하셨나요?
              </p>
              <Link
                href="/support/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB5C5] to-[#E8A8C8] text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                1:1 문의하기
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
