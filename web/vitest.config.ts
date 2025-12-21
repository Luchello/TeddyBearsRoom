import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // 환경 설정
    environment: 'happy-dom',

    // 글로벌 설정
    globals: true,

    // Setup 파일
    setupFiles: ['./tests/setup.ts'],

    // 커버리지 설정
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/.next/**',
      ],
    },

    // 타임아웃 설정 (ms)
    testTimeout: 10000,

    // Include/Exclude 패턴
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'playwright-report', 'test-results', 'tests/e2e'],
  },

  // Path alias 설정 (tsconfig.json과 동일)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
