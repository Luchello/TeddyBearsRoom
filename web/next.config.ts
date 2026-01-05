import type { NextConfig } from "next";

// ====================================
// Security Headers Configuration
// OWASP 권장 보안 헤더 적용
// ====================================
const securityHeaders = [
  {
    // XSS 공격 방지: 브라우저의 MIME 스니핑 비활성화
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Clickjacking 방지: 동일 출처에서만 iframe 허용
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // XSS 필터 활성화 (레거시 브라우저 지원)
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // HTTPS 강제: 1년간 HTTPS만 허용
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Referrer 정보 제한: 동일 출처에만 전체 URL 전송
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // 권한 정책: 불필요한 브라우저 기능 비활성화
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Content Security Policy: XSS 및 데이터 인젝션 방지
    // 개발 환경에서는 eval 허용 (Next.js HMR)
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // React Compiler 활성화 (Next.js 16 + React 19)
  // 자동 메모이제이션으로 성능 최적화
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },

  // 모든 라우트에 보안 헤더 적용
  async headers() {
    return [
      {
        // 모든 경로에 적용
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
