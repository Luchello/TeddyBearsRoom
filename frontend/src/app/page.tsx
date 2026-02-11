import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { Sparkles, ArrowRight, Heart, Lock, Gift, Crown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 🌈 Hero — Bento Grid */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-12">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B8E8FF] to-[#E8F8FF] z-0" />

        {/* Floating decorations */}
        <div className="cloud absolute top-16 left-[8%] w-32 h-12 animate-[drift_12s_ease-in-out_infinite]" />
        <div className="cloud absolute top-32 right-[12%] w-24 h-8 opacity-50 animate-[drift_18s_ease-in-out_infinite_reverse]" />
        <span className="absolute top-20 right-[20%] text-3xl animate-sparkle pointer-events-none">✨</span>
        <span className="absolute top-44 left-[18%] text-2xl animate-sparkle pointer-events-none" style={{ animationDelay: '0.7s' }}>🌸</span>
        <span className="absolute bottom-24 right-[25%] text-3xl animate-sparkle pointer-events-none" style={{ animationDelay: '1.4s' }}>🌈</span>
        <span className="absolute bottom-40 left-[10%] text-2xl animate-sparkle pointer-events-none" style={{ animationDelay: '0.3s' }}>⭐</span>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 w-full">
          {/* Bento Grid */}
          <div className="bento-grid min-h-[520px]">
            {/* Main Card — Title + CTA */}
            <div className="bento-large glass rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF6B9D]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4ECDC4]/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 pill bg-white/70 text-[#7C6BA8] text-xs tracking-widest uppercase mb-6 border border-white/50">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                  🌈 Whimsyshire Collection
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
                  <span className="block rainbow-text">Soft Outside,</span>
                  <span className="block text-[#2D1B69]">Wild Inside.</span>
                </h1>

                <p className="text-lg md:text-xl text-[#2D1B69]/60 max-w-lg mb-8 leading-relaxed">
                  일상의 귀여움 뒤에 숨겨진 당신만의 본능.<br />
                  <span className="font-bold text-[#FF6B9D]">당신만의 비밀 셀프케어</span>를 시작해보세요.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="pill bg-[#FF6B9D] text-white hover:bg-[#FF5189] text-lg px-8 py-6 shadow-[0_8px_24px_rgba(255,107,157,0.35)] hover:scale-105 transition-all">
                    <Link href="/products">
                      Explore <ArrowRight className="ml-1 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="pill border-2 border-white/60 bg-white/40 hover:bg-white/70 text-lg px-8 py-6 transition-all">
                    <Link href="/about">Our Story 🌸</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Best Seller Card */}
            <div className="glass rounded-3xl p-6 flex flex-col justify-between card-3d overflow-hidden group cursor-pointer relative">
              <div className="absolute top-3 right-3 pill bg-[#FF6B9D] text-white text-[10px] px-3 py-1">🔥 BEST</div>
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative w-28 h-28">
                  <Image src="/tbr_logo.png" alt="Best Seller" fill className="object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-[#2D1B69] mb-1">이번 달 베스트 🏆</p>
                <p className="text-xs text-[#7C6BA8]">가장 사랑받는 아이템</p>
              </div>
            </div>

            {/* Category Card */}
            <div className="glass rounded-3xl p-6 flex flex-col justify-between card-3d group cursor-pointer">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['🧸', '💜', '🎀', '✨'].map((emoji, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-white/50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-[#2D1B69] mb-1">카테고리 🎀</p>
                <p className="text-xs text-[#7C6BA8]">무드 · 케어 · 라이프 · 패션</p>
              </div>
            </div>

            {/* Promo Banner — Wide */}
            <div className="bento-wide glass rounded-3xl p-6 flex items-center justify-between card-3d overflow-hidden relative group">
              <div className="absolute inset-0 rainbow-gradient opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" />
              <div className="relative z-10 flex items-center gap-4">
                <span className="text-4xl animate-float">🎁</span>
                <div>
                  <p className="text-lg font-bold text-[#2D1B69]">첫 구매 15% 할인</p>
                  <p className="text-sm text-[#7C6BA8]">코드: WHIMSY15 · 이번 주까지</p>
                </div>
              </div>
              <Button asChild className="pill bg-[#4ECDC4] text-white hover:bg-[#3dbdb5] relative z-10">
                <Link href="/products">쇼핑하기 →</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 rounded-full border-2 border-[#2D1B69]/20 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2D1B69]/50" />
          </div>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-12 bg-white/60 backdrop-blur-sm border-y border-[#C8E6FF]">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: <Lock className="w-6 h-6" />, emoji: '🔒', title: '비밀 배송', desc: '무표기 포장으로 프라이버시 보호', color: '#FF6B9D' },
              { icon: <Gift className="w-6 h-6" />, emoji: '🎁', title: '선물 포장', desc: '감성 가득한 무료 선물 포장', color: '#4ECDC4' },
              { icon: <Crown className="w-6 h-6" />, emoji: '💝', title: '멤버십 혜택', desc: 'Roommate 구독으로 최대 30% 할인', color: '#FFD93D' },
            ].map((b, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex items-center gap-4 card-3d">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${b.color}15` }}>
                  {b.emoji}
                </div>
                <div>
                  <p className="font-bold text-[#2D1B69]">{b.title}</p>
                  <p className="text-sm text-[#7C6BA8]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — Horizontal Scroll */}
      <section className="py-20 bg-[#F0FFF0]/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-[#2D1B69] mb-3">
                ✨ Curated Pleasure
              </h2>
              <p className="text-lg text-[#7C6BA8]">엄선된 아이템으로 당신의 취향을 발견하세요.</p>
            </div>
            <Button asChild variant="ghost" className="group text-lg font-medium hover:text-[#FF6B9D] p-0 hidden md:flex">
              <Link href="/products" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>

          {/* Scroll snap carousel on mobile, grid on desktop */}
          <div className="flex gap-6 scroll-snap-x pb-4 md:grid md:grid-cols-4 md:overflow-visible">
            {featuredProducts.map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-0">
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="pill">
              <Link href="/products">모든 상품 보기 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-20 bg-[#F5F0FF]/60">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="glass rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B9D]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4ECDC4]/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-block p-3 rounded-2xl bg-[#FFD93D]/20 text-[#FF6B9D]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2D1B69] leading-tight">
                  Become a <br />
                  <span className="rainbow-text">Roommate</span> 🌈
                </h2>
                <p className="text-lg text-[#7C6BA8] leading-relaxed">
                  매달 도착하는 시크릿 박스.<br />
                  당신의 취향을 분석해 가장 완벽한 경험을 선물합니다.
                </p>
                <ul className="space-y-4">
                  {subscriptionBenefits.slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#2D1B69] font-medium">
                      <div className="w-6 h-6 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] flex items-center justify-center text-xs font-bold">✓</div>
                      {benefit.title}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="pill bg-[#FF6B9D] text-white px-10 py-6 text-lg shadow-[0_8px_24px_rgba(255,107,157,0.3)] hover:scale-105 transition-transform">
                  <Link href="/subscribe">Roommate 되기 🏠</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] bg-white/40 overflow-hidden relative border border-white/50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl mb-4 block animate-float">🎁</span>
                    <p className="font-bold text-xl text-[#2D1B69]/30 uppercase tracking-widest">Mystery Box</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 glass p-5 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B9D]/15 flex items-center justify-center text-[#FF6B9D]">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7C6BA8] font-bold uppercase">Satisfaction</p>
                      <p className="text-lg font-bold text-[#2D1B69]">100%</p>
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
