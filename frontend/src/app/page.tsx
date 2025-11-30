import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - 지뢰계 스타일 ♡ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/15 py-20 lg:py-32 dark:from-primary/10 dark:via-background dark:to-accent/10">
        {/* 지뢰계 floating decorations ♡✧🎀 */}
        <div className="absolute top-16 left-8 text-4xl opacity-30 animate-float">♡</div>
        <div className="absolute top-32 right-16 text-3xl opacity-25 animate-sparkle-twinkle">✧</div>
        <div className="absolute top-48 left-1/3 text-2xl opacity-20 animate-ribbon-flutter">🎀</div>
        <div className="absolute bottom-24 left-16 text-3xl opacity-20 animate-heart-beat">💗</div>
        <div className="absolute bottom-32 right-1/4 text-2xl opacity-25 animate-float" style={{ animationDelay: '0.7s' }}>☆</div>
        <div className="absolute top-1/2 left-8 text-xl opacity-15 animate-sparkle-twinkle" style={{ animationDelay: '1.2s' }}>✦</div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/30 via-secondary/40 to-accent/30 px-5 py-2.5 text-sm font-bold text-foreground shadow-lg border border-primary/20 dark:bg-primary/10 dark:border dark:border-primary/40 dark:shadow-[0_0_15px_rgba(255,105,180,0.2)]">
                <span className="animate-heart-beat text-xl">🎀</span>
                <span className="dark:text-primary">TeddyBear&apos;s Room에 오신 것을 환영해요!</span>
                <span className="animate-sparkle-twinkle">✧</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                <span className="text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text dark:from-[#FF69B4] dark:via-[#9D4EDD] dark:to-[#FF69B4]">지뢰계 감성</span>의<br />
                <span className="relative">
                  프라이빗 셀프케어
                  <span className="absolute -right-8 top-0 text-2xl animate-heart-beat">♡</span>
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                파스텔 핑크와 라벤더 속에서 나만의 특별한 시간을 만들어보세요 ♡
                <br />
                TeddyBear&apos;s Room이 달콤하게 함께할게요 ✧
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl shadow-[0_4px_20px_rgba(255,182,193,0.4)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.6)]"
                >
                  <Link href="/products">🎀 상품 둘러보기</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-accent/50 hover:border-accent hover:bg-accent/10"
                >
                  <Link href="/subscribe">♡ 구독 혜택 보기</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/25 p-8 flex items-center justify-center shadow-[0_20px_60px_rgba(255,182,193,0.25)] border-2 border-primary/30 dark:from-primary/15 dark:via-secondary/10 dark:to-accent/15 dark:shadow-[0_0_60px_rgba(255,105,180,0.2)] dark:border-primary/40">
                <span className="text-[180px] animate-soft-float drop-shadow-2xl">🧸</span>
              </div>
              {/* 지뢰계 decorative elements ♡✧🎀 */}
              <div className="absolute -top-4 -right-4 text-3xl animate-sparkle-twinkle">✧</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-heart-beat" style={{ animationDelay: '0.3s' }}>♡</div>
              <div className="absolute top-1/2 -right-6 text-xl animate-ribbon-flutter" style={{ animationDelay: '0.7s' }}>🎀</div>
              <div className="absolute top-1/4 -left-4 text-lg animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}>☆</div>
              {/* Decorative pink/purple orbs for dark mode */}
              <div className="hidden dark:block absolute -top-10 -right-10 w-40 h-40 bg-[#FF69B4]/20 rounded-full blur-3xl animate-pink-glow-pulse" />
              <div className="hidden dark:block absolute -bottom-10 -left-10 w-32 h-32 bg-[#9D4EDD]/20 rounded-full blur-3xl animate-pink-glow-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - 지뢰계 ♡ */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute top-10 right-10 text-3xl opacity-15 animate-ribbon-flutter">🎀</div>
        <div className="absolute bottom-16 left-8 text-2xl opacity-10 animate-heart-beat">♡</div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl animate-heart-beat">♡</span>
                <h2 className="text-3xl font-bold text-foreground dark:text-transparent dark:bg-gradient-to-r dark:from-[#FF69B4] dark:to-[#9D4EDD] dark:bg-clip-text">인기 상품</h2>
              </div>
              <p className="text-muted-foreground">
                지금 가장 사랑받는 아이템들을 만나보세요 ✧
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-2xl border-primary/40 hover:border-primary"
            >
              <Link href="/products">전체 보기 →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA - 지뢰계 ♡ */}
      <section className="bg-gradient-to-r from-primary/15 via-accent/10 to-secondary/15 py-16 lg:py-24 dark:from-primary/10 dark:via-accent/5 dark:to-secondary/10 relative overflow-hidden">
        {/* 지뢰계 decorative elements */}
        <div className="absolute top-10 left-10 text-5xl opacity-15 animate-ribbon-flutter">🎀</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-heart-beat" style={{ animationDelay: '1s' }}>♡</div>
        <div className="absolute top-1/2 right-16 text-3xl opacity-10 animate-sparkle-twinkle">✧</div>
        <div className="absolute bottom-1/4 left-16 text-2xl opacity-10 animate-float">☆</div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-sparkle-twinkle">✧</span>
              <span className="text-6xl animate-soft-float">🧸</span>
              <span className="text-4xl animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}>✧</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground dark:text-transparent dark:bg-gradient-to-r dark:from-[#FF69B4] dark:to-[#9D4EDD] dark:bg-clip-text">
              스탠다드 멤버십
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              월 <span className="text-primary font-bold">19,900원</span>으로 특별한 혜택을 누리세요 ♡
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {subscriptionBenefits.map((benefit, index) => (
              <Card key={index} className="rounded-3xl border-2 border-primary/25 bg-card/70 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(255,182,193,0.25)] dark:bg-card/30 dark:border-primary/40 dark:hover:shadow-[0_0_30px_rgba(255,105,180,0.2)] group">
                <CardContent className="p-6 text-center">
                  <span className="text-5xl mb-4 block group-hover:animate-heart-beat transition-transform">{benefit.icon}</span>
                  <h3 className="font-bold text-foreground text-lg">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl text-lg px-10 shadow-[0_4px_20px_rgba(255,182,193,0.4)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.6)]"
            >
              <Link href="/subscribe">✧ 구독 시작하기</Link>
            </Button>
            <p className="mt-6 text-muted-foreground dark:text-secondary">
              ♡ <span className="font-bold text-primary">프리미엄 멤버십</span>도 있어요! 혜택 2배, 가격은 절반만 더!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Brand Values - 지뢰계 ♡ */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute top-12 left-12 text-2xl opacity-10 animate-sparkle-twinkle">✧</div>
        <div className="absolute bottom-12 right-12 text-2xl opacity-10 animate-heart-beat">♡</div>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <span className="text-3xl animate-sparkle-twinkle">✧</span>
              TeddyBear&apos;s Room만의 특별함
              <span className="text-3xl animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }}>✧</span>
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/15 border-2 border-primary/25 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(255,182,193,0.2)]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg dark:bg-card/80 dark:shadow-[0_0_20px_rgba(255,105,180,0.15)] group-hover:scale-110 transition-transform">
                <span className="text-4xl group-hover:animate-heart-beat">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">프라이버시 보장</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                무지 박스 배송과 안전한 결제로<br />프라이버시를 완벽히 보장해요 ✧
              </p>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-secondary/10 to-secondary/15 border-2 border-secondary/25 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,208,224,0.2)]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg dark:bg-card/80 dark:shadow-[0_0_20px_rgba(157,78,221,0.15)] group-hover:scale-110 transition-transform">
                <span className="text-4xl group-hover:animate-heart-beat">♡</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">기부 투표</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                매출의 일부를 사회에 환원하고<br />구독자가 기부처를 선택해요 ♡
              </p>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-gradient-to-br from-accent/10 to-accent/15 border-2 border-accent/25 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(197,163,255,0.2)]">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg dark:bg-card/80 dark:shadow-[0_0_20px_rgba(197,163,255,0.15)] group-hover:scale-110 transition-transform">
                <span className="text-4xl group-hover:animate-ribbon-flutter">🎀</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">큐레이션</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                엄선된 고품질 상품만을<br />지뢰계 감성으로 선보여요 ✧
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
