/**
 * Adult Access Control Integration Tests
 * TeddyBear's Room - 성인인증 접근 제어 통합 테스트
 *
 * Task 10.2: 접근 제어 통합 테스트 작성
 * - 미인증 사용자 성인 콘텐츠 차단 확인
 * - 만료 사용자 재인증 요청 확인
 *
 * TDD: RED Phase - 실패하는 테스트 먼저 작성
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock must be hoisted - use factory function
vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    adultVerificationLog: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api/auth", () => ({
  requireAuth: vi.fn(),
  apiError: vi.fn((message, status, code) => ({
    status: () => status,
    json: () => Promise.resolve({ success: false, error: { code, message } }),
  })),
  apiSuccess: vi.fn((data) => ({
    status: () => 200,
    json: () => Promise.resolve({ success: true, data }),
  })),
}));

// Import after mock setup
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api/auth";
import { requireAdultVerification, optionalAdultVerification } from "@/lib/api/adult-auth";
import { isVerificationExpired } from "@/lib/services/adult-verification.service";
import { ADULT_VERIFICATION } from "@/constants/adult-verification";

// ============================================================
// 미인증 사용자 차단 테스트
// ============================================================
describe("Unauthenticated User Access Control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("미로그인 사용자 접근 시 인증 필요 에러 반환", async () => {
    // 미로그인 상태 시뮬레이션
    vi.mocked(requireAuth).mockResolvedValue({
      success: false,
      response: {
        status: () => 401,
        json: () => Promise.resolve({ success: false, error: { code: "UNAUTHORIZED" } }),
      },
    } as never);

    const result = await requireAdultVerification();

    expect(result.success).toBe(false);
    expect(requireAuth).toHaveBeenCalled();
  });

  it("로그인했지만 성인인증 미완료 사용자 차단", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 미완료 프로필
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: false,
      adultVerifiedAt: null,
    } as never);

    const result = await requireAdultVerification();

    expect(result.success).toBe(false);
  });

  it("성인인증 완료된 사용자 접근 허용", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 완료 프로필 (미만료)
    const verifiedAt = new Date("2025-06-01T00:00:00.000Z"); // 7개월 전
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await requireAdultVerification();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.userId).toBe("user-1");
      expect(result.isAdultVerified).toBe(true);
    }
  });
});

// ============================================================
// 만료 사용자 재인증 요청 테스트
// ============================================================
describe("Expired Verification Access Control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("365일 경과한 인증은 만료로 처리", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 366일 전에 인증 완료 (만료됨)
    const verifiedAt = new Date("2025-01-01T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await requireAdultVerification();

    expect(result.success).toBe(false);
  });

  it("364일 경과한 인증은 유효로 처리", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 364일 전에 인증 완료 (아직 유효)
    const verifiedAt = new Date("2025-01-03T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await requireAdultVerification();

    expect(result.success).toBe(true);
  });

  it("정확히 365일 경과한 인증은 만료로 처리", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 정확히 365일 전에 인증 완료
    const verifiedAt = new Date("2025-01-02T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    await requireAdultVerification();

    // isVerificationExpired 함수에서 365일 경과는 true (만료)
    expect(isVerificationExpired(verifiedAt)).toBe(true);
  });
});

// ============================================================
// 선택적 성인인증 테스트
// ============================================================
describe("Optional Adult Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("미로그인 사용자도 에러 없이 처리", async () => {
    // 미로그인 상태
    vi.mocked(requireAuth).mockResolvedValue({
      success: false,
      response: {} as never,
    } as never);

    const result = await optionalAdultVerification();

    expect(result.isAuthenticated).toBe(false);
    expect(result.isAdultVerified).toBe(false);
  });

  it("로그인했지만 미인증 사용자 상태 반환", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 미완료
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: false,
      adultVerifiedAt: null,
    } as never);

    const result = await optionalAdultVerification();

    expect(result.isAuthenticated).toBe(true);
    expect(result.isAdultVerified).toBe(false);
  });

  it("성인인증 완료 사용자 상태 반환", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 완료
    const verifiedAt = new Date("2025-06-01T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await optionalAdultVerification();

    expect(result.isAuthenticated).toBe(true);
    expect(result.isAdultVerified).toBe(true);
    expect(result.userId).toBe("user-1");
  });
});

// ============================================================
// 기능 플래그 기반 접근 제어 테스트
// ============================================================
describe("Feature Flag Based Access Control", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("ADULT_VERIFICATION_ENABLED=false 시 인증 체크 스킵", async () => {
    // 기능 비활성화
    process.env.ADULT_VERIFICATION_ENABLED = "false";

    // 모듈 재로드
    const { isAdultVerificationEnabled } = await import("@/lib/feature-flags");

    expect(isAdultVerificationEnabled()).toBe(false);
  });

  it("ADULT_VERIFICATION_ENABLED=true 시 인증 체크 실행", async () => {
    // 기능 활성화
    process.env.ADULT_VERIFICATION_ENABLED = "true";

    const { isAdultVerificationEnabled } = await import("@/lib/feature-flags");

    expect(isAdultVerificationEnabled()).toBe(true);
  });

  it("환경변수 미설정 시 기본값 활성화", async () => {
    // 환경변수 제거
    delete process.env.ADULT_VERIFICATION_ENABLED;

    const { isAdultVerificationEnabled } = await import("@/lib/feature-flags");

    // 기본값은 true (안전한 기본값)
    expect(isAdultVerificationEnabled()).toBe(true);
  });
});

// ============================================================
// 트리거 방식 테스트 (A/B)
// ============================================================
describe("Verification Trigger Mode", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("ADULT_VERIFICATION_TRIGGER=A 시 회원가입 직후 인증", async () => {
    process.env.ADULT_VERIFICATION_TRIGGER = "A";

    const { getAdultVerificationTrigger } = await import("@/lib/feature-flags");

    expect(getAdultVerificationTrigger()).toBe("A");
  });

  it("ADULT_VERIFICATION_TRIGGER=B 시 성인구역 진입 시 인증", async () => {
    process.env.ADULT_VERIFICATION_TRIGGER = "B";

    const { getAdultVerificationTrigger } = await import("@/lib/feature-flags");

    expect(getAdultVerificationTrigger()).toBe("B");
  });

  it("환경변수 미설정 시 기본값 B", async () => {
    delete process.env.ADULT_VERIFICATION_TRIGGER;

    const { getAdultVerificationTrigger } = await import("@/lib/feature-flags");

    expect(getAdultVerificationTrigger()).toBe("B");
  });
});

// ============================================================
// 에러 코드 및 메시지 테스트
// ============================================================
describe("Error Codes and Messages", () => {
  it("ADULT_VERIFICATION_REQUIRED 에러 코드 정의 확인", () => {
    expect(ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_REQUIRED).toBe(
      "ADULT_VERIFICATION_REQUIRED"
    );
  });

  it("ADULT_VERIFICATION_EXPIRED 에러 코드 정의 확인", () => {
    expect(ADULT_VERIFICATION.ERROR_CODES.ADULT_VERIFICATION_EXPIRED).toBe(
      "ADULT_VERIFICATION_EXPIRED"
    );
  });

  it("UNDERAGE 에러 코드 정의 확인", () => {
    expect(ADULT_VERIFICATION.ERROR_CODES.UNDERAGE).toBe("UNDERAGE");
  });

  it("모든 에러 코드에 대응하는 메시지 존재", async () => {
    const { ERROR_MESSAGES } = await import("@/constants/adult-verification");

    Object.values(ADULT_VERIFICATION.ERROR_CODES).forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe("string");
    });
  });
});

// ============================================================
// 프로필 없음 에러 처리 테스트
// ============================================================
describe("Profile Not Found Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("프로필이 없는 경우 에러 처리", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "non-existent-user" },
    } as never);

    // 프로필 없음
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);

    const result = await requireAdultVerification();

    expect(result.success).toBe(false);
  });
});

// ============================================================
// 동시 요청 처리 테스트
// ============================================================
describe("Concurrent Request Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("동시에 여러 요청이 와도 정확하게 처리", async () => {
    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 완료 프로필
    const verifiedAt = new Date("2025-06-01T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    // 동시에 5개 요청 실행
    const requests = Array(5)
      .fill(null)
      .map(() => requireAdultVerification());

    const results = await Promise.all(requests);

    // 모든 요청이 성공해야 함
    results.forEach((result) => {
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================
// 장애 대응 (Failsafe) 테스트
// ============================================================
describe("Failsafe Mode", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("기능 비활성화 시 인증된 것으로 처리 (fail-open)", async () => {
    // 기능 비활성화
    process.env.ADULT_VERIFICATION_ENABLED = "false";

    // 로그인 성공
    vi.mocked(requireAuth).mockResolvedValue({
      success: true,
      user: { id: "user-1" },
    } as never);

    // 성인인증 미완료 프로필 (기능 비활성화로 인해 체크 스킵)
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "user-1",
      isAdultVerified: false,
      adultVerifiedAt: null,
    } as never);

    const result = await requireAdultVerification();

    // 기능 비활성화 시 인증된 것으로 처리
    expect(result.success).toBe(true);
  });
});
