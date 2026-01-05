/**
 * Register Callback Page
 *
 * 모바일 본인인증 후 회원가입 완료 콜백 페이지
 * - Next.js 16 요구사항: useSearchParams()는 Suspense boundary 필수
 */

import { Suspense } from "react";
import { RegisterCallbackHandler } from "./callback-handler";
import { Loader2 } from "lucide-react";

function CallbackLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-card shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">인증 결과를 확인하는 중...</p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <RegisterCallbackHandler />
    </Suspense>
  );
}

// Metadata
export const metadata = {
  title: "회원가입 처리 중 | TeddyBear's Room",
  description: "회원가입을 처리하고 있습니다.",
};
