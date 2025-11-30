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
      {/* Hero - 지뢰계 스타일 ♡ */}
      <section className="bg-gradient-to-b from-primary/15 via-accent/10 to-background py-16 lg:py-24 dark:from-primary/20 dark:via-secondary/10 relative overflow-hidden">
        {/* 지뢰계 floating decorations ♡✧🎀 */}
        <div className="absolute top-12 left-10 text-4xl opacity-20 animate-heart-beat pointer-events-none">♡</div>
        <div className="absolute top-20 right-16 text-3xl opacity-15 animate-sparkle-twinkle pointer-events-none">✧</div>
        <div className="absolute bottom-16 left-1/4 text-2xl opacity-15 animate-ribbon-flutter pointer-events-none">🎀</div>
        <div className="absolute top-1/3 right-10 text-xl opacity-10 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>☆</div>
        <div className="absolute bottom-20 right-1/3 text-3xl opacity-15 animate-heart-beat pointer-events-none" style={{ animationDelay: '1s' }}>💗</div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center relative">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-sparkle-twinkle">✧</span>
            <span className="text-6xl animate-soft-float">🧸</span>
            <span className="text-4xl animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}>✧</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground lg:text-5xl dark:text-transparent dark:bg-gradient-to-r dark:from-[#FF69B4] dark:to-[#9D4EDD] dark:bg-clip-text">
            TeddyBear&apos;s Room
            <br />
            <span className="text-primary">멤버십</span>
            <span className="text-2xl ml-2 animate-heart-beat">♡</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            특별한 혜택과 함께 더 특별한 경험을 만들어보세요 ✧
            <br />
            구독하고, 기부하고, 함께 성장해요 ♡
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          {/* MVP: 단일 멤버십 - 중앙 정렬 */}
          <div className="flex justify-center">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative rounded-3xl transition-all duration-300 hover:-translate-y-1 max-w-md w-full ${
                  plan.popular
                    ? "border-2 border-primary shadow-lg shadow-primary/20 dark:neon-card dark:neon-glow"
                    : "border-border hover:shadow-lg dark:neon-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground dark:neon-glow-subtle">
                      🔥 인기 플랜
                    </span>
                  </div>
                )}
                <CardHeader className="p-8 text-center">
                  <span className="text-5xl mb-2 block">{plan.icon}</span>
                  <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary dark:neon-text">
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
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary dark:bg-primary/30">
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
                    className={`w-full rounded-xl py-6 text-lg transition-all ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
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
              💡 <span className="font-medium text-primary">멤버십 혜택:</span> 포인트 적립 + 기부 참여 + 무료 배송까지!
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 lg:py-16 bg-muted/30 dark:bg-card/30">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            🔍 플랜 비교
          </h2>
          <div className="rounded-2xl bg-card border border-border overflow-hidden dark:neon-card">
            <PlanComparisonTable />
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-gradient-to-r from-secondary/10 to-primary/10 py-16 dark:from-secondary/20 dark:to-primary/20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="text-5xl mb-4 block animate-float">💝</span>
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            함께하는 기부
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            TeddyBear&apos;s Room은 매출의 일부를 사회에 환원합니다.
            <br />
            구독자 여러분이 기부처를 직접 선택할 수 있어요.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1 dark:neon-card dark:hover:border-primary/50">
              <span className="text-3xl">🌱</span>
              <p className="mt-2 font-medium text-foreground">환경 단체</p>
              <p className="text-xs text-muted-foreground mt-1">지구 환경 보호</p>
            </div>
            <div className="rounded-2xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1 dark:neon-card dark:hover:border-primary/50">
              <span className="text-3xl">🐾</span>
              <p className="mt-2 font-medium text-foreground">동물 복지</p>
              <p className="text-xs text-muted-foreground mt-1">유기동물 보호</p>
            </div>
            <div className="rounded-2xl bg-card p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-1 dark:neon-card dark:hover:border-primary/50">
              <span className="text-3xl">👶</span>
              <p className="mt-2 font-medium text-foreground">아동 보호</p>
              <p className="text-xs text-muted-foreground mt-1">취약 아동 지원</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            매월 초, 구독자 투표로 이달의 기부처가 결정됩니다 🗳️
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            ❓ 자주 묻는 질문
          </h2>
          <FAQAccordion faqs={subscriptionFAQs} />
        </div>
      </section>

      {/* Final CTA - 지뢰계 스타일 ♡ */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/10 dark:to-primary/15 relative overflow-hidden">
        {/* 지뢰계 decorations */}
        <div className="absolute top-8 left-16 text-3xl opacity-15 animate-sparkle-twinkle pointer-events-none">✧</div>
        <div className="absolute bottom-12 right-16 text-2xl opacity-15 animate-heart-beat pointer-events-none">♡</div>

        <div className="mx-auto max-w-2xl px-4 lg:px-8 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl animate-heart-beat">♡</span>
            <h2 className="text-2xl font-bold text-foreground">
              지금 시작해보세요!
            </h2>
            <span className="text-3xl animate-sparkle-twinkle">✧</span>
          </div>
          <p className="text-muted-foreground mb-6">
            첫 달 구독료 50% 할인 혜택을 놓치지 마세요 ♡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
            >
              멤버십 시작하기 🐻
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
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
