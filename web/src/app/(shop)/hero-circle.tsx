/**
 * Hero Circle - Client Component
 * Interactive circle with logo for Hero Section (Light Mode)
 * Whimsyshire Theme
 */

import Image from "next/image";

export function HeroCircle() {
  return (
    <div className="relative animate-float">
      {/* Glow Ring */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-110 bg-[var(--gradient-rainbow-soft)]" />

      {/* Main Circle */}
      <div className="relative w-[340px] h-[340px] rounded-full flex items-center justify-center shadow-2xl bg-white/80 backdrop-blur-xl border border-white/50">
        <div className="text-center">
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto mb-3">
            <Image
              src="/logo.png"
              alt="TeddyBear's Room"
              fill
              sizes="128px"
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Inner Glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-t from-[var(--color-love-50)]/30 to-transparent" />
      </div>


      {/* Decorative Dots */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--color-magic-300)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
      </div>
    </div>
  );
}
