// ====================================
// TeddyBear's Room - Database Seed
// Prisma 7 + pg adapter for E-commerce
// ====================================

import * as dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Load .env.local for local development
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma client with adapter (Prisma 7 requirement)
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "파스텔 드림 컬렉션 - 소프트 터치",
    description:
      "부드러운 실리콘 소재로 제작된 파스텔 드림 컬렉션입니다. 피부에 닿는 부드러운 촉감과 안전한 소재로 안심하고 사용할 수 있어요.",
    price: 39000,
    originalPrice: 49000,
    imageUrl: "/placeholder.jpg",
    category: "토이",
    isNew: true,
    isBest: true,
    stock: 50,
  },
  {
    name: "코지 나이트 아로마 캔들 세트",
    description:
      "은은한 라벤더와 바닐라 향이 어우러진 아로마 캔들 세트입니다. 로맨틱한 분위기 연출에 완벽해요.",
    price: 28000,
    originalPrice: null,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isNew: true,
    isBest: false,
    stock: 100,
  },
  {
    name: "실크 터치 마사지 오일",
    description:
      "비타민 E가 함유된 프리미엄 마사지 오일입니다. 피부에 빠르게 흡수되며 끈적임 없이 촉촉함을 유지해요.",
    price: 32000,
    originalPrice: 38000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
    isNew: false,
    isBest: true,
    stock: 80,
  },
  {
    name: "베어 허그 쿠션 세트",
    description:
      "귀여운 테디베어 모양의 인테리어 쿠션 세트입니다. 부드러운 밍크 소재로 포근한 느낌을 선사해요.",
    price: 45000,
    originalPrice: null,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
    isNew: false,
    isBest: false,
    stock: 60,
  },
  {
    name: "스윗 드림 슬립 마스크",
    description:
      "100% 실크 소재의 고급 수면 안대입니다. 빛을 완벽하게 차단하고 피부 자극을 최소화해요.",
    price: 18000,
    originalPrice: null,
    imageUrl: "/placeholder.jpg",
    category: "라이프",
    isNew: true,
    isBest: false,
    stock: 120,
  },
  {
    name: "버블 베어 바스 솔트",
    description:
      "히말라야 핑크솔트와 장미 에센스가 들어간 입욕제입니다. 피로 회복과 피부 보습에 탁월해요.",
    price: 22000,
    originalPrice: 28000,
    imageUrl: "/placeholder.jpg",
    category: "케어",
    isNew: false,
    isBest: false,
    stock: 90,
  },
  {
    name: "로맨틱 무드등 세트",
    description:
      "다양한 색상 변환이 가능한 LED 무드등입니다. 리모컨으로 간편하게 조작할 수 있어요.",
    price: 35000,
    originalPrice: null,
    imageUrl: "/placeholder.jpg",
    category: "무드",
    isNew: false,
    isBest: true,
    stock: 70,
  },
  {
    name: "허니 베어 립밤 세트",
    description:
      "꿀 성분이 함유된 촉촉한 립밤 3종 세트입니다. 달콤한 향과 함께 입술을 부드럽게 케어해요.",
    price: 15000,
    originalPrice: null,
    imageUrl: "/placeholder.jpg",
    category: "케어",
    isNew: false,
    isBest: false,
    stock: 150,
  },
];

async function main() {
  console.log("🌱 Starting seed...");
  console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Loaded" : "❌ Missing"}`);

  // Clear existing products
  await prisma.product.deleteMany();
  console.log("🗑️  Cleared existing products");

  // Create new products
  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created: ${created.name}`);
  }

  console.log(`\n🎉 Seed completed! ${products.length} products created.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
