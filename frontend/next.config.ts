import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack이 이 서버(t3.large)에서 ENOENT race condition 발생
  // webpack을 기본 번들러로 사용
  experimental: {
    // turbo 비활성화 (Next.js 16에서 기본 turbopack 사용 방지)
  },
  images: {
    // 외부 이미지 도메인 허용 (필요 시)
    remotePatterns: [],
  },
};

export default nextConfig;
