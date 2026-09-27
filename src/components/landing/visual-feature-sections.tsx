"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wheat,
  FlaskConical,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function VisualFeatureSections() {
  const { t } = useLanguage();
  const { section1, section2, section3 } = t.visualFeatures;

  return (
    <div className="space-y-20 md:space-y-28 py-16 md:py-24 border-b border-border/70">
      {/* SECTION 1: FIELD OPERATIONS & BATCH TRACEABILITY */}
      <section id="purity" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
              <Wheat className="h-3.5 w-3.5 text-[#D97706]" />
              <span>{section1.badge}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              {section1.heading}
            </h2>
            <p className="text-base text-[#5F6B64] leading-relaxed">
              {section1.description}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-foreground/85">
              {section1.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#143D2B] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="text-xs font-semibold gap-1.5 h-10 px-4 border-[#E7E3DB] bg-white hover:bg-[#FAF8F5] text-foreground rounded-lg cursor-pointer shadow-2xs">
                <Link href="/login">
                  <span>{section1.signInBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* UI Visual Right */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E3DB] pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-foreground">{section1.ledgerTitle}</span>
                </div>
                <span className="font-mono text-[10.5px] text-[#B45309] font-bold bg-[#FEF6E8] border border-[#FCDDB5] px-2 py-0.5 rounded-full">
                  {section1.sectorTag}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-foreground">HC-RAW-2026-0001</span>
                    <span className="bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {section1.sealedVerified}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-[#5F6B64] block font-medium">{section1.extractedNet}</span>
                      <span className="font-mono font-bold text-foreground">450.0 kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B64] block font-medium">{section1.moisture}</span>
                      <span className="font-mono font-bold text-[#143D2B]">17.2%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5F6B64] block font-medium">{section1.floraOrigin}</span>
                      <span className="font-semibold text-foreground truncate block">{section1.multifloral}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#D97706] shrink-0" />
                    <span className="text-[#5F6B64] text-[11.5px]">
                      GPS: 30.5524° N, 79.5642° E (Uttarakhand, 2400m)
                    </span>
                  </div>
                  <span className="font-mono text-[10.5px] text-[#5F6B64] font-semibold">{section1.boxLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACCREDITED LAB TESTING (REVERSED LAYOUT) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* UI Visual Left */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-[#C6DDD0] bg-white p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E3DB] pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[#143D2B]" />
                  <span className="font-mono text-xs font-bold text-foreground">{section2.cardTitle}</span>
                </div>
                <span className="bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                  {section2.gradeA}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B64] block">{section2.nmrMatch}</span>
                  <div className="font-heading text-xl font-bold text-[#143D2B] font-mono mt-0.5">99.4%</div>
                  <span className="text-[10.5px] text-[#5F6B64]">{section2.passedSpectrum}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B64] block">{section2.c4Screening}</span>
                  <div className="font-heading text-xl font-bold text-[#143D2B] font-mono mt-0.5">0.8%</div>
                  <span className="text-[10.5px] text-[#5F6B64]">{section2.standardLimit}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B64] block">{section2.hmfTitle}</span>
                  <div className="font-heading text-xl font-bold text-foreground font-mono mt-0.5">11.2 mg/kg</div>
                  <span className="text-[10.5px] text-[#5F6B64]">{section2.maxLimit}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B64] block">{section2.certRef}</span>
                  <div className="text-xs font-bold text-[#D97706] font-mono mt-1.5 truncate">CERT-HC-2026-0001</div>
                  <span className="text-[10.5px] text-[#143D2B] font-semibold">{section2.cryptographicallySigned}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C6DDD0] bg-[#EAF3EE] px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
              <FlaskConical className="h-3.5 w-3.5 text-[#143D2B]" />
              <span>{section2.badge}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              {section2.heading}
            </h2>
            <p className="text-base text-[#5F6B64] leading-relaxed">
              {section2.description}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-foreground/85">
              {section2.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#143D2B] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="text-xs font-semibold gap-1.5 h-10 px-4 border-[#E7E3DB] bg-white hover:bg-[#FAF8F5] text-foreground rounded-lg cursor-pointer shadow-2xs">
                <Link href="/login">
                  <span>{section2.signInBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONSUMER QR VERIFICATION */}
      <section id="consumer-trust" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
              <QrCode className="h-3.5 w-3.5 text-[#D97706]" />
              <span>{section3.badge}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              {section3.heading}
            </h2>
            <p className="text-base text-[#5F6B64] leading-relaxed">
              {section3.description}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-foreground/85">
              {section3.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#143D2B] shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button size="sm" asChild className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold h-10 px-5 rounded-lg cursor-pointer shadow-xs">
                <Link href="/verify/HC-BTL-2026-00001">
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  {section3.testLiveBtn}
                </Link>
              </Button>
            </div>
          </div>

          {/* UI Visual Right */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DB] flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#143D2B]">
                    {section3.confirmedVerification}
                  </div>
                  <div className="font-heading font-bold text-foreground text-sm mt-0.5">
                    {section3.honeyName}
                  </div>
                  <span className="font-mono text-[11px] text-[#5F6B64]">
                    {section3.jarLabel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[#E7E3DB] bg-white text-center">
                  <span className="text-[10px] text-[#5F6B64] uppercase font-semibold">{section3.originRegion}</span>
                  <p className="font-heading font-bold text-foreground text-xs mt-1">{section3.location}</p>
                </div>
                <div className="p-3 rounded-xl border border-[#E7E3DB] bg-white text-center">
                  <span className="text-[10px] text-[#5F6B64] uppercase font-semibold">{section3.purityStandard}</span>
                  <p className="font-heading font-bold text-[#143D2B] text-xs mt-1">{section3.purityScore}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] text-center text-xs">
                <Link
                  href="/verify/HC-BTL-2026-00001"
                  className="font-semibold text-[#D97706] hover:text-[#B45309] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{section3.openConsumerLink}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
