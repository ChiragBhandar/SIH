"use client";

import * as React from "react";
import Link from "next/link";
import { Hexagon, ArrowRight, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeehiveCluster } from "@/components/landing/beehive-pattern";
import { useLanguage } from "@/context/language-context";

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 border-b border-border/70 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Contained, Integrated Card Design */}
        <div className="relative rounded-3xl border border-[#E7E3DB] bg-white p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Subtle Ambient Decorative Glows & Beehive Pattern */}
          <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-[#D97706]/5 blur-[100px]" />
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-[#143D2B]/4 blur-[90px]" />
            <BeehiveCluster 
              className="absolute -top-12 -right-12 w-[340px] h-[300px]" 
              strokeColor="#E6D3B1"
              strokeWidth={1.4}
              opacity={0.3}
            />
            <BeehiveCluster 
              className="absolute -bottom-16 -left-16 w-[300px] h-[280px]" 
              strokeColor="#E6D3B1"
              strokeWidth={1.4}
              opacity={0.25}
            />
          </div>

          {/* Brand Icon Lockup */}
          <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#143D2B] text-white shadow-sm">
            <Hexagon className="h-7 w-7 fill-[#D97706] stroke-current stroke-[2.2]" />
          </div>

          {/* Headline & Narrative */}
          <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[40px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              {t.finalCta.heading}
            </h2>
            <p className="text-base sm:text-lg text-[#5F6B64] leading-relaxed max-w-2xl mx-auto">
              {t.finalCta.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto h-11 px-7 text-sm font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer group rounded-lg transition-all active:scale-98"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <span>{t.finalCta.signInBtn}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto h-11 px-6 text-sm font-semibold border-[#E7E3DB] bg-white text-foreground hover:bg-[#FAF8F5] cursor-pointer rounded-lg shadow-2xs transition-colors"
            >
              <Link href="/verify" className="flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4 text-[#D97706]" />
                <span>{t.finalCta.verifySampleBtn}</span>
              </Link>
            </Button>
          </div>

          {/* Security & Verification Trust Proof Badges */}
          <div className="relative z-10 pt-6 border-t border-[#E7E3DB] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#5F6B64]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#143D2B]" />
              <span className="font-medium">{t.finalCta.badge1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#143D2B]" />
              <span className="font-medium">{t.finalCta.badge2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#143D2B]" />
              <span className="font-medium">{t.finalCta.badge3}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
