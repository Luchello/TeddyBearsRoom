/**
 * Verification Failsafe Service
 *
 * 성인인증 시스템 장애 대응 로직
 * - 제공사(PortOne) 헬스체크
 * - Fail-secure 모드 관리 (장애 시 접근 차단 유지)
 * - 자동 복구 확인
 * - 재시도 가능 안내
 *
 * 핵심 원칙: fail-secure (장애 시 성인상품 접근 차단 유지)
 * - fail-open 절대 금지 (법적 문제 발생)
 */

import { isAdultVerificationEnabled } from "@/lib/feature-flags";
import { logger } from "@/lib/logger";
import type {
  FailsafeMode,
  HealthCheckResult,
  OutageNotice,
  RetryAvailability,
} from "@/types/adult-verification";

// Re-export types for convenience
export type { FailsafeMode, HealthCheckResult, RetryAvailability };

// ============================================================
// CONSTANTS
// ============================================================

const PORTONE_API_BASE_URL = "https://api.portone.io";

// 헬스체크 타임아웃 (5초)
const HEALTH_CHECK_TIMEOUT_MS = 5000;

// 장애 시 기본 재시도 대기 시간 (5분)
const DEFAULT_RETRY_WAIT_SECONDS = 300;

// 예상 복구 시간 (장애 발생 후 30분)
const ESTIMATED_RECOVERY_MINUTES = 30;

// ============================================================
// ERROR CODES
// ============================================================

const ERROR_CODES = {
  PROVIDER_SERVICE_UNAVAILABLE: "PROVIDER_SERVICE_UNAVAILABLE",
  PROVIDER_TIMEOUT: "PROVIDER_TIMEOUT",
  NETWORK_ERROR: "NETWORK_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
} as const;

// ============================================================
// HEALTH CHECK
// ============================================================

/**
 * PortOne API 헬스체크
 *
 * @description
 * PortOne API 서버의 응답 가능 여부를 확인합니다.
 * 실제 인증 요청이 아닌 가벼운 체크입니다.
 *
 * @returns 헬스체크 결과 (healthy, latencyMs, errorCode 등)
 */
export async function checkProviderHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const checkedAt = new Date();

  // API Secret 설정 확인
  const apiSecret = process.env.PORTONE_API_SECRET;
  if (!apiSecret) {
    logger.error("[Failsafe]", "PORTONE_API_SECRET not configured");
    return {
      healthy: false,
      latencyMs: Date.now() - startTime,
      checkedAt,
      errorCode: ERROR_CODES.CONFIG_ERROR,
      errorMessage: "API configuration error",
    };
  }

  try {
    // PortOne API에 간단한 요청으로 응답 가능 여부 확인
    // 실제로는 /identity-verifications 엔드포인트의 존재 확인
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      HEALTH_CHECK_TIMEOUT_MS
    );

    const response = await fetch(`${PORTONE_API_BASE_URL}/`, {
      method: "GET",
      headers: {
        Authorization: `PortOne ${apiSecret}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;

    if (response.ok || response.status === 401 || response.status === 404) {
      // 200, 401, 404는 서버가 응답한다는 의미 (정상)
      // 401은 인증 필요, 404는 엔드포인트 없음 - 둘 다 서버는 살아있음
      logger.debug("[Failsafe]", `Health check OK (${latencyMs}ms)`);
      return {
        healthy: true,
        latencyMs,
        checkedAt,
      };
    }

    // 5xx 에러는 서버 장애
    if (response.status >= 500) {
      logger.warn(
        "[Failsafe]",
        `Provider unavailable: ${response.status} (${latencyMs}ms)`
      );
      return {
        healthy: false,
        latencyMs,
        checkedAt,
        errorCode: ERROR_CODES.PROVIDER_SERVICE_UNAVAILABLE,
        errorMessage: `HTTP ${response.status}`,
      };
    }

    // 그 외 상태는 일단 정상으로 처리
    return {
      healthy: true,
      latencyMs,
      checkedAt,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // 타임아웃 에러
    if (error instanceof Error && error.name === "AbortError") {
      logger.warn("[Failsafe]", `Health check timeout (${latencyMs}ms)`);
      return {
        healthy: false,
        latencyMs,
        checkedAt,
        errorCode: ERROR_CODES.PROVIDER_TIMEOUT,
        errorMessage: "Request timeout",
      };
    }

    // 네트워크 에러
    logger.error("[Failsafe]", "Health check network error:", error);
    return {
      healthy: false,
      latencyMs,
      checkedAt,
      errorCode: ERROR_CODES.NETWORK_ERROR,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================
// FAILSAFE MODE
// ============================================================

/**
 * 현재 Failsafe 모드 조회
 *
 * @description
 * 시스템 상태에 따른 운영 모드를 반환합니다.
 * - NORMAL: 정상 운영
 * - OUTAGE: 제공사 장애 (fail-secure)
 * - DISABLED: 기능 비활성화
 *
 * BYPASS 모드는 의도적으로 존재하지 않습니다.
 * 장애 시에도 성인상품 접근을 허용해서는 안 됩니다.
 *
 * @returns 현재 Failsafe 모드
 */
export async function getFailsafeMode(): Promise<FailsafeMode> {
  // 1. 기능 비활성화 확인
  if (!isAdultVerificationEnabled()) {
    return "DISABLED";
  }

  // 2. 제공사 헬스체크
  const health = await checkProviderHealth();

  if (!health.healthy) {
    // fail-secure: 장애 시 OUTAGE 모드 (접근 차단 유지)
    // 절대 BYPASS로 전환하지 않음
    return "OUTAGE";
  }

  return "NORMAL";
}

// ============================================================
// OUTAGE NOTICE
// ============================================================

/**
 * 장애 안내 공지 조회
 *
 * @description
 * 현재 상태에 따른 사용자 안내 메시지를 반환합니다.
 * NORMAL 모드에서는 null을 반환합니다.
 *
 * @returns 장애 안내 공지 또는 null
 */
export async function getOutageNotice(): Promise<OutageNotice | null> {
  const mode = await getFailsafeMode();

  if (mode === "NORMAL") {
    return null;
  }

  if (mode === "DISABLED") {
    return {
      title: "성인인증 점검 중",
      message:
        "현재 성인인증 시스템 점검 중입니다. 점검이 완료될 때까지 성인용품 구매가 제한됩니다.",
      estimatedRecoveryTime: getEstimatedRecoveryTime(),
    };
  }

  // OUTAGE 모드
  return {
    title: "성인인증 서비스 일시 중단",
    message:
      "성인인증 서비스에 일시적인 장애가 발생했습니다. 불편을 드려 죄송합니다. 잠시 후 다시 시도해 주세요.",
    estimatedRecoveryTime: getEstimatedRecoveryTime(),
  };
}

/**
 * 예상 복구 시간 계산
 */
function getEstimatedRecoveryTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + ESTIMATED_RECOVERY_MINUTES);
  return now;
}

// ============================================================
// SERVICE RECOVERY
// ============================================================

/**
 * 서비스 복구 여부 확인
 *
 * @param options.retryCount - 재시도 횟수 (기본 1)
 * @returns 복구되었으면 true
 */
export async function isServiceRecovered(
  options: { retryCount?: number } = {}
): Promise<boolean> {
  const { retryCount = 1 } = options;

  for (let i = 0; i < retryCount; i++) {
    const health = await checkProviderHealth();

    if (health.healthy) {
      logger.info("[Failsafe]", `Service recovered (attempt ${i + 1})`);
      return true;
    }

    // 마지막 시도가 아니면 잠시 대기
    if (i < retryCount - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return false;
}

// ============================================================
// RETRY AVAILABILITY
// ============================================================

/**
 * 재시도 가능 여부 및 대기 시간 안내
 *
 * @description
 * 사용자에게 언제 다시 시도할 수 있는지 안내합니다.
 *
 * @returns 재시도 가능 여부 및 안내 메시지
 */
export async function getRetryAvailability(): Promise<RetryAvailability> {
  const health = await checkProviderHealth();

  if (health.healthy) {
    return {
      canRetry: true,
      waitTimeSeconds: 0,
      message: "지금 바로 성인인증을 진행할 수 있습니다.",
    };
  }

  // 장애 상태: 재시도 대기 필요
  const nextCheckAt = new Date();
  nextCheckAt.setSeconds(nextCheckAt.getSeconds() + DEFAULT_RETRY_WAIT_SECONDS);

  const waitMinutes = Math.ceil(DEFAULT_RETRY_WAIT_SECONDS / 60);

  return {
    canRetry: false,
    waitTimeSeconds: DEFAULT_RETRY_WAIT_SECONDS,
    nextCheckAt,
    message: `현재 서비스 점검 중입니다. 약 ${waitMinutes}분 후에 다시 시도해 주세요.`,
  };
}
