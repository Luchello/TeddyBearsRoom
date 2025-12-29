"use client";

import * as React from "react";
import { useUIStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function AgeGate() {
    const { isAgeVerified, setAgeVerified } = useUIStore();
    const [birthYear, setBirthYear] = React.useState("");
    const [error, setError] = React.useState("");
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        const verified = localStorage.getItem("tbr_age_verified") === "true";
        if (verified) setAgeVerified(true);
    }, [setAgeVerified]);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const year = parseInt(birthYear);
        const currentYear = new Date().getFullYear();

        if (isNaN(year) || year < 1900 || year > currentYear) {
            setError("올바른 출생 연도를 입력해 주세요.");
            return;
        }

        if (currentYear - year >= 19) {
            setAgeVerified(true);
            localStorage.setItem("tbr_age_verified", "true");
        } else {
            setError("만 19세 미만은 이용하실 수 없습니다.");
        }
    };

    if (!isMounted || isAgeVerified) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden p-4">
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-silk-texture silk-texture opacity-[0.05] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-secondary)_0%,transparent_70%)] opacity-30 pointer-events-none" />

            <div className="relative w-full max-w-lg">
                <div className="card-premium p-8 sm:p-12 text-center space-y-8 animate-reveal">
                    {/* Brand Icon */}
                    <div className="relative mx-auto w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-5xl shadow-inner-silk">
                        <span className="animate-float">🧸</span>
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-glow" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">
                            Access <span className="text-premium">Restricted</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            TeddyBear&apos;s Room은 성인 전용 서비스입니다.
                            <br />
                            <span className="text-sm opacity-80">이용을 위해 출생 연도를 입력해 주세요.</span>
                        </p>
                    </div>

                    <form id="age-gate-form" onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-3">
                            <input
                                type="number"
                                placeholder="YYYY"
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                                className="w-full text-center text-4xl h-20 tracking-[0.2em] rounded-2xl bg-primary/5 border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                                autoFocus
                                required
                            />
                            {error && (
                                <p className="text-sm font-bold text-destructive animate-bounce">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                className="btn-premium w-full h-16 text-xl"
                            >
                                입장하기
                            </button>
                            <button
                                type="button"
                                className="w-full h-12 text-muted-foreground hover:text-foreground font-semibold transition-colors"
                                onClick={() => window.location.href = "https://www.google.com"}
                            >
                                나가기
                            </button>
                        </div>
                    </form>

                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto opacity-60">
                        본 사이트는 쿠키를 사용하여 성인 인증 상태를 유지합니다.
                        입장은 만 19세 이상의 성인임을 동의하는 것으로 간주됩니다.
                    </p>
                </div>

                {/* Floating Decoration */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
            </div>
        </div>
    );
}
