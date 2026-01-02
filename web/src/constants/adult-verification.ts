// 성인인증 관련 상수
export const ADULT_VERIFICATION = {
  // 만 19세 이상만 성인
  ADULT_AGE: 19,

  // 인증 유효기간 (일)
  EXPIRY_DAYS: 365,

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
  },

  // 인증 방식
  METHOD: {
    PHONE: "PHONE",
  },

  // 인증 제공사
  PROVIDER: {
    PORTONE_KCP: "PORTONE_KCP",
    PORTONE_DANAL: "PORTONE_DANAL",
  },

  // 이벤트 타입
  EVENT_TYPE: {
    INITIATED: "INITIATED",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
  },
} as const;

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
};
