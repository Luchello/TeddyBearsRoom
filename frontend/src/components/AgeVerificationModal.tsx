"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("age-verified");
  });
  const [isExiting, setIsExiting] = useState(false);

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem("age-verified", "true");
      setIsVisible(false);
    }, 420);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F0F1A]/80 backdrop-blur-[10px]" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-none sm:max-w-md h-[100svh] sm:h-auto transition-all duration-500 ${
          isExiting ? "translate-y-3 scale-[0.98]" : "translate-y-0 scale-100"
        }`}
      >
        <div className="h-full sm:h-auto overflow-hidden rounded-none sm:rounded-[28px] border border-white/10 bg-[#141425] shadow-premium-lg">
          {/* Top gradient rail */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="p-6 sm:p-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <div className="relative h-8 w-8">
                <Image
                  src="/tbr_logo.png"
                  alt="TeddyBear's Room"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-[11px] tracking-[0.22em] uppercase text-white/55">
              TeddyBear&apos;s Room
            </p>

            <h2 className="mt-4 font-display text-2xl text-white">
              성인 인증이 필요합니다
            </h2>
            <p className="mt-4 text-sm text-white/65 leading-relaxed">
              본 사이트는 만 19세 이상만 이용 가능한 성인 전용 쇼핑몰입니다.
              계속 진행하시려면 아래 버튼을 눌러주세요.
            </p>

            <div className="mt-8 grid gap-3">
              <Button
                onClick={handleConfirm}
                size="lg"
                className="w-full rounded-full bg-white text-[#0F0F1A] hover:bg-white/90"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                네, 19세 이상입니다
              </Button>
              <Button
                onClick={handleDeny}
                variant="outline"
                size="lg"
                className="w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                아니요, 나가겠습니다
              </Button>
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-white/45">
              &apos;네, 19세 이상입니다&apos;를 클릭하면 이용약관에 동의하며,
              성인 콘텐츠 열람에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
