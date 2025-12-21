-- ============================================================
-- Referral Milestone System Migration
-- 추천 마일스톤 시스템 (즉시 보상 없음)
-- ============================================================

-- 1. Enums 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReferralStatus') THEN
        CREATE TYPE "ReferralStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PointTransactionType') THEN
        CREATE TYPE "PointTransactionType" AS ENUM (
            'EARN_REFERRAL_MILESTONE',
            'EARN_AMBASSADOR',
            'EARN_ORDER',
            'EARN_EVENT',
            'USE_ORDER',
            'EXPIRE',
            'ADMIN_ADJUST'
        );
    END IF;
END$$;

-- 2. profiles 테이블에 추천 관련 컬럼 추가
ALTER TABLE "profiles"
ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "referredByCode" TEXT,
ADD COLUMN IF NOT EXISTS "totalReferrals" INTEGER NOT NULL DEFAULT 0;

-- 3. referrals 테이블 생성 (추천 관계)
CREATE TABLE IF NOT EXISTS "referrals" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'ACTIVE',
    "refereeSubscriptionStartedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "referrals_refereeId_key" UNIQUE ("refereeId"),
    CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId")
        REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "referrals_refereeId_fkey" FOREIGN KEY ("refereeId")
        REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "referrals_referrerId_idx" ON "referrals"("referrerId");
CREATE INDEX IF NOT EXISTS "referrals_referralCode_idx" ON "referrals"("referralCode");

-- 4. referral_milestone_rewards 테이블 생성 (마일스톤 보상)
CREATE TABLE IF NOT EXISTS "referral_milestone_rewards" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "referralId" TEXT NOT NULL,
    "milestoneMonths" INTEGER NOT NULL,
    "rewardPoints" INTEGER NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
    "rewardClaimedAt" TIMESTAMP(3),

    CONSTRAINT "referral_milestone_rewards_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "referral_milestone_rewards_referralId_milestoneMonths_key"
        UNIQUE ("referralId", "milestoneMonths"),
    CONSTRAINT "referral_milestone_rewards_referralId_fkey" FOREIGN KEY ("referralId")
        REFERENCES "referrals"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. point_transactions 테이블 생성 (포인트 거래 내역)
CREATE TABLE IF NOT EXISTS "point_transactions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "profileId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "type" "PointTransactionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "referenceId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "point_transactions_profileId_fkey" FOREIGN KEY ("profileId")
        REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "point_transactions_profileId_createdAt_idx"
    ON "point_transactions"("profileId", "createdAt" DESC);

-- 6. updatedAt 트리거 함수 (없으면 생성)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. referrals 테이블에 updatedAt 트리거 적용
DROP TRIGGER IF EXISTS update_referrals_updated_at ON "referrals";
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON "referrals"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 마이그레이션 완료
-- ============================================================
