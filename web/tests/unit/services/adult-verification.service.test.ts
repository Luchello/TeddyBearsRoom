/**
 * Adult Verification Service Tests
 *
 * TDD: GREEN phase - 테스트 통과 확인
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock must be hoisted - use factory function
vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    adultVerificationLog: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Import after mock setup
import {
  isAdult,
  isVerificationExpired,
  hashCi,
  getVerificationStatus,
  completeVerification,
  createVerificationLog,
  isDuplicateCallback,
} from "@/lib/services/adult-verification.service";
import { prisma } from "@/lib/prisma";

// ============================================================
// isAdult 테스트
// ============================================================
describe("isAdult", () => {
  // 현재 날짜를 고정하여 테스트 일관성 확보
  beforeEach(() => {
    vi.useFakeTimers();
    // 2026-01-02로 날짜 고정
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("만 19세 이상이면 true 반환", () => {
    // 2007-01-02 생일 -> 2026-01-02에 만 19세
    const birthDate = "2007-01-02";
    expect(isAdult(birthDate)).toBe(true);
  });

  it("만 19세 미만이면 false 반환", () => {
    // 2008-01-02 생일 -> 2026-01-02에 만 18세
    const birthDate = "2008-01-02";
    expect(isAdult(birthDate)).toBe(false);
  });

  it("생일 당일에 만 19세가 되면 true 반환", () => {
    // 2007-01-02 생일 -> 2026-01-02(오늘)에 만 19세 됨
    const birthDate = "2007-01-02";
    expect(isAdult(birthDate)).toBe(true);
  });

  it("생일 전날에는 만 18세로 false 반환", () => {
    // 2007-01-03 생일 -> 2026-01-02(오늘)에 아직 만 18세
    const birthDate = "2007-01-03";
    expect(isAdult(birthDate)).toBe(false);
  });

  it("생일이 지난 경우 (월이 다름) true 반환", () => {
    // 2006-12-01 생일 -> 2026-01-02에 만 19세 이상
    const birthDate = "2006-12-01";
    expect(isAdult(birthDate)).toBe(true);
  });

  it("생일이 아직 안 온 경우 (월이 다름) 나이 계산 정확성", () => {
    // 2007-02-01 생일 -> 2026-01-02에 아직 만 18세
    const birthDate = "2007-02-01";
    expect(isAdult(birthDate)).toBe(false);
  });

  it("만 20세 이상이면 true 반환", () => {
    const birthDate = "2000-01-01";
    expect(isAdult(birthDate)).toBe(true);
  });
});

// ============================================================
// isVerificationExpired 테스트
// ============================================================
describe("isVerificationExpired", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("null이면 true 반환 (미인증)", () => {
    expect(isVerificationExpired(null)).toBe(true);
  });

  it("365일 이내면 false 반환", () => {
    // 2025-01-03에 인증 -> 2026-01-02에 364일 경과
    const verifiedAt = new Date("2025-01-03T00:00:00.000Z");
    expect(isVerificationExpired(verifiedAt)).toBe(false);
  });

  it("365일 경과하면 true 반환", () => {
    // 2025-01-01에 인증 -> 2026-01-02에 366일 경과
    const verifiedAt = new Date("2025-01-01T00:00:00.000Z");
    expect(isVerificationExpired(verifiedAt)).toBe(true);
  });

  it("정확히 365일이면 true 반환 (만료 시점)", () => {
    // 2025-01-02에 인증 -> 2026-01-02에 정확히 365일 경과
    const verifiedAt = new Date("2025-01-02T00:00:00.000Z");
    expect(isVerificationExpired(verifiedAt)).toBe(true);
  });

  it("인증 직후면 false 반환", () => {
    const verifiedAt = new Date("2026-01-01T00:00:00.000Z");
    expect(isVerificationExpired(verifiedAt)).toBe(false);
  });

  it("인증 당일이면 false 반환", () => {
    const verifiedAt = new Date("2026-01-02T00:00:00.000Z");
    expect(isVerificationExpired(verifiedAt)).toBe(false);
  });
});

// ============================================================
// hashCi 테스트
// ============================================================
describe("hashCi", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("CI를 SHA-256으로 해시 처리", () => {
    process.env.ADULT_VERIFICATION_CI_SALT = "test-salt-12345";
    const ci = "test-ci-value";
    const hash = hashCi(ci);

    // SHA-256 해시는 64자리 hex 문자열
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("동일한 CI는 동일한 해시 반환", () => {
    process.env.ADULT_VERIFICATION_CI_SALT = "test-salt-12345";
    const ci = "same-ci-value";

    const hash1 = hashCi(ci);
    const hash2 = hashCi(ci);

    expect(hash1).toBe(hash2);
  });

  it("다른 CI는 다른 해시 반환", () => {
    process.env.ADULT_VERIFICATION_CI_SALT = "test-salt-12345";

    const hash1 = hashCi("ci-value-1");
    const hash2 = hashCi("ci-value-2");

    expect(hash1).not.toBe(hash2);
  });

  it("salt가 없으면 에러 throw", () => {
    delete process.env.ADULT_VERIFICATION_CI_SALT;

    expect(() => hashCi("test-ci")).toThrow();
  });

  it("다른 salt는 다른 해시 반환", () => {
    const ci = "same-ci-value";

    process.env.ADULT_VERIFICATION_CI_SALT = "salt-1";
    const hash1 = hashCi(ci);

    process.env.ADULT_VERIFICATION_CI_SALT = "salt-2";
    const hash2 = hashCi(ci);

    expect(hash1).not.toBe(hash2);
  });
});

// ============================================================
// getVerificationStatus 테스트
// ============================================================
describe("getVerificationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("PENDING: isAdultVerified=false인 경우", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "profile-1",
      isAdultVerified: false,
      adultVerifiedAt: null,
    } as never);

    const result = await getVerificationStatus("profile-1");

    expect(result.status).toBe("PENDING");
    expect(result.verifiedAt).toBeNull();
  });

  it("VERIFIED: isAdultVerified=true이고 미만료인 경우", async () => {
    const verifiedAt = new Date("2025-06-01T00:00:00.000Z");
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "profile-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await getVerificationStatus("profile-1");

    expect(result.status).toBe("VERIFIED");
    expect(result.verifiedAt).toEqual(verifiedAt);
  });

  it("EXPIRED: isAdultVerified=true이지만 365일 경과", async () => {
    const verifiedAt = new Date("2025-01-01T00:00:00.000Z"); // 366일 경과
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({
      id: "profile-1",
      isAdultVerified: true,
      adultVerifiedAt: verifiedAt,
    } as never);

    const result = await getVerificationStatus("profile-1");

    expect(result.status).toBe("EXPIRED");
    expect(result.verifiedAt).toEqual(verifiedAt);
  });

  it("프로필이 없으면 에러 throw", async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);

    await expect(getVerificationStatus("non-existent-profile")).rejects.toThrow();
  });
});

// ============================================================
// completeVerification 테스트
// ============================================================
describe("completeVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Profile 업데이트 - 모든 필드가 올바르게 설정됨", async () => {
    const params = {
      profileId: "profile-1",
      txid: "txid-12345",
      method: "PHONE",
      provider: "PORTONE_KCP",
      ciHash: "hashed-ci-value",
    };

    vi.mocked(prisma.profile.update).mockResolvedValue({
      id: "profile-1",
      isAdultVerified: true,
      adultVerifiedAt: new Date(),
      adultVerifyMethod: "PHONE",
      adultVerifyProvider: "PORTONE_KCP",
      adultVerifyTxid: "txid-12345",
      ciHash: "hashed-ci-value",
    } as never);

    await completeVerification(params);

    expect(prisma.profile.update).toHaveBeenCalledWith({
      where: { id: "profile-1" },
      data: expect.objectContaining({
        isAdultVerified: true,
        adultVerifiedAt: expect.any(Date),
        adultVerifyMethod: "PHONE",
        adultVerifyProvider: "PORTONE_KCP",
        adultVerifyTxid: "txid-12345",
        ciHash: "hashed-ci-value",
      }),
    });
  });

  it("adultVerifiedAt이 현재 시간으로 설정됨", async () => {
    const params = {
      profileId: "profile-1",
      txid: "txid-12345",
      method: "PHONE",
      provider: "PORTONE_KCP",
      ciHash: "hashed-ci-value",
    };

    vi.mocked(prisma.profile.update).mockResolvedValue({} as never);

    await completeVerification(params);

    const updateCall = vi.mocked(prisma.profile.update).mock.calls[0][0];
    const adultVerifiedAt = updateCall.data.adultVerifiedAt as Date;

    expect(adultVerifiedAt.toISOString()).toBe("2026-01-02T12:00:00.000Z");
  });
});

// ============================================================
// createVerificationLog 테스트
// ============================================================
describe("createVerificationLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("INITIATED 이벤트 로그 생성", async () => {
    vi.mocked(prisma.adultVerificationLog.create).mockResolvedValue({
      id: "log-1",
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "INITIATED",
      failureCode: null,
      createdAt: new Date(),
    } as never);

    await createVerificationLog({
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "INITIATED",
    });

    expect(prisma.adultVerificationLog.create).toHaveBeenCalledWith({
      data: {
        profileId: "profile-1",
        txid: "txid-12345",
        eventType: "INITIATED",
        failureCode: undefined,
      },
    });
  });

  it("SUCCESS 이벤트 로그 생성", async () => {
    vi.mocked(prisma.adultVerificationLog.create).mockResolvedValue({} as never);

    await createVerificationLog({
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "SUCCESS",
    });

    expect(prisma.adultVerificationLog.create).toHaveBeenCalledWith({
      data: {
        profileId: "profile-1",
        txid: "txid-12345",
        eventType: "SUCCESS",
        failureCode: undefined,
      },
    });
  });

  it("FAILED 이벤트 로그 생성 - failureCode 포함", async () => {
    vi.mocked(prisma.adultVerificationLog.create).mockResolvedValue({} as never);

    await createVerificationLog({
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "FAILED",
      failureCode: "UNDERAGE",
    });

    expect(prisma.adultVerificationLog.create).toHaveBeenCalledWith({
      data: {
        profileId: "profile-1",
        txid: "txid-12345",
        eventType: "FAILED",
        failureCode: "UNDERAGE",
      },
    });
  });

  it("API_ERROR failureCode 로그 생성", async () => {
    vi.mocked(prisma.adultVerificationLog.create).mockResolvedValue({} as never);

    await createVerificationLog({
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "FAILED",
      failureCode: "API_ERROR",
    });

    expect(prisma.adultVerificationLog.create).toHaveBeenCalledWith({
      data: {
        profileId: "profile-1",
        txid: "txid-12345",
        eventType: "FAILED",
        failureCode: "API_ERROR",
      },
    });
  });
});

// ============================================================
// isDuplicateCallback 테스트
// ============================================================
describe("isDuplicateCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("동일 txid로 SUCCESS 로그가 있으면 true 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.findFirst).mockResolvedValue({
      id: "log-1",
      profileId: "profile-1",
      txid: "txid-12345",
      eventType: "SUCCESS",
      failureCode: null,
      createdAt: new Date(),
    } as never);

    const result = await isDuplicateCallback("txid-12345");

    expect(result).toBe(true);
    expect(prisma.adultVerificationLog.findFirst).toHaveBeenCalledWith({
      where: {
        txid: "txid-12345",
        eventType: "SUCCESS",
      },
    });
  });

  it("동일 txid로 SUCCESS 로그가 없으면 false 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.findFirst).mockResolvedValue(null);

    const result = await isDuplicateCallback("txid-12345");

    expect(result).toBe(false);
  });

  it("다른 txid로 SUCCESS 로그가 있어도 false 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.findFirst).mockResolvedValue(null);

    const result = await isDuplicateCallback("txid-different");

    expect(result).toBe(false);
    expect(prisma.adultVerificationLog.findFirst).toHaveBeenCalledWith({
      where: {
        txid: "txid-different",
        eventType: "SUCCESS",
      },
    });
  });

  it("동일 txid로 FAILED 로그만 있으면 false 반환", async () => {
    // FAILED 로그만 있는 경우 - findFirst with SUCCESS 조건이 null 반환
    vi.mocked(prisma.adultVerificationLog.findFirst).mockResolvedValue(null);

    const result = await isDuplicateCallback("txid-failed-only");

    expect(result).toBe(false);
  });

  it("동일 txid로 INITIATED 로그만 있으면 false 반환", async () => {
    // INITIATED 로그만 있는 경우 - findFirst with SUCCESS 조건이 null 반환
    vi.mocked(prisma.adultVerificationLog.findFirst).mockResolvedValue(null);

    const result = await isDuplicateCallback("txid-initiated-only");

    expect(result).toBe(false);
  });
});
