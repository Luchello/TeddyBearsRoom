"use client";

// ====================================
// TeddyBear's Room - Auth Modal
// Login/Register modal component (Skeleton)
// ====================================

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Reset form on modal close (using timeout to avoid synchronous setState in effect)
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, closeModal]);

  // Prevent body scroll when open
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={modalMode === "login" ? "로그인" : "회원가입"}
      >
        <div className="w-full max-w-md bg-background rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 dark:neon-card">
          {/* Header */}
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

          {/* Form */}
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

          {/* Footer */}
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

          {/* Social Login Placeholder */}
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
