"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wheat,
  Activity,
  FlaskConical,
  Award,
  CheckCircle2,
  Sparkles,
  QrCode,
  ArrowRight,
  Check,
  Truck,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeehiveCluster, BeehiveBackground } from "@/components/landing/beehive-pattern";
import { useLanguage } from "@/context/language-context";

export function ProductShowcase() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "lab" | "custody" | "verify">("dashboard");

  return (
    <section id="overview" className="py-16 md:py-24 border-b border-border/70 relative overflow-hidden">
      {/* Subtle Beehive Honeycomb Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <BeehiveBackground 
          className="-top-12 -right-20 w-[600px] h-[480px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.3}
          opacity={0.16}
        />
        <BeehiveCluster 
          className="bottom-4 -left-16 w-[360px] h-[340px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.4}
          opacity={0.18}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
            <span>{t.showcase.badge}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.12]">
            {t.showcase.heading}
          </h2>
          <p className="text-base text-[#5F6B64] leading-relaxed">
            {t.showcase.subheading}
          </p>

          {/* Small Feature Segmented Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "bg-white border border-[#E7E3DB] text-[#5F6B64] hover:text-foreground hover:bg-[#FAF8F5]"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{t.showcase.tabs.dashboard}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("lab")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "lab"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "bg-white border border-[#E7E3DB] text-[#5F6B64] hover:text-foreground hover:bg-[#FAF8F5]"
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{t.showcase.tabs.lab}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custody")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "custody"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "bg-white border border-[#E7E3DB] text-[#5F6B64] hover:text-foreground hover:bg-[#FAF8F5]"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{t.showcase.tabs.custody}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("verify")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "verify"
                  ? "bg-[#D97706] text-white shadow-xs"
                  : "bg-white border border-[#E7E3DB] text-[#5F6B64] hover:text-foreground hover:bg-[#FAF8F5]"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>{t.showcase.tabs.verify}</span>
            </button>
          </div>
        </div>

        {/* Polished Product Preview Window */}
        <div className="relative rounded-2xl border border-[#E7E3DB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden max-w-5xl mx-auto">
          {/* Top Window Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E7E3DB] bg-[#FAF8F5] text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-[#5F6B64] pl-2 hidden sm:inline">
                honeychain.io/
                {activeTab === "dashboard"
                  ? "dashboard"
                  : activeTab === "lab"
                  ? "certifications/CERT-HC-2026-0001"
                  : activeTab === "custody"
                  ? "transfers/TR-2026-0042"
                  : "verify/HC-BTL-2026-00001"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.showcase.ledgerConnected}
              </span>
              <Button size="sm" variant="ghost" asChild className="h-7 text-[11px] px-2 text-[#D97706] hover:text-[#B45309] font-semibold">
                <Link href="/login">{t.showcase.signInArrow}</Link>
              </Button>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="p-5 sm:p-7 md:p-8 bg-[#FAF8F5]/50">
            {/* VIEW 1: OPERATIONAL DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                {/* Feature Context Banner: Role-based Access Simplified */}
                <div className="bg-white rounded-xl border border-[#E7E3DB] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-foreground text-sm sm:text-base">
                        {t.showcase.dashboard.title}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] px-2 py-0.5 rounded-full">
                        {t.showcase.dashboard.rbacActive}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F6B64] mt-1">
                      {t.showcase.dashboard.description}
                    </p>
                  </div>

                  {/* Flow Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-medium">
                    <span className="bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] px-2 py-1 rounded-md flex items-center gap-1">
                      <Wheat className="h-3 w-3" /> {t.showcase.dashboard.roles.beekeeper}
                    </span>
                    <span className="text-[#5F6B64]">→</span>
                    <span className="bg-white text-foreground border border-[#E7E3DB] px-2 py-1 rounded-md">{t.showcase.dashboard.roles.collector}</span>
                    <span className="text-[#5F6B64]">→</span>
                    <span className="bg-white text-foreground border border-[#E7E3DB] px-2 py-1 rounded-md">{t.showcase.dashboard.roles.lab}</span>
                    <span className="text-[#5F6B64]">→</span>
                    <span className="bg-white text-foreground border border-[#E7E3DB] px-2 py-1 rounded-md">{t.showcase.dashboard.roles.packager}</span>
                  </div>
                </div>

                {/* Active Harvest Batch Showcase Card */}
                <div className="bg-white rounded-xl border border-[#E7E3DB] p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E7E3DB] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-[#FEF6E8] text-[#B45309] flex items-center justify-center font-bold">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                          <span>HC-RAW-2026-0001</span>
                          <span className="font-sans text-[10px] font-bold bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] px-2 py-0.5 rounded-full">
                            {t.showcase.dashboard.sealedVerified}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5F6B64]">
                          {t.showcase.dashboard.coopLocation}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-[#E7E3DB]" asChild>
                      <Link href="/login">{t.showcase.dashboard.signInToView}</Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E7E3DB]">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-mono block">{t.showcase.dashboard.extractedNet}</span>
                      <span className="font-mono font-bold text-foreground text-sm">450.0 kg</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E7E3DB]">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-mono block">{t.showcase.dashboard.moistureIndex}</span>
                      <span className="font-mono font-bold text-[#143D2B] text-sm">{t.showcase.dashboard.moisturePassed}</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E7E3DB]">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-mono block">{t.showcase.dashboard.floralOrigin}</span>
                      <span className="font-semibold text-foreground text-xs mt-0.5 block">{t.showcase.dashboard.wildMultifloral}</span>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border border-[#E7E3DB]">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-mono block">{t.showcase.dashboard.ledgerState}</span>
                      <span className="font-semibold text-[#143D2B] text-xs mt-0.5 block">{t.showcase.dashboard.cryptographicallySealed}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: LAB TESTING & CERTIFICATION */}
            {activeTab === "lab" && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-xl border border-[#C6DDD0] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0]">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{t.showcase.lab.certificateTitle}</span>
                        <span className="bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {t.showcase.lab.gradeA}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#5F6B64]">{t.showcase.lab.issuedBy}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-[10.5px] border border-[#C6DDD0] text-[#143D2B] bg-[#EAF3EE] px-2.5 py-1 rounded-full font-semibold self-start sm:self-auto">
                    <CheckCircle2 className="h-3 w-3" /> {t.showcase.lab.validSignature}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-white text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#5F6B64]">{t.showcase.lab.nmrIndex}</span>
                    <div className="text-lg font-bold text-[#143D2B] font-mono">99.4%</div>
                    <span className="text-[10px] text-[#5F6B64]">{t.showcase.lab.nmrDesc}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-white text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#5F6B64]">{t.showcase.lab.c4Analysis}</span>
                    <div className="text-lg font-bold text-[#143D2B] font-mono">0.8%</div>
                    <span className="text-[10px] text-[#5F6B64]">{t.showcase.lab.c4Passed}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-white text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#5F6B64]">{t.showcase.lab.hmrFreshness}</span>
                    <div className="text-lg font-bold text-foreground font-mono">11.2 mg/kg</div>
                    <span className="text-[10px] text-[#5F6B64]">{t.showcase.lab.hmrStandard}</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E7E3DB] bg-white text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#5F6B64]">{t.showcase.lab.pollenDensity}</span>
                    <div className="text-lg font-bold text-foreground font-mono">88.5% Wild</div>
                    <span className="text-[10px] text-[#5F6B64]">{t.showcase.lab.pollenSpec}</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: CUSTODY TRANSFERS */}
            {activeTab === "custody" && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-xl border border-[#E7E3DB] p-4 sm:p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#E7E3DB] pb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#D97706]" />
                      <span className="text-xs font-bold text-foreground">{t.showcase.custody.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#143D2B] font-semibold bg-[#EAF3EE] px-2 py-0.5 rounded-full border border-[#C6DDD0]">
                      {t.showcase.custody.dualSigned}
                    </span>
                  </div>

                  <div className="relative border-l-2 border-[#E7E3DB] ml-4 pl-6 space-y-4 py-2 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5]">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{t.showcase.custody.step1Title}</span>
                        <span className="text-[10px] font-mono text-[#5F6B64]">2026-09-14 09:30</span>
                      </div>
                      <p className="text-[#5F6B64] text-[11px]">
                        {t.showcase.custody.step1Desc}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5]">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{t.showcase.custody.step2Title}</span>
                        <span className="text-[10px] font-mono text-[#5F6B64]">2026-09-14 13:45</span>
                      </div>
                      <p className="text-[#5F6B64] text-[11px]">
                        {t.showcase.custody.step2Desc}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0]">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{t.showcase.custody.step3Title}</span>
                        <span className="text-[10px] font-mono text-[#143D2B] font-semibold">{t.showcase.custody.step3Accepted}</span>
                      </div>
                      <p className="text-[#5F6B64] text-[11px]">
                        {t.showcase.custody.step3Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: CONSUMER QR VERIFICATION */}
            {activeTab === "verify" && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="bg-white rounded-xl border border-[#C6DDD0] p-4 sm:p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E3DB] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#EAF3EE] border border-[#C6DDD0] text-[#143D2B]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-foreground">
                            {t.showcase.verifyPreview.productTitle}
                          </span>
                          <span className="bg-[#EAF3EE] text-[#143D2B] border border-[#C6DDD0] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t.showcase.verifyPreview.verifiedAuthentic}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-[#5F6B64]">
                          {t.showcase.verifyPreview.bottleSerial}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold h-8 rounded-lg" asChild>
                      <Link href="/verify/HC-BTL-2026-00001">
                        {t.showcase.verifyPreview.openFullPage} <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg border border-[#E7E3DB] bg-[#FAF8F5] text-center">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-medium">{t.showcase.verifyPreview.botanicalOrigin}</span>
                      <p className="font-bold text-foreground mt-0.5">{t.showcase.verifyPreview.originLocation}</p>
                      <span className="text-[10px] text-[#143D2B] font-medium">{t.showcase.verifyPreview.alpineFlora}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#E7E3DB] bg-[#FAF8F5] text-center">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-medium">{t.showcase.verifyPreview.harvestSeason}</span>
                      <p className="font-bold text-foreground mt-0.5">{t.showcase.verifyPreview.harvestMonth}</p>
                      <span className="text-[10px] text-[#5F6B64]">{t.showcase.verifyPreview.autumnExtraction}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#E7E3DB] bg-[#FAF8F5] text-center">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-medium">{t.showcase.verifyPreview.labPurity}</span>
                      <p className="font-bold text-[#143D2B] mt-0.5">{t.showcase.verifyPreview.purityScore}</p>
                      <span className="text-[10px] text-[#5F6B64]">{t.showcase.verifyPreview.nmrSpectroscopy}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#E7E3DB] bg-[#FAF8F5] text-center">
                      <span className="text-[10px] text-[#5F6B64] uppercase font-medium">{t.showcase.verifyPreview.tamperStatus}</span>
                      <p className="font-bold text-foreground mt-0.5">{t.showcase.verifyPreview.activeSealed}</p>
                      <span className="text-[10px] text-[#143D2B] font-medium">QR-HC-00001</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
