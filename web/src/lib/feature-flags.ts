// ====================================
// TeddyBear's Room - Feature Flags
// 기능 플래그 관리
// ====================================
//
// 환경 변수 기반으로 기능 활성화/비활성화를 관리합니다.
// 점진적 롤아웃, A/B 테스트, 장애 대응 등에 활용됩니다.
//
// 사용 예시:
//   if (isAdultVerificationEnabled()) {
//     // 성인인증 로직 실행
//   }
//
// ====================================

import type { VerificationTrigger } from "@/types/adult-verification";

// ============================================================
// ADULT VERIFICATION FLAGS
// 성인인증 관련 기능 플래그
// ============================================================

/**
 * 성인인증 기능 활성화 여부
 *
 * @description
 * 환경변수 ADULT_VERIFICATION_ENABLED로 제어
 * - "true": 활성화 (기본값)
 * - "false": 비활성화 (인증 체크 스킵)
 *
 * 장애 대응 시 비활성화하여 서비스 영향 최소화
 * (단, fail-secure 원칙에 따라 성인구역 접근도 차단됨)
 *
 * @returns {boolean} 성인인증 기능 활성화 여부
 */
export function isAdultVerificationEnabled(): boolean {
  const enabled = process.env.ADULT_VERIFICATION_ENABLED;

  // 환경변수가 명시적으로 "false"인 경우에만 비활성화
  // 미설정 또는 다른 값은 기본적으로 활성화
  if (enabled === "false") {
    return false;
  }

  return true;
}

/**
 * 성인인증 트리거 방식 조회
 *
 * @description
 * 환경변수 ADULT_VERIFICATION_TRIGGER로 제어
 * - "A": 회원가입 직후 인증 (온보딩 단계에서 강제 인증)
 * - "B": 성인 구역 진입 시 인증 (lazy 인증, 기본값)
 *
 * B 방식이 기본값인 이유:
 * - 사용자 경험 개선 (필요할 때만 인증)
 * - 가입 전환율 유지
 * - 인증 비용 절감
 *
 * @returns {VerificationTrigger} "A" 또는 "B"
 */
export function getAdultVerificationTrigger(): VerificationTrigger {
  const trigger = process.env.ADULT_VERIFICATION_TRIGGER;

  // "A"가 명시적으로 설정된 경우에만 A 방식
  if (trigger === "A") {
    return "A";
  }

  // 기본값: B (성인 구역 진입 시 인증)
  return "B";
}

// ============================================================
// FEATURE FLAG CONSTANTS
// 기능 플래그 통합 객체 (디버깅/로깅용)
// ============================================================

/**
 * 모든 기능 플래그 상태 조회 (동기)
 *
 * @description
 * 디버깅, 로깅, 관리자 페이지 등에서 사용
 * 동기 함수이므로 제공사 상태는 포함되지 않음
 *
 * @returns {object} 모든 기능 플래그 상태
 */
export function getAllFeatureFlags() {
  return {
    // Adult Verification
    ADULT_VERIFICATION_ENABLED: isAdultVerificationEnabled(),
    ADULT_VERIFICATION_TRIGGER: getAdultVerificationTrigger(),
  };
}

/**
 * 모든 기능 플래그 상태 조회 (비동기, 제공사 상태 포함)
 *
 * @description
 * 제공사 상태를 포함한 전체 기능 플래그 상태 조회
 *
 * @returns {Promise<object>} 모든 기능 플래그 상태 (제공사 상태 포함)
 */
export async function getAllFeatureFlagsAsync() {
  const baseFlags = getAllFeatureFlags();
  const providerHealthy = await isVerificationProviderHealthy();

  return {
    ...baseFlags,
    ADULT_VERIFICATION_PROVIDER_HEALTHY: providerHealthy,
  };
}

// ============================================================
// HELPER FUNCTIONS
// 기능 플래그 관련 유틸리티
// ============================================================

/**
 * 성인인증이 회원가입 직후 트리거인지 확인
 *
 * @returns {boolean} A 방식(회원가입 직후 인증)이면 true
 */
export function isAdultVerificationOnSignup(): boolean {
  return isAdultVerificationEnabled() && getAdultVerificationTrigger() === "A";
}

/**
 * 성인인증이 성인구역 진입 시 트리거인지 확인
 *
 * @returns {boolean} B 방식(성인구역 진입 시 인증)이면 true
 */
export function isAdultVerificationOnAccess(): boolean {
  return isAdultVerificationEnabled() && getAdultVerificationTrigger() === "B";
}

// ============================================================
// PROVIDER HEALTH CHECK
// 제공사 상태 확인 (장애 대응)
// ============================================================

/**
 * 성인인증 제공사 상태 확인
 *
 * @description
 * PortOne API 서버의 응답 가능 여부를 확인합니다.
 * 이 함수는 verification-failsafe.service의 checkProviderHealth를 래핑합니다.
 *
 * 사용 예시:
 *   const healthy = await isVerificationProviderHealthy();
 *   if (!healthy) {
 *     // 장애 대응 로직 실행
 *   }
 *
 * @returns {Promise<boolean>} 제공사가 정상이면 true, 장애면 false
 */
export async function isVerificationProviderHealthy(): Promise<boolean> {
  // 기능이 비활성화되어 있으면 false 반환
  if (!isAdultVerificationEnabled()) {
    return false;
  }

  try {
    // 동적 import로 순환 참조 방지
    const { checkProviderHealth } = await import(
      "@/lib/services/verification-failsafe.service"
    );
    const result = await checkProviderHealth();
    return result.healthy;
  } catch {
    // import 실패 시 장애로 간주
    return false;
  }
}
