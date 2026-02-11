import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { featuredProducts, subscriptionBenefits } from "@/lib/data";
import { Sparkles, ArrowRight, Heart, Lock, Gift, Crown, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================
          🌈 HERO — Welcome to Whimsyshire
          디아블로3 무지개방: 밝은 하늘 + 구름 + 무지개 아치 + 초원
          ============================================ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* ── Sky Gradient ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3A9BD5] via-[#5CB8E6] to-[#8DD4F0] z-0" />

        {/* ── Sun ── */}
        <div className="absolute top-[8%] right-[12%] z-[1]">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#FFD000] shadow-[0_0_80px_rgba(255,208,0,0.6),0_0_160px_rgba(255,208,0,0.3)] animate-pulse" />
        </div>

        {/* ── Clouds ── */}
        <div className="cloud absolute top-[12%] left-[5%] w-40 h-14 animate-[drift_15s_ease-in-out_infinite]" />
        <div className="cloud absolute top-[22%] right-[8%] w-32 h-10 opacity-70 animate-[drift_20s_ease-in-out_infinite_reverse]" />
        <div className="cloud absolute top-[8%] left-[45%] w-28 h-9 opacity-50 animate-[drift_25s_ease-in-out_infinite]" />
        <div className="cloud absolute top-[35%] left-[70%] w-20 h-7 opacity-40 animate-[drift_18s_ease-in-out_infinite_reverse]" />

        {/* ── Rainbow Arch ── */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-[1] pointer-events-none">
          <div className="rainbow-arch opacity-50" />
        </div>

        {/* ── Floating Whimsy Elements ── */}
        <span className="absolute top-[15%] right-[25%] text-4xl animate-sparkle pointer-events-none z-[2]">✨</span>
        <span className="absolute top-[40%] left-[8%] text-3xl animate-float pointer-events-none z-[2]" style={{ animationDelay: '0.5s' }}>🌸</span>
        <span className="absolute top-[25%] left-[30%] text-3xl animate-sway pointer-events-none z-[2]" style={{ animationDelay: '1s' }}>🦋</span>
        <span className="absolute bottom-[40%] right-[15%] text-4xl animate-float pointer-events-none z-[2]" style={{ animationDelay: '0.3s' }}>🌈</span>
        <span className="absolute top-[55%] left-[15%] text-2xl animate-sparkle pointer-events-none z-[2]" style={{ animationDelay: '1.5s' }}>⭐</span>
        <span className="absolute bottom-[45%] left-[60%] text-3xl animate-bounce-cute pointer-events-none z-[2]">🧸</span>
        <span className="absolute top-[45%] right-[5%] text-2xl animate-sway pointer-events-none z-[2]" style={{ animationDelay: '2s' }}>🌼</span>
        <span className="absolute bottom-[35%] left-[40%] text-2xl float-note pointer-events-none z-[2]">♪</span>

        {/* ── Rolling Hills (foreground) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none">
          {/* Back hill — darker green */}
          <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="#3BA63B" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L0,320Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none" style={{ marginBottom: '-2px' }}>
          {/* Front hill — bright green */}
          <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="#5BCD5B" d="M0,256L60,250.7C120,245,240,235,360,240C480,245,600,267,720,266.7C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L0,320Z" />
          </svg>
          {/* Flowers on the hill */}
          <div className="absolute bottom-4 left-[10%] text-xl animate-sway">🌼</div>
          <div className="absolute bottom-6 left-[25%] text-lg animate-sway" style={{ animationDelay: '0.5s' }}>🌸</div>
          <div className="absolute bottom-3 left-[55%] text-xl animate-sway" style={{ animationDelay: '1s' }}>🌷</div>
          <div className="absolute bottom-5 right-[20%] text-lg animate-sway" style={{ animationDelay: '1.5s' }}>🌻</div>
          <div className="absolute bottom-4 right-[35%] text-xl animate-sway" style={{ animationDelay: '0.7s' }}>🌼</div>
        </div>

        {/* ── Hero Content ── */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-[5] w-full pt-24 pb-40">
          <div className="bento-grid min-h-[520px]">
            {/* ── Main Card — 메인 타이틀 ── */}
            <div className="bento-large glass rounded-[2rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
              {/* Decorative blobs */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF4D88]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FFD000]/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-0 w-32 h-32 bg-[#C77DFF]/8 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 pill bg-white/80 text-[#6B5BA7] text-xs tracking-[0.2em] uppercase mb-6 border border-white/60 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5BCD5B] animate-pulse shadow-[0_0_8px_rgba(91,205,91,0.5)]" />
                  🌈 Whimsyshire
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] leading-[0.9] mb-6">
                  <span className="block rainbow-text-animated">Soft Outside,</span>
                  <span className="block text-[#1A0F3C] mt-2">Wild Inside.</span>
                </h1>

                <p className="text-lg md:text-xl text-[#1A0F3C]/55 max-w-lg mb-8 leading-relaxed">
                  무지개 너머 숨겨진 비밀의 방.<br />
                  <span className="font-bold text-[#FF4D88]">귀여움 뒤에 감춰진 본능</span>을 깨워보세요.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="pill bg-[#FF4D88] text-white hover:bg-[#E6326E] text-lg px-10 py-7 shadow-[0_8px_32px_rgba(255,77,136,0.4)] hover:shadow-[0_12px_40px_rgba(255,77,136,0.5)] transition-all group">
                    <Link href="/products">
                      Enter the Room <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="pill border-2 border-white/70 bg-white/50 hover:bg-white/80 text-lg px-10 py-7 transition-all">
                    <Link href="/about">Our Story 🌸</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Best Seller Card ── */}
            <div className="glass rounded-[2rem] p-6 flex flex-col justify-between card-3d overflow-hidden group cursor-pointer relative">
              <div className="absolute top-3 right-3 pill bg-[#FF4D88] text-white text-[10px] px-3 py-1 shadow-lg">🔥 BEST</div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD000]/5 to-[#FF4D88]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative w-28 h-28">
                  <Image src="/tbr_logo.png" alt="Best Seller" fill className="object-contain group-hover:scale-115 transition-transform duration-700 drop-shadow-lg" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-[#1A0F3C] mb-1">이번 달 베스트 🏆</p>
                <p className="text-xs text-[#6B5BA7]">가장 사랑받는 아이템</p>
              </div>
            </div>

            {/* ── Category Card ── */}
            <div className="glass rounded-[2rem] p-6 flex flex-col justify-between card-3d group cursor-pointer">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { emoji: '🧸', bg: 'from-[#FFE0EC] to-[#FFCCE0]' },
                  { emoji: '💜', bg: 'from-[#E8D5FF] to-[#D5C0F5]' },
                  { emoji: '🎀', bg: 'from-[#FFD5E8] to-[#FFC0D5]' },
                  { emoji: '✨', bg: 'from-[#FFE8C0] to-[#FFD5A0]' },
                ].map((item, i) => (
                  <div key={i} className={`aspect-square rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-300 shadow-sm`} style={{ transitionDelay: `${i * 60}ms` }}>
                    {item.emoji}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A0F3C] mb-1">카테고리 🎀</p>
                <p className="text-xs text-[#6B5BA7]">무드 · 케어 · 라이프 · 패션</p>
              </div>
            </div>

            {/* ── Promo Banner ── */}
            <div className="bento-wide glass rounded-[2rem] p-6 flex items-center justify-between card-3d overflow-hidden relative group">
              <div className="absolute inset-0 rainbow-gradient-animated opacity-[0.06] group-hover:opacity-[0.12] transition-opacity" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFD000]/20 flex items-center justify-center">
                  <span className="text-3xl animate-bounce-cute">🎁</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1A0F3C]">첫 구매 15% 할인</p>
                  <p className="text-sm text-[#6B5BA7]">코드: <span className="font-mono font-bold text-[#FF4D88]">WHIMSY15</span> · 이번 주까지</p>
                </div>
              </div>
              <Button asChild className="pill bg-[#2EC4B6] text-white hover:bg-[#25A99D] relative z-10 shadow-lg">
                <Link href="/products">쇼핑하기 →</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Scroll Indicator ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-[6]">
          <div className="w-7 h-11 rounded-full border-2 border-white/60 flex justify-center pt-2 bg-white/20 backdrop-blur-sm">
            <div className="w-1.5 h-3 rounded-full bg-white/80 animate-[float_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ============================================
          🛡️ Benefits Strip — 게임 스탯 느낌
          ============================================ */}
      <section className="py-14 bg-white/70 backdrop-blur-md border-y border-[#B8DBFF] relative z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {[
              { emoji: '🔒', title: '비밀 배송', desc: '무표기 포장 — 아무도 몰라요', color: '#FF4D88', bg: 'from-[#FF4D88]/10 to-[#FF4D88]/5' },
              { emoji: '🎁', title: '선물 포장', desc: '감성 무료 포장 — 설렘 2배', color: '#2EC4B6', bg: 'from-[#2EC4B6]/10 to-[#2EC4B6]/5' },
              { emoji: '👑', title: '멤버십 혜택', desc: 'Roommate 구독 최대 30% OFF', color: '#FFD000', bg: 'from-[#FFD000]/10 to-[#FFD000]/5' },
            ].map((b, i) => (
              <div key={i} className={`glass rounded-2xl p-6 flex items-center gap-5 card-3d border-l-4`} style={{ borderLeftColor: b.color }}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.bg} flex items-center justify-center text-3xl shadow-inner`}>
                  {b.emoji}
                </div>
                <div>
                  <p className="font-bold text-lg text-[#1A0F3C]">{b.title}</p>
                  <p className="text-sm text-[#6B5BA7]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ✨ Featured Products — 아이템 발견
          ============================================ */}
      <section className="py-24 relative z-10">
        {/* Meadow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-[#F0FFF0]/80 to-[#E0FFE0]/60 -z-10" />

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 pill bg-[#FFD000]/15 text-[#6B5BA7] text-xs tracking-widest uppercase mb-4">
                <Star className="w-3.5 h-3.5 text-[#FFD000] fill-[#FFD000]" />
                Curated Items
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A0F3C] tracking-tight">
                ✨ 이번 달의 발견
              </h2>
              <p className="text-lg text-[#6B5BA7] mt-3">무지개 너머에서 엄선한 아이템들.</p>
            </div>
            <Button asChild variant="ghost" className="group text-lg font-bold hover:text-[#FF4D88] p-0 hidden md:flex">
              <Link href="/products" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
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
            <Button asChild variant="outline" className="pill border-2">
              <Link href="/products">모든 상품 보기 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          🏠 Subscription CTA — Roommate 초대장
          ============================================ */}
      <section className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0FFE0]/40 via-[#F5F0FF]/60 to-[#EEF2FF]/80 -z-10" />

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="glass rounded-[2.5rem] p-8 md:p-16 overflow-hidden relative rainbow-border">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D88]/8 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C77DFF]/8 rounded-full blur-[80px] -ml-40 -mb-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD000]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 pill bg-[#C77DFF]/15 text-[#6B5BA7] text-xs tracking-widest uppercase">
                  <Sparkles className="w-4 h-4 text-[#C77DFF]" />
                  Secret Membership
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-[#1A0F3C] leading-[0.95] tracking-tight">
                  Become a<br />
                  <span className="rainbow-text-animated">Roommate</span> 🌈
                </h2>

                <p className="text-lg text-[#6B5BA7] leading-relaxed max-w-md">
                  매달 무지개 너머에서 도착하는 미스터리 박스.<br />
                  당신의 취향을 분석해 <span className="font-bold text-[#FF4D88]">완벽한 경험</span>을 선물합니다.
                </p>

                <ul className="space-y-4">
                  {subscriptionBenefits.slice(0, 4).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-4 text-[#1A0F3C] font-medium">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5BCD5B]/20 to-[#2EC4B6]/20 flex items-center justify-center text-sm font-bold text-[#2EC4B6] shadow-inner">✓</div>
                      {benefit.title}
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="pill bg-[#FF4D88] text-white px-12 py-7 text-lg shadow-[0_8px_32px_rgba(255,77,136,0.35)] hover:shadow-[0_12px_40px_rgba(255,77,136,0.45)] transition-all">
                  <Link href="/subscribe" className="flex items-center gap-2">
                    Roommate 되기 <span className="text-xl">🏠</span>
                  </Link>
                </Button>
              </div>

              {/* Mystery Box Visual */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-[#E8D5FF]/40 via-white/30 to-[#FFD5E8]/40 border border-white/40 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-[portal-spin_8s_linear_infinite] opacity-20">
                        <div className="w-40 h-40 rounded-full border-4 border-dashed border-[#C77DFF]/40 mx-auto" />
                      </div>
                      <span className="text-[7rem] block animate-float relative z-10 drop-shadow-lg">🎁</span>
                    </div>
                    <p className="font-black text-2xl text-[#1A0F3C]/20 uppercase tracking-[0.3em] mt-4">Mystery Box</p>
                    <p className="text-sm text-[#6B5BA7]/40 mt-1">무지개 너머의 선물</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 glass p-5 rounded-2xl shadow-xl animate-float border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4D88]/15 to-[#FF4D88]/5 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#FF4D88] fill-[#FF4D88]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B5BA7] font-bold uppercase tracking-wider">Satisfaction</p>
                      <p className="text-xl font-black text-[#1A0F3C]">100%</p>
                    </div>
                  </div>
                </div>

                {/* Floating sparkle */}
                <div className="absolute -top-4 -left-4 glass p-4 rounded-xl shadow-lg animate-bounce-cute border border-white/50">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-[10px] text-[#6B5BA7] font-bold">4.9 / 5.0</p>
                      <p className="text-[10px] text-[#6B5BA7]/60">2,847 reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          💬 Testimonials
          ============================================ */}
      <Testimonials />
    </div>
  );
}
