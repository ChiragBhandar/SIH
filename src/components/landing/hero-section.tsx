"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Hexagon,
  FileCheck2,
  Layers,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  Wheat,
  FlaskConical,
  Award,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthSession } from "@/context/auth-session-context";

export function HeroSection() {
  const router = useRouter();
  const { isAuthenticated, hasSelectedOrg, hasSelectedRole } = useAuthSession();
  const [bottleLookup, setBottleLookup] = React.useState("");

  const appEntryHref = isAuthenticated
    ? hasSelectedOrg && hasSelectedRole
      ? "/dashboard"
      : "/select-organisation"
    : "/login";

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = bottleLookup.trim() || "HC-BTL-2026-00001";
    router.push(`/verify/${targetId}`);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-border/60">
      {/* Background Subtle Warm Gradient & Light Decorative Canvas */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[520px] w-[800px] rounded-full bg-primary/6 blur-[140px] opacity-70" />
        <div className="absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Balanced 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="uppercase font-mono text-[11px] tracking-wider text-muted-foreground">
                Digital Traceability • Verified Provenance
              </span>
            </div>

            {/* Headline with single gold accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              From Hive to Bottle,{" "}
              <span className="text-primary">
                Verified Every Step.
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Connect origin, harvest, quality certification, custody, and consumer verification in one trusted traceability platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                size="lg"
                asChild
                className="h-11 px-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer group rounded-lg"
              >
                <Link href={appEntryHref} className="flex items-center justify-center gap-2">
                  <span>Open Operational Workspace</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 px-5 text-sm font-medium border-border/90 bg-card text-foreground hover:bg-muted cursor-pointer rounded-lg"
              >
                <a href="#workflow" className="flex items-center justify-center gap-1.5">
                  <span>Explore the Workflow</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </Button>
            </div>

            {/* Compact Quick Verification Lookup */}
            <div className="pt-3 max-w-xl">
              <div className="rounded-xl border border-border bg-card p-2 sm:p-2.5 shadow-xs">
                <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={bottleLookup}
                      onChange={(e) => setBottleLookup(e.target.value)}
                      placeholder="Enter bottle code (e.g. HC-BTL-2026-00001)"
                      className="h-9 pl-10 pr-3 text-xs bg-background/70 border-border/80 font-mono text-foreground"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-9 px-4 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs shrink-0 cursor-pointer rounded-md"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    Verify Bottle
                  </Button>
                </form>

                {/* Sample Bottle Chips */}
                <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-medium">Sample Verified Bottles:</span>
                  <button
                    type="button"
                    onClick={() => router.push("/verify/HC-BTL-2026-00001")}
                    className="font-mono text-primary hover:text-primary-foreground hover:bg-primary transition-colors bg-primary/10 px-2 py-0.5 rounded border border-primary/20 cursor-pointer text-[10px] font-semibold"
                  >
                    HC-BTL-2026-00001
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/verify/HC-BTL-2026-00002")}
                    className="font-mono text-primary hover:text-primary-foreground hover:bg-primary transition-colors bg-primary/10 px-2 py-0.5 rounded border border-primary/20 cursor-pointer text-[10px] font-semibold"
                  >
                    HC-BTL-2026-00002
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Traceability Workflow Visualization */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl shadow-primary/5 space-y-4">
              {/* Product Visual Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Honey Chain Traceability Record
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Digital Product Passport
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              </div>

              {/* Bottle Meta Line */}
              <div className="flex items-center justify-between bg-muted/40 rounded-lg p-2.5 border border-border/70 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono block">Bottle Identity</span>
                  <span className="font-mono font-bold text-foreground">HC-BTL-2026-00001</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono block">Variety</span>
                  <span className="font-medium text-foreground">Himalayan Multifloral</span>
                </div>
              </div>

              {/* Step-by-Step Verified Progression */}
              <div className="space-y-2.5 text-xs">
                {/* 1. Origin */}
                <div className="flex items-start gap-3 p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/30 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-primary mt-0.5">
                    <Wheat className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">1. Apiary Origin</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Reg #042</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">High Altitude Himalayan Region • 100% Wild Flora</p>
                  </div>
                </div>

                {/* 2. Harvest */}
                <div className="flex items-start gap-3 p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/30 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-primary mt-0.5">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">2. Harvest & Processing</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Sep 2026</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Batch #LOT-2026-HIM-01 • Raw Unpasteurized</p>
                  </div>
                </div>

                {/* 3. Quality Testing */}
                <div className="flex items-start gap-3 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 mt-0.5">
                    <FlaskConical className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">3. Laboratory Testing</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.2 rounded">PASSED</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">NMR Spectroscopy • C4 Sugar Panel Passed</p>
                  </div>
                </div>

                {/* 4. Certification */}
                <div className="flex items-start gap-3 p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/30 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-primary mt-0.5">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">4. Quality Certification</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold">CERT-HC-2026-0001</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Grade A Standard • ISO/IEC 17025 Laboratory</p>
                  </div>
                </div>

                {/* 5. Consumer Verification */}
                <div className="flex items-start gap-3 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 mt-0.5">
                    <PackageCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground text-xs">5. Consumer Verification</span>
                      <span className="text-[10px] font-bold text-emerald-600">✓ VERIFIED</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">QR Serialized Retail Unit • Tamper Evident</p>
                  </div>
                </div>
              </div>

              {/* Link into Verification Screen */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs font-semibold h-9 border-border/80 bg-background hover:bg-muted text-foreground cursor-pointer rounded-lg"
                >
                  <Link href="/verify/HC-BTL-2026-00001" className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>View Public Verification Passport</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Highlights Strip */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 shadow-2xs hover:border-primary/30 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">100% Provenance Lineage</div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Immutable batch lineage from registered mountain apiaries.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 shadow-2xs hover:border-primary/30 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Accredited Lab Panels</div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                NMR spectroscopy, C4 sugar analysis & purity certification.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 shadow-2xs hover:border-primary/30 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Multi-Party Custody</div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Digital transfer handoffs with cryptographically signed logs.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 shadow-2xs hover:border-primary/30 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Unit Serialization</div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Tamper-evident QR codes giving consumers immediate trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
