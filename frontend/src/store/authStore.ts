"use client";

// ====================================
// TeddyBear's Room - Auth Store
// Zustand store for authentication (Skeleton)
// Supabase integration will be added later
// ====================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthState } from "@/lib/types";

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  // Modal state
  isModalOpen: boolean;
  modalMode: "login" | "register";
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModal: () => void;
}

// Mock user for development (remove when Supabase is integrated)
const mockUser: User = {
  id: "mock-user-1",
  email: "test@example.com",
  name: "테스트 사용자",
  subscriptionTier: "none",
  points: 0,
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isModalOpen: false,
      modalMode: "login",

      // Auth Actions (Skeleton - will connect to Supabase)
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // TODO: Replace with Supabase auth
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock success (replace with actual auth)
        if (email && password) {
          set({
            user: { ...mockUser, email },
            isAuthenticated: true,
            isLoading: false,
            isModalOpen: false,
          });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        // TODO: Replace with Supabase auth
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock success (replace with actual auth)
        if (email && password && name) {
          set({
            user: { ...mockUser, email, name },
            isAuthenticated: true,
            isLoading: false,
            isModalOpen: false,
          });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        // TODO: Add Supabase signOut
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
