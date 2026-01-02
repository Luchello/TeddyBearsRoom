-- ============================================================
-- Profile Auto Creation & Adult Verification Migration
-- 소셜 로그인 시 Profile 자동 생성 + 성인인증 필드 추가
-- ============================================================

-- 1. profiles 테이블에 성인인증 관련 컬럼 추가
ALTER TABLE "profiles"
ADD COLUMN IF NOT EXISTS "isAdultVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "adultVerifiedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "ci" TEXT,
ADD COLUMN IF NOT EXISTS "di" TEXT;

-- 2. Profile 자동 생성 함수
-- auth.users에 새 유저가 추가되면 자동으로 profiles 테이블에 레코드 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        name,
        avatar,
        "subscriptionTier",
        points,
        "createdAt",
        "updatedAt",
        "isAdultVerified"
    )
    VALUES (
        NEW.id::text,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        'NONE',
        0,
        NOW(),
        NOW(),
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(profiles.name, EXCLUDED.name),
        avatar = COALESCE(profiles.avatar, EXCLUDED.avatar),
        "updatedAt" = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 트리거 생성 (이미 존재하면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. 기존 auth.users에 대해 profiles 동기화 (profiles가 없는 유저)
-- 주의: 이 쿼리는 한 번만 실행해야 함
INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar,
    "subscriptionTier",
    points,
    "createdAt",
    "updatedAt",
    "isAdultVerified"
)
SELECT
    u.id::text,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
    COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
    'NONE',
    0,
    COALESCE(u.created_at, NOW()),
    NOW(),
    false
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id::text
);

-- ============================================================
-- 마이그레이션 완료
-- ============================================================
