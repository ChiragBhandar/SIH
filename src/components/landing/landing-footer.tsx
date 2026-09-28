"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, ShieldCheck, QrCode } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#E7E3DB] bg-white py-12 md:py-16 text-xs text-[#5F6B64]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#143D2B] text-white shadow-2xs">
                <Hexagon className="h-5 w-5 fill-[#D97706] stroke-current stroke-[2.2]" />
              </div>
              <span className="font-heading font-extrabold text-[16.5px] tracking-tight text-foreground">
                {t.common.honeyChain}
              </span>
            </Link>
            <p className="text-xs text-[#5F6B64] leading-relaxed">
              {t.footer.description}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3EE] px-3 py-1 text-[10.5px] text-[#143D2B] font-mono font-semibold border border-[#C6DDD0]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t.footer.networkActive}
            </div>
          </div>

          {/* Nav Col 1: Platform Modules */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold text-foreground uppercase tracking-wider text-[11px] block">
              {t.footer.modulesHeading}
            </span>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.apiaries}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.batches}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.custody}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.lab}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.modules.processing}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Consumer & Marketplace */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold text-foreground uppercase tracking-wider text-[11px] block">
              {t.footer.commercialHeading}
            </span>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/verify/HC-BTL-2026-00001" className="text-[#D97706] hover:text-[#B45309] font-semibold flex items-center gap-1.5 transition-colors">
                  <QrCode className="h-3.5 w-3.5" />
                  <span>{t.footer.commercial.verify001}</span>
                </Link>
              </li>
              <li>
                <Link href="/verify/HC-BTL-2026-00002" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.commercial.verify002}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.commercial.marketplace}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.commercial.serialization}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Trust & Governance */}
          <div className="space-y-2.5">
            <span className="font-heading font-bold text-foreground uppercase tracking-wider text-[11px] block">
              {t.footer.governanceHeading}
            </span>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.governance.auditLog}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.governance.orgScoping}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.governance.rbac}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors font-medium">
                  {t.footer.governance.certAuthority}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-[#E7E3DB] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#143D2B]" />
            <span>{t.footer.copyright}</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link href="/login" className="hover:text-foreground transition-colors">
              {t.footer.operatorSignIn}
            </Link>
            <Link href="/verify" className="hover:text-foreground transition-colors">
              {t.footer.consumerPortal}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
