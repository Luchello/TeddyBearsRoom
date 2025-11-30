"use client";

// ====================================
// TeddyBear's Room - Toast System
// Context 기반 토스트 알림 시스템
// ====================================
//
// 🎯 용도:
// - 전역 토스트 알림 표시
// - success, error, warning, info 타입 지원
// - 자동 사라짐 (3초)
//
// 📦 구조:
// - ToastProvider: Context Provider + 토스트 UI 렌더링
// - useToast: Context 훅 (addToast, removeToast)
// - Toast UI: 우측 하단 고정 위치
//
// 🎨 스타일:
// - success: 녹색 배경 + ✅
// - error: 빨간색 배경 + ❌
// - warning: 노란색 배경 + ⚠️
// - info: primary 색상 + 💡
//
// 🔧 동작 원리:
// 1. addToast 호출 → toasts 배열에 추가
// 2. setTimeout (3초) → 자동 제거
// 3. removeToast → 수동 제거 (닫기 버튼)
//
// 📝 사용 예시:
// ```tsx
// // 1. layout.tsx에서 Provider 감싸기
// <ToastProvider>
//   <App />
// </ToastProvider>
//
// // 2. 컴포넌트에서 사용
// const { addToast } = useToast();
// addToast("장바구니에 추가되었습니다", "success");
// ```
// ====================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Toast, ToastType } from "@/lib/types";

// ──────────────────────────────────────
// Context 타입 정의
// ──────────────────────────────────────

/**
 * Toast Context 인터페이스
 * @description 토스트 배열 + 추가/제거 액션
 */
interface ToastContextType {
  toasts: Toast[];                                    // 현재 표시 중인 토스트들
  addToast: (message: string, type?: ToastType) => void;  // 토스트 추가
  removeToast: (id: string) => void;                 // 토스트 제거
}

// Context 생성 (초기값 undefined → useToast에서 에러 체크)
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ──────────────────────────────────────
// Toast Provider 컴포넌트
// ──────────────────────────────────────

/**
 * 토스트 Provider 컴포넌트
 *
 * @description
 * - 토스트 상태 관리
 * - 토스트 UI 렌더링 (우측 하단 고정)
 * - 3초 후 자동 사라짐
 *
 * @param children - 자식 컴포넌트
 *
 * @example
 * // layout.tsx
 * export default function Layout({ children }) {
 *   return (
 *     <ToastProvider>
 *       {children}
 *     </ToastProvider>
 *   );
 * }
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  // 토스트 배열 상태
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ──────────────────────────────────────
  // 토스트 추가
  // - 고유 ID 생성 (timestamp + random)
  // - toasts 배열에 추가
  // - 3초 후 자동 제거 (setTimeout)
  // ──────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    // 고유 ID 생성: toast-{timestamp}-{random}
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newToast: Toast = { id, message, type };

    // 배열에 추가
    setToasts((prev) => [...prev, newToast]);

    // 3초 후 자동 제거
    // setTimeout으로 비동기 처리하여 React lint 에러 방지
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // ──────────────────────────────────────
  // 토스트 수동 제거 (닫기 버튼)
  // ──────────────────────────────────────
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* ─────────────────────────────────────
          Toast UI Container
          - 우측 하단 고정 (fixed bottom-4 right-4)
          - z-50으로 최상위 레이어
          ───────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              animate-in slide-in-from-right fade-in duration-300
              rounded-xl px-4 py-3 shadow-lg backdrop-blur
              flex items-center gap-3 min-w-[280px] max-w-[400px]
              ${toast.type === "success" ? "bg-green-500/90 text-white" : ""}
              ${toast.type === "error" ? "bg-red-500/90 text-white" : ""}
              ${toast.type === "warning" ? "bg-yellow-500/90 text-black" : ""}
              ${toast.type === "info" ? "bg-primary/90 text-primary-foreground" : ""}
            `}
            role="alert"
            aria-live="polite"
          >
            {/* 토스트 타입별 이모지 아이콘 */}
            <span className="text-lg">
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "warning" && "⚠️"}
              {toast.type === "info" && "💡"}
            </span>

            {/* 메시지 */}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>

            {/* 닫기 버튼 */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ──────────────────────────────────────
// useToast 훅
// ──────────────────────────────────────

/**
 * 토스트 Context 훅
 *
 * @description
 * ToastContext에서 toasts, addToast, removeToast를 가져옵니다.
 * ToastProvider 외부에서 호출하면 에러를 throw합니다.
 *
 * @returns ToastContextType - { toasts, addToast, removeToast }
 * @throws Error - ToastProvider 외부에서 호출 시
 *
 * @example
 * function CartButton() {
 *   const { addToast } = useToast();
 *
 *   const handleAddToCart = () => {
 *     // 장바구니 추가 로직...
 *     addToast("장바구니에 추가되었습니다", "success");
 *   };
 *
 *   return <button onClick={handleAddToCart}>담기</button>;
 * }
 */
export function useToast() {
  const context = useContext(ToastContext);

  // Provider 외부에서 호출 시 에러
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
