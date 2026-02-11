"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";
import Image from "next/image";

export function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("age-verified");
    if (!verified) {
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem("age-verified", "true");
      setIsVisible(false);
    }, 400);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Backdrop — frosted sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C1E0F7]/95 via-[#E4F0FB]/95 to-[#F6FAFF]/95 backdrop-blur-xl" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 transition-all duration-500 ${
          isExiting ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
        style={{ animation: isExiting ? "none" : "scale-in 0.5s ease-out" }}
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-premium-lg overflow-hidden">
          {/* Rainbow accent line */}
          <div className="rainbow-line" />

          {/* Content */}
          <div className="p-8 md:p-10 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/tbr_logo.png"
                  alt="TeddyBear's Room"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Brand name */}
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6">
              TeddyBear&apos;s Room
            </p>

            {/* Age badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-white text-lg font-black mb-6">
              19
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-foreground mb-3">
              성인 인증이 필요합니다
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
              이 사이트는 만 19세 이상만 이용 가능한
              성인 전용 셀프케어 쇼핑몰입니다.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleConfirm}
                size="lg"
                className="w-full rounded-full py-6 text-base bg-foreground text-white hover:bg-foreground/90 shadow-premium transition-all duration-300 hover:shadow-premium-lg"
              >
                <ShieldCheck className="mr-2 w-4 h-4" />
                네, 19세 이상입니다
              </Button>
              <Button
                onClick={handleDeny}
                variant="ghost"
                size="lg"
                className="w-full rounded-full py-6 text-base text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
              >
                아니요, 나가겠습니다
              </Button>
            </div>

            {/* Legal */}
            <p className="text-[11px] text-muted-foreground/60 mt-6 leading-relaxed">
              &apos;네, 19세 이상입니다&apos;를 클릭하면 이용약관에 동의하며,
              <br />본 사이트의 성인 콘텐츠 열람에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
