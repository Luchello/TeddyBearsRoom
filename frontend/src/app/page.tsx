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
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 grid-bg">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 via-purple-50/30 to-green-50/20 z-0" />

        {/* Animated Blobs (Light Mode) */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float-slow delay-1000" />

        {/* Content Container - max-w-7xl로 큰 화면에서도 적절한 너비 유지 */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Typography & Message */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-primary/20 backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                TBR Universe Collection
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-green-400 animate-gradient-x">
                Soft Outside,
              </span>
              <span className="block relative">
                Wild Inside.
                <svg className="absolute -bottom-4 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              일상의 귀여움 뒤에 숨겨진 당신만의 본능.<br />
              <span className="font-bold text-primary">당신만의 비밀 셀프케어</span>를 시작해보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full text-lg px-8 py-7 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Link href="/products">
                  Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 py-7 border-2 border-foreground/10 hover:bg-foreground/5 transition-all duration-300"
              >
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Right: Visual "The Portal" */}
          <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center perspective-1000">
            {/* Abstract Shape representing "Soft vs Hard" */}
            <div className="relative w-[260px] h-[350px] sm:w-[400px] sm:h-[500px]">
                            {/* Front Card (Light Mode / Furry) */}
              {/* P1: rounded-[2.5rem] = --radius-2xl (40px) - Design Token 표준화 */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.1)] -rotate-6 hover:rotate-0 transition-all duration-700 ease-out flex flex-col items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
                <div className="relative w-48 h-48 animate-bounce-slow drop-shadow-lg filter group-hover:blur-[2px] transition-all duration-300">
                  <Image src="/tbr_logo.png" alt="TBR Logo" fill className="object-contain" />
                </div>
                <div className="absolute bottom-10 px-6 py-2 bg-white/90 rounded-full shadow-sm text-sm font-bold tracking-wider uppercase">
                  Touch Me
                </div>
              </div>
            </div>
          </div>
        </div>
        </div> {/* Close Content Container */}


      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
        </div>
      </div>
    </section>

      {/* Featured Products - "The Collection" */}
      <section className="py-24 relative z-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4 section-heading">
              Curated Pleasure
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

      {/* Subscription CTA - "The Inner Circle" */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110" />

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          {/* P1: rounded-[2.5rem] = --radius-2xl (40px) - Design Token 표준화 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-primary/10 overflow-hidden relative">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block p-3 rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight section-heading">
                  Become a <br />
                  <span className="text-primary">Roommate</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  매달 도착하는 시크릿 박스. <br />
                  당신의 취향을 분석해 가장 완벽한 경험을 선물합니다.
                </p>
                <ul className="space-y-4">
                  {subscriptionBenefits.slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                      {benefit.title}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="rounded-full px-10 py-6 text-lg shadow-lg shadow-primary/25">
                  <Link href="/subscribe">Roommate 되기 🏠</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] bg-neutral-100 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl mb-4 block animate-bounce-slow">🎁</span>
                      <p className="font-bold text-xl text-foreground/50 uppercase tracking-widest">Mystery Box</p>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-primary/10 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
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
