import type { Metadata } from "next";
import { Inter, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BeeTech | Traceability & Consumer Trust Platform",
  description:
    "Enterprise honey-material traceability platform providing immutable supply chain verification, lab test certifications, and consumer trust validation.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

import { AuthSessionProvider } from "@/context/auth-session-context";
import { TraceabilityProvider } from "@/context/traceability-context";
import { LanguageProvider } from "@/context/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${notoDevanagari.variable} light`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <LanguageProvider>
          <AuthSessionProvider>
            <TraceabilityProvider>{children}</TraceabilityProvider>
          </AuthSessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
