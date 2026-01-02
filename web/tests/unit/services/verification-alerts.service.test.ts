/**
 * Verification Alerts Service Tests
 *
 * TDD: RED phase - 실패하는 테스트 먼저 작성
 *
 * 알림 임계치 모니터링 테스트:
 * - 성공률 80% 미만: WARNING
 * - 오류율 10% 초과: CRITICAL
 * - 5분간 콜백 실패 10건 이상: ALERT
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// vi.mock must be hoisted - use factory function
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adultVerificationLog: {
      count: vi.fn(),
    },
  },
}));

// Mock the metrics service
vi.mock("@/lib/services/verification-metrics.service", () => ({
  getVerificationSuccessRate: vi.fn(),
  getVerificationErrorRate: vi.fn(),
}));

// Import after mock setup
import {
  checkAlertThresholds,
  AlertLevel,
  Alert,
  ALERT_THRESHOLDS,
} from "@/lib/services/verification-alerts.service";
import { prisma } from "@/lib/prisma";
import {
  getVerificationSuccessRate,
  getVerificationErrorRate,
} from "@/lib/services/verification-metrics.service";

// ============================================================
// 상수 테스트
// ============================================================
describe("ALERT_THRESHOLDS", () => {
  it("성공률 임계치가 80%로 설정", () => {
    expect(ALERT_THRESHOLDS.SUCCESS_RATE_MIN).toBe(80);
  });

  it("오류율 임계치가 10%로 설정", () => {
    expect(ALERT_THRESHOLDS.ERROR_RATE_MAX).toBe(10);
  });

  it("콜백 실패 임계치가 5분간 10건으로 설정", () => {
    expect(ALERT_THRESHOLDS.CALLBACK_FAILURE_COUNT).toBe(10);
    expect(ALERT_THRESHOLDS.CALLBACK_FAILURE_MINUTES).toBe(5);
  });
});

// ============================================================
// checkAlertThresholds 테스트
// ============================================================
describe("checkAlertThresholds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("모든 지표가 정상일 때 빈 배열 반환", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85); // 80% 이상
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);    // 10% 이하
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5); // 10건 미만

    const alerts = await checkAlertThresholds();

    expect(alerts).toEqual([]);
  });

  it("성공률 80% 미만: WARNING 알림 생성", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(75); // 80% 미만
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    const alerts = await checkAlertThresholds();

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      level: "WARNING",
      type: "LOW_SUCCESS_RATE",
      message: expect.stringContaining("75%"),
    });
  });

  it("성공률 정확히 80%: 알림 없음", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(80); // 정확히 80%
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    const alerts = await checkAlertThresholds();

    expect(alerts.filter(a => a.type === "LOW_SUCCESS_RATE")).toHaveLength(0);
  });

  it("오류율 10% 초과: CRITICAL 알림 생성", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(15); // 10% 초과
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    const alerts = await checkAlertThresholds();

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      level: "CRITICAL",
      type: "HIGH_ERROR_RATE",
      message: expect.stringContaining("15%"),
    });
  });

  it("오류율 정확히 10%: 알림 없음", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(10); // 정확히 10%
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    const alerts = await checkAlertThresholds();

    expect(alerts.filter(a => a.type === "HIGH_ERROR_RATE")).toHaveLength(0);
  });

  it("5분간 콜백 실패 10건 이상: ALERT 알림 생성", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(10); // 10건

    const alerts = await checkAlertThresholds();

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toMatchObject({
      level: "ALERT",
      type: "CALLBACK_FAILURES_SPIKE",
      message: expect.stringContaining("10건"),
    });
  });

  it("5분간 콜백 실패 9건: 알림 없음", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(9); // 9건

    const alerts = await checkAlertThresholds();

    expect(alerts.filter(a => a.type === "CALLBACK_FAILURES_SPIKE")).toHaveLength(0);
  });

  it("여러 알림이 동시에 발생할 수 있음", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(70); // WARNING
    vi.mocked(getVerificationErrorRate).mockResolvedValue(15);   // CRITICAL
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(15); // ALERT

    const alerts = await checkAlertThresholds();

    expect(alerts).toHaveLength(3);

    const levels = alerts.map(a => a.level);
    expect(levels).toContain("WARNING");
    expect(levels).toContain("CRITICAL");
    expect(levels).toContain("ALERT");
  });

  it("알림에 timestamp 포함", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(70); // WARNING
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    const alerts = await checkAlertThresholds();

    expect(alerts[0].timestamp).toBeInstanceOf(Date);
    expect(alerts[0].timestamp.toISOString()).toBe("2026-01-02T12:00:00.000Z");
  });

  it("콜백 실패 쿼리는 최근 5분 데이터만 조회", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(85);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    await checkAlertThresholds();

    // 5분 전 시간
    const fiveMinutesAgo = new Date("2026-01-02T11:55:00.000Z");

    expect(prisma.adultVerificationLog.count).toHaveBeenCalledWith({
      where: {
        eventType: "FAILED",
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });
  });

  it("CRITICAL 알림은 가장 높은 우선순위", async () => {
    vi.mocked(getVerificationSuccessRate).mockResolvedValue(70);
    vi.mocked(getVerificationErrorRate).mockResolvedValue(15);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(15);

    const alerts = await checkAlertThresholds();

    // CRITICAL이 가장 먼저 오도록 정렬
    expect(alerts[0].level).toBe("CRITICAL");
  });
});

// ============================================================
// Alert 타입 테스트
// ============================================================
describe("Alert 타입", () => {
  it("AlertLevel은 WARNING, ALERT, CRITICAL 포함", () => {
    const levels: AlertLevel[] = ["WARNING", "ALERT", "CRITICAL"];
    expect(levels).toHaveLength(3);
  });

  it("Alert 객체는 필수 필드 포함", () => {
    const alert: Alert = {
      level: "WARNING",
      type: "LOW_SUCCESS_RATE",
      message: "성공률이 75%로 80% 미만입니다.",
      timestamp: new Date(),
      value: 75,
    };

    expect(alert.level).toBeDefined();
    expect(alert.type).toBeDefined();
    expect(alert.message).toBeDefined();
    expect(alert.timestamp).toBeDefined();
    expect(alert.value).toBeDefined();
  });
});

// ============================================================
// 에러 처리 테스트
// ============================================================
describe("에러 처리", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("DB 에러 발생 시 에러를 전파", async () => {
    vi.mocked(getVerificationSuccessRate).mockRejectedValue(new Error("DB Error"));
    vi.mocked(getVerificationErrorRate).mockResolvedValue(5);
    vi.mocked(prisma.adultVerificationLog.count).mockResolvedValue(5);

    await expect(checkAlertThresholds()).rejects.toThrow("DB Error");
  });
});
