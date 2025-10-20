import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GemILike",
  description: "GemILike gradient logo demo (Next.js + Tailwind)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
