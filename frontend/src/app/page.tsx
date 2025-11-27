import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32 dark:from-primary/5 dark:via-background dark:to-secondary/5 dark:matrix-bg">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2 text-sm font-medium text-accent-foreground dark:bg-primary/10 dark:border dark:border-primary/30 dark:neon-glow-subtle">
                <span className="animate-bounce-slow">🧸</span>
                <span className="dark:text-primary">TeddyBear&apos;s Room에 오신 것을 환영해요</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                <span className="text-primary dark:neon-text dark:neon-flicker">파스텔 감성</span>의<br />
                프라이빗 셀프케어
              </h1>
              <p className="text-lg text-muted-foreground">
                귀엽고 아늑한 분위기 속에서 나만의 특별한 시간을 만들어보세요.
                <br />
                TeddyBear&apos;s Room이 함께할게요.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
                >
                  <Link href="/products">상품 둘러보기</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-primary text-primary hover:bg-primary/10 dark:border-secondary dark:text-secondary dark:hover:bg-secondary/10 dark:hover:neon-text"
                >
                  <Link href="/subscribe">구독 혜택 보기</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center dark:from-primary/10 dark:to-secondary/10 dark:neon-card">
                <span className="text-[200px] animate-float">🧸</span>
              </div>
              {/* Decorative neon orbs for dark mode */}
              <div className="hidden dark:block absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
              <div className="hidden dark:block absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 dark:matrix-bg">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground dark:neon-text">인기 상품</h2>
              <p className="mt-2 text-muted-foreground">
                지금 가장 사랑받는 아이템들을 만나보세요
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-primary hover:text-primary/90 dark:hover:neon-text"
            >
              <Link href="/products">전체 보기 →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16 lg:py-24 dark:from-primary/5 dark:via-accent/5 dark:to-secondary/5 dark:matrix-bg">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-5xl mb-4 block animate-float">🐻</span>
            <h2 className="text-3xl font-bold text-foreground dark:neon-text dark:neon-flicker">
              스탠다드 멤버십
            </h2>
            <p className="mt-2 text-muted-foreground">
              월 19,900원으로 특별한 혜택을 누리세요
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {subscriptionBenefits.map((benefit, index) => (
              <Card key={index} className="rounded-2xl border-border bg-card/50 backdrop-blur dark:neon-card dark:bg-card/30">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-4 block animate-sparkle">{benefit.icon}</span>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle dark:hover:neon-glow"
            >
              <Link href="/subscribe">구독 시작하기</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground dark:text-secondary">
              👑 프리미엄 멤버십도 있어요! 혜택 2배, 가격은 절반만 더!
            </p>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:neon-card dark:neon-glow-subtle group-hover:animate-wiggle transition-transform">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">프라이버시 보장</h3>
              <p className="mt-2 text-muted-foreground">
                무지 박스 배송과 안전한 결제로 프라이버시를 보장해요
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 dark:bg-secondary/20 dark:neon-glow-subtle group-hover:animate-wiggle transition-transform" style={{ '--primary': 'var(--secondary)' } as React.CSSProperties}>
                <span className="text-3xl">💕</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">기부 투표</h3>
              <p className="mt-2 text-muted-foreground">
                매출의 일부를 사회에 환원하고, 구독자가 기부처를 선택해요
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 dark:neon-glow-subtle group-hover:animate-wiggle transition-transform" style={{ '--primary': 'var(--accent)' } as React.CSSProperties}>
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">큐레이션</h3>
              <p className="mt-2 text-muted-foreground">
                엄선된 고품질 상품만을 파스텔 감성으로 선보여요
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
