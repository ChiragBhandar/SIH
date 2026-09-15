"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, Menu, X, ArrowRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/context/auth-session-context";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isAuthenticated, hasSelectedOrg, hasSelectedRole } = useAuthSession();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#overview" },
    { label: "Workflow", href: "#workflow" },
    { label: "Platform", href: "#features" },
    { label: "Quality & Trust", href: "#purity" },
  ];

  const appEntryHref = isAuthenticated
    ? hasSelectedOrg && hasSelectedRole
      ? "/dashboard"
      : "/select-organisation"
    : "/login";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs shadow-foreground/5"
          : "border-b border-border/50 bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Honey Chain Brand Lockup */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Hexagon className="h-5 w-5 fill-current stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground leading-tight">
                Honey Chain
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-medium">
                Traceability Platform
              </span>
            </div>
          </Link>

          {/* Center: Minimal Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Subtle Verify Bottle Action */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-3 font-medium cursor-pointer"
          >
            <Link href="/verify/HC-BTL-2026-00001" className="flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-primary" />
              <span>Verify Bottle</span>
            </Link>
          </Button>

          {/* Secondary Sign In */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-9 px-3.5 font-medium border-border/90 bg-card text-foreground hover:bg-muted cursor-pointer"
          >
            <Link href="/login">
              Sign In
            </Link>
          </Button>

          {/* Primary Action Button */}
          <Button
            size="sm"
            asChild
            className="text-xs h-9 px-4 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer group rounded-lg"
          >
            <Link href={appEntryHref} className="flex items-center gap-1.5">
              <span>{isAuthenticated ? "Open Workspace" : "Open Workspace"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            size="sm"
            asChild
            className="text-xs h-8 px-3 font-semibold bg-primary text-primary-foreground rounded-lg"
          >
            <Link href={appEntryHref}>
              {isAuthenticated ? "Workspace" : "Sign In"}
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
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
                <QrCode className="h-3.5 w-3.5 mr-2 text-primary" />
                Public Bottle Verification
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="w-full text-xs font-semibold bg-primary text-primary-foreground h-9 rounded-lg"
            >
              <Link href={appEntryHref} onClick={() => setMobileMenuOpen(false)}>
                <span>Open Operational Workspace</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
