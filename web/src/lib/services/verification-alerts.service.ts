/**
 * Verification Alerts Service
 *
 * 성인인증 알림 임계치 모니터링
 * - 성공률 80% 미만: WARNING
 * - 오류율 10% 초과: CRITICAL
 * - 5분간 콜백 실패 10건 이상: ALERT
 */

import { prisma } from "@/lib/prisma";
import {
  getVerificationSuccessRate,
  getVerificationErrorRate,
} from "@/lib/services/verification-metrics.service";

// ============================================================
// CONSTANTS
// ============================================================
export const ALERT_THRESHOLDS = {
  /** 성공률 최소 임계치 (%) */
  SUCCESS_RATE_MIN: 80,

  /** 오류율 최대 임계치 (%) */
  ERROR_RATE_MAX: 10,

  /** 콜백 실패 임계 건수 */
  CALLBACK_FAILURE_COUNT: 10,

  /** 콜백 실패 모니터링 시간 (분) */
  CALLBACK_FAILURE_MINUTES: 5,
} as const;

// ============================================================
// TYPE DEFINITIONS
// ============================================================
export type AlertLevel = "WARNING" | "ALERT" | "CRITICAL";

export type AlertType =
  | "LOW_SUCCESS_RATE"
  | "HIGH_ERROR_RATE"
  | "CALLBACK_FAILURES_SPIKE";

export interface Alert {
  level: AlertLevel;
  type: AlertType;
  message: string;
  timestamp: Date;
  value: number;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * 알림 레벨 우선순위 반환 (CRITICAL > ALERT > WARNING)
 */
function getAlertPriority(level: AlertLevel): number {
  switch (level) {
    case "CRITICAL":
      return 3;
    case "ALERT":
      return 2;
    case "WARNING":
      return 1;
    default:
      return 0;
  }
}

/**
 * 알림 배열을 우선순위 순으로 정렬
 */
function sortAlertsByPriority(alerts: Alert[]): Alert[] {
  return [...alerts].sort(
    (a, b) => getAlertPriority(b.level) - getAlertPriority(a.level)
  );
}

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * 알림 임계치 확인
 *
 * 다음 조건에서 알림 생성:
 * - 성공률 80% 미만: WARNING
 * - 오류율 10% 초과: CRITICAL
 * - 5분간 콜백 실패 10건 이상: ALERT
 *
 * @returns 발생한 알림 배열 (CRITICAL 우선순위 순)
 *
 * @example
 * const alerts = await checkAlertThresholds();
 * if (alerts.length > 0) {
 *   // 알림 처리
 * }
 */
export async function checkAlertThresholds(): Promise<Alert[]> {
  const now = new Date();
  const alerts: Alert[] = [];

  // 최근 1시간 기준으로 성공률/오류율 계산
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // 병렬로 지표 조회
  const [successRate, errorRate, recentFailures] = await Promise.all([
    getVerificationSuccessRate(oneHourAgo, now),
    getVerificationErrorRate(oneHourAgo, now),
    getRecentCallbackFailures(now),
  ]);

  // 성공률 임계치 확인
  if (successRate < ALERT_THRESHOLDS.SUCCESS_RATE_MIN) {
    alerts.push({
      level: "WARNING",
      type: "LOW_SUCCESS_RATE",
      message: `성인인증 성공률이 ${successRate}%로 ${ALERT_THRESHOLDS.SUCCESS_RATE_MIN}% 미만입니다.`,
      timestamp: now,
      value: successRate,
    });
  }

  // 오류율 임계치 확인
  if (errorRate > ALERT_THRESHOLDS.ERROR_RATE_MAX) {
    alerts.push({
      level: "CRITICAL",
      type: "HIGH_ERROR_RATE",
      message: `성인인증 오류율이 ${errorRate}%로 ${ALERT_THRESHOLDS.ERROR_RATE_MAX}%를 초과했습니다.`,
      timestamp: now,
      value: errorRate,
    });
  }

  // 콜백 실패 급증 확인
  if (recentFailures >= ALERT_THRESHOLDS.CALLBACK_FAILURE_COUNT) {
    alerts.push({
      level: "ALERT",
      type: "CALLBACK_FAILURES_SPIKE",
      message: `최근 ${ALERT_THRESHOLDS.CALLBACK_FAILURE_MINUTES}분간 콜백 실패가 ${recentFailures}건 발생했습니다.`,
      timestamp: now,
      value: recentFailures,
    });
  }

  // CRITICAL 우선순위 순으로 정렬
  return sortAlertsByPriority(alerts);
}

/**
 * 최근 N분간 콜백 실패 건수 조회
 */
async function getRecentCallbackFailures(now: Date): Promise<number> {
  const minutesAgo = new Date(
    now.getTime() - ALERT_THRESHOLDS.CALLBACK_FAILURE_MINUTES * 60 * 1000
  );

  return prisma.adultVerificationLog.count({
    where: {
      eventType: "FAILED",
      createdAt: {
        gte: minutesAgo,
      },
    },
  });
}
