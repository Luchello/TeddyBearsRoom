"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ban } from "lucide-react";

export function AgeVerificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem("age-verified");
        if (!verified) {
            setTimeout(() => setIsOpen(true), 0);
            document.body.style.overflow = "hidden";
        }
    }, []);

    const handleVerify = () => {
        setIsExiting(true);
        setTimeout(() => {
            localStorage.setItem("age-verified", "true");
            setIsOpen(false);
            document.body.style.overflow = "";
        }, 600);
    };

    const handleReject = () => {
        window.location.href = "https://www.google.com";
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-600 ${isExiting ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}`}>
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B8EC5] via-[#4BA8D8] to-[#7CC8F0]" />

            {/* Sun */}
            <div className="absolute top-[8%] right-[12%] pointer-events-none">
                <div className="relative">
                    <div className="absolute inset-[-16px] rounded-full bg-[#FFB800]/20 blur-2xl" />
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFE45C] to-[#FFB800] shadow-[0_0_60px_rgba(255,184,0,0.4)]" />
                </div>
            </div>

            {/* Clouds */}
            <div className="cloud absolute top-[10%] left-[6%] w-40 h-14 animate-[drift_15s_ease-in-out_infinite]" />
            <div className="cloud absolute top-[22%] right-[8%] w-32 h-10 opacity-70 animate-[drift_22s_ease-in-out_infinite_reverse]" />
            <div className="cloud absolute top-[6%] left-[45%] w-24 h-8 opacity-40 animate-[drift_28s_ease-in-out_infinite]" />

            {/* Hills */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 240" className="w-full h-auto block" preserveAspectRatio="none">
                    <path fill="#2D8F3E" fillOpacity="0.7" d="M0,160L180,145C360,130,720,100,1080,110C1260,115,1380,130,1440,138L1440,240L0,240Z" />
                    <path fill="#39A34D" d="M0,180L120,170C240,160,480,140,720,150C960,160,1200,180,1320,190L1440,200L1440,240L0,240Z" />
                    <path fill="#4CC95E" d="M0,210L80,205C160,200,320,190,480,195C640,200,800,215,960,220C1120,225,1280,215,1360,210L1440,205L1440,240L0,240Z" />
                </svg>
            </div>

            {/* Sparkle particles */}
            <div className="absolute top-[15%] left-[25%] w-2 h-2 rounded-full bg-white/60 animate-sparkle pointer-events-none" />
            <div className="absolute top-[35%] right-[15%] w-1.5 h-1.5 rounded-full bg-white/40 animate-sparkle pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[50%] left-[10%] w-2 h-2 rounded-full bg-[#FFD000]/40 animate-sparkle pointer-events-none" style={{ animationDelay: '0.5s' }} />

            {/* Gate Card */}
            <div className="relative w-full max-w-md mx-4 z-10">
                <div className="rounded-3xl bg-white/90 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-white/60 p-10 text-center relative overflow-hidden">
                    {/* Subtle gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF4D88] via-[#FFD000] via-[#4CC95E] via-[#4BA8D8] to-[#C77DFF]" />

                    {/* Brand */}
                    <p className="text-lg font-black text-[#FF4D88] tracking-tight">TeddyBear&apos;s Room</p>
                    <p className="text-[10px] text-[#6B5BA7]/60 tracking-[0.3em] uppercase mt-1 mb-8">Whimsyshire Edition</p>

                    {/* 19+ Badge */}
                    <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4D88] to-[#C77DFF] shadow-[0_8px_32px_rgba(255,77,136,0.3)]">
                        <span className="text-3xl font-black text-white">19</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-[#1A0F3C] mb-2 tracking-tight">
                        19세 이상이신가요?
                    </h2>
                    <p className="text-sm text-[#6B5BA7] mb-10 leading-relaxed">
                        이곳은 성인만을 위한 프라이빗 공간입니다.<br />
                        입장하시려면 확인이 필요합니다.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={handleVerify}
                            size="lg"
                            className="rounded-full text-base px-10 py-6 bg-[#FF4D88] hover:bg-[#E6326E] text-white font-bold shadow-[0_8px_24px_rgba(255,77,136,0.3)] hover:shadow-[0_12px_32px_rgba(255,77,136,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            네, 입장합니다
                        </Button>
                        <Button
                            onClick={handleReject}
                            variant="outline"
                            size="lg"
                            className="rounded-full text-base px-10 py-6 border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 font-medium"
                        >
                            <Ban className="mr-2 h-4 w-4" />
                            돌아가기
                        </Button>
                    </div>

                    <p className="mt-8 text-[10px] text-[#6B5BA7]/30">
                        정보통신망법 및 청소년보호법의 규정을 준수합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
