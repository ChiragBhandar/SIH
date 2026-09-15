"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, ArrowRight, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/context/auth-session-context";

export function FinalCTA() {
  const { isAuthenticated, hasSelectedOrg, hasSelectedRole } = useAuthSession();

  const appEntryHref = isAuthenticated
    ? hasSelectedOrg && hasSelectedRole
      ? "/dashboard"
      : "/select-organisation"
    : "/login";

  return (
    <section className="py-16 md:py-24 bg-card border-b border-border/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Brand Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Hexagon className="h-7 w-7 fill-current stroke-[2.5]" />
        </div>

        {/* Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Ready to Build Verifiable Trust Across Your Honey Supply Chain?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Unite your beekeeper cooperatives, extraction hubs, testing laboratories, and retail packaging lines in one secure, cryptographically auditable platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            asChild
            className="w-full sm:w-auto h-11 px-7 text-sm font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/25 cursor-pointer group"
          >
            <Link href={appEntryHref} className="flex items-center justify-center gap-2">
              <span>{isAuthenticated ? "Go to Operational Dashboard" : "Sign In to Platform"}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto h-11 px-6 text-sm font-medium border-border/90 bg-card/60 hover:bg-muted/80 cursor-pointer"
          >
            <Link href="/verify/HC-BTL-2026-00001" className="flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4 text-primary" />
              <span>Verify Sample Bottle</span>
            </Link>
          </Button>
        </div>

        {/* Security & Verification Trust Badges */}
        <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Immutable Provenance Ledger</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Accredited Lab Integrations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Role-Based Multi-Org Security</span>
          </div>
        </div>
      </div>
    </section>
  );
}
