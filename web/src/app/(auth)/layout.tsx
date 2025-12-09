/**
 * Auth Layout
 * TeddyBear's Room - Authentication Pages
 */

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">
            TeddyBear&apos;s Room
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">{children}</div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TeddyBear&apos;s Room</p>
          <p className="mt-1">본 사이트는 만 19세 이상만 이용 가능합니다.</p>
        </div>
      </footer>
    </div>
  );
}
