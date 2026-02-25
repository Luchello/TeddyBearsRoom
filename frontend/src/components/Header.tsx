"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Menu,
  Search,
  User,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Info,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartButton } from "@/components/CartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { useAuthStore } from "@/store/authStore";

type NavItem = { name: string; href: string };

const primaryNav: NavItem[] = [
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Subscribe", href: "/subscribe" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, openLoginModal, logout } = useAuthStore();

  const accountLabel = useMemo(() => {
    if (isAuthenticated && user?.name) return `${user.name} account`;
    return "Account";
  }, [isAuthenticated, user?.name]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass rail */}
      <div className="glass border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: brand */}
            <Link
              href="/"
              className="group inline-flex items-baseline gap-2"
              aria-label="TeddyBear's Room Home"
            >
              <span className="font-display text-xl sm:text-2xl text-foreground group-hover:opacity-80 transition-opacity">
                TeddyBear&apos;s Room
              </span>
              <span className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                Intimacy Wellness
              </span>
            </Link>

            {/* Center: nav */}
            <nav className="hidden md:flex items-center gap-8">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              {/* Search (lightweight) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-11 w-11 rounded-full"
                asChild
              >
                <Link href="/products" aria-label="Search products">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>

              <WishlistButton />
              <CartButton />

              {/* Account */}
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex h-11 w-11 rounded-full"
                  asChild
                >
                  <Link href="/profile" aria-label={accountLabel}>
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex h-11 w-11 rounded-full"
                  aria-label={accountLabel}
                  onClick={openLoginModal}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Mobile menu */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-11 w-11 rounded-full"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[340px] sm:w-[380px] bg-background/80 backdrop-blur-xl border-l border-border"
                >
                  <SheetHeader className="pb-4 border-b border-border">
                    <SheetTitle className="font-display text-xl text-foreground">
                      TeddyBear&apos;s Room
                    </SheetTitle>
                  </SheetHeader>

                  <div className="pt-6 flex flex-col gap-8">
                    {/* Account block */}
                    <div className="surface p-4">
                      {isAuthenticated && user ? (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {user.email || "Member"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-11 px-4 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setOpen(false);
                              logout();
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Sign in
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Access orders, wishlist, and rewards.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="h-11 px-5 rounded-full bg-accent text-accent-foreground hover:opacity-90"
                            onClick={() => {
                              setOpen(false);
                              openLoginModal();
                            }}
                          >
                            Continue
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2">
                      <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                        Navigate
                      </p>
                      <div className="grid gap-1">
                        <Link
                          href="/products"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            Shop
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                          href="/about"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            About
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link
                          href="/subscribe"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                            <Crown className="h-4 w-4 text-muted-foreground" />
                            Subscribe
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-2">
                      <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                        Quick access
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl justify-start"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/products">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl justify-start"
                          onClick={() => {
                            setOpen(false);
                            if (isAuthenticated) {
                              window.location.href = "/profile?tab=wishlist";
                            } else {
                              openLoginModal();
                            }
                          }}
                        >
                          <span className="inline-flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Account
                          </span>
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Discreet delivery. Safe materials. Same-day dispatch.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle ambient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
