"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, ShieldCheck, QrCode } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-12 md:py-16 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                Honey Chain
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise honey supply chain traceability platform providing immutable batch provenance, accredited laboratory certification, and consumer QR trust validation.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Network Active • 2026 Registry
            </div>
          </div>

          {/* Nav Col 1: Platform Modules */}
          <div className="space-y-2.5">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block">
              Platform Modules
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Operational Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Apiaries & Hive Registry
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Harvest Batches & Lots
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Chain-of-Custody Transfers
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Laboratory Testing & Certs
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Processing & Blending Lineage
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Consumer & Marketplace */}
          <div className="space-y-2.5">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block">
              Public & Commercial
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/verify/HC-BTL-2026-00001" className="text-primary hover:underline font-medium flex items-center gap-1">
                  <QrCode className="h-3 w-3" />
                  <span>Verify Bottle #00001</span>
                </Link>
              </li>
              <li>
                <Link href="/verify/HC-BTL-2026-00002" className="hover:text-foreground transition-colors">
                  Verify Bottle #00002
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  B2B Bulk Marketplace
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Retail Serialization Runs
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Trust & Governance */}
          <div className="space-y-2.5">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block">
              Governance & Admin
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Administrative Audit Log
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Organisation Scoping
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Role-Based Access Control
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Digital Certificate Authority
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>© 2026 Honey Chain Trust Platform. All digital product identities cryptographically hashed and indexed.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Operator Sign In
            </Link>
            <Link href="/verify/HC-BTL-2026-00001" className="hover:text-foreground transition-colors">
              Consumer Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
