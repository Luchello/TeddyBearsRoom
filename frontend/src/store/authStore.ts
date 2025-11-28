"use client";

// ====================================
// TeddyBear's Room - Auth Store
// Zustand store with Supabase Auth integration
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthState } from "@/lib/types";

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshSession: () => Promise<void>;
  // Modal state
  isModalOpen: boolean;
  modalMode: "login" | "register";
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModal: () => void;
}

// Helper to convert Supabase user to our User type
function mapSupabaseUser(supabaseUser: { id: string; email?: string; user_metadata?: { name?: string; avatar_url?: string } } | null): User | null {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
    avatar: supabaseUser.user_metadata?.avatar_url,
    subscriptionTier: "none", // Will be fetched from profile
    points: 0, // Will be fetched from profile
    createdAt: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isModalOpen: false,
      modalMode: "login",

      // Auth Actions with Supabase
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

          const user = mapSupabaseUser(data.user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isModalOpen: false,
          });

          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: "로그인 중 오류가 발생했습니다." };
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          // Check if email confirmation is required
          if (data.user && !data.session) {
            set({ isLoading: false });
            return { success: true, error: "이메일을 확인하여 가입을 완료해주세요." };
          }

          const user = mapSupabaseUser(data.user);

          set({
            user,
            isAuthenticated: !!data.session,
            isLoading: false,
            isModalOpen: false,
          });

          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, error: "회원가입 중 오류가 발생했습니다." };
        }
      },

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (err) {
          console.error("Logout error:", err);
        }

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

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
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (err) {
          console.error("Session refresh error:", err);
        }
      },

      // Modal Actions
      openLoginModal: () => set({ isModalOpen: true, modalMode: "login" }),
      openRegisterModal: () => set({ isModalOpen: true, modalMode: "register" }),
      closeModal: () => set({ isModalOpen: false }),
    }),
    {
      name: "tbr-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
