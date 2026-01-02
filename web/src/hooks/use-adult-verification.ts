/**
 * useAdultVerification Hook
 * 성인인증 모달 상태 및 인증 플로우 관리
 */

"use client";

import { useState, useCallback } from "react";
import type { VerificationStatus, InitiateResponse, InitiateErrorResponse } from "@/types/adult-verification";
import { requestAdultVerification, getCallbackUrl } from "@/lib/portone/client";
import { getErrorMessage, getApiErrorMessage } from "@/lib/adult-verification/error-messages";

/**
 * 인증 상태 응답 타입
 */
interface StatusResponse {
  success: boolean;
  data?: {
    status: VerificationStatus;
    verifiedAt?: string;
    expiresAt?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 훅 반환 타입
 */
export interface UseAdultVerificationReturn {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 열기 */
  openModal: () => void;
  /** 모달 닫기 */
  closeModal: () => void;
  /** 현재 인증 상태 */
  verificationStatus: VerificationStatus | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 인증 시작 */
  startVerification: () => Promise<void>;
  /** 인증 상태 확인 */
  checkStatus: () => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 성인인증 훅
 *
 * @param onSuccess 인증 성공 시 콜백
 * @returns 인증 상태 및 제어 함수
 *
 * @example
 * ```tsx
 * const {
 *   isOpen,
 *   openModal,
 *   closeModal,
 *   startVerification,
 *   isLoading,
 *   error
 * } = useAdultVerification({
 *   onSuccess: () => {
 *     console.log("인증 완료!");
 *     router.refresh();
 *   }
 * });
 * ```
 */
export function useAdultVerification(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}): UseAdultVerificationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 인증 상태 확인
   */
  const checkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/adult-verification/status");
      const data: StatusResponse = await response.json();

      if (data.success && data.data) {
        setVerificationStatus(data.data.status);
      } else {
        setError(getApiErrorMessage(data));
      }
    } catch (err) {
      console.error("[useAdultVerification] checkStatus error:", err);
      setError("인증 상태 확인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 인증 시작 (전체 플로우)
   */
  const startVerification = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 서버에서 인증 정보 요청
      const initiateResponse = await fetch("/api/auth/adult-verification/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const initiateData: InitiateResponse | InitiateErrorResponse = await initiateResponse.json();

      if (!initiateData.success) {
        const errorResponse = initiateData as InitiateErrorResponse;
        setError(getErrorMessage(errorResponse.error.code));
        options?.onError?.(errorResponse.error.message);
        return;
      }

      const { identityVerificationId, storeId, channelKey } = initiateData.data;

      // 2. PortOne SDK 호출
      const portoneResult = await requestAdultVerification({
        storeId,
        identityVerificationId,
        channelKey,
        redirectUrl: getCallbackUrl(),
      });

      // 3. SDK 에러 처리
      if (!portoneResult.success) {
        const errorMessage = getErrorMessage(portoneResult.error?.code || "UNKNOWN_ERROR");
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return;
      }

      // 4. 서버 검증 요청
      const verifyResponse = await fetch("/api/auth/adult-verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identityVerificationId: portoneResult.identityVerificationId || identityVerificationId,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        setVerificationStatus("VERIFIED");
        closeModal();
        options?.onSuccess?.();
      } else {
        const errorMessage = getApiErrorMessage(verifyData);
        setError(errorMessage);
        options?.onError?.(errorMessage);
      }
    } catch (err) {
      console.error("[useAdultVerification] startVerification error:", err);
      const errorMessage = "본인인증 중 오류가 발생했습니다.";
      setError(errorMessage);
      options?.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [closeModal, options]);

  return {
    isOpen,
    openModal,
    closeModal,
    verificationStatus,
    isLoading,
    error,
    startVerification,
    checkStatus,
    clearError,
  };
}

export default useAdultVerification;
