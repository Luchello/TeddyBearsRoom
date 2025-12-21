/**
 * Register Form Component
 * TeddyBear's Room - User Registration with Adult Verification
 */

"use client";

import * as React from "react";
import Link from "next/link";
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

export function RegisterForm({ className, onSubmit, redirectUrl }: RegisterFormProps) {
  const [step, setStep] = React.useState<"form" | "verification">("form");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setIsLoading(true);

    try {
      // Move to adult verification step
      setStep("verification");
    } catch {
      // SECURITY: 상세 에러 메시지 노출 방지, 일반화된 메시지 사용
      setError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement PASS adult verification
      // After verification, call onSubmit
      await onSubmit?.(formData);
    } catch {
      // SECURITY: 상세 에러 메시지 노출 방지, 일반화된 메시지 사용
      setError("본인인증에 실패했습니다. 잠시 후 다시 시도해주세요.");
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

  if (step === "verification") {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">성인인증</h1>
          <p className="text-muted-foreground mt-2">
            TeddyBear&apos;s Room은 성인 전용 서비스입니다.
            <br />
            본인인증을 통해 만 19세 이상임을 확인해 주세요.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleVerification}
            disabled={isLoading}
          >
            {isLoading ? "인증 중..." : "PASS 본인인증"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            본인인증은 SKT PASS를 통해 안전하게 진행됩니다.
            <br />
            인증 정보는 성인 확인 목적으로만 사용됩니다.
          </p>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setStep("form")}
          >
            이전 단계로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-muted-foreground mt-2">
          TeddyBear&apos;s Room의 회원이 되어주세요
        </p>
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
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? "처리 중..." : "다음 단계"}
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
          href={`/auth/login${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
