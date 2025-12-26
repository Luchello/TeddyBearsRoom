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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md px-4">
            <Card className="max-w-md w-full animate-reveal border-primary/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl animate-pulse-glow">
                        🧸
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Access Restricted</CardTitle>
                    <p className="text-muted-foreground">
                        TeddyBear&apos;s Room은 성인 전용 서비스입니다.
                        <br />
                        이용을 위해 출생 연도를 입력해 주세요.
                    </p>
                </CardHeader>
                <CardContent>
                    <form id="age-gate-form" onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="number"
                                placeholder="YYYY (예: 1990)"
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                                className="text-center text-2xl h-16 tracking-widest rounded-full border-2 focus:border-primary"
                                autoFocus
                                required
                            />
                            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        form="age-gate-form"
                        type="submit"
                        className="w-full text-lg h-14"
                        variant="default"
                    >
                        입장하기
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => window.location.href = "https://www.google.com"}
                    >
                        나가기
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        본 사이트는 쿠키를 사용하여 성인 인증 상태를 유지합니다.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
