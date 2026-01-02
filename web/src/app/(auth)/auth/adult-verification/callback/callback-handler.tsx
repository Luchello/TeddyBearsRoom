"use client";

/**
 * Adult Verification Callback Handler
 *
 * 모바일 본인인증 콜백 처리 컴포넌트
 * - useSearchParams + Suspense 필수 (Next.js 16)
 * - 인증 결과 파싱 및 서버 검증 요청
 * - 결과에 따른 리다이렉트
 */

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type CallbackStatus = "loading" | "verifying" | "success" | "error";

interface ErrorInfo {
  message: string;
  code?: string;
}

export function AdultVerificationCallbackHandler() {
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

      // 서버에 검증 요청
      setStatus("verifying");

      try {
        const response = await fetch("/api/auth/adult-verification/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identityVerificationId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          // 3초 후 이전 페이지 또는 홈으로 리다이렉트
          setTimeout(() => {
            const returnUrl = searchParams.get("returnUrl") || "/";
            router.push(returnUrl);
          }, 2000);
        } else {
          setStatus("error");
          setError({
            message: data.error || "인증 검증에 실패했습니다.",
            code: data.code,
          });
        }
      } catch (err) {
        console.error("Verification callback error:", err);
        setStatus("error");
        setError({
          message: "인증 처리 중 오류가 발생했습니다.",
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
      case "NOT_VERIFIED":
        return "본인인증이 완료되지 않았습니다.";
      case "VERIFICATION_NOT_FOUND":
        return "인증 정보를 찾을 수 없습니다.";
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
            <p className="text-lg font-medium">인증을 검증하는 중...</p>
            <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-medium text-green-700">성인인증이 완료되었습니다!</p>
            <p className="text-sm text-muted-foreground">잠시 후 이전 페이지로 이동합니다...</p>
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
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
