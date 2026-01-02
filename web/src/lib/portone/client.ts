/**
 * PortOne Browser SDK Client
 * 본인인증(Identity Verification) 클라이언트 래퍼
 */

import * as PortOne from "@portone/browser-sdk/v2";

/**
 * 본인인증 요청 파라미터
 */
export interface RequestVerificationParams {
  storeId: string;
  identityVerificationId: string;
  channelKey: string;
  redirectUrl?: string;
}

/**
 * 본인인증 결과
 */
export interface VerificationResult {
  success: boolean;
  identityVerificationId?: string;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * PortOne SDK를 통한 본인인증 요청
 *
 * @param params 인증 요청 파라미터
 * @returns 인증 결과
 *
 * @example
 * ```ts
 * const result = await requestAdultVerification({
 *   storeId: "store-xxx",
 *   identityVerificationId: "adult-user123-1234567890",
 *   channelKey: "channel-key-xxx",
 *   redirectUrl: "/auth/adult-verification/callback"
 * });
 *
 * if (result.success) {
 *   // 서버로 검증 요청
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function requestAdultVerification(
  params: RequestVerificationParams
): Promise<VerificationResult> {
  try {
    const response = await PortOne.requestIdentityVerification({
      storeId: params.storeId,
      identityVerificationId: params.identityVerificationId,
      channelKey: params.channelKey,
      // 모바일에서 리다이렉트될 URL (선택)
      redirectUrl: params.redirectUrl,
    });

    // PortOne SDK는 에러 시 code 필드가 존재
    if (response && "code" in response && response.code !== undefined) {
      return {
        success: false,
        error: {
          code: response.code as string,
          message: (response as { message?: string }).message || "본인인증에 실패했습니다.",
        },
      };
    }

    // 성공 시 identityVerificationId 반환
    return {
      success: true,
      identityVerificationId: response?.identityVerificationId,
    };
  } catch (error) {
    console.error("[PortOne] Identity verification error:", error);

    // 예외 처리
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          code: "SDK_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "본인인증 중 알 수 없는 오류가 발생했습니다.",
      },
    };
  }
}

/**
 * 현재 디바이스가 모바일인지 확인
 * 모바일에서는 리다이렉트 방식으로 인증 진행
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

/**
 * 본인인증 콜백 URL 생성
 * 모바일 리다이렉트 시 사용
 */
export function getCallbackUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/adult-verification/callback`;
}
