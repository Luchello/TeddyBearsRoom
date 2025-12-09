/**
 * Shop Layout
 * TeddyBear's Room - Main Shopping Experience
 */

import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/toast";
import { CartDrawer } from "@/components/cart";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
