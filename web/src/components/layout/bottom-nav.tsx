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
    { name: "Profile", href: "/mypage", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 md:hidden">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
                            isActive
                                ? "text-primary scale-110"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <div className={cn(
                            "p-1 rounded-full transition-all",
                            isActive && "bg-primary/10 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]"
                        )}>
                            <Icon size={20} className={cn(isActive && "animate-pulse-glow")} />
                        </div>
                        <span className="text-[10px] font-medium tracking-tight">
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
