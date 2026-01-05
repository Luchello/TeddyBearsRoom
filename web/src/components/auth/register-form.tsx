/**
 * Register Form Component v2.0
 * TeddyBear's Room - User Registration with Adult Verification
 *
 * 3-Step Flow:
 * 1. form: 이메일/비밀번호/약관 입력
 * 2. verification: 본인확인 SDK 호출 중 (로딩 UI)
 * 3. complete: 완료/자동 로그인
 */

"use client";

import * as React from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator, TextSeparator } from "@/components/ui/separator";

interface RegisterFormProps {
  className?: string;
  onSubmit?: (data: RegisterData) => Promise<void>;
  redirectUrl?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

interface InitiateResponse {
  storeId: string;
  identityVerificationId: string;
  channelKey: string;
  registrationToken: string;
}

type Step = "form" | "verification" | "complete";

/**
 * PortOne SDK 에러 코드를 사용자 친화적 메시지로 변환
 */
function getVerificationErrorMessage(code: string): string {
  switch (code) {
    case "USER_CANCEL":
      return "본인인증이 취소되었습니다.";
    case "PG_PROVIDER":
      return "인증 서비스에 일시적인 오류가 발생했습니다.";
    case "TIMEOUT":
      return "인증 시간이 초과되었습니다. 다시 시도해주세요.";
    case "INVALID_REQUEST":
      return "잘못된 요청입니다. 다시 시도해주세요.";
    default:
      return "본인인증에 실패했습니다. 다시 시도해주세요.";
  }
}

export function RegisterForm({ className, onSubmit, redirectUrl }: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("form");
  const [formData, setFormData] = React.useState<RegisterData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const passwordMatch = formData.password === passwordConfirm;
  const passwordValid = formData.password.length >= 8;
  const canSubmit =
    formData.email &&
    formData.password &&
    passwordMatch &&
    passwordValid &&
    formData.name &&
    formData.agreeTerms &&
    formData.agreePrivacy;

  /**
   * Step 3: 회원가입 완료 처리
   */
  const completeRegistration = async (
    registrationToken: string,
    identityVerificationId: string
  ) => {
    const response = await fetch("/api/auth/register/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationToken,
        identityVerificationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "회원가입 완료에 실패했습니다.");
    }

    return response.json();
  };

  /**
   * Step 2: PortOne 본인인증 SDK 호출
   */
  const startVerification = async (initiateData: InitiateResponse) => {
    setStep("verification");

    // 모바일 리다이렉트 시나리오를 위해 registrationToken 저장
    // 콜백 페이지에서 회원가입 완료에 필요
    sessionStorage.setItem("registrationToken", initiateData.registrationToken);

    try {
      // PortOne SDK 호출
      const response = await PortOne.requestIdentityVerification({
        storeId: initiateData.storeId,
        identityVerificationId: initiateData.identityVerificationId,
        channelKey: initiateData.channelKey,
        redirectUrl: `${window.location.origin}/auth/register/callback`,
      });

      // SDK 에러 처리 (code가 있으면 에러)
      if (response?.code !== undefined) {
        setError(getVerificationErrorMessage(response.code));
        setStep("form");
        return;
      }

      // 서버 검증 호출
      await completeRegistration(
        initiateData.registrationToken,
        response?.identityVerificationId || initiateData.identityVerificationId
      );

      // 성공 시 sessionStorage 정리
      sessionStorage.removeItem("registrationToken");

      // 완료 단계로 이동
      setStep("complete");

      // 추가 콜백 실행 (있는 경우)
      if (onSubmit) {
        await onSubmit(formData);
      }

      // 자동 리다이렉트 (3초 후)
      setTimeout(() => {
        router.push(redirectUrl || "/");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "본인인증에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
      setStep("form");
    }
  };

  /**
   * Step 1: 폼 제출 -> initiate API 호출
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setIsLoading(true);

    try {
      // initiate API 호출
      const response = await fetch("/api/auth/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          agreeTerms: formData.agreeTerms,
          agreePrivacy: formData.agreePrivacy,
          agreeMarketing: formData.agreeMarketing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "회원가입 요청에 실패했습니다.");
      }

      const initiateData: InitiateResponse = await response.json();

      // 본인인증 SDK 호출
      await startVerification(initiateData);
    } catch (err) {
      // SECURITY: 상세 에러 메시지 노출 방지
      const errorMessage =
        err instanceof Error ? err.message : "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setError(errorMessage);
      setStep("form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgreeAll = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    });
  };

  const allAgreed =
    formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing;

  // Step 3: 완료 화면
  if (step === "complete") {
    return (
      <div className={cn("w-full max-w-md mx-auto card-whimsy p-8 bg-white/70 backdrop-blur-md", className)}>
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-green-100 mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
            가입 완료!
          </h1>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            TeddyBear&apos;s Room 가족이 되신 것을 환영합니다!
            <br />
            잠시 후 자동으로 이동합니다...
          </p>
          <Button
            variant="bubbly"
            className="w-full"
            onClick={() => router.push(redirectUrl || "/")}
          >
            지금 시작하기
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: 본인인증 진행 중 화면
  if (step === "verification") {
    return (
      <div className={cn("w-full max-w-md mx-auto card-whimsy p-8 bg-white/70 backdrop-blur-md", className)}>
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-[var(--color-love-50)] mb-6 animate-pulse">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
            본인인증 진행 중
          </h1>
          <p className="text-[var(--color-muted-foreground)] mb-6">
            인증 창에서 본인인증을 완료해주세요.
            <br />
            완료되면 자동으로 다음 단계로 진행됩니다.
          </p>

          {/* 로딩 인디케이터 */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            인증 창이 열리지 않으면{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setStep("form")}
            >
              여기를 클릭
            </button>
            하여 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  // Step 1: 회원가입 폼
  return (
    <div className={cn("w-full max-w-md mx-auto card-whimsy p-8 bg-white/70 backdrop-blur-md", className)}>
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-[var(--color-love-50)] mb-4 animate-pulse-glow">
          <span className="text-3xl">🧸</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">회원가입</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          TeddyBear&apos;s Room의 가족이 되어주세요
        </p>
      </div>

      {/* 성인인증 안내 */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔞</span>
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-1">
              성인인증이 필요한 서비스입니다
            </p>
            <ul className="text-amber-800 space-y-1 list-disc list-inside">
              <li>TeddyBear&apos;s Room은 만 19세 이상만 이용 가능합니다</li>
              <li>휴대폰 본인확인을 통해 연령을 인증합니다</li>
              <li>인증 정보는 성인 확인 목적으로만 사용됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" required>
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" required>
            비밀번호
          </Label>
          <PasswordInput
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            autoComplete="new-password"
          />
          {formData.password && !passwordValid && (
            <p className="text-xs text-destructive">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* Password Confirm */}
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm" required>
            비밀번호 확인
          </Label>
          <PasswordInput
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
          {passwordConfirm && !passwordMatch && (
            <p className="text-xs text-destructive">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" required>
            이름
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" optional>
            휴대폰 번호
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            autoComplete="tel"
          />
        </div>

        <Separator className="my-6" />

        {/* Agreements */}
        <div className="space-y-3">
          <Checkbox
            label="전체 동의"
            checked={allAgreed}
            onChange={(e) => handleAgreeAll(e.target.checked)}
            className="font-medium"
          />

          <div className="pl-6 space-y-2">
            <div className="flex items-center justify-between">
              <Checkbox
                label="이용약관 동의 (필수)"
                checked={formData.agreeTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeTerms: e.target.checked })
                }
              />
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                보기
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="개인정보처리방침 동의 (필수)"
                checked={formData.agreePrivacy}
                onChange={(e) =>
                  setFormData({ ...formData, agreePrivacy: e.target.checked })
                }
              />
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                보기
              </Link>
            </div>

            <Checkbox
              label="마케팅 정보 수신 동의 (선택)"
              description="이벤트, 할인 정보 등을 받아보실 수 있습니다."
              checked={formData.agreeMarketing}
              onChange={(e) =>
                setFormData({ ...formData, agreeMarketing: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          variant="bubbly"
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? "처리 중..." : "본인인증 후 가입하기"}
        </Button>
      </form>

      <TextSeparator className="my-6">또는</TextSeparator>

      {/* Social Sign Up */}
      <p className="text-center text-sm text-muted-foreground">
        소셜 계정으로 간편하게 가입하세요
      </p>

      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.68 2 11.2c0 2.93 1.97 5.5 4.93 6.95l-.93 3.45c-.08.3.26.56.52.4l4.12-2.74c.44.04.89.06 1.36.06 5.52 0 10-3.68 10-8.2S17.52 3 12 3z" />
          </svg>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#03C75A">
            <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
          </svg>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href={`/login${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
