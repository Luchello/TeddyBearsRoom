-- ============================================================
-- Add Adult Verification Fields to Profile
-- 성인인증 추가 필드 마이그레이션
-- ============================================================

-- Add adult verification fields to profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "adultVerifyMethod" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "adultVerifyProvider" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "adultVerifyTxid" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "ciHash" TEXT;

-- ============================================================
-- Create AdultVerificationLog table
-- 성인인증 이벤트 로그 테이블
-- ============================================================

CREATE TABLE IF NOT EXISTS "adult_verification_logs" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "txid" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "failureCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adult_verification_logs_pkey" PRIMARY KEY ("id")
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "adult_verification_logs_profileId_idx" ON "adult_verification_logs"("profileId");
CREATE INDEX IF NOT EXISTS "adult_verification_logs_txid_idx" ON "adult_verification_logs"("txid");
CREATE INDEX IF NOT EXISTS "adult_verification_logs_createdAt_idx" ON "adult_verification_logs"("createdAt");

-- Add foreign key constraint
-- Note: This will fail if the constraint already exists, so we use DO block
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'adult_verification_logs_profileId_fkey'
    ) THEN
        ALTER TABLE "adult_verification_logs"
        ADD CONSTRAINT "adult_verification_logs_profileId_fkey"
        FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON COLUMN "profiles"."adultVerifyMethod" IS '인증 방식: PHONE';
COMMENT ON COLUMN "profiles"."adultVerifyProvider" IS '제공사: PORTONE_KCP, PORTONE_DANAL';
COMMENT ON COLUMN "profiles"."adultVerifyTxid" IS '본인인증 거래 ID';
COMMENT ON COLUMN "profiles"."ciHash" IS 'SHA-256 해시된 CI (원문 저장 안 함)';

COMMENT ON TABLE "adult_verification_logs" IS '성인인증 이벤트 로그';
COMMENT ON COLUMN "adult_verification_logs"."txid" IS '본인인증 거래 ID';
COMMENT ON COLUMN "adult_verification_logs"."eventType" IS 'INITIATED, SUCCESS, FAILED';
COMMENT ON COLUMN "adult_verification_logs"."failureCode" IS '실패 시 에러 코드';
