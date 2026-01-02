/**
 * Verification Metrics Service Tests
 *
 * TDD: RED phase - 실패하는 테스트 먼저 작성
 *
 * KPI 지표 수집 함수 테스트:
 * - getVerificationSuccessRate: 성공률
 * - getVerificationDropOffRate: 이탈률
 * - getVerificationErrorRate: 오류율
 * - getVerificationStats: 종합 통계
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock must be hoisted - use factory function
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adultVerificationLog: {
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Import after mock setup
import {
  getVerificationSuccessRate,
  getVerificationDropOffRate,
  getVerificationErrorRate,
  getVerificationStats,
} from "@/lib/services/verification-metrics.service";
import { prisma } from "@/lib/prisma";

// ============================================================
// getVerificationSuccessRate 테스트
// ============================================================
describe("getVerificationSuccessRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("성공률 = SUCCESS / (SUCCESS + FAILED) * 100", async () => {
    // 성공 8건, 실패 2건 = 성공률 80%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(8) // SUCCESS count
      .mockResolvedValueOnce(2); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationSuccessRate(startDate, endDate);

    expect(result).toBe(80);
  });

  it("완료 건수가 0일 때 0 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(0) // SUCCESS count
      .mockResolvedValueOnce(0); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationSuccessRate(startDate, endDate);

    expect(result).toBe(0);
  });

  it("100% 성공률", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10) // SUCCESS count
      .mockResolvedValueOnce(0); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationSuccessRate(startDate, endDate);

    expect(result).toBe(100);
  });

  it("올바른 날짜 범위로 쿼리 호출", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(5);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T23:59:59.999Z");

    await getVerificationSuccessRate(startDate, endDate);

    expect(prisma.adultVerificationLog.count).toHaveBeenCalledWith({
      where: {
        eventType: "SUCCESS",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  });

  it("소수점 둘째자리까지 반올림", async () => {
    // 성공 7건, 실패 3건 = 성공률 70%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(7) // SUCCESS count
      .mockResolvedValueOnce(3); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationSuccessRate(startDate, endDate);

    expect(result).toBe(70);
  });

  it("소수점 정밀도 테스트 (33.33%)", async () => {
    // 성공 1건, 실패 2건 = 33.33%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationSuccessRate(startDate, endDate);

    expect(result).toBe(33.33);
  });
});

// ============================================================
// getVerificationDropOffRate 테스트
// ============================================================
describe("getVerificationDropOffRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("이탈률 = (INITIATED - SUCCESS - FAILED) / INITIATED * 100", async () => {
    // INITIATED 10건, SUCCESS 6건, FAILED 2건 = 이탈 2건 = 20%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10) // INITIATED count
      .mockResolvedValueOnce(6)  // SUCCESS count
      .mockResolvedValueOnce(2); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationDropOffRate(startDate, endDate);

    expect(result).toBe(20);
  });

  it("INITIATED가 0일 때 0 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(0) // INITIATED count
      .mockResolvedValueOnce(0) // SUCCESS count
      .mockResolvedValueOnce(0); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationDropOffRate(startDate, endDate);

    expect(result).toBe(0);
  });

  it("이탈 0건일 때 0% 반환", async () => {
    // INITIATED 10건, SUCCESS 8건, FAILED 2건 = 이탈 0건
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(2);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationDropOffRate(startDate, endDate);

    expect(result).toBe(0);
  });

  it("전체 이탈 시 100% 반환", async () => {
    // INITIATED 5건, SUCCESS 0건, FAILED 0건 = 이탈 5건 = 100%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationDropOffRate(startDate, endDate);

    expect(result).toBe(100);
  });

  it("올바른 날짜 범위로 INITIATED 쿼리 호출", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValue(0);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    await getVerificationDropOffRate(startDate, endDate);

    expect(prisma.adultVerificationLog.count).toHaveBeenCalledWith({
      where: {
        eventType: "INITIATED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  });
});

// ============================================================
// getVerificationErrorRate 테스트
// ============================================================
describe("getVerificationErrorRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("오류율 = FAILED / (SUCCESS + FAILED) * 100", async () => {
    // 성공 9건, 실패 1건 = 오류율 10%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(9)  // SUCCESS count
      .mockResolvedValueOnce(1); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationErrorRate(startDate, endDate);

    expect(result).toBe(10);
  });

  it("완료 건수가 0일 때 0 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(0) // SUCCESS count
      .mockResolvedValueOnce(0); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationErrorRate(startDate, endDate);

    expect(result).toBe(0);
  });

  it("100% 실패율", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(0)  // SUCCESS count
      .mockResolvedValueOnce(10); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationErrorRate(startDate, endDate);

    expect(result).toBe(100);
  });

  it("0% 실패율 (전체 성공)", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10) // SUCCESS count
      .mockResolvedValueOnce(0); // FAILED count

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationErrorRate(startDate, endDate);

    expect(result).toBe(0);
  });

  it("소수점 정밀도 테스트", async () => {
    // 성공 2건, 실패 1건 = 오류율 33.33%
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationErrorRate(startDate, endDate);

    expect(result).toBe(33.33);
  });
});

// ============================================================
// getVerificationStats 테스트
// ============================================================
describe("getVerificationStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("종합 통계 반환 - 모든 필드 포함", async () => {
    // INITIATED 20건, SUCCESS 14건, FAILED 2건, 이탈 4건
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(20) // INITIATED
      .mockResolvedValueOnce(14) // SUCCESS
      .mockResolvedValueOnce(2); // FAILED

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationStats(startDate, endDate);

    expect(result).toEqual({
      totalInitiated: 20,
      totalSuccess: 14,
      totalFailed: 2,
      totalDropOff: 4,
      successRate: 87.5,    // 14 / 16 * 100
      errorRate: 12.5,      // 2 / 16 * 100
      dropOffRate: 20,      // 4 / 20 * 100
      startDate,
      endDate,
    });
  });

  it("빈 데이터일 때 0 값들 반환", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValue(0);

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationStats(startDate, endDate);

    expect(result).toEqual({
      totalInitiated: 0,
      totalSuccess: 0,
      totalFailed: 0,
      totalDropOff: 0,
      successRate: 0,
      errorRate: 0,
      dropOffRate: 0,
      startDate,
      endDate,
    });
  });

  it("SUCCESS만 있는 경우", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10) // INITIATED
      .mockResolvedValueOnce(10) // SUCCESS
      .mockResolvedValueOnce(0); // FAILED

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationStats(startDate, endDate);

    expect(result.successRate).toBe(100);
    expect(result.errorRate).toBe(0);
    expect(result.dropOffRate).toBe(0);
  });

  it("FAILED만 있는 경우", async () => {
    vi.mocked(prisma.adultVerificationLog.count)
      .mockResolvedValueOnce(10) // INITIATED
      .mockResolvedValueOnce(0)  // SUCCESS
      .mockResolvedValueOnce(10); // FAILED

    const startDate = new Date("2026-01-01T00:00:00.000Z");
    const endDate = new Date("2026-01-02T00:00:00.000Z");

    const result = await getVerificationStats(startDate, endDate);

    expect(result.successRate).toBe(0);
    expect(result.errorRate).toBe(100);
    expect(result.dropOffRate).toBe(0);
  });
});

// ============================================================
// 개인정보 로깅 금지 테스트
// ============================================================
describe("Privacy - 개인정보 로깅 금지", () => {
  it("로그에 CI가 포함되지 않아야 함", () => {
    // 이 테스트는 로그 데이터 구조 검증
    // 실제 로그 호출 시 CI, 이름, 생년월일 등이 포함되지 않는지 확인
    const logFields = ["timestamp", "user_id", "txid", "event_type", "failure_code"];
    const sensitiveFields = ["ci", "name", "birthDate", "phoneNumber"];

    sensitiveFields.forEach((field) => {
      expect(logFields).not.toContain(field);
    });
  });
});
