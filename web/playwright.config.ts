import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * TeddyBear's Room - End-to-End Testing Setup
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test 파일 위치
  testDir: './tests/e2e',

  // 최대 실행 시간 (30초)
  timeout: 30 * 1000,

  // 각 테스트 간 완전 격리 (새 컨텍스트/페이지)
  fullyParallel: true,

  // CI 환경에서는 재시도 비활성화
  forbidOnly: !!process.env.CI,

  // 실패 시 재시도 횟수
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행 워커 수
  workers: process.env.CI ? 1 : undefined,

  // Reporter 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // 모든 테스트에 공통으로 적용되는 설정
  use: {
    // Base URL (로컬 개발 서버)
    baseURL: 'http://localhost:3000',

    // 실패 시 스크린샷 캡처
    screenshot: 'only-on-failure',

    // 실패 시 trace 수집
    trace: 'on-first-retry',

    // 비디오 녹화 (실패 시에만)
    video: 'retain-on-failure',

    // 타임아웃 설정
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  // 테스트 프로젝트 설정 (브라우저)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // 속도를 위해 Chrome만 사용, 필요시 아래 주석 해제
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // 로컬 개발 서버 자동 실행
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
