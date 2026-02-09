import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack이 이 서버(t3.large)에서 ENOENT race condition 발생
  // webpack을 기본 번들러로 사용
  // Turbopack 비활성화 — 이 서버에서 ENOENT race condition 발생
  // Next.js 16: bundlePagesRouterDependencies로 webpack 모드 안정화
  bundlePagesRouterDependencies: true,
  images: {
    // 외부 이미지 도메인 허용 (필요 시)
    remotePatterns: [],
  },
};

export default nextConfig;
