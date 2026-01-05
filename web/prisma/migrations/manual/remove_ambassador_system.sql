-- Remove Ambassador System Migration
-- Date: 2026-01-05
-- Description: Removes AmbassadorStatus model and related columns from profiles

-- Step 1: Drop the AmbassadorStatus table if it exists
DROP TABLE IF EXISTS "ambassador_statuses" CASCADE;

-- Step 2: Remove ambassadorStatus column from profiles if it exists
-- (This might fail if the column doesn't exist, which is fine)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'ambassador_status_id'
    ) THEN
        ALTER TABLE "profiles" DROP COLUMN "ambassador_status_id";
    END IF;
END $$;

-- Step 3: Drop the AmbassadorStatusType enum if it exists
DROP TYPE IF EXISTS "AmbassadorStatusType" CASCADE;

-- Verification
SELECT 'Ambassador system removed successfully' AS status;
