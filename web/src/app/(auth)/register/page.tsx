/**
 * Register Page
 * TeddyBear's Room - User Registration
 */

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/auth";
import { Skeleton } from "@/components/ui/skeleton";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  // TODO: formData will be used when implementing Supabase Auth registration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRegister = async (formData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
  }) => {
    // TODO: Implement actual registration via Supabase Auth
    // 1. Create user in Supabase Auth (_formData.email, _formData.password)
    // 2. Store additional user data in users table (_formData.name, _formData.phone)
    // 3. Handle adult verification result

    // Mock registration success
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(redirectUrl);
  };

  return (
    <RegisterForm onSubmit={handleRegister} redirectUrl={redirectUrl} />
  );
}

function RegisterSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Decorations */}
      <div className="absolute top-[10%] left-[5%] text-6xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>☁️</div>
      <div className="absolute bottom-[20%] right-[10%] text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>☁️</div>
      <div className="absolute top-[30%] right-[20%] w-64 h-64 bg-[var(--color-love-50)] rounded-full blur-[80px] opacity-40" />
      <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-[var(--color-dream-50)] rounded-full blur-[100px] opacity-40" />
      <div className="w-full max-w-md space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}
