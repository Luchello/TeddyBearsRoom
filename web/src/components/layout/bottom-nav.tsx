"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: ShoppingBag },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Profile", href: "/account", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 h-16 w-[90%] max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-around px-6 shadow-2xl md:hidden animate-reveal"
            role="navigation"
            aria-label="모바일 메인 네비게이션"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={item.name}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 transition-all duration-500",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl",
                            isActive
                                ? "text-primary scale-110"
                                : "text-muted-foreground hover:text-foreground active:scale-95"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full transition-all duration-500",
                            isActive && "bg-primary/10 shadow-[0_0_20px_rgba(226,149,120,0.2)]"
                        )}>
                            <Icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                aria-hidden="true"
                                className={cn(isActive && "animate-pulse-glow")}
                            />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black tracking-widest uppercase transition-all",
                            isActive ? "opacity-100" : "opacity-0"
                        )}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
