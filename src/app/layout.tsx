import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Honey Chain | Traceability & Consumer Trust Platform",
  description:
    "Enterprise honey-material traceability platform providing immutable supply chain verification, lab test certifications, and consumer trust validation.",
};

import { AuthSessionProvider } from "@/context/auth-session-context";
import { TraceabilityProvider } from "@/context/traceability-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthSessionProvider>
          <TraceabilityProvider>{children}</TraceabilityProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
