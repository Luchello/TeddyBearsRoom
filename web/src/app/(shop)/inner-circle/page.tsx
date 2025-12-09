/**
 * Inner Circle Page
 * TeddyBear's Room - Subscription Program Landing
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const benefits = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
        <path d="M2 9v1c0 1.1.9 2 2 2h1" />
        <path d="M16 11h.01" />
      </svg>
    ),
    title: "10% 상시 할인",
    description: "모든 상품에 대해 10% 추가 할인을 받으세요. 세일 상품도 중복 적용!",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
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
    ),
    title: "무료 배송",
    description: "3만원 이상 구매 시 무료 배송. 일반 회원보다 낮은 무료배송 기준!",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    title: "1% 기부 참여",
    description: "구매 금액의 1%가 성소수자 인권단체에 기부됩니다. 함께 더 나은 세상을!",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    title: "우선 접근권",
    description: "신상품, 한정판 상품에 대한 우선 구매 및 사전 알림 제공",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    title: "전문 상담",
    description: "제품 선택, 사이즈 추천 등 1:1 전문 상담 서비스 제공",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "커뮤니티 접근",
    description: "이너 써클 전용 커뮤니티에서 솔직한 후기와 정보 공유",
  },
];

const faqs = [
  {
    question: "이너 써클은 어떻게 가입하나요?",
    answer:
      "회원가입 후 이너 써클 페이지에서 월 9,900원의 구독료를 결제하시면 즉시 멤버십이 활성화됩니다.",
  },
  {
    question: "할인은 어떻게 적용되나요?",
    answer:
      "장바구니와 결제 페이지에서 자동으로 10% 할인이 적용됩니다. 세일 상품도 추가 할인이 가능합니다.",
  },
  {
    question: "언제든지 해지할 수 있나요?",
    answer:
      "네, 마이페이지에서 언제든 해지가 가능합니다. 해지 시 다음 결제일까지 혜택을 유지하실 수 있습니다.",
  },
  {
    question: "기부는 어디로 전달되나요?",
    answer:
      "구매 금액의 1%는 성소수자 인권 증진을 위해 활동하는 비영리 단체에 기부됩니다. 분기별로 기부 내역을 투명하게 공개합니다.",
  },
];

const testimonials = [
  {
    content:
      "매달 구매하는 입장에서 10% 할인이 정말 체감이 커요. 구독료 이상의 가치를 받고 있습니다.",
    author: "김*현",
    duration: "6개월째 이용 중",
  },
  {
    content:
      "무료배송 기준이 낮아서 좋아요. 부담 없이 필요한 것만 주문할 수 있어요.",
    author: "이*민",
    duration: "3개월째 이용 중",
  },
  {
    content:
      "기부 참여가 가능한 게 마음에 들어요. 소비하면서도 좋은 일에 동참할 수 있다니!",
    author: "박*진",
    duration: "1년째 이용 중",
  },
];

export default function InnerCirclePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tbr-lavender/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tbr-lavender/20 via-transparent to-transparent" />

        <div className="container relative text-center">
          <Badge className="mb-6 bg-tbr-lavender text-tbr-lavender-foreground">
            🏠 Roommate
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-tbr-lavender-foreground">이너 써클</span>에
            <br />
            오신 것을 환영합니다
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            TeddyBear&apos;s Room의 특별한 멤버십.
            <br />
            더 많은 혜택, 더 나은 세상을 위한 선택.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">지금 시작하기</Link>
            </Button>
            <div className="text-center">
              <span className="text-3xl font-bold">9,900원</span>
              <span className="text-muted-foreground">/월</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">멤버십 혜택</h2>
            <p className="text-muted-foreground">
              이너 써클 멤버만을 위한 특별한 혜택들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-tbr-lavender/20 flex items-center justify-center text-tbr-lavender-foreground mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Calculator */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">얼마나 절약할 수 있을까요?</h2>
            <p className="text-muted-foreground mb-8">
              월 평균 구매 금액에 따른 절약 효과를 확인하세요
            </p>

            <div className="rounded-2xl border bg-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    월 5만원 구매 시
                  </p>
                  <p className="text-2xl font-bold text-tbr-mint-foreground">
                    -5,000원
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    구독료 차감 후 -900원/월
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    월 10만원 구매 시
                  </p>
                  <p className="text-2xl font-bold text-tbr-mint-foreground">
                    -10,000원
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    구독료 차감 후 +100원/월
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    월 20만원 구매 시
                  </p>
                  <p className="text-2xl font-bold text-tbr-mint-foreground">
                    -20,000원
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    구독료 차감 후 +10,100원/월
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                💡 월 10만원 이상 구매 시 구독료 이상의 절약 효과!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">멤버들의 이야기</h2>
            <p className="text-muted-foreground">
              이너 써클을 이용하는 분들의 솔직한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-2xl border bg-card p-6">
                <p className="text-sm mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{testimonial.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {testimonial.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">자주 묻는 질문</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-tbr-lavender/20 to-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 이너 써클에 가입하세요
          </h2>
          <p className="text-muted-foreground mb-8">
            첫 달 무료 체험 후, 월 9,900원으로 모든 혜택을 누리세요
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/register?plan=inner-circle">무료로 시작하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
