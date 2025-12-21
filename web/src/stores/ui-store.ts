/**
 * UI Store - Zustand
 * Global UI State Management for TeddyBear's Room
 */

import { create } from "zustand";
import type { Toast, ToastType } from "@/types";
import { generateId } from "@/lib/utils";

// Toast duration in milliseconds
const DEFAULT_TOAST_DURATION = 5000;

interface UIState {
  // Mobile Navigation
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Modal Management
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Loading States
  globalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;

  // Toast Notifications
  toasts: Toast[];
  addToast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Scroll
  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Mobile Navigation
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  isSearchOpen: false,
  searchQuery: "",
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modal Management
  activeModal: null,
  modalData: null,
  openModal: (modalId, data = {}) =>
    set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Loading States
  globalLoading: false,
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),

  // Toast Notifications
  toasts: [],
  addToast: (type, title, description, duration = DEFAULT_TOAST_DURATION) => {
    const id = generateId();
    const toast: Toast = { id, type, title, description, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),

  // Theme
  theme: "system",
  setTheme: (theme) => set({ theme }),

  // Scroll
  isScrolled: false,
  setIsScrolled: (isScrolled) => set({ isScrolled }),
}));

// Convenience hooks
export const useToast = () => {
  const { addToast, removeToast, clearToasts, toasts } = useUIStore();

  return {
    toasts,
    toast: {
      success: (title: string, description?: string) =>
        addToast("success", title, description),
      error: (title: string, description?: string) =>
        addToast("error", title, description),
      warning: (title: string, description?: string) =>
        addToast("warning", title, description),
      info: (title: string, description?: string) =>
        addToast("info", title, description),
    },
    dismiss: removeToast,
    dismissAll: clearToasts,
  };
};

export const useMobileMenu = () =>
  useUIStore((state) => ({
    isOpen: state.isMobileMenuOpen,
    setOpen: state.setMobileMenuOpen,
    toggle: state.toggleMobileMenu,
  }));

export const useSearch = () =>
  useUIStore((state) => ({
    isOpen: state.isSearchOpen,
    query: state.searchQuery,
    setOpen: state.setSearchOpen,
    setQuery: state.setSearchQuery,
  }));

export const useModal = () =>
  useUIStore((state) => ({
    activeModal: state.activeModal,
    modalData: state.modalData,
    open: state.openModal,
    close: state.closeModal,
    isOpen: (modalId: string) => state.activeModal === modalId,
  }));
