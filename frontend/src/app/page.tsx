import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { Sparkles, ArrowRight, Heart, Lock, Gift, Crown, Star, ShieldCheck, Truck, Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================
          🌈 HERO — Whimsyshire Gateway
          ============================================ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B8EC5] via-[#4BA8D8] to-[#7CC8F0] z-0" />

        {/* Sun with rays */}
        <div className="absolute top-[6%] right-[10%] z-[1]">
          <div className="relative">
            <div className="absolute inset-[-20px] rounded-full bg-[#FFD000]/20 blur-2xl animate-pulse" />
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#FFE45C] to-[#FFB800] shadow-[0_0_80px_rgba(255,184,0,0.5)]" />
          </div>
        </div>

        {/* Clouds — pure CSS, no emoji */}
        <div className="cloud absolute top-[10%] left-[3%] w-44 h-16 animate-[drift_18s_ease-in-out_infinite]" />
        <div className="cloud absolute top-[20%] right-[6%] w-36 h-12 opacity-80 animate-[drift_24s_ease-in-out_infinite_reverse]" />
        <div className="cloud absolute top-[6%] left-[40%] w-28 h-10 opacity-50 animate-[drift_30s_ease-in-out_infinite]" />
        <div className="cloud absolute top-[32%] left-[65%] w-20 h-7 opacity-40 animate-[drift_20s_ease-in-out_infinite_reverse]" />

        {/* Rainbow arch — CSS conic gradient */}
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-[1] pointer-events-none opacity-40">
          <div className="rainbow-arch" />
        </div>

        {/* Sparkle particles — CSS dots, NOT emoji */}
        <div className="absolute top-[18%] right-[28%] w-2 h-2 rounded-full bg-white/80 animate-sparkle z-[2]" />
        <div className="absolute top-[42%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#FFD000]/60 animate-sparkle z-[2]" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-[28%] left-[55%] w-2.5 h-2.5 rounded-full bg-white/50 animate-sparkle z-[2]" style={{ animationDelay: '1.3s' }} />
        <div className="absolute bottom-[42%] right-[18%] w-1.5 h-1.5 rounded-full bg-[#FF4D88]/40 animate-sparkle z-[2]" style={{ animationDelay: '2s' }} />

        {/* Hills — layered SVGs for depth */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none">
          <svg viewBox="0 0 1440 280" className="w-full h-auto block" preserveAspectRatio="none">
            <path fill="#2D8F3E" fillOpacity="0.7" d="M0,200L120,185C240,170,480,140,720,150C960,160,1200,210,1320,235L1440,260L1440,280L0,280Z" />
            <path fill="#39A34D" d="M0,220L80,210C160,200,320,180,480,185C640,190,800,220,960,230C1120,240,1280,230,1360,225L1440,220L1440,280L0,280Z" />
            <path fill="#4CC95E" d="M0,250L60,245C120,240,240,230,360,235C480,240,600,260,720,260C840,260,960,240,1080,235C1200,230,1320,240,1380,245L1440,250L1440,280L0,280Z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-[5] w-full pt-28 pb-48">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-xs tracking-[0.25em] uppercase px-5 py-2.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#4CC95E] shadow-[0_0_6px_rgba(76,201,94,0.6)]" />
                Whimsyshire Collection
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[6.5rem] font-black tracking-[-0.04em] leading-[0.88]">
                <span className="block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">Soft Outside,</span>
                <span className="block mt-2 bg-gradient-to-r from-[#FF4D88] via-[#FF6BA8] to-[#FFD000] bg-clip-text text-transparent drop-shadow-none">Wild Inside.</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 max-w-lg leading-relaxed font-light">
                무지개 너머 숨겨진 비밀의 방.<br />
                <span className="font-semibold text-white/90">귀여움 뒤에 감춰진 본능</span>을 깨워보세요.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="rounded-full bg-[#FF4D88] text-white hover:bg-[#E6326E] text-lg px-10 py-7 font-bold shadow-[0_8px_32px_rgba(255,77,136,0.45)] hover:shadow-[0_16px_48px_rgba(255,77,136,0.55)] transition-all duration-300 hover:-translate-y-1">
                  <Link href="/products">
                    Enter the Room <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-lg px-10 py-7 font-medium transition-all duration-300">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </div>

            {/* Right — Featured Bento */}
            <div className="grid grid-cols-2 gap-4">
              {/* Best Seller */}
              <div className="col-span-2 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-8 flex items-center gap-8 group hover:bg-white/25 transition-all duration-500 cursor-pointer">
                <div className="relative w-24 h-24 shrink-0">
                  <Image src="/tbr_logo.png" alt="Best" fill className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
                </div>
                <div>
                  <div className="inline-block rounded-full bg-[#FF4D88] text-white text-[10px] font-bold px-3 py-1 mb-2 tracking-wider">BEST SELLER</div>
                  <p className="text-white font-bold text-lg">이번 달 베스트</p>
                  <p className="text-white/50 text-sm">가장 사랑받는 아이템을 만나보세요</p>
                </div>
              </div>

              {/* Category */}
              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-6 group hover:bg-white/25 transition-all duration-500 cursor-pointer">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['#FFB8D0', '#D0B8FF', '#FFD0B8', '#B8E8FF'].map((color, i) => (
                    <div key={i} className="aspect-square rounded-xl group-hover:scale-105 transition-transform duration-300" style={{ background: color, transitionDelay: `${i * 40}ms`, opacity: 0.6 }} />
                  ))}
                </div>
                <p className="text-white font-bold text-sm">카테고리</p>
                <p className="text-white/40 text-xs">무드 · 케어 · 라이프</p>
              </div>

              {/* Promo */}
              <div className="rounded-3xl bg-gradient-to-br from-[#FF4D88]/20 to-[#C77DFF]/20 backdrop-blur-xl border border-[#FF4D88]/20 p-6 flex flex-col justify-between group hover:from-[#FF4D88]/30 hover:to-[#C77DFF]/30 transition-all duration-500 cursor-pointer">
                <div className="text-3xl font-black text-white/90 leading-tight">
                  15<span className="text-lg font-bold text-[#FFD000]">%</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">첫 구매 할인</p>
                  <p className="text-white/40 text-xs font-mono">WHIMSY15</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[6]">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/60 animate-[float_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ============================================
          Trust Strip
          ============================================ */}
      <section className="py-16 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: '비밀 배송', desc: '무표기 포장으로 완벽한 프라이버시', accent: '#FF4D88' },
              { icon: Package, title: '무료 선물 포장', desc: '모든 주문에 감성 포장 무료', accent: '#2EC4B6' },
              { icon: Crown, title: '멤버십 최대 30% OFF', desc: 'Roommate 구독 특별 혜택', accent: '#C77DFF' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.accent}12` }}>
                  <b.icon className="w-5 h-5" style={{ color: b.accent }} />
                </div>
                <div>
                  <p className="font-bold text-[#1A0F3C] text-lg">{b.title}</p>
                  <p className="text-[#6B5BA7] text-sm mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          Featured Products
          ============================================ */}
      <section className="py-24 bg-gradient-to-b from-white via-[#FAFBFF] to-[#F5F0FF] relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-[#FF4D88] mb-3">Curated Items</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A0F3C] tracking-tight leading-tight">
                이번 달의 발견
              </h2>
              <p className="text-lg text-[#6B5BA7] mt-3">무지개 너머에서 엄선한 아이템들.</p>
            </div>
            <Button asChild variant="ghost" className="group text-base font-bold text-[#6B5BA7] hover:text-[#FF4D88] hidden md:flex">
              <Link href="/products" className="flex items-center gap-2">
                전체 보기
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex gap-6 scroll-snap-x pb-4 md:grid md:grid-cols-4 md:overflow-visible">
            {featuredProducts.map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-0">
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="rounded-full border-2 px-8 py-6 font-bold">
              <Link href="/products">모든 상품 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          Subscription CTA
          ============================================ */}
      <section className="py-24 bg-[#F5F0FF] relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#1A0F3C] to-[#2D1B69] p-10 md:p-20 overflow-hidden relative">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4D88]/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C77DFF]/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <p className="text-sm font-bold tracking-[0.25em] uppercase text-[#C77DFF]">Secret Membership</p>

                <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
                  Become a<br />
                  <span className="bg-gradient-to-r from-[#FF4D88] via-[#FF6BA8] to-[#FFD000] bg-clip-text text-transparent">Roommate</span>
                </h2>

                <p className="text-lg text-white/50 leading-relaxed max-w-md">
                  매달 도착하는 미스터리 박스. 당신의 취향을 분석해 <span className="text-white/80 font-semibold">완벽한 경험</span>을 선물합니다.
                </p>

                <ul className="space-y-4">
                  {subscriptionBenefits.slice(0, 4).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-4 text-white/80">
                      <div className="w-6 h-6 rounded-full bg-[#4CC95E]/20 flex items-center justify-center text-[#4CC95E] text-xs font-bold shrink-0">✓</div>
                      <span className="font-medium">{benefit.title}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="rounded-full bg-[#FF4D88] text-white px-12 py-7 text-lg font-bold shadow-[0_8px_32px_rgba(255,77,136,0.4)] hover:shadow-[0_16px_48px_rgba(255,77,136,0.5)] transition-all duration-300 hover:-translate-y-1">
                  <Link href="/subscribe">Roommate 되기</Link>
                </Button>
              </div>

              {/* Visual */}
              <div className="relative hidden lg:block">
                <div className="aspect-[4/5] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D88]/5 to-[#C77DFF]/5" />
                  <div className="text-center relative z-10">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <Image src="/tbr_logo.png" alt="Mystery Box" fill className="object-contain animate-float opacity-60" />
                    </div>
                    <p className="font-black text-xl text-white/15 uppercase tracking-[0.3em]">Mystery Box</p>
                  </div>
                </div>

                {/* Stats badge */}
                <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-[#FF4D88] fill-[#FF4D88]" />
                    <div>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Satisfaction</p>
                      <p className="text-xl font-black text-white">100%</p>
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
