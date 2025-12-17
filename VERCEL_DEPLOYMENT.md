# Vercel Deployment Guide

## 배포 오류 해결 (2025-12-17)

### 문제 원인
Vercel이 프로젝트의 root directory를 잘못 인식하여 배포 실패

### 해결 방안

#### Option 1: Vercel Dashboard 설정 (권장)

1. Vercel Dashboard 접속: https://vercel.com/luchellos-projects/teddy-bears-room/settings
2. **Settings > General** 이동
3. **Root Directory** 설정:
   - Current: `.` (root)
   - **변경 필요**: `web`
4. **Framework Preset**: `Next.js` 선택
5. **Build & Development Settings** 확인:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   ```

#### Option 2: vercel.json 사용 (완료됨)

`vercel.json` 파일이 프로젝트 root에 추가되었습니다:

```json
{
  "buildCommand": "cd web && npm run build",
  "devCommand": "cd web && npm run dev",
  "installCommand": "cd web && npm install",
  "framework": null,
  "outputDirectory": "web/.next"
}
```

### 환경변수 설정 확인

Vercel Dashboard > Settings > Environment Variables에서 다음 변수들이 설정되어 있는지 확인:

**필수 환경변수:**
- `DATABASE_URL`: Supabase pooler connection (port 6543)
- `DIRECT_URL`: Supabase direct connection (port 5432)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

**환경별 설정:**
- Production: ✓ (모든 필수 변수)
- Preview: ✓ (모든 필수 변수)
- Development: ✓ (모든 필수 변수)

### 배포 테스트

```bash
# 로컬 빌드 테스트 (성공 확인됨)
cd web
npm run build

# Vercel CLI로 배포 테스트 (선택사항)
vercel --prod
```

### 일반적인 Vercel 배포 실패 원인

1. **Root Directory 오설정** ← 현재 문제
   - 증상: "Could not find package.json" 또는 빌드 명령 실패
   - 해결: Root Directory를 `web`으로 설정

2. **환경변수 누락**
   - 증상: Prisma connection errors, Supabase errors
   - 해결: Dashboard에서 환경변수 확인

3. **Build Command 오류**
   - 증상: TypeScript errors, lint errors
   - 해결: 로컬에서 `npm run build` 테스트

4. **Prisma 관련 오류**
   - 증상: "Prisma Client not generated"
   - 해결: `package.json`의 `build` script에 `prisma generate` 포함 확인됨

### 프로젝트 구조

```
TeddyBear'sRoom/
├── web/                    ← Next.js 프로젝트 (Vercel Root로 설정 필요)
│   ├── package.json       ← 실제 의존성
│   ├── next.config.ts
│   ├── prisma/
│   └── src/
├── package.json           ← Monorepo workspace (minimal)
├── vercel.json            ← Vercel 설정 (추가됨)
└── VERCEL_DEPLOYMENT.md   ← 이 문서
```

### 다음 단계

1. **Option 1 (권장)**: Vercel Dashboard에서 Root Directory를 `web`으로 변경
2. **Option 2**: `vercel.json` 설정이 자동으로 적용되도록 대기
3. PR #1을 다시 배포 (자동 트리거 또는 수동 redeploy)
4. 배포 로그 확인: https://vercel.com/luchellos-projects/teddy-bears-room

### Monorepo 관련 참고사항

현재 프로젝트는 monorepo 구조가 아니지만, root에 `package.json`이 존재하여 Vercel이 혼동할 수 있습니다.

**장기 해결책 (선택사항):**
- Root `package.json` 제거 (현재는 workspace 설정만 있음)
- 또는 실제 monorepo로 전환 (pnpm workspace, Turborepo 등)

### 참고 문서

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
