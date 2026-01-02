/**
 * PortOne Identity Verification API Helper
 *
 * PortOne 본인인증 API 호출 헬퍼
 */

import type { PortOneVerificationResponse } from "@/types/adult-verification";
import { logger } from "@/lib/logger";

const PORTONE_API_BASE_URL = "https://api.portone.io";

/**
 * PortOne 본인인증 결과 조회
 *
 * @param identityVerificationId - 본인인증 거래 ID
 * @returns PortOne 본인인증 응답
 * @throws API 호출 실패 시 에러
 */
export async function getIdentityVerification(
  identityVerificationId: string
): Promise<PortOneVerificationResponse> {
  const apiSecret = process.env.PORTONE_API_SECRET;

  if (!apiSecret) {
    throw new Error("PORTONE_API_SECRET environment variable is not set");
  }

  const url = `${PORTONE_API_BASE_URL}/identity-verifications/${encodeURIComponent(identityVerificationId)}`;

  logger.info("[PortOne]", `Fetching identity verification: ${identityVerificationId}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `PortOne ${apiSecret}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("[PortOne]", `API error: ${response.status}`, errorBody);
    throw new Error(`PortOne API error: ${response.status}`);
  }

  const data = await response.json();
  logger.info("[PortOne]", `Verification status: ${data.status}`);

  return data as PortOneVerificationResponse;
}
