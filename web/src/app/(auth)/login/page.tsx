/**
 * Login Page
 * TeddyBear's Room - User Login
 */

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth";
import { Skeleton } from "@/components/ui/skeleton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleLogin = async (_credentials: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    // TODO: Implement actual login via Supabase Auth
    // const { data: authData, error } = await supabase.auth.signInWithPassword({
    //   email: _credentials.email,
    //   password: _credentials.password,
    // });

    // Mock login success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(redirectUrl);
  };

  return (
    <LoginForm onSubmit={handleLogin} redirectUrl={redirectUrl} />
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
