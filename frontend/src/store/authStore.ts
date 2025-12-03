"use client";

// ====================================
// TeddyBear's Room - Auth Store
// 인증 상태 관리 (Zustand + Supabase Auth)
// ====================================
//
// 🎯 용도:
// - Supabase Auth 기반 로그인/회원가입/로그아웃
// - 사용자 세션 상태 관리
// - 인증 모달 UI 상태 관리
//
// 📦 상태 구조:
// - user: User | null (현재 로그인된 사용자)
// - isAuthenticated: boolean (로그인 여부)
// - isLoading: boolean (인증 처리 중)
// - isModalOpen: boolean (로그인/회원가입 모달)
// - modalMode: "login" | "register" (모달 모드)
//
// 🔧 주요 기능:
// - login: 이메일/비밀번호 로그인 (Supabase Auth)
// - register: 회원가입 (이메일 확인 필요)
// - logout: 로그아웃
// - refreshSession: 세션 갱신 (앱 시작 시)
//
// 💾 영속성:
// - localStorage 키: "tbr-auth"
// - partialize로 user, isAuthenticated만 저장
// - isLoading, 모달 상태는 저장 안 함
//
// 📝 사용 예시:
// ```tsx
// const { user, login, openLoginModal } = useAuthStore();
//
// if (!user) {
//   openLoginModal(); // 로그인 모달 열기
// }
//
// const result = await login(email, password);
// if (result.success) {
//   // 로그인 성공
// }
// ```
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthState } from "@/lib/types";

// ──────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────

/**
 * Auth Store 인터페이스
 * @description AuthState 확장 + 모달 상태 + 액션 메서드
 */
interface AuthStore extends AuthState {
  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshSession: () => Promise<void>;

  // Modal State & Actions
  isModalOpen: boolean;
  modalMode: "login" | "register";
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModal: () => void;
}

// ──────────────────────────────────────
// 헬퍼 함수: Supabase User → TBR User 변환
// ──────────────────────────────────────

/**
 * Supabase 사용자 객체를 TBR User 타입으로 변환
 *
 * @description
 * Supabase Auth의 user 객체를 애플리케이션에서 사용하는
 * User 타입으로 매핑합니다.
 *
 * @param supabaseUser - Supabase Auth user 객체
 * @returns User | null - 변환된 사용자 객체
 *
 * @example
 * const user = mapSupabaseUser(session.user);
 * // { id, email, name, avatar, subscriptionTier: "none", points: 0 }
 */
function mapSupabaseUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: { name?: string; avatar_url?: string }
} | null): User | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    // 이름 우선순위: user_metadata.name → 이메일 앞부분 → "User"
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
    avatar: supabaseUser.user_metadata?.avatar_url,
    // 구독/포인트는 별도 프로필 테이블에서 가져옴 (TODO)
    subscriptionTier: "none",
    points: 0,
    createdAt: new Date().toISOString(),
  };
}

// ──────────────────────────────────────
// Store 생성
// ──────────────────────────────────────

/**
 * 인증 Zustand Store
 *
 * @description
 * Supabase Auth를 기반으로 인증 상태를 관리합니다.
 * persist middleware로 user, isAuthenticated만 localStorage에 저장합니다.
 *
 * @example
 * // 컴포넌트에서 사용
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 *
 * // 로그인 처리
 * const result = await login(email, password);
 * if (!result.success) {
 *   showError(result.error);
 * }
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ──────────────────────────────────────
      // 초기 상태
      // ──────────────────────────────────────
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isModalOpen: false,
      modalMode: "login",

      // ──────────────────────────────────────
      // 로그인 (Supabase signInWithPassword)
      // - 성공 시 user 상태 업데이트 + 모달 닫기
      // - 실패 시 error 메시지 반환
      // ──────────────────────────────────────
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // Supabase user → TBR User 변환
          const user = mapSupabaseUser(data.user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isModalOpen: false, // 로그인 성공 시 모달 자동 닫기
          });

          return { success: true };
        } catch (_err) {
          // Note: 에러 로깅은 프로덕션에서 Sentry 등으로 대체 예정
          set({ isLoading: false });
          return { success: false, error: "로그인 중 오류가 발생했습니다." };
        }
      },

      // ──────────────────────────────────────
      // 회원가입 (Supabase signUp)
      // - 이메일 확인이 필요한 경우 안내 메시지 반환
      // - 즉시 로그인 가능한 경우 user 상태 업데이트
      // ──────────────────────────────────────
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name, // user_metadata에 이름 저장
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // 이메일 확인이 필요한 경우 (user는 있지만 session은 없음)
          if (data.user && !data.session) {
            set({ isLoading: false });
            return { success: true, error: "이메일을 확인하여 가입을 완료해주세요." };
          }

          // 즉시 로그인된 경우
          const user = mapSupabaseUser(data.user);

          set({
            user,
            isAuthenticated: !!data.session,
            isLoading: false,
            isModalOpen: false,
          });

          return { success: true };
        } catch (_err) {
          // Note: 에러 로깅은 프로덕션에서 Sentry 등으로 대체 예정
          set({ isLoading: false });
          return { success: false, error: "회원가입 중 오류가 발생했습니다." };
        }
      },

      // ──────────────────────────────────────
      // 로그아웃 (Supabase signOut)
      // - Supabase 세션 종료
      // - 로컬 상태 초기화
      // ──────────────────────────────────────
      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (err) {
          console.error("Logout error:", err);
        }

        // Supabase 에러와 무관하게 로컬 상태는 초기화
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // ──────────────────────────────────────
      // 사용자 정보 부분 업데이트
      // - 프로필 수정 후 상태 반영
      // ──────────────────────────────────────
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      // ──────────────────────────────────────
      // 로딩 상태 설정 (외부에서 제어 필요 시)
      // ──────────────────────────────────────
      setLoading: (loading) => set({ isLoading: loading }),

      // ──────────────────────────────────────
      // 세션 갱신 (앱 시작 시 호출)
      // - Supabase에서 현재 세션 확인
      // - 유효하면 user 상태 업데이트
      // - 무효하면 로그아웃 상태로 설정
      // ──────────────────────────────────────
      refreshSession: async () => {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const user = mapSupabaseUser(session.user);
            set({
              user,
              isAuthenticated: true,
            });
          } else {
            // 세션 없음 → 로그아웃 상태
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (err) {
          console.error("Session refresh error:", err);
        }
      },

      // ──────────────────────────────────────
      // 모달 액션
      // - openLoginModal: 로그인 모달 열기
      // - openRegisterModal: 회원가입 모달 열기
      // - closeModal: 모달 닫기
      // ──────────────────────────────────────
      openLoginModal: () => set({ isModalOpen: true, modalMode: "login" }),
      openRegisterModal: () => set({ isModalOpen: true, modalMode: "register" }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    {
      name: "tbr-auth", // localStorage 키
      // ──────────────────────────────────────
      // partialize: 저장할 상태 선택
      // - user, isAuthenticated만 localStorage에 저장
      // - isLoading, 모달 상태는 저장하지 않음
      // ──────────────────────────────────────
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
