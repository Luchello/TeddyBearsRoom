/**
 * Verification Metrics Service
 *
 * 성인인증 KPI 지표 수집 함수
 * - 성공률, 이탈률, 오류율, 종합 통계
 *
 * PRIVACY: 개인정보 (CI, 이름, 생년월일 등)는 로그에 포함하지 않음
 * 로그 필드: timestamp, user_id, txid, event_type, failure_code
 */

import { prisma } from "@/lib/prisma";

// ============================================================
// TYPE DEFINITIONS
// ============================================================
export interface VerificationStats {
  totalInitiated: number;
  totalSuccess: number;
  totalFailed: number;
  totalDropOff: number;
  successRate: number;
  errorRate: number;
  dropOffRate: number;
  startDate: Date;
  endDate: Date;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * 소수점 둘째자리까지 반올림
 */
function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * 비율 계산 (분모가 0일 때 0 반환)
 */
function calculateRate(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }
  return roundToTwoDecimals((numerator / denominator) * 100);
}

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * 성공률 = SUCCESS / (SUCCESS + FAILED) * 100
 *
 * @param startDate - 조회 시작일
 * @param endDate - 조회 종료일
 * @returns 성공률 (0-100, 소수점 둘째자리)
 *
 * @example
 * // 성공 8건, 실패 2건 = 80%
 * await getVerificationSuccessRate(startDate, endDate) // 80
 */
export async function getVerificationSuccessRate(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const [successCount, failedCount] = await Promise.all([
    prisma.adultVerificationLog.count({
      where: {
        eventType: "SUCCESS",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "FAILED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const total = successCount + failedCount;
  return calculateRate(successCount, total);
}

/**
 * 이탈률 = (INITIATED - SUCCESS - FAILED) / INITIATED * 100
 *
 * 인증을 시작했지만 완료하지 않은 비율
 *
 * @param startDate - 조회 시작일
 * @param endDate - 조회 종료일
 * @returns 이탈률 (0-100, 소수점 둘째자리)
 *
 * @example
 * // INITIATED 10건, SUCCESS 6건, FAILED 2건 = 이탈 2건 = 20%
 * await getVerificationDropOffRate(startDate, endDate) // 20
 */
export async function getVerificationDropOffRate(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const [initiatedCount, successCount, failedCount] = await Promise.all([
    prisma.adultVerificationLog.count({
      where: {
        eventType: "INITIATED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "SUCCESS",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "FAILED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  if (initiatedCount === 0) {
    return 0;
  }

  const completed = successCount + failedCount;
  const dropOff = initiatedCount - completed;

  // 이탈 수가 음수가 되는 경우 (완료가 시작보다 많음) 0으로 처리
  if (dropOff < 0) {
    return 0;
  }

  return calculateRate(dropOff, initiatedCount);
}

/**
 * 오류율 = FAILED / (SUCCESS + FAILED) * 100
 *
 * @param startDate - 조회 시작일
 * @param endDate - 조회 종료일
 * @returns 오류율 (0-100, 소수점 둘째자리)
 *
 * @example
 * // 성공 9건, 실패 1건 = 오류율 10%
 * await getVerificationErrorRate(startDate, endDate) // 10
 */
export async function getVerificationErrorRate(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const [successCount, failedCount] = await Promise.all([
    prisma.adultVerificationLog.count({
      where: {
        eventType: "SUCCESS",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "FAILED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const total = successCount + failedCount;
  return calculateRate(failedCount, total);
}

/**
 * 종합 통계 반환
 *
 * @param startDate - 조회 시작일
 * @param endDate - 조회 종료일
 * @returns 모든 KPI 지표를 포함한 통계 객체
 *
 * @example
 * const stats = await getVerificationStats(startDate, endDate);
 * // {
 * //   totalInitiated: 20,
 * //   totalSuccess: 14,
 * //   totalFailed: 2,
 * //   totalDropOff: 4,
 * //   successRate: 87.5,
 * //   errorRate: 12.5,
 * //   dropOffRate: 20,
 * //   startDate,
 * //   endDate
 * // }
 */
export async function getVerificationStats(
  startDate: Date,
  endDate: Date
): Promise<VerificationStats> {
  const [initiatedCount, successCount, failedCount] = await Promise.all([
    prisma.adultVerificationLog.count({
      where: {
        eventType: "INITIATED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "SUCCESS",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.adultVerificationLog.count({
      where: {
        eventType: "FAILED",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  const completed = successCount + failedCount;
  const dropOff = Math.max(0, initiatedCount - completed);

  return {
    totalInitiated: initiatedCount,
    totalSuccess: successCount,
    totalFailed: failedCount,
    totalDropOff: dropOff,
    successRate: calculateRate(successCount, completed),
    errorRate: calculateRate(failedCount, completed),
    dropOffRate: calculateRate(dropOff, initiatedCount),
    startDate,
    endDate,
  };
}
