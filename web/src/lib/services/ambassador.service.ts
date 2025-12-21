/**
 * Ambassador Service
 *
 * TBR 앰버서더 시스템 비즈니스 로직
 * - 앰버서더 상태 관리
 * - 자격 부여 및 확인
 * - 혜택 관리 (신제품 미리보기, 월 1회 무료 배송)
 */

import { prisma } from "@/lib/prisma";
import { AMBASSADOR_CONFIG } from "@/constants/referral";
import type { AmbassadorStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface AmbassadorBenefits {
  [key: string]: boolean | number | string | undefined;
  newProductEarlyAccess: boolean;
  monthlyFreeShipping: number;
}

interface FreeShippingResult {
  available: boolean;
  nextAvailableAt: Date | null;
}

interface UseFreeShippingResult {
  success: boolean;
  error?: string;
}

// ============================================================
// AMBASSADOR STATUS MANAGEMENT
// ============================================================

/**
 * 앰버서더 상태 생성 또는 조회
 * - 프로필 ID에 해당하는 앰버서더 상태가 없으면 CANDIDATE로 생성
 */
export async function getOrCreateAmbassadorStatus(
  profileId: string
): Promise<AmbassadorStatus> {
  // 기존 상태 조회
  const existing = await prisma.ambassadorStatus.findUnique({
    where: { profileId },
  });

  if (existing) {
    return existing;
  }

  // 프로필의 현재 추천 수 조회
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { totalReferrals: true },
  });

  if (!profile) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  // 새 앰버서더 상태 생성
  const newStatus = await prisma.ambassadorStatus.create({
    data: {
      profileId,
      totalReferrals: profile.totalReferrals,
      status: "CANDIDATE",
      benefits: {
        newProductEarlyAccess: false,
        monthlyFreeShipping: 0,
      },
    },
  });

  return newStatus;
}

// ============================================================
// AMBASSADOR QUALIFICATION
// ============================================================

/**
 * 앰버서더 자격 업데이트
 * - 프로필의 totalReferrals를 체크하여 자격 부여
 * - 10명 이상 추천 성공 시 ACTIVE로 전환
 *
 * @returns boolean - 새로 앰버서더 자격을 획득했는지 여부
 */
export async function updateAmbassadorQualification(
  profileId: string
): Promise<boolean> {
  // 프로필 정보 조회
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { totalReferrals: true },
  });

  if (!profile) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  // 앰버서더 상태 조회 또는 생성
  const ambassadorStatus = await getOrCreateAmbassadorStatus(profileId);

  // 이미 ACTIVE인 경우 업데이트만
  if (ambassadorStatus.status === "ACTIVE") {
    // 추천 수만 동기화
    if (ambassadorStatus.totalReferrals !== profile.totalReferrals) {
      await prisma.ambassadorStatus.update({
        where: { profileId },
        data: { totalReferrals: profile.totalReferrals },
      });
    }
    return false;
  }

  // 자격 조건 충족 확인
  const meetsRequirement = profile.totalReferrals >= AMBASSADOR_CONFIG.requiredReferrals;

  if (!meetsRequirement) {
    // 추천 수 동기화만 수행
    await prisma.ambassadorStatus.update({
      where: { profileId },
      data: { totalReferrals: profile.totalReferrals },
    });
    return false;
  }

  // 앰버서더 자격 부여
  await prisma.ambassadorStatus.update({
    where: { profileId },
    data: {
      status: "ACTIVE",
      qualifiedAt: new Date(),
      totalReferrals: profile.totalReferrals,
    },
  });

  // 혜택 자동 부여
  await grantAmbassadorBenefits(profileId);

  logger.info("[AmbassadorService]", `Ambassador qualification granted to profile: ${profileId}`);
  return true;
}

// ============================================================
// AMBASSADOR BENEFITS
// ============================================================

/**
 * 앰버서더 혜택 부여
 * - 신제품 미리보기 자격
 * - 월 1회 무료 배송
 */
export async function grantAmbassadorBenefits(profileId: string): Promise<void> {
  const ambassadorStatus = await prisma.ambassadorStatus.findUnique({
    where: { profileId },
  });

  if (!ambassadorStatus || ambassadorStatus.status !== "ACTIVE") {
    logger.debug("[AmbassadorService]", `Profile ${profileId} is not an active ambassador`);
    return;
  }

  const benefits: AmbassadorBenefits = {
    newProductEarlyAccess: AMBASSADOR_CONFIG.benefits.newProductEarlyAccess,
    monthlyFreeShipping: AMBASSADOR_CONFIG.benefits.monthlyFreeShipping,
  };

  // 다음 달 1일로 무료 배송 가능일 설정 (첫 부여 시)
  let nextFreeShippingAt: Date | null = ambassadorStatus.nextFreeShippingAt;
  if (!nextFreeShippingAt) {
    // 현재 날짜부터 바로 사용 가능
    nextFreeShippingAt = null;
  }

  await prisma.ambassadorStatus.update({
    where: { profileId },
    data: {
      benefits,
      nextFreeShippingAt,
    },
  });

  logger.info("[AmbassadorService]", `Ambassador benefits granted to profile: ${profileId}`);
}

// ============================================================
// FREE SHIPPING MANAGEMENT
// ============================================================

/**
 * 무료 배송 사용 가능 여부 체크
 * - ACTIVE 앰버서더인지 확인
 * - nextFreeShippingAt 날짜 확인
 */
export async function checkFreeShippingAvailable(
  profileId: string
): Promise<FreeShippingResult> {
  const ambassadorStatus = await prisma.ambassadorStatus.findUnique({
    where: { profileId },
  });

  // 앰버서더 상태가 없거나 ACTIVE가 아닌 경우
  if (!ambassadorStatus || ambassadorStatus.status !== "ACTIVE") {
    return {
      available: false,
      nextAvailableAt: null,
    };
  }

  // benefits 확인
  const benefits = ambassadorStatus.benefits as AmbassadorBenefits | null;
  if (!benefits || benefits.monthlyFreeShipping < 1) {
    return {
      available: false,
      nextAvailableAt: null,
    };
  }

  const now = new Date();
  const nextAvailableAt = ambassadorStatus.nextFreeShippingAt;

  // nextFreeShippingAt이 null이거나 현재 시간보다 이전이면 사용 가능
  if (!nextAvailableAt || nextAvailableAt <= now) {
    return {
      available: true,
      nextAvailableAt: null,
    };
  }

  // 아직 사용 불가
  return {
    available: false,
    nextAvailableAt,
  };
}

/**
 * 무료 배송 사용
 * - 사용 가능 여부 확인 후 사용 처리
 * - 다음 달 1일로 nextFreeShippingAt 업데이트
 */
export async function useFreeShipping(
  profileId: string
): Promise<UseFreeShippingResult> {
  // 사용 가능 여부 확인
  const availability = await checkFreeShippingAvailable(profileId);

  if (!availability.available) {
    if (availability.nextAvailableAt) {
      const nextDate = availability.nextAvailableAt.toLocaleDateString("ko-KR");
      return {
        success: false,
        error: `무료 배송은 ${nextDate}부터 다시 사용할 수 있습니다`,
      };
    }
    return {
      success: false,
      error: "무료 배송 혜택을 사용할 수 없습니다",
    };
  }

  // 다음 달 1일 계산
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  nextMonth.setHours(0, 0, 0, 0);

  // nextFreeShippingAt 업데이트
  await prisma.ambassadorStatus.update({
    where: { profileId },
    data: { nextFreeShippingAt: nextMonth },
  });

  logger.info("[AmbassadorService]", `Free shipping used by profile: ${profileId}, next available: ${nextMonth.toISOString()}`);

  return { success: true };
}

// ============================================================
// NEW PRODUCT EARLY ACCESS
// ============================================================

/**
 * 신제품 미리보기 자격 체크
 * - ACTIVE 앰버서더이고 benefits에 newProductEarlyAccess가 true인지 확인
 */
export async function hasNewProductEarlyAccess(
  profileId: string
): Promise<boolean> {
  const ambassadorStatus = await prisma.ambassadorStatus.findUnique({
    where: { profileId },
  });

  // 앰버서더 상태가 없거나 ACTIVE가 아닌 경우
  if (!ambassadorStatus || ambassadorStatus.status !== "ACTIVE") {
    return false;
  }

  // benefits 확인
  const benefits = ambassadorStatus.benefits as AmbassadorBenefits | null;
  if (!benefits) {
    return false;
  }

  return benefits.newProductEarlyAccess === true;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * 앰버서더 상태 전체 조회 (대시보드용)
 */
export async function getAmbassadorDashboard(profileId: string) {
  const ambassadorStatus = await getOrCreateAmbassadorStatus(profileId);
  const freeShipping = await checkFreeShippingAvailable(profileId);
  const earlyAccess = await hasNewProductEarlyAccess(profileId);

  const remaining = Math.max(
    0,
    AMBASSADOR_CONFIG.requiredReferrals - ambassadorStatus.totalReferrals
  );

  return {
    status: ambassadorStatus.status,
    isActive: ambassadorStatus.status === "ACTIVE",
    totalReferrals: ambassadorStatus.totalReferrals,
    requiredReferrals: AMBASSADOR_CONFIG.requiredReferrals,
    remaining,
    qualifiedAt: ambassadorStatus.qualifiedAt,
    badge: ambassadorStatus.status === "ACTIVE" ? AMBASSADOR_CONFIG.badge : null,
    benefits: {
      freeShipping: {
        available: freeShipping.available,
        nextAvailableAt: freeShipping.nextAvailableAt,
        monthlyLimit: AMBASSADOR_CONFIG.benefits.monthlyFreeShipping,
      },
      newProductEarlyAccess: earlyAccess,
    },
  };
}

/**
 * 앰버서더 상태 비활성화
 * - 관리자 또는 시스템에 의해 호출
 */
export async function deactivateAmbassador(
  profileId: string,
  reason?: string
): Promise<void> {
  await prisma.ambassadorStatus.update({
    where: { profileId },
    data: {
      status: "INACTIVE",
      benefits: {
        newProductEarlyAccess: false,
        monthlyFreeShipping: 0,
      },
    },
  });

  logger.info("[AmbassadorService]", `Ambassador deactivated for profile: ${profileId}, reason: ${reason || "N/A"}`);
}

/**
 * 앰버서더 상태 재활성화
 * - 조건 충족 시 관리자에 의해 호출
 */
export async function reactivateAmbassador(profileId: string): Promise<boolean> {
  const ambassadorStatus = await prisma.ambassadorStatus.findUnique({
    where: { profileId },
  });

  if (!ambassadorStatus) {
    return false;
  }

  // 재활성화 조건 확인
  if (ambassadorStatus.totalReferrals < AMBASSADOR_CONFIG.requiredReferrals) {
    return false;
  }

  await prisma.ambassadorStatus.update({
    where: { profileId },
    data: { status: "ACTIVE" },
  });

  await grantAmbassadorBenefits(profileId);

  logger.info("[AmbassadorService]", `Ambassador reactivated for profile: ${profileId}`);
  return true;
}
