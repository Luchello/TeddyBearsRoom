import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeddyBear's Room",
  description: "Coming Soon - TeddyBear's Room",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
