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
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon",
    apple: "/apple-icon",
  },
};

import { AuthSessionProvider } from "@/context/auth-session-context";
import { TraceabilityProvider } from "@/context/traceability-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`} style={{ colorScheme: "light" }}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <AuthSessionProvider>
          <TraceabilityProvider>{children}</TraceabilityProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
