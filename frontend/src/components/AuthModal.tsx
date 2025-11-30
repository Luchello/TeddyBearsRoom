"use client";

// ====================================
// TeddyBear's Room - AuthModal 컴포넌트
// 로그인/회원가입 모달 (Skeleton)
// ====================================
//
// 🎯 용도:
// - 로그인/회원가입 인터페이스 제공
// - authStore 기반 상태 관리
// - 이메일 + 비밀번호 인증 (Skeleton)
// - 추후 소셜 로그인 통합 예정
//
// 📦 구조:
// - Backdrop: 반투명 배경 (클릭 시 닫힘)
// - Modal: 중앙 모달 (헤더 + 폼 + 푸터)
// - Header: 제목 + 닫기 버튼
// - Form: 로그인 또는 회원가입 폼
// - Footer: 모드 전환 링크
// - Social Login: 카카오, 네이버 (비활성화)
//
// 🎨 디자인:
// - animate-in zoom-in-95: 모달 진입 애니메이션
// - max-w-md: 최대 너비 md (448px)
// - dark:neon-card: 다크모드 네온 효과
// - 가로 3단 레이아웃 (헤더/폼/푸터)
//
// 🔧 주요 기능:
// - ESC 키로 모달 닫기
// - 열릴 때 body overflow hidden (배경 스크롤 방지)
// - 폼 제출 시 login/register 액션 실행
// - isLoading 상태에서 버튼 비활성화
// - 로그인↔회원가입 모드 전환
//
// 📝 의존성:
// - shadcn/ui: Button
// - lucide-react: X, Mail, Lock, User, Loader2 아이콘
// - authStore: 로그인/회원가입 액션
// - ToastContext: 알림 표시
// ====================================

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";

// ──────────────────────────────────────
// AuthModal 컴포넌트
// ──────────────────────────────────────

/**
 * 인증 모달 컴포넌트
 *
 * @description
 * 로그인 및 회원가입 기능을 제공하는 모달입니다.
 * - authStore의 isModalOpen으로 표시/숨김 제어
 * - modalMode로 로그인/회원가입 구분
 * - 이메일, 비밀번호, 이름(가입 시) 입력
 * - Toast 알림으로 결과 피드백
 *
 * @example
 * // App 전역 배치 (layout.tsx)
 * <AuthModal />
 *
 * // 로그인 모달 열기
 * const { openLoginModal } = useAuthStore();
 * <button onClick={openLoginModal}>로그인</button>
 */
export function AuthModal() {
  const {
    isModalOpen,
    modalMode,
    isLoading,
    closeModal,
    login,
    register,
    openLoginModal,
    openRegisterModal,
  } = useAuthStore();
  const { addToast } = useToast();

  // ──────────────────────────────────────
  // 폼 상태
  // ──────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // ──────────────────────────────────────
  // 모달 닫힐 때 폼 초기화
  // setTimeout으로 비동기화하여 lint 에러 방지
  // ──────────────────────────────────────
  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setEmail("");
        setPassword("");
        setName("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // ──────────────────────────────────────
  // ESC 키로 모달 닫기
  // ──────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, closeModal]);

  // ──────────────────────────────────────
  // 모달 열릴 때 배경 스크롤 잠금
  // ──────────────────────────────────────
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // ──────────────────────────────────────
  // 폼 제출 핸들러
  // - 로그인 모드: email + password로 로그인
  // - 회원가입 모드: email + password + name으로 회원가입
  // ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "login") {
      const result = await login(email, password);
      if (result.success) {
        addToast("로그인되었어요! 환영합니다 🧸", "success");
      } else {
        addToast(result.error || "로그인에 실패했어요. 다시 시도해주세요.", "error");
      }
    } else {
      const result = await register(email, password, name);
      if (result.success && !result.error) {
        addToast("회원가입이 완료되었어요! 환영합니다 🎉", "success");
      } else if (result.success && result.error) {
        // Email confirmation required
        addToast(result.error, "info");
        closeModal();
      } else {
        addToast(result.error || "회원가입에 실패했어요. 다시 시도해주세요.", "error");
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* ─────────────────────────────────────
          배경 (Backdrop)
          - 반투명 검은색 배경
          - 클릭 시 모달 닫기
          ───────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────
          모달 (Dialog)
          - role="dialog": 접근성 정보
          - zoom-in-95 애니메이션
          ───────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={modalMode === "login" ? "로그인" : "회원가입"}
      >
        <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 dark:neon-card">
          {/* ─────────────────────────────────────
              헤더 (제목 + 닫기 버튼)
              ───────────────────────────────────── */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧸</span>
              <h2 className="text-xl font-bold">
                {modalMode === "login" ? "로그인" : "회원가입"}
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ─────────────────────────────────────
              폼 (입력 필드 + 제출 버튼)
              ───────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modalMode === "register" && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground dark:neon-glow-subtle"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : modalMode === "login" ? (
                "로그인"
              ) : (
                "회원가입"
              )}
            </Button>
          </form>

          {/* ─────────────────────────────────────
              푸터 (모드 전환 링크)
              - 로그인 모드 → 회원가입 링크
              - 회원가입 모드 → 로그인 링크
              ───────────────────────────────────── */}
          <div className="p-6 pt-0 text-center">
            <p className="text-sm text-muted-foreground">
              {modalMode === "login" ? (
                <>
                  아직 회원이 아니신가요?{" "}
                  <button
                    type="button"
                    onClick={openRegisterModal}
                    className="text-primary hover:underline font-medium"
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="text-primary hover:underline font-medium"
                  >
                    로그인
                  </button>
                </>
              )}
            </p>
          </div>

          {/* ─────────────────────────────────────
              소셜 로그인 (준비 중)
              - 카카오, 네이버 로그인 예정
              - 현재는 비활성화 (disabled)
              ───────────────────────────────────── */}
          <div className="px-6 pb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  또는 소셜 로그인
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
              >
                <span>🔜</span> 카카오
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
              >
                <span>🔜</span> 네이버
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              소셜 로그인은 준비 중이에요
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
