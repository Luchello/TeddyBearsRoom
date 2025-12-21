/**
 * AuthButton Component
 * TeddyBear's Room - Header Authentication Button
 *
 * Displays login button when unauthenticated, or user avatar with dropdown when authenticated.
 * Uses useHydrated pattern to prevent hydration mismatch with Radix components.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ============================================================
// Hydration Pattern - Prevents SSR/CSR mismatch for Radix
// ============================================================
const emptySubscribe = () => () => {};
function useHydrated() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true, // Client: always hydrated
    () => false // Server: not hydrated
  );
}

// ============================================================
// Icons (Inline SVG for performance)
// ============================================================
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PackageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const GiftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ============================================================
// AuthButton Component
// ============================================================
interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const isHydrated = useHydrated();
  const { user, isLoading, isAuthenticated, signOut } = useAuth();

  /**
   * Extract user initials from email
   * Takes first 2 characters, uppercase
   */
  const getInitials = React.useCallback((email: string | undefined): string => {
    if (!email) return "??";
    return email.slice(0, 2).toUpperCase();
  }, []);

  /**
   * Handle sign out with error handling
   */
  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("[AuthButton] Sign out failed:", error);
    }
  }, [signOut]);

  // ============================================================
  // Render States
  // ============================================================

  // Loading state - show skeleton placeholder
  if (!isHydrated || isLoading) {
    return (
      <div className={className}>
        {/* Show button-sized skeleton during loading */}
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
    );
  }

  // Unauthenticated - show login button
  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" asChild className={className}>
        <Link href="/login">로그인</Link>
      </Button>
    );
  }

  // Authenticated - show avatar with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          aria-label="사용자 메뉴"
        >
          <Avatar className="h-9 w-9 ring-2 ring-border ring-offset-1 ring-offset-background">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* User info header */}
        <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
          {user?.email}
        </div>
        <DropdownMenuSeparator />

        {/* Navigation items */}
        <DropdownMenuItem asChild>
          <Link href="/mypage" className="flex items-center gap-2 cursor-pointer">
            <UserIcon />
            <span>마이페이지</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
            <PackageIcon />
            <span>주문내역</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my/referral/milestones" className="flex items-center gap-2 cursor-pointer">
            <GiftIcon />
            <span>추천인 마일스톤</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my/ambassador" className="flex items-center gap-2 cursor-pointer">
            <StarIcon />
            <span>앰버서더</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out button */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOutIcon />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AuthButton;
