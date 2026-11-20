
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIP ARENA | Market Battles",
  description: "Continuous market trading practice arena.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
