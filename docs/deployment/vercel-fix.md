# Vercel Deployment Fix Guide

## Issue Summary
**Error**: `The specified Root Directory "frontend" does not exist.`
**Root Cause**: Vercel Project Settings has wrong Root Directory configuration
**Status**: ❌ Build Failed (1s duration)
**Deployment ID**: 3JGoJc7btnuDEho6jdd1swyEwWtK

## Problem Analysis

### Current Configuration

```yaml
Repository Structure:
  TeddyBearsRoom/
    ├── web/              # Actual Next.js app location
    ├── vercel.json       # Correct config exists
    └── ...

Vercel Dashboard Settings:
  Root Directory: "frontend"  # ❌ Wrong! This directory doesn't exist

Actual Directory Name:
  "web"                       # ✅ Correct location
```

### Why This Happened

The `.vercel/project.json` file shows:
```json
{
  "projectId": "prj_xllPyVrWw2rRnrBi8QrZRG883m37",
  "orgId": "team_chlFhTSlAuLTWuV3wWaVdkkW",
  "projectName": "frontend"  // ← Project NAME (not directory)
}
```

The project **name** is "frontend" but the **directory** is "web". Vercel Dashboard mistakenly used the project name as the Root Directory.

## Solution

### Method 1: Fix via Vercel Dashboard (Recommended)

**Step-by-step Instructions:**

1. **Navigate to Settings**
   - URL: https://vercel.com/luchellos-projects/teddy-bears-room/settings
   - Click: Project Settings > General

2. **Locate Root Directory Setting**
   ```
   Build & Development Settings
   ┌────────────────────────────────┐
   │ Root Directory                 │
   │ ┌────────────────────────────┐ │
   │ │ frontend                   │ │ ← Current (WRONG)
   │ └────────────────────────────┘ │
   │                                │
   │ Change to:                     │
   │ ┌────────────────────────────┐ │
   │ │ web                        │ │ ← New (CORRECT)
   │ └────────────────────────────┘ │
   └────────────────────────────────┘
   ```

3. **Update Configuration**
   - Delete "frontend"
   - Type "web"
   - Click **Save**

4. **Trigger Redeployment**
   - Option A: Vercel will auto-redeploy after save
   - Option B: Manual redeploy via Deployments tab
   - Option C: Push new commit to GitHub

### Method 2: Verify Other Settings

While in Project Settings, verify these configurations:

```yaml
Framework Preset: Next.js
Build Command: cd web && npm run build
Install Command: cd web && npm install
Output Directory: web/.next
Node.js Version: 20.x (recommended for Next.js 16)
```

**Important**: These commands are already configured in your `vercel.json`, but Dashboard settings take precedence if set.

## Verification

After changing Root Directory to "web", the deployment should succeed because:

1. ✅ `vercel.json` correctly references `web/`
   ```json
   {
     "buildCommand": "cd web && npm run build",
     "installCommand": "cd web && npm install",
     "outputDirectory": "web/.next"
   }
   ```

2. ✅ Local build works (`npm run build` succeeds)
3. ✅ All dependencies are properly installed
4. ✅ Next.js 16 + Prisma 7 configuration is correct

## Expected Build Output After Fix

```
[INFO] Cloning repository...
[INFO] Installing dependencies in web/...
[INFO] Running build command: cd web && npm run build
[INFO] > prisma generate
[INFO] > next build
[INFO] ✓ Build completed successfully
[INFO] Deployment URL: https://teddy-bears-room-[hash].vercel.app
```

## Additional Recommendations

### 1. Environment Variables Check
Ensure these are set in Vercel Dashboard > Settings > Environment Variables:

```env
DATABASE_URL=postgresql://...@[POOLER]:[6543]/postgres
DIRECT_URL=postgresql://...@[DIRECT]:[5432]/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Build Command Verification
Your `package.json` build script includes `prisma generate`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma Client is generated before Next.js build.

### 3. Monorepo Best Practices
Current setup follows Vercel monorepo guidelines:
- ✅ Root `vercel.json` with custom commands
- ✅ Framework set to `null` (custom detection)
- ✅ Output directory properly scoped to `web/.next`

## References

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Vercel Root Directory Guide](https://vercel.com/docs/build-step#root-directory)
- [Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build)
- [Next.js 16 Deployment](https://vercel.com/templates/next.js)

## Timeline

- **2025-12-17 18:49 KST**: Deployment failed with "frontend" directory error
- **2025-12-17 19:07 KST**: Root cause identified via Playwright browser automation
- **Next Step**: Update Root Directory to "web" in Vercel Dashboard

---

**Status**: 🟡 Action Required (Update Vercel Dashboard settings)
**ETA**: < 5 minutes to fix + 2-3 minutes for successful deployment
