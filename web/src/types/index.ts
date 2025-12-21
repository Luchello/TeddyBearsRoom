/**
 * TeddyBear's Room - Type Exports
 */

// Product Types
export * from "./product";

// Cart Types
export * from "./cart";

// User Types
export * from "./user";

// Order Types
export * from "./order";

// Referral Types
export * from "./referral";

// Common Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Form States
export interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// UI States
export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Modal Types
export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
}

// Search Types
export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  pagination?: PaginationParams;
}

// Date Range
export interface DateRange {
  from: Date;
  to: Date;
}

// Price Range
export interface PriceRange {
  min: number;
  max: number;
}
