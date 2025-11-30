"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ban } from "lucide-react";

export function AgeVerificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Check if already verified
        const verified = localStorage.getItem("age-verified");
        if (!verified) {
            setIsOpen(true);
            document.body.style.overflow = "hidden";
        }
    }, []);

    const handleVerify = () => {
        setIsExiting(true);
        setTimeout(() => {
            localStorage.setItem("age-verified", "true");
            setIsOpen(false);
            document.body.style.overflow = "";
        }, 500); // Wait for exit animation
    };

    const handleReject = () => {
        window.location.href = "https://www.google.com";
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Light Mode: Clouds */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/noise.png')] opacity-10 mix-blend-overlay dark:opacity-0" />
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float dark:hidden" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float dark:hidden" style={{ animationDelay: "2s" }} />

                {/* Dark Mode: Matrix/Latex */}
                <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <div className="relative w-full max-w-lg p-8 mx-4 text-center">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse dark:bg-primary/40" />
                    <span className="relative text-6xl animate-bounce-slow block">🔞</span>
                </div>

                <h2 className="text-3xl font-black mb-4 text-foreground dark:text-white tracking-tight">
                    <span className="block text-lg font-medium text-muted-foreground mb-2 uppercase tracking-widest">
                        Gatekeeper Protocol
                    </span>
                    19세 이상이신가요?
                </h2>

                <p className="text-muted-foreground mb-10 leading-relaxed">
                    이곳은 성인만을 위한 <span className="text-primary font-bold">시크릿 유니버스</span>입니다.<br />
                    입장하시려면 성인 인증이 필요합니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleVerify}
                        size="lg"
                        className="rounded-full text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300 group"
                    >
                        <ShieldCheck className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        네, 성인입니다
                    </Button>
                    <Button
                        onClick={handleReject}
                        variant="outline"
                        size="lg"
                        className="rounded-full text-lg px-10 py-6 border-2 hover:bg-muted transition-all duration-300"
                    >
                        <Ban className="mr-2 h-5 w-5" />
                        아니요
                    </Button>
                </div>

                <p className="mt-8 text-xs text-muted-foreground/50">
                    본 사이트는 정보통신망법 및 청소년보호법의 규정을 준수합니다.
                </p>
            </div>
        </div>
    );
}
