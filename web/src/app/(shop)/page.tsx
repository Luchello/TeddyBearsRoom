/**
 * Coming Soon Page
 * TeddyBear's Room - Under Construction
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | TeddyBear's Room",
  description: "TeddyBear's Room이 곧 오픈합니다. 프리미엄 성인용품 큐레이션 서비스를 기대해주세요.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-silk-texture silk-texture opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-secondary)_0%,transparent_50%),radial-gradient(circle_at_bottom_left,var(--color-accent)_0%,transparent_50%)] opacity-20" />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] animate-float" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[150px] animate-float" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-12 animate-reveal">
          <span className="text-6xl mb-6 block">🧸</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            TeddyBear&apos;s Room
          </h1>
        </div>

        {/* Status Badge */}
        <div className="mb-10 animate-reveal" style={{ animationDelay: "0.1s" }}>
          <span className="badge-silk px-6 py-2 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            사이트 구축 중
          </span>
        </div>

        {/* Message */}
        <div className="space-y-6 animate-reveal" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90">
            곧 만나요
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            더 나은 서비스로 찾아뵙기 위해 준비 중입니다.
            <br />
            조금만 기다려주세요.
          </p>
        </div>

        {/* Decorative Line */}
        <div className="mt-16 flex items-center justify-center gap-4 animate-reveal" style={{ animationDelay: "0.3s" }}>
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
          <span className="text-primary/40 text-sm font-medium tracking-widest uppercase">Coming Soon</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
        </div>

        {/* Contact hint */}
        <div className="mt-12 text-sm text-foreground/40 animate-reveal" style={{ animationDelay: "0.4s" }}>
          문의: support@teddybearsroom.com
        </div>
      </div>
    </main>
  );
}
