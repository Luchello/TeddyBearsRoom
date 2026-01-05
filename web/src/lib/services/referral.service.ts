/**
 * Referral Service
 *
 * 추천인 시스템 핵심 비즈니스 로직
 * - 추천 코드 생성
 * - 추천 관계 등록
 * - 마일스톤 체크 및 보상 지급
 */

import { prisma } from "@/lib/prisma";
import {
  REFERRAL_CODE_CONFIG,
  REFERRAL_MILESTONES,
  POINTS_CONFIG,
} from "@/constants/referral";
import type { Referral, ReferralMilestoneReward } from "@prisma/client";
import { logger } from "@/lib/logger";

// ============================================================
// REFERRAL CODE GENERATION
// ============================================================

/**
 * 고유한 추천 코드 생성
 * 형식: TBR + 6자리 영숫자 (예: TBR2X4K9M)
 */
export async function generateReferralCode(): Promise<string> {
  const { prefix, length, charset } = REFERRAL_CODE_CONFIG;

  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    const randomPart = Array.from({ length }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join("");

    code = `${prefix}${randomPart}`;

    // 중복 체크
    const existing = await prisma.profile.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });

    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique referral code");
  }

  return code!;
}

/**
 * 프로필에 추천 코드 할당 (없는 경우에만)
 */
export async function ensureReferralCode(profileId: string): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { referralCode: true },
  });

  if (profile?.referralCode) {
    return profile.referralCode;
  }

  const code = await generateReferralCode();

  await prisma.profile.update({
    where: { id: profileId },
    data: { referralCode: code },
  });

  return code;
}

// ============================================================
// REFERRAL CODE VALIDATION
// ============================================================

/**
 * 추천 코드 유효성 검증
 */
export async function validateReferralCode(
  code: string
): Promise<{ valid: boolean; referrerId?: string; error?: string }> {
  if (!code || code.length !== REFERRAL_CODE_CONFIG.prefix.length + REFERRAL_CODE_CONFIG.length) {
    return { valid: false, error: "유효하지 않은 코드 형식입니다" };
  }

  const referrer = await prisma.profile.findUnique({
    where: { referralCode: code.toUpperCase() },
    select: { id: true, name: true },
  });

  if (!referrer) {
    return { valid: false, error: "존재하지 않는 추천 코드입니다" };
  }

  return { valid: true, referrerId: referrer.id };
}

// ============================================================
// REFERRAL REGISTRATION
// ============================================================

/**
 * 추천 관계 등록 (회원가입 시 호출)
 * - 즉시 보상 없음
 * - B가 구독 시작하면 refereeSubscriptionStartedAt 업데이트
 */
export async function registerReferral(
  refereeId: string,
  referralCode: string
): Promise<Referral | null> {
  // 이미 추천받은 적이 있는지 확인
  const existingReferral = await prisma.referral.findUnique({
    where: { refereeId },
  });

  if (existingReferral) {
    logger.debug("[ReferralService]", `Profile ${refereeId} already has a referral`);
    return null;
  }

  // 추천 코드 검증
  const validation = await validateReferralCode(referralCode);
  if (!validation.valid || !validation.referrerId) {
    logger.debug("[ReferralService]", `Invalid referral code: ${referralCode}`);
    return null;
  }

  // 자기 자신 추천 방지
  if (validation.referrerId === refereeId) {
    logger.debug("[ReferralService]", "Cannot refer yourself");
    return null;
  }

  // 추천 관계 생성
  const referral = await prisma.referral.create({
    data: {
      referrerId: validation.referrerId,
      refereeId,
      referralCode: referralCode.toUpperCase(),
      // refereeSubscriptionStartedAt: B가 구독 시작할 때 설정
    },
  });

  // 피추천인 프로필에 추천 코드 기록
  await prisma.profile.update({
    where: { id: refereeId },
    data: { referredByCode: referralCode.toUpperCase() },
  });

  return referral;
}

// ============================================================
// SUBSCRIPTION START (B가 구독 시작)
// ============================================================

/**
 * 피추천인(B)이 구독을 시작할 때 호출
 * - 마일스톤 타이머 시작
 */
export async function onRefereeSubscriptionStart(refereeId: string): Promise<void> {
  const referral = await prisma.referral.findUnique({
    where: { refereeId },
  });

  if (!referral) {
    return; // 추천받지 않은 사용자
  }

  if (referral.refereeSubscriptionStartedAt) {
    return; // 이미 구독 시작일이 설정됨
  }

  await prisma.referral.update({
    where: { id: referral.id },
    data: { refereeSubscriptionStartedAt: new Date() },
  });

  // 추천인 총 추천 수 증가
  await prisma.profile.update({
    where: { id: referral.referrerId },
    data: { totalReferrals: { increment: 1 } },
  });

  logger.info("[ReferralService]", `Referral milestone timer started for referral ${referral.id}`);
}

// ============================================================
// MILESTONE CHECK & REWARD
// ============================================================

/**
 * 특정 추천 관계의 마일스톤 체크 및 보상 생성
 */
export async function checkAndCreateMilestoneRewards(
  referralId: string
): Promise<ReferralMilestoneReward[]> {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    include: {
      milestoneRewards: true,
      referee: {
        include: {
          // B의 현재 구독 상태 확인
        },
      },
    },
  });

  if (!referral || !referral.refereeSubscriptionStartedAt) {
    return [];
  }

  // B의 구독이 활성 상태인지 확인
  const subscription = await prisma.subscription.findUnique({
    where: { profileId: referral.refereeId },
  });

  if (!subscription || subscription.status !== "ACTIVE") {
    return [];
  }

  const subscriptionStartDate = referral.refereeSubscriptionStartedAt;
  const now = new Date();
  const monthsSubscribed = getMonthsDifference(subscriptionStartDate, now);

  const newRewards: ReferralMilestoneReward[] = [];
  const existingMonths = new Set(referral.milestoneRewards.map((r) => r.milestoneMonths));

  for (const milestone of REFERRAL_MILESTONES) {
    // 이미 달성한 마일스톤은 스킵
    if (existingMonths.has(milestone.months)) {
      continue;
    }

    // 해당 개월 수에 도달했는지 확인
    if (monthsSubscribed >= milestone.months) {
      const reward = await prisma.referralMilestoneReward.create({
        data: {
          referralId,
          milestoneMonths: milestone.months,
          rewardPoints: milestone.points,
          achievedAt: new Date(),
        },
      });
      newRewards.push(reward);

      logger.info("[ReferralService]", `Milestone achieved: ${milestone.months}M for referral ${referralId}, ${milestone.points}P`);
    }
  }

  // 12개월 마일스톤 완료 시 상태 업데이트
  if (newRewards.some((r) => r.milestoneMonths === 12)) {
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: "COMPLETED" },
    });
  }

  return newRewards;
}

/**
 * 모든 활성 추천 관계의 마일스톤 체크 (Cron Job용)
 */
export async function checkAllMilestones(): Promise<void> {
  const activeReferrals = await prisma.referral.findMany({
    where: {
      status: "ACTIVE",
      refereeSubscriptionStartedAt: { not: null },
    },
    select: { id: true },
  });

  logger.info("[ReferralService]", `Checking milestones for ${activeReferrals.length} active referrals`);

  for (const referral of activeReferrals) {
    try {
      await checkAndCreateMilestoneRewards(referral.id);
    } catch (error) {
      logger.error("[ReferralService]", `Error checking milestones for referral ${referral.id}:`, error);
    }
  }
}

// ============================================================
// CLAIM REWARD (보상 수령)
// ============================================================

/**
 * 마일스톤 보상 수령
 */
export async function claimMilestoneReward(
  rewardId: string,
  referrerId: string
): Promise<{ success: boolean; error?: string; points?: number }> {
  const reward = await prisma.referralMilestoneReward.findUnique({
    where: { id: rewardId },
    include: {
      referral: true,
    },
  });

  if (!reward) {
    return { success: false, error: "보상을 찾을 수 없습니다" };
  }

  if (reward.referral.referrerId !== referrerId) {
    return { success: false, error: "권한이 없습니다" };
  }

  if (reward.rewardClaimed) {
    return { success: false, error: "이미 수령한 보상입니다" };
  }

  // 트랜잭션으로 보상 지급
  await prisma.$transaction(async (tx) => {
    // 1. 보상 상태 업데이트
    await tx.referralMilestoneReward.update({
      where: { id: rewardId },
      data: {
        rewardClaimed: true,
        rewardClaimedAt: new Date(),
      },
    });

    // 2. 프로필 포인트 증가
    const profile = await tx.profile.update({
      where: { id: referrerId },
      data: { points: { increment: reward.rewardPoints } },
    });

    // 3. 포인트 거래 내역 생성
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + POINTS_CONFIG.expirationMonths);

    await tx.pointTransaction.create({
      data: {
        profileId: referrerId,
        amount: reward.rewardPoints,
        balance: profile.points,
        type: "EARN_REFERRAL_MILESTONE",
        reason: `추천 마일스톤: ${reward.milestoneMonths}개월 구독 유지`,
        referenceId: reward.referralId,
        expiresAt,
      },
    });
  });

  return { success: true, points: reward.rewardPoints };
}

// ============================================================
// REFERRAL STATS
// ============================================================

/**
 * 추천인의 추천 현황 조회
 */
export async function getReferralStats(referrerId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId },
    include: {
      referee: {
        select: { id: true, name: true, email: true, createdAt: true },
      },
      milestoneRewards: {
        orderBy: { milestoneMonths: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter((r) => r.status === "ACTIVE").length,
    completedReferrals: referrals.filter((r) => r.status === "COMPLETED").length,
    totalPointsEarned: 0,
    unclaimedPoints: 0,
    referrals: referrals.map((r) => ({
      id: r.id,
      referee: {
        name: r.referee.name || "익명",
        joinedAt: r.referee.createdAt,
      },
      status: r.status,
      subscriptionStartedAt: r.refereeSubscriptionStartedAt,
      milestones: r.milestoneRewards.map((m) => ({
        months: m.milestoneMonths,
        points: m.rewardPoints,
        achievedAt: m.achievedAt,
        claimed: m.rewardClaimed,
        claimedAt: m.rewardClaimedAt,
      })),
    })),
  };

  // 포인트 계산
  for (const referral of referrals) {
    for (const reward of referral.milestoneRewards) {
      stats.totalPointsEarned += reward.rewardPoints;
      if (!reward.rewardClaimed) {
        stats.unclaimedPoints += reward.rewardPoints;
      }
    }
  }

  return stats;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getMonthsDifference(startDate: Date, endDate: Date): number {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // 일자도 고려하여 정확한 개월 수 계산
  if (endDate.getDate() < startDate.getDate()) {
    return months - 1;
  }

  return months;
}
