// 성인인증 관련 상수
export const ADULT_VERIFICATION = {
  // 만 19세 이상만 성인
  ADULT_AGE: 19,

  // 인증 유효기간 (일)
  EXPIRY_DAYS: 365,

  // v2.0: 등록 토큰 만료 시간 (분)
  REGISTRATION_TOKEN_EXPIRY_MINUTES: 15,

  // 에러 코드
  ERROR_CODES: {
    ADULT_VERIFICATION_REQUIRED: "ADULT_VERIFICATION_REQUIRED",
    ADULT_VERIFICATION_EXPIRED: "ADULT_VERIFICATION_EXPIRED",
    ALREADY_VERIFIED: "ALREADY_VERIFIED",
    UNDERAGE: "UNDERAGE",
    VERIFICATION_NOT_FOUND: "VERIFICATION_NOT_FOUND",
    NOT_VERIFIED: "NOT_VERIFIED",
    API_ERROR: "API_ERROR",
    DUPLICATE_CALLBACK: "DUPLICATE_CALLBACK",
    // v2.0 추가
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    REGISTRATION_FAILED: "REGISTRATION_FAILED",
    PROVIDER_NOT_CONFIGURED: "PROVIDER_NOT_CONFIGURED",
  },

  // 인증 방식
  METHOD: {
    PHONE: "PHONE",
  },

  // 인증 제공사 (PortOne 채널)
  PROVIDER: {
    KCP: "KCP",
    DANAL: "DANAL",
  },

  // 제공사별 전체 식별자 (로그/DB 저장용)
  PROVIDER_FULL: {
    PORTONE_KCP: "PORTONE_KCP",
    PORTONE_DANAL: "PORTONE_DANAL",
  },

  // 이벤트 타입
  EVENT_TYPE: {
    INITIATED: "INITIATED",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    // v2.0 추가
    UNDERAGE: "UNDERAGE",
  },
} as const;

// 제공사 타입
export type IdentityVerificationProvider = "KCP" | "DANAL";

/**
 * 현재 설정된 본인인증 제공사 가져오기
 * 환경변수 IDENTITY_VERIFICATION_PROVIDER에서 읽음
 * 기본값: KCP (성인용품 쇼핑몰 권장)
 */
export function getConfiguredProvider(): IdentityVerificationProvider {
  const provider = process.env.IDENTITY_VERIFICATION_PROVIDER;
  if (provider === "DANAL") return "DANAL";
  return "KCP"; // 기본값
}

/**
 * 제공사별 PortOne 채널키 가져오기
 * @param provider - 제공사 (KCP | DANAL)
 * @returns 채널키 또는 undefined
 */
export function getChannelKey(provider: IdentityVerificationProvider): string | undefined {
  switch (provider) {
    case "KCP":
      return process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_KCP;
    case "DANAL":
      return process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_DANAL;
    default:
      return undefined;
  }
}

/**
 * 제공사 전체 식별자 가져오기 (DB 저장용)
 * @param provider - 제공사 (KCP | DANAL)
 * @returns PORTONE_KCP 또는 PORTONE_DANAL
 */
export function getProviderFullName(provider: IdentityVerificationProvider): string {
  return provider === "KCP"
    ? ADULT_VERIFICATION.PROVIDER_FULL.PORTONE_KCP
    : ADULT_VERIFICATION.PROVIDER_FULL.PORTONE_DANAL;
}

// 에러 메시지 매핑
export const ERROR_MESSAGES: Record<string, string> = {
  ADULT_VERIFICATION_REQUIRED: "성인인증이 필요합니다.",
  ADULT_VERIFICATION_EXPIRED: "성인인증이 만료되었습니다. 재인증이 필요합니다.",
  ALREADY_VERIFIED: "이미 성인인증이 완료되었습니다.",
  UNDERAGE: "만 19세 이상만 이용 가능합니다.",
  VERIFICATION_NOT_FOUND: "본인인증 정보를 조회할 수 없습니다.",
  NOT_VERIFIED: "본인인증이 완료되지 않았습니다.",
  API_ERROR: "인증 서비스에 일시적인 오류가 발생했습니다.",
  DUPLICATE_CALLBACK: "이미 처리된 인증 요청입니다.",
  IDENTITY_VERIFICATION_ALREADY_VERIFIED: "이미 완료된 본인인증입니다.",
  PG_PROVIDER: "인증 서비스에 일시적인 오류가 발생했습니다.",
  // v2.0 추가
  TOKEN_EXPIRED: "등록 토큰이 만료되었습니다. 다시 시도해 주세요.",
  REGISTRATION_FAILED: "회원가입에 실패했습니다. 다시 시도해 주세요.",
};
