// PortOne 본인인증 관련 타입
export type VerificationStatus = "PENDING" | "VERIFIED" | "EXPIRED" | "FAILED";
export type VerificationEventType = "INITIATED" | "SUCCESS" | "FAILED" | "UNDERAGE";
export type VerificationTrigger = "A" | "B"; // A: 회원가입 직후, B: 성인구역 진입 시

export interface VerificationResult {
  success: boolean;
  status: VerificationStatus;
  message?: string;
}

export interface InitiateResponse {
  success: true;
  data: {
    identityVerificationId: string;
    storeId: string;
    channelKey: string;
  };
}

export interface InitiateErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface VerifyRequest {
  identityVerificationId: string;
}

export interface VerifyResponse {
  success: true;
  data: {
    verified: boolean;
    verifiedAt: string;
  };
}

// PortOne API 응답 타입
export interface PortOneVerifiedCustomer {
  ci: string;
  di: string | null;
  name: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  phoneNumber?: string;
  operator?: string;
  isForeigner?: boolean;
}

export interface PortOneVerificationResponse {
  id: string;
  status: "READY" | "VERIFIED" | "FAILED";
  verifiedCustomer?: PortOneVerifiedCustomer;
  customData?: string;
  requestedAt?: string;
  verifiedAt?: string;
}

// ============================================================
// v2.0 Registration Flow Types
// ============================================================

/**
 * 등록 토큰에 저장되는 데이터
 * 회원가입 시작 시 암호화되어 저장됨
 */
export interface RegistrationData {
  email: string;
  password: string;
  createdAt: number;
}

/**
 * 회원가입 시작 API 요청
 */
export interface RegisterInitiateRequest {
  email: string;
  password: string;
}

/**
 * 회원가입 시작 API 응답
 */
export interface RegisterInitiateResponse {
  success: true;
  data: {
    identityVerificationId: string;
    storeId: string;
    channelKey: string;
    registrationToken: string;
  };
}

/**
 * 회원가입 완료 API 요청
 */
export interface RegisterCompleteRequest {
  registrationToken: string;
  identityVerificationId: string;
}

/**
 * 회원가입 완료 API 응답
 */
export interface RegisterCompleteResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
    };
    session: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// ============================================================
// Failsafe 관련 타입
// ============================================================

/**
 * Failsafe 모드
 * - NORMAL: 정상 운영
 * - OUTAGE: 제공사 장애 (fail-secure: 성인상품 접근 차단)
 * - DISABLED: 기능 비활성화 (점검 중)
 *
 * 주의: BYPASS 모드는 의도적으로 존재하지 않음 (fail-secure 원칙)
 */
export type FailsafeMode = "NORMAL" | "OUTAGE" | "DISABLED";

/**
 * 헬스체크 결과
 */
export interface HealthCheckResult {
  healthy: boolean;
  latencyMs: number;
  checkedAt: Date;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * 장애 안내 공지
 */
export interface OutageNotice {
  title: string;
  message: string;
  estimatedRecoveryTime?: Date;
}

/**
 * 재시도 가능 여부
 */
export interface RetryAvailability {
  canRetry: boolean;
  waitTimeSeconds: number;
  nextCheckAt?: Date;
  message: string;
}
