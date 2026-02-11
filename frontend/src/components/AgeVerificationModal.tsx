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
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-600 ${isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}>
            {/* ── Whimsyshire Sky Background ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#3A9BD5] via-[#5CB8E6] to-[#8DD4F0]" />

            {/* ── Sun ── */}
            <div className="absolute top-[10%] right-[15%] pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-[#FFD000] shadow-[0_0_60px_rgba(255,208,0,0.5),0_0_120px_rgba(255,208,0,0.2)] animate-pulse" />
            </div>

            {/* ── Clouds ── */}
            <div className="cloud absolute top-[8%] left-[8%] w-36 h-12 animate-[drift_12s_ease-in-out_infinite]" />
            <div className="cloud absolute top-[25%] right-[10%] w-28 h-9 opacity-60 animate-[drift_18s_ease-in-out_infinite_reverse]" />
            <div className="cloud absolute top-[15%] left-[50%] w-20 h-7 opacity-40 animate-[drift_22s_ease-in-out_infinite]" />

            {/* ── Rolling Hills ── */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
                    <path fill="#3BA63B" d="M0,256L120,250.7C240,245,480,235,720,245.3C960,256,1200,288,1320,304L1440,320L1440,320L0,320Z" />
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ marginBottom: '-1px' }}>
                <svg viewBox="0 0 1440 200" className="w-full h-auto" preserveAspectRatio="none">
                    <path fill="#5BCD5B" d="M0,128L80,138.7C160,149,320,171,480,165.3C640,160,800,128,960,122.7C1120,117,1280,139,1360,149.3L1440,160L1440,200L0,200Z" />
                </svg>
                {/* Flowers on hill */}
                <div className="absolute bottom-2 left-[15%] text-xl animate-sway">🌼</div>
                <div className="absolute bottom-4 left-[35%] text-lg animate-sway" style={{ animationDelay: '0.5s' }}>🌸</div>
                <div className="absolute bottom-2 right-[25%] text-xl animate-sway" style={{ animationDelay: '1s' }}>🌷</div>
                <div className="absolute bottom-3 right-[40%] text-lg animate-sway" style={{ animationDelay: '0.3s' }}>🌻</div>
            </div>

            {/* ── Floating Elements ── */}
            <span className="absolute top-[12%] left-[25%] text-3xl animate-sparkle pointer-events-none">✨</span>
            <span className="absolute top-[35%] right-[8%] text-2xl animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>🦋</span>
            <span className="absolute top-[20%] left-[60%] text-3xl animate-sway pointer-events-none">🌈</span>
            <span className="absolute bottom-[35%] left-[5%] text-2xl animate-bounce-cute pointer-events-none">🧸</span>
            <span className="absolute top-[50%] right-[20%] text-xl float-note pointer-events-none">♪</span>

            {/* ── Gate Card — 무지개방 입구 ── */}
            <div className="relative w-full max-w-lg p-10 mx-4 text-center z-10">
                {/* Portal ring effect */}
                <div className="absolute inset-0 rounded-[2.5rem] animate-[gate-pulse_3s_ease-in-out_infinite]" />

                {/* Main card */}
                <div className="relative glass rounded-[2.5rem] p-10 rainbow-border overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C77DFF]/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FF4D88]/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Brand */}
                    <span className="text-xl font-black text-[#FF4D88] mb-2 block tracking-tight">TeddyBear&apos;s Room</span>
                    <p className="text-[10px] text-[#6B5BA7] tracking-[0.3em] uppercase mb-6">Whimsyshire Edition</p>

                    {/* 19+ Badge — Game portal style */}
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-[-8px] rounded-full animate-[portal-spin_6s_linear_infinite]">
                            <div className="w-full h-full rounded-full border-2 border-dashed border-[#C77DFF]/30" />
                        </div>
                        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4D88] to-[#C77DFF] shadow-[0_0_30px_rgba(255,77,136,0.4)]">
                            <span className="text-3xl font-black text-white drop-shadow-sm">19</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-black mb-2 text-[#1A0F3C] tracking-tight">
                        무지개 너머로
                    </h2>
                    <p className="text-sm text-[#6B5BA7] mb-8 leading-relaxed">
                        이곳은 성인만을 위한 <span className="text-[#FF4D88] font-bold">비밀의 방</span>입니다.<br />
                        입장하시려면 나이를 확인해주세요.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleVerify}
                            size="lg"
                            className="pill text-lg px-10 py-7 bg-gradient-to-r from-[#FF4D88] to-[#C77DFF] text-white shadow-[0_8px_32px_rgba(255,77,136,0.35)] hover:shadow-[0_12px_40px_rgba(255,77,136,0.5)] hover:scale-105 transition-all group"
                        >
                            <ShieldCheck className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                            네, 입장합니다
                        </Button>
                        <Button
                            onClick={handleReject}
                            variant="outline"
                            size="lg"
                            className="pill text-lg px-10 py-7 border-2 border-[#B8DBFF] bg-white/40 hover:bg-white/70 transition-all"
                        >
                            <Ban className="mr-2 h-5 w-5" />
                            돌아가기
                        </Button>
                    </div>

                    {/* Legal */}
                    <p className="mt-8 text-[10px] text-[#6B5BA7]/40">
                        정보통신망법 및 청소년보호법의 규정을 준수합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
