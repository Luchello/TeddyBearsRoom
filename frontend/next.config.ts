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
  // X-Powered-By 헤더 비활성화 (보안)
  poweredByHeader: false,
  // 보안 헤더 설정
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data: https:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; ')
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    }];
  }
};

export default nextConfig;
