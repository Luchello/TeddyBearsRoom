"use client";

/**
 * Register Callback Handler
 *
 * 모바일 본인인증 후 회원가입 완료 처리 컴포넌트
 * - useSearchParams + Suspense 필수 (Next.js 16)
 * - sessionStorage에서 registrationToken 복구
 * - 서버에 회원가입 완료 요청
 */

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type CallbackStatus = "loading" | "verifying" | "success" | "error";

interface ErrorInfo {
  message: string;
  code?: string;
}

export function RegisterCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // PortOne 콜백 파라미터 추출
      const identityVerificationId = searchParams.get("identityVerificationId");
      const code = searchParams.get("code"); // PortOne error code
      const message = searchParams.get("message"); // PortOne error message

      // 에러 응답인 경우
      if (code && code !== "0") {
        setStatus("error");
        setError({
          message: message || "본인인증에 실패했습니다.",
          code,
        });
        return;
      }

      // identityVerificationId가 없는 경우
      if (!identityVerificationId) {
        setStatus("error");
        setError({
          message: "인증 정보가 유효하지 않습니다.",
          code: "MISSING_ID",
        });
        return;
      }

      // sessionStorage에서 registrationToken 가져오기
      const registrationToken = sessionStorage.getItem("registrationToken");
      if (!registrationToken) {
        setStatus("error");
        setError({
          message: "등록 세션이 만료되었습니다. 다시 시도해주세요.",
          code: "SESSION_EXPIRED",
        });
        return;
      }

      // 서버에 회원가입 완료 요청
      setStatus("verifying");

      try {
        const response = await fetch("/api/auth/register/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationToken, identityVerificationId }),
        });

        const data = await response.json();

        if (data.success) {
          // 성공 시 sessionStorage 정리
          sessionStorage.removeItem("registrationToken");
          setStatus("success");

          // 3초 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setStatus("error");
          setError({
            message: data.error?.message || "회원가입에 실패했습니다.",
            code: data.error?.code,
          });
        }
      } catch (err) {
        console.error("Registration callback error:", err);
        setStatus("error");
        setError({
          message: "회원가입 처리 중 오류가 발생했습니다.",
          code: "NETWORK_ERROR",
        });
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const getStatusMessage = () => {
    switch (error?.code) {
      case "UNDERAGE":
        return "만 19세 이상만 이용 가능합니다.";
      case "SESSION_EXPIRED":
        return "등록 세션이 만료되었습니다. 다시 시도해주세요.";
      case "NOT_VERIFIED":
        return "본인인증이 완료되지 않았습니다.";
      case "VERIFICATION_NOT_FOUND":
        return "인증 정보를 찾을 수 없습니다.";
      case "EMAIL_EXISTS":
        return "이미 가입된 이메일입니다.";
      case "INVALID_TOKEN":
        return "유효하지 않은 등록 토큰입니다.";
      default:
        return error?.message || "알 수 없는 오류가 발생했습니다.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-card shadow-lg">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">인증 결과를 확인하는 중...</p>
          </div>
        )}

        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">회원가입을 완료하는 중...</p>
            <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-medium text-green-700">회원가입이 완료되었습니다!</p>
            <p className="text-sm text-muted-foreground">
              TeddyBear&apos;s Room에 오신 것을 환영합니다.
            </p>
            <p className="text-sm text-muted-foreground">잠시 후 메인 페이지로 이동합니다...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium text-destructive">{getStatusMessage()}</p>
            {error?.code && (
              <p className="text-xs text-muted-foreground">오류 코드: {error.code}</p>
            )}
            <button
              onClick={() => router.push("/register")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
