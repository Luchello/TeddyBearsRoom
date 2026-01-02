/**
 * Homepage
 * TeddyBear's Room - "Soft Whimsyshire" Theme
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsSection } from "./products-section";
import { HeroCircle } from "./hero-circle";
import { cn } from "@/lib/utils";

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-silk-texture silk-texture opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-secondary)_0%,transparent_50%),radial-gradient(circle_at_bottom_left,var(--color-accent)_0%,transparent_50%)] opacity-20" />

      {/* Premium Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-float" />
        <div className="absolute bottom-[5%] right-[-10%] w-[800px] h-[800px] rounded-full bg-accent/10 blur-[150px] animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-12">
            <div className="inline-flex animate-reveal">
              <span className="badge-silk px-6 py-2">
                <span className="mr-2 opacity-60">✧</span>
                Premium Adult Lifestyle
                <span className="ml-2 opacity-60">✧</span>
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-foreground">
                <span className="block opacity-90">Skin Deep,</span>
                <span className="text-premium">
                  Silk Smooth.
                </span>
              </h1>
            </div>

            <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              당신의 가장 사적인 공간을 위한 프리미엄 큐레이션.
              <br />
              <span className="text-foreground/90 font-bold">TeddyBear&apos;s Room</span>에서 감각의 혁명을 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 animate-reveal" style={{ animationDelay: '0.4s' }}>
              <Button
                size="xl"
                className="btn-premium px-12 h-16 text-xl min-w-[200px]"
                asChild
              >
                <Link href="/products" className="flex items-center gap-3">
                  Shop Collection
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="rounded-full px-12 h-16 text-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all min-w-[200px]"
                asChild
              >
                <Link href="/about">Our Philosophy</Link>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:flex items-center justify-center animate-reveal" style={{ animationDelay: '0.2s' }}>
            <HeroCircle />
            <div className="absolute -top-10 -right-10 text-[200px] font-black italic opacity-[0.03] select-none text-primary pointer-events-none">TBR</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 animate-bounce">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-foreground" />
      </div>
    </section>
  );
}

// ============================================================
// ROOMMATE SECTION
// ============================================================
function RoommateSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-muted/30">
      <div className="container relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="card-premium p-10 sm:p-20 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-10">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner-silk text-4xl group-hover:scale-110 transition-transform duration-500">
                  🎁
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
                    Become a <br />
                    <span className="text-premium">Roommate</span>
                  </h2>
                  <p className="text-foreground/70 text-xl leading-relaxed font-medium">
                    매달 감각적인 서프라이즈가 찾아옵니다.
                    <br />
                    당신의 취향을 깊게 파고드는 스페셜 큐레이션 박스.
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['15% 상시 할인', '시크릿 굿즈 증정', '우선 배송 서비스', '1% 기부 참여'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80 font-bold text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  size="xl"
                  className="btn-premium w-full sm:w-auto px-10"
                  asChild
                >
                  <Link href="/inner-circle" className="flex items-center gap-3 justify-center">
                    Join the Inner Circle
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
              </div>

              {/* Right Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative animate-float">
                  <div className="w-[320px] h-[400px] bg-gradient-to-br from-white to-secondary/50 rounded-[40px] shadow-2xl border border-white/40 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-silk-texture silk-texture opacity-[0.03]" />
                    <div className="text-9xl filter drop-shadow-2xl">📦</div>
                    <div className="absolute top-8 right-8 text-3xl opacity-20 animate-pulse-glow">✨</div>
                    <div className="absolute bottom-8 left-8 text-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '-1s' }}>💖</div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-8 -right-8 card-premium px-8 py-5 shadow-2xl bg-white/90 backdrop-blur-md">
                    <p className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">Guaranteed</p>
                    <p className="text-xl font-black text-foreground">100% Cotton Base</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// REVIEWS SECTION
// ============================================================
function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    { id: 1, content: "디자인이 너무 세련되어서 화장대에 두기만 해도 기분이 좋아요. 촉감이 정말 실크 같네요.", author: "S*** Silk", emoji: "🧴" },
    { id: 2, content: "지금까지 경험해보지 못한 부드러움이에요. 패키징도 시크하고 프라이빗해서 만족합니다.", author: "M*** Night", emoji: "🌙" },
    { id: 3, content: "색감이 정말 고급스러워요. 인테리어 소품이라고 해도 믿을 것 같아요!", author: "G*** Skin", emoji: "✨" },
  ];

  const nextSlide = useCallback(() => setCurrentIndex((p) => (p + 1) % reviews.length), [reviews.length]);
  const prevSlide = useCallback(() => setCurrentIndex((p) => (p - 1 + reviews.length) % reviews.length), [reviews.length]);

  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container relative z-10 px-4">
        <div className="text-center mb-20 space-y-6">
          <span className="badge-silk mx-auto">
            <span>💌 Curated Reviews</span>
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
            Loved by <span className="text-premium">Thousands</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-20 z-10">
            <button onClick={prevSlide} className="w-14 h-14 bg-white border shadow-xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-20 z-10">
            <button onClick={nextSlide} className="w-14 h-14 bg-white border shadow-xl rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div className="overflow-visible">
            <div className="flex transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)]" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="card-premium p-10 sm:p-16 text-center bg-white/40 border-white/60 relative">
                    <div className="text-6xl mb-10 filter drop-shadow-lg">{review.emoji}</div>
                    <blockquote className="text-2xl sm:text-3xl text-foreground font-medium leading-relaxed mb-10 italic">
                      &ldquo;{review.content}&rdquo;
                    </blockquote>
                    <cite className="text-sm font-black text-primary tracking-[0.2em] uppercase not-italic">
                      - {review.author}
                    </cite>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentIndex === i ? "w-12 bg-primary" : "w-1.5 bg-primary/20 hover:bg-primary/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProductsSection />
      <ReviewsSection />
      <RoommateSection />
    </div>
  );
}
