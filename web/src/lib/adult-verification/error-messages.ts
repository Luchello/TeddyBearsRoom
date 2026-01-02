/**
 * Adult Verification Error Messages
 * PortOne 에러 코드를 사용자 친화적 한글 메시지로 변환
 */

import { ERROR_MESSAGES } from "@/constants/adult-verification";

/**
 * PortOne 에러 코드 및 내부 에러 코드를 사용자 친화적 메시지로 변환
 * @param code 에러 코드 (PortOne 또는 내부 정의)
 * @returns 한글 에러 메시지
 */
export function getErrorMessage(code: string): string {
  // 상수 파일에 정의된 메시지 확인
  if (code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code];
  }

  // PortOne SDK 특수 에러 코드 처리
  switch (code) {
    // 사용자 취소
    case "USER_CANCEL":
    case "IDENTITY_VERIFICATION_CANCELLED":
      return "본인인증이 취소되었습니다.";

    // 이미 완료된 인증
    case "IDENTITY_VERIFICATION_ALREADY_VERIFIED":
      return "이미 완료된 본인인증입니다.";

    // PG사 오류
    case "PG_PROVIDER":
    case "PG_PROVIDER_ERROR":
      return "인증 서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    // 타임아웃
    case "TIMEOUT":
    case "IDENTITY_VERIFICATION_TIMEOUT":
      return "인증 시간이 초과되었습니다. 다시 시도해주세요.";

    // 네트워크 오류
    case "NETWORK_ERROR":
      return "네트워크 연결을 확인해주세요.";

    // SDK 초기화 오류
    case "SDK_ERROR":
    case "SDK_INIT_ERROR":
      return "인증 서비스 초기화에 실패했습니다. 페이지를 새로고침해주세요.";

    // 잘못된 파라미터
    case "INVALID_PARAMS":
    case "INVALID_REQUEST":
      return "인증 요청 정보가 올바르지 않습니다.";

    // 채널 설정 오류
    case "CHANNEL_NOT_FOUND":
    case "INVALID_CHANNEL":
      return "인증 채널 설정에 문제가 있습니다. 관리자에게 문의해주세요.";

    // 미성년자
    case "UNDERAGE":
      return "만 19세 이상만 이용 가능합니다.";

    // 인증 실패
    case "VERIFICATION_FAILED":
    case "IDENTITY_VERIFICATION_FAILED":
      return "본인인증에 실패했습니다. 입력 정보를 확인 후 다시 시도해주세요.";

    // 서버 오류
    case "SERVER_ERROR":
    case "INTERNAL_SERVER_ERROR":
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    // 기본 메시지
    default:
      return "본인인증에 실패했습니다. 다시 시도해주세요.";
  }
}

/**
 * API 응답에서 에러 메시지 추출
 * @param response API 에러 응답
 * @returns 사용자 친화적 메시지
 */
export function getApiErrorMessage(response: {
  error?: { code?: string; message?: string };
}): string {
  if (response.error?.code) {
    return getErrorMessage(response.error.code);
  }
  if (response.error?.message) {
    return response.error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
}
