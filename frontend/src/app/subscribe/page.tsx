"use client";

// ====================================
// TeddyBear's Room - Subscribe Page
// Enhanced subscription membership page
// ====================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { subscriptionPlans, subscriptionFAQs } from "@/lib/data";

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#C8A2C8]/15 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Subscription
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-display text-foreground">
            TeddyBear&apos;s Room
            <br />
            <span className="text-primary">Roommate</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            특별한 혜택과 함께 더 특별한 경험을 만들어보세요
            <br />
            구독하고, 기부하고, 함께 성장해요
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          {/* MVP: 단일 멤버십 - 중앙 정렬 */}
          <div className="flex justify-center">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-3xl transition-all duration-300 hover:-translate-y-1 max-w-md w-full ${plan.popular
                    ? "border-2 border-primary shadow-lg shadow-primary/20"
                    : "border-border hover:shadow-lg"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      추천
                    </span>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <span className="text-5xl mb-2 block">{plan.icon}</span>
                  <h2 className="text-2xl font-display text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">원/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                            ✓
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            –
                          </span>
                        )}
                        <span
                          className={
                            feature.included ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button
                    className={`w-full rounded-full py-6 text-lg transition-all ${plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Value Message */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Roommate 혜택:</span> 10% 상시 할인 + 1% 기부 + 3만원↑ 무료배송!
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-display text-foreground text-center mb-8">
            플랜 비교
          </h2>
          <div className="rounded-3xl bg-card border border-border overflow-hidden">
            <PlanComparisonTable />
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-[#C8A2C8]/15 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <span className="text-5xl mb-4 block">💝</span>
          <h2 className="text-2xl font-display text-foreground lg:text-3xl">
            함께하는 기부
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            TeddyBear&apos;s Room은 매출의 일부를 사회에 환원합니다.
            <br />
            구독자 여러분이 기부처를 직접 선택할 수 있어요.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="text-3xl">🌱</span>
              <p className="mt-2 font-medium text-foreground">환경 단체</p>
              <p className="text-xs text-muted-foreground mt-1">지구 환경 보호</p>
            </div>
            <div className="rounded-3xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="text-3xl">🐾</span>
              <p className="mt-2 font-medium text-foreground">동물 복지</p>
              <p className="text-xs text-muted-foreground mt-1">유기동물 보호</p>
            </div>
            <div className="rounded-3xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1">
              <span className="text-3xl">👶</span>
              <p className="mt-2 font-medium text-foreground">아동 보호</p>
              <p className="text-xs text-muted-foreground mt-1">취약 아동 지원</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            매월 초, 구독자 투표로 이달의 기부처가 결정됩니다
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-display text-foreground text-center mb-8">
            자주 묻는 질문
          </h2>
          <FAQAccordion faqs={subscriptionFAQs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-2xl px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display text-foreground mb-4">
            지금 시작해보세요!
          </h2>
          <p className="text-muted-foreground mb-6">
            첫 달 구독료 50% 할인 혜택을 놓치지 마세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Roommate 되기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link href="/products">상품 먼저 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
