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

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
    agreeMarketing: boolean;
  }) => {
    // TODO: Implement actual registration via Supabase Auth
    // 1. Create user in Supabase Auth
    // 2. Store additional user data in users table
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
    <div className="min-h-screen flex items-center justify-center">
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
