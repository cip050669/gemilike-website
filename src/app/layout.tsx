import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemilike - Exklusive Edelsteine",
  description: "Entdecken Sie unsere exklusiven Edelsteine und Schmuckstücke",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
