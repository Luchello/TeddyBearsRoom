/**
 * Shop Layout
 * TeddyBear's Room - Main Shopping Experience
 */

import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CartDrawer } from "@/components/cart";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ErrorBoundary variant="default">
        <main className="flex-1">{children}</main>
      </ErrorBoundary>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
