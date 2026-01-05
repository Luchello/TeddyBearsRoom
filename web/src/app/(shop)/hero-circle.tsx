/**
 * Hero Circle - Client Component
 * Interactive circle with logo for Hero Section (Light Mode)
 * Whimsyshire Theme
 */

import Image from "next/image";

export function HeroCircle() {
  return (
    <div className="relative animate-float">
      {/* Premium Glow */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-125 bg-primary" />
      <div className="absolute inset-0 rounded-full blur-2xl opacity-20 scale-110 bg-accent" />

      {/* Main Container */}
      <div className="relative w-[380px] h-[380px] rounded-full flex items-center justify-center shadow-2xl bg-card backdrop-blur-2xl border border-white/20 overflow-hidden">
        {/* Subtle Silk Pattern */}
        <div className="absolute inset-0 bg-silk-texture silk-texture opacity-[0.05]" />

        <div className="relative z-10 text-center">
          <div className="relative w-40 h-40 mx-auto">
            <Image
              src="/logo.png"
              alt="TeddyBear's Room"
              fill
              sizes="160px"
              className="object-contain drop-shadow-xl saturate-[0.8]"
              priority
              quality={90}
            />
          </div>
        </div>

        {/* Ambient Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/10" />
      </div>
    </div>
  );
}
