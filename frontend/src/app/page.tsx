import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { Sparkles, ArrowRight, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 🌈 Hero Section — Whimsyshire Sky */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B8E8FF] to-[#E8F8FF] z-0" />

        {/* Cloud decorations */}
        <div className="cloud absolute top-16 left-[10%] w-32 h-12 animate-[drift_12s_ease-in-out_infinite]" />
        <div className="cloud absolute top-28 right-[15%] w-24 h-8 opacity-50 animate-[drift_18s_ease-in-out_infinite_reverse]" />
        <div className="cloud absolute top-40 left-[40%] w-20 h-7 opacity-40 animate-[drift_15s_ease-in-out_infinite]" />

        {/* Sparkle decorations */}
        <span className="absolute top-24 right-[25%] text-3xl animate-sparkle pointer-events-none">✨</span>
        <span className="absolute top-48 left-[20%] text-2xl animate-sparkle pointer-events-none" style={{ animationDelay: '0.7s' }}>🌸</span>
        <span className="absolute bottom-32 right-[30%] text-3xl animate-sparkle pointer-events-none" style={{ animationDelay: '1.4s' }}>🌈</span>
        <span className="absolute bottom-48 left-[15%] text-2xl animate-sparkle pointer-events-none" style={{ animationDelay: '0.3s' }}>🧸</span>
        <span className="absolute top-36 left-[60%] text-xl animate-sparkle pointer-events-none" style={{ animationDelay: '2s' }}>⭐</span>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Typography */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/50 backdrop-blur-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#7C6BA8]">
                  🌈 TBR Whimsyshire Collection
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
                <span className="block rainbow-text">
                  Soft Outside,
                </span>
                <span className="block text-[#2D1B69] relative">
                  Wild Inside.
                  <svg className="absolute -bottom-4 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="rainbow-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="25%" stopColor="#FFD93D" />
                        <stop offset="50%" stopColor="#4ECDC4" />
                        <stop offset="75%" stopColor="#45B7D1" />
                        <stop offset="100%" stopColor="#FF6B9D" />
                      </linearGradient>
                    </defs>
                    <path d="M0 5 Q 50 10 100 5" stroke="url(#rainbow-line)" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-[#2D1B69]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                일상의 귀여움 뒤에 숨겨진 당신만의 본능.<br />
                <span className="font-bold text-[#FF6B9D]">당신만의 비밀 셀프케어</span>를 시작해보세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-lg px-8 py-7 bg-[#FF6B9D] text-white hover:bg-[#FF5189] transition-all duration-300 hover:scale-105 shadow-[0_8px_24px_rgba(255,107,157,0.35)]"
                >
                  <Link href="/products">
                    Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg px-8 py-7 border-2 border-[#2D1B69]/15 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                >
                  <Link href="/about">Our Story 🌸</Link>
                </Button>
              </div>
            </div>

            {/* Right: Visual Card */}
            <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center">
              <div className="relative w-[260px] h-[350px] sm:w-[400px] sm:h-[500px]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-white/90 backdrop-blur-xl border-2 border-white/60 shadow-[0_20px_60px_rgba(255,107,157,0.15),0_8px_32px_rgba(78,205,196,0.1)] -rotate-6 hover:rotate-0 transition-all duration-700 ease-out flex flex-col items-center justify-center overflow-hidden group rainbow-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D]/10 via-[#FFD93D]/10 to-[#4ECDC4]/10 opacity-50" />
                  <div className="relative w-48 h-48 drop-shadow-lg filter group-hover:scale-110 transition-all duration-300">
                    <Image src="/tbr_logo.png" alt="TBR Logo" fill className="object-contain" />
                  </div>
                  <div className="absolute bottom-10 px-6 py-2 bg-white/90 rounded-full shadow-sm text-sm font-bold tracking-wider uppercase rainbow-text">
                    Open the Magic Box 🌈
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <span className="absolute top-10 right-10 text-4xl animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>🧸</span>
              <span className="absolute bottom-20 left-5 text-3xl animate-float pointer-events-none" style={{ animationDelay: '1s' }}>🌼</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[#2D1B69]/20 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2D1B69]/50" />
          </div>
        </div>
      </section>

      {/* Featured Products — Meadow Section */}
      <section className="py-24 relative z-10 bg-[#F0FFF0]/80">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4 section-heading">
                ✨ Curated Pleasure
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                엄선된 아이템으로 당신의 취향을 발견하세요.
                <br />귀여움 속에 숨겨진 기능을 탐험해보세요.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="group text-lg font-medium hover:bg-transparent hover:text-primary p-0"
            >
              <Link href="/products" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA — Lavender Section */}
      <section className="py-24 relative overflow-hidden bg-[#F5F0FF]/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_12px_48px_rgba(255,107,157,0.12)] border border-[#C8E6FF] overflow-hidden relative">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B9D]/15 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4ECDC4]/15 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block p-3 rounded-2xl bg-[#FFD93D]/20 text-[#FF6B9D]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight section-heading">
                  Become a <br />
                  <span className="rainbow-text">Roommate</span> 🌈
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  매달 도착하는 시크릿 박스. <br />
                  당신의 취향을 분석해 가장 완벽한 경험을 선물합니다.
                </p>
                <ul className="space-y-4">
                  {subscriptionBenefits.slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                      <div className="w-6 h-6 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-xs font-bold">✓</div>
                      {benefit.title}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-[0_8px_24px_rgba(255,107,157,0.3)] hover:scale-105 transition-transform">
                  <Link href="/subscribe">Roommate 되기 🏠</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-[#FF6B9D]/5 via-[#FFD93D]/5 to-[#4ECDC4]/5 overflow-hidden relative group border border-[#C8E6FF]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl mb-4 block animate-float">🎁</span>
                      <p className="font-bold text-xl text-foreground/40 uppercase tracking-widest">Mystery Box</p>
                    </div>
                  </div>
                </div>
                {/* Floating stat */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-[#C8E6FF] animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B9D]/15 flex items-center justify-center text-[#FF6B9D]">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase">Satisfaction</p>
                      <p className="text-lg font-bold">100% Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
