import type { Metadata } from "next";
import { GlobalBanner } from "@/components/GlobalBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAUNCH — Life After Graduation",
  description:
    "A financial life simulator for recent college graduates. Make 12 years of decisions. See how they compound.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <GlobalBanner />
        {children}
      </body>
    </html>
  );
}
