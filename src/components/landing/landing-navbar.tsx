"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, Menu, X, ArrowRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function LandingNavbar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.navbar.product, href: "#overview" },
    { label: t.navbar.workflow, href: "#workflow" },
    { label: t.navbar.platform, href: "#features" },
    { label: t.navbar.qualityTrust, href: "#purity" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-card/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          : "border-b border-border/80 bg-card/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Honey Chain Brand Lockup */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#143D2B] text-white shadow-xs transition-transform group-hover:scale-102">
              <Hexagon className="h-5 w-5 fill-[#D97706] stroke-current stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[16.5px] font-extrabold tracking-tight text-foreground leading-none">
                {t.common.honeyChain}
              </span>
              <span className="text-[9.5px] uppercase font-mono tracking-widest text-[#5F6B64] font-semibold mt-1">
                {t.common.traceabilityPlatform}
              </span>
            </div>
          </Link>

          {/* Center: Minimal Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-semibold text-[#5F6B64] hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Action CTAs + Language Selector */}
        <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
          {/* Language Selector: Globe + English / हिन्दी */}
          <LanguageSwitcher />

          {/* Subtle Verify Bottle Action - clearly visible */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-[#1A221E] hover:text-foreground hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7E3DB] h-9 px-3.5 font-semibold cursor-pointer rounded-lg transition-colors"
          >
            <Link href="/verify/HC-BTL-2026-00001" className="flex items-center gap-1.5 whitespace-nowrap">
              <QrCode className="h-3.5 w-3.5 text-[#D97706]" />
              <span>{t.navbar.verifyBottle}</span>
            </Link>
          </Button>

          {/* Single Primary Action Button: Sign In */}
          <Button
            size="sm"
            asChild
            className="text-xs h-9 px-4 font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer group rounded-lg transition-all active:scale-98 whitespace-nowrap"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <span>{t.navbar.signIn}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />

          <Button
            size="sm"
            asChild
            className="text-xs h-8 px-3 font-semibold bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg"
          >
            <Link href="/login">{t.navbar.signIn}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 pt-3 pb-5 space-y-3 shadow-md animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs justify-start h-9 font-medium"
            >
              <Link href="/verify/HC-BTL-2026-00001" onClick={() => setMobileMenuOpen(false)}>
                <QrCode className="h-3.5 w-3.5 mr-2 text-[#D97706]" />
                {t.navbar.publicVerification}
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="w-full text-xs font-semibold bg-[#D97706] hover:bg-[#B45309] text-white h-9 rounded-lg"
            >
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <span>{t.navbar.signInPlatform}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
