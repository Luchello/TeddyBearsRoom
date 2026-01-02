/**
 * Adult Verification Modal Component
 * 성인인증 안내 및 인증 시작 모달
 */

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ADULT_VERIFICATION } from "@/constants/adult-verification";

/**
 * Props 인터페이스
 */
interface AdultVerificationModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 인증 성공 콜백 */
  onSuccess: () => void;
  /** 인증 시작 핸들러 (외부에서 주입) */
  onStartVerification: () => Promise<void>;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 에러 메시지 */
  error?: string | null;
}

/**
 * 성인인증 안내 모달
 *
 * 청소년보호법에 따른 성인인증 안내 및 인증 시작 UI
 *
 * @example
 * ```tsx
 * const { isOpen, closeModal, startVerification, isLoading, error } = useAdultVerification({
 *   onSuccess: () => router.refresh()
 * });
 *
 * <AdultVerificationModal
 *   open={isOpen}
 *   onClose={closeModal}
 *   onSuccess={() => {}}
 *   onStartVerification={startVerification}
 *   isLoading={isLoading}
 *   error={error}
 * />
 * ```
 */
export function AdultVerificationModal({
  open,
  onClose,
  onSuccess,
  onStartVerification,
  isLoading = false,
  error = null,
}: AdultVerificationModalProps) {
  const handleStartVerification = async () => {
    await onStartVerification();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            <span>성인인증 안내</span>
          </DialogTitle>
          <DialogDescription>
            청소년보호법에 따라 만 19세 이상만 이용 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 안내 문구 */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              이 상품은 청소년보호법에 따라
              <br />
              <strong className="text-foreground">만 19세 이상</strong>만 구매 가능합니다.
            </p>
            <p>
              휴대폰 본인인증을 통해
              <br />
              연령을 확인해주세요.
            </p>
          </div>

          {/* 인증 정보 */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>
                <strong>소요 시간:</strong> 약 1분
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <LockIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>
                <strong>수집 정보:</strong> 연령 확인 정보만 저장
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>
                <strong>유효 기간:</strong> {Math.floor(ADULT_VERIFICATION.EXPIRY_DAYS / 365)}년
              </span>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 개인정보 안내 */}
          <p className="text-xs text-muted-foreground">
            인증 시 수집되는 개인정보는 연령 확인 목적으로만 사용되며,
            CI(연계정보)는 해시 처리하여 안전하게 보관됩니다.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            onClick={handleStartVerification}
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "인증 진행 중..." : "본인인증 시작"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// === Icons ===

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export default AdultVerificationModal;
