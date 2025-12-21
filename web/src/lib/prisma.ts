// ====================================
// TeddyBear's Room - Prisma Client
// Prisma 7+ with PostgreSQL Adapter
// ====================================
//
// 🎯 설계 배경:
// Prisma 7은 adapter 패턴을 사용하여 DB 연결
// Supabase PostgreSQL (Mumbai region) 사용
//
// 📝 환경변수:
// - DATABASE_URL: Supabase connection string (pooler, port 6543)
// - DIRECT_URL: Direct connection (port 5432, migrations용)
//
// ⚠️ 주의사항:
// - 개발 환경에서 HMR로 인한 다중 인스턴스 방지 필요
// - globalThis 패턴으로 싱글톤 보장
// ====================================

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * 전역 Prisma 인스턴스 타입 확장
 * @description 개발 환경 HMR에서 다중 인스턴스 생성 방지
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Prisma 클라이언트 생성 함수
 * @description Prisma 7의 adapter 패턴 사용
 * @returns 설정된 PrismaClient 인스턴스
 */
function createPrismaClient() {
  // ──────────────────────────────────────
  // 1. PostgreSQL Connection Pool 생성
  // ──────────────────────────────────────
  // - 기존 pool 재사용 (개발 환경 HMR 대응)
  // - DATABASE_URL: Supabase pooler (port 6543, pgbouncer)
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
    });

  // 개발 환경에서만 pool 전역 저장 (HMR 시 재사용)
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  // ──────────────────────────────────────
  // 2. Prisma Adapter 생성
  // ──────────────────────────────────────
  // Prisma 7+: PrismaPg adapter로 PostgreSQL 연결
  const adapter = new PrismaPg(pool);

  // ──────────────────────────────────────
  // 3. Prisma Client 생성
  // ──────────────────────────────────────
  return new PrismaClient({
    adapter,
    // 개발 환경: query, error, warn 로깅
    // 프로덕션: error만 로깅
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

/**
 * Prisma 클라이언트 싱글톤 인스턴스
 * @example
 * import { prisma } from "@/lib/prisma";
 * const products = await prisma.product.findMany();
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 개발 환경에서만 전역 저장 (HMR 시 재사용)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
