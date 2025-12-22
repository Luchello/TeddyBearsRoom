/**
 * Login Form Component (Social Only)
 * TeddyBear's Room - Social Authentication
 *
 * Provides social login buttons for Kakao and Google.
 * Email/password login has been removed in favor of social-only auth.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signInWithSocial, type SocialProvider } from "@/lib/auth/social";
import { logger } from "@/lib/logger";

// ============================================
// Types
// ============================================

interface LoginFormProps {
  className?: string;
  redirectUrl?: string;
}

interface ProviderButtonProps {
  provider: SocialProvider;
  isLoading: boolean;
  loadingProvider: SocialProvider | null;
  onClick: (provider: SocialProvider) => void;
}

// ============================================
// Provider Icons
// ============================================

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 3C6.48 3 2 6.68 2 11.2c0 2.93 1.97 5.5 4.93 6.95l-.93 3.45c-.08.3.26.56.52.4l4.12-2.74c.44.04.89.06 1.36.06 5.52 0 10-3.68 10-8.2S17.52 3 12 3z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ============================================
// Provider Button Component
// ============================================

const PROVIDER_CONFIG: Record<
  SocialProvider,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  kakao: {
    label: "카카오로 계속하기",
    icon: KakaoIcon,
    className: "bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] border-transparent",
  },
  google: {
    label: "Google로 계속하기",
    icon: GoogleIcon,
    className: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
  },
};

function ProviderButton({
  provider,
  isLoading,
  loadingProvider,
  onClick,
}: ProviderButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  const Icon = config.icon;
  const isCurrentLoading = loadingProvider === provider;

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full gap-3 font-medium", config.className)}
      onClick={() => onClick(provider)}
      disabled={isLoading}
    >
      {isCurrentLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      {isCurrentLoading ? "로그인 중..." : config.label}
    </Button>
  );
}

// ============================================
// Main Login Form Component
// ============================================

export function LoginForm({ className, redirectUrl = "/" }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<SocialProvider | null>(null);
  const [error, setError] = React.useState("");

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError("");
    setIsLoading(true);
    setLoadingProvider(provider);

    try {
      const result = await signInWithSocial(provider, redirectUrl);

      if (result.success && result.url) {
        // Redirect to OAuth provider
        window.location.href = result.url;
      } else {
        setError(result.error || "로그인에 실패했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
        setLoadingProvider(null);
      }
    } catch (err) {
      logger.error("[LoginForm]", "Social login error:", err);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto card-whimsy p-8 bg-white/70 backdrop-blur-md", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 text-5xl flex items-center justify-center animate-bounce-soft">
          ☁️
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">로그인</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          TeddyBear&apos;s Room에 오신 것을 환영합니다 🎀
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <ProviderButton
          provider="kakao"
          isLoading={isLoading}
          loadingProvider={loadingProvider}
          onClick={handleSocialLogin}
        />
        <ProviderButton
          provider="google"
          isLoading={isLoading}
          loadingProvider={loadingProvider}
          onClick={handleSocialLogin}
        />
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted" />
        </div>
      </div>

      {/* Terms Notice */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        로그인 시{" "}
        <Link href="/terms" className="text-primary hover:underline">
          이용약관
        </Link>
        {" "}및{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>

      {/* Help Text */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        처음 방문하시나요?{" "}
        <span className="text-foreground">
          소셜 로그인으로 간편하게 가입됩니다.
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
