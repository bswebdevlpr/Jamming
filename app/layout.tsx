import type { Metadata } from "next";
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "Jamming",
  description: "놀기 위해 모였다! 음악인을 위한 합주 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
