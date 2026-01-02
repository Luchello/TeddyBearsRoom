/**
 * Admin Auth Helper Tests
 *
 * TDD: RED phase - 실패하는 테스트 작성
 *
 * 관리자 권한 제어 테스트
 * - Role enum: GUEST, USER, ADMIN, SUPER_ADMIN
 * - requireAdminRole(minRole): 최소 권한 검증
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock NextResponse before imports
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      _data: data,
    })),
  },
}));

// Mock Supabase client - use factory function to avoid hoisting issues
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock Prisma - use factory function to avoid hoisting issues
vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Import after mocks
import { Role, requireAdminRole } from "@/lib/api/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Helper to setup mocks
const mockGetUser = vi.fn();
const setupSupabaseMock = () => {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: mockGetUser,
    },
  } as never);
};

describe("Admin Auth Helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSupabaseMock();
  });

  // ============================================================
  // Role enum 테스트
  // ============================================================
  describe("Role enum", () => {
    it("GUEST 역할이 정의되어 있어야 함", () => {
      expect(Role.GUEST).toBeDefined();
    });

    it("USER 역할이 정의되어 있어야 함", () => {
      expect(Role.USER).toBeDefined();
    });

    it("ADMIN 역할이 정의되어 있어야 함", () => {
      expect(Role.ADMIN).toBeDefined();
    });

    it("SUPER_ADMIN 역할이 정의되어 있어야 함", () => {
      expect(Role.SUPER_ADMIN).toBeDefined();
    });

    it("역할 순서: GUEST < USER < ADMIN < SUPER_ADMIN", () => {
      expect(Role.GUEST).toBeLessThan(Role.USER);
      expect(Role.USER).toBeLessThan(Role.ADMIN);
      expect(Role.ADMIN).toBeLessThan(Role.SUPER_ADMIN);
    });
  });

  // ============================================================
  // requireAdminRole 테스트
  // ============================================================
  describe("requireAdminRole", () => {
    describe("미인증 사용자", () => {
      it("로그인하지 않은 사용자는 401 반환", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: null },
          error: null,
        });

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(401);
          const data = result.response._data as { code: string };
          expect(data.code).toBe("UNAUTHORIZED");
        }
      });
    });

    describe("ADMIN 권한 요구", () => {
      it("ADMIN 역할 사용자는 접근 가능", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-123", email: "admin@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-123",
          email: "admin@example.com",
          role: "ADMIN",
        } as never);

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.user.id).toBe("user-123");
          expect(result.role).toBe(Role.ADMIN);
        }
      });

      it("SUPER_ADMIN 역할 사용자는 접근 가능", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-456", email: "super@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-456",
          email: "super@example.com",
          role: "SUPER_ADMIN",
        } as never);

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.role).toBe(Role.SUPER_ADMIN);
        }
      });

      it("USER 역할 사용자는 403 반환", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-789", email: "user@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-789",
          email: "user@example.com",
          role: "USER",
        } as never);

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(403);
          const data = result.response._data as { code: string };
          expect(data.code).toBe("FORBIDDEN");
        }
      });

      it("GUEST 역할 사용자는 403 반환", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-000", email: "guest@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-000",
          email: "guest@example.com",
          role: "GUEST",
        } as never);

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(403);
        }
      });
    });

    describe("SUPER_ADMIN 권한 요구", () => {
      it("SUPER_ADMIN 역할만 접근 가능", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-456", email: "super@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-456",
          email: "super@example.com",
          role: "SUPER_ADMIN",
        } as never);

        const result = await requireAdminRole(Role.SUPER_ADMIN);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.role).toBe(Role.SUPER_ADMIN);
        }
      });

      it("ADMIN 역할은 403 반환", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-123", email: "admin@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-123",
          email: "admin@example.com",
          role: "ADMIN",
        } as never);

        const result = await requireAdminRole(Role.SUPER_ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(403);
          const data = result.response._data as { code: string };
          expect(data.code).toBe("FORBIDDEN");
        }
      });
    });

    describe("USER 권한 요구", () => {
      it("모든 로그인 사용자 접근 가능 (USER 이상)", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-789", email: "user@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue({
          id: "user-789",
          email: "user@example.com",
          role: "USER",
        } as never);

        const result = await requireAdminRole(Role.USER);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.role).toBe(Role.USER);
        }
      });
    });

    describe("프로필 없음", () => {
      it("프로필이 없는 사용자는 GUEST로 처리", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-new", email: "new@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);

        const result = await requireAdminRole(Role.USER);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(403);
        }
      });
    });

    describe("에러 처리", () => {
      it("Supabase 에러 시 500 반환", async () => {
        mockGetUser.mockRejectedValue(new Error("Connection failed"));

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(500);
          const data = result.response._data as { code: string };
          expect(data.code).toBe("AUTH_ERROR");
        }
      });

      it("Prisma 에러 시 500 반환", async () => {
        mockGetUser.mockResolvedValue({
          data: { user: { id: "user-123", email: "admin@example.com" } },
          error: null,
        });
        vi.mocked(prisma.profile.findUnique).mockRejectedValue(
          new Error("DB Error")
        );

        const result = await requireAdminRole(Role.ADMIN);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.response.status).toBe(500);
        }
      });
    });
  });
});
