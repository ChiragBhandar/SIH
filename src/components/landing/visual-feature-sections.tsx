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
import { Badge } from "@/components/ui/badge";

export function VisualFeatureSections() {
  return (
    <div className="space-y-16 md:space-y-24 py-16 md:py-24">
      {/* SECTION 1: FIELD OPERATIONS & BATCH TRACEABILITY */}
      <section id="purity" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <Wheat className="h-3.5 w-3.5" />
              <span>Apiaries & Raw Harvest Batches</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Complete Operational Visibility from Yard to Refinery
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Capture every critical field milestone right where it happens. Beekeepers and harvest managers log yard GPS coordinates, hive box inspections, seasonal nectar flows, and precise harvest extractions directly to the Honey Chain digital ledger.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-foreground/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Geofenced apiary coordinates & physical NFC/RFID hive pairing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Refractometer moisture index logging (<strong className="font-semibold text-foreground">&lt; 18.0% standard</strong>)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Tamper-evident raw barrel sealing with unique on-chain identifiers</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="text-xs gap-1.5 h-9">
                <Link href="/login">
                  <span>Explore Apiary Workflows</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* UI Visual Right */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-foreground">APIARY HARVEST LEDGER</span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30">
                  Chamoli Alpine Sector
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-foreground">HC-RAW-2026-0001</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                      Sealed & Verified
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Extracted Net</span>
                      <span className="font-mono font-bold text-foreground">450.0 kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Moisture %</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">17.2%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Flora Origin</span>
                      <span className="font-semibold text-foreground truncate block">Multifloral</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground text-[11px]">
                      GPS: 30.5524° N, 79.5642° E (Uttarakhand, 2400m)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">Box #01–#24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACCREDITED LAB TESTING (REVERSED LAYOUT) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* UI Visual Left */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-950/10 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-emerald-500" />
                  <span className="font-mono text-xs font-bold text-foreground">LABORATORY PURITY CERTIFICATE</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                  Grade A Standard
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">NMR Purity Match</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">99.4%</div>
                  <span className="text-[10px] text-muted-foreground">Passed botanical spectrum</span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">C4 Sugar Adulteration</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">0.8%</div>
                  <span className="text-[10px] text-muted-foreground">Standard limit &lt; 7.0%</span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Hydroxymethyl (HMF)</span>
                  <div className="text-lg font-bold text-foreground font-mono mt-0.5">11.2 mg/kg</div>
                  <span className="text-[10px] text-muted-foreground">Max limit 40 mg/kg</span>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Certificate Ref</span>
                  <div className="text-xs font-bold text-primary font-mono mt-1.5 truncate">CERT-HC-2026-0001</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Cryptographically Signed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Scientific Purity Validation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Defend Brand Integrity with Multi-Param Lab Testing
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Adulteration with rice syrup or corn syrup destroys consumer trust. Honey Chain integrates accredited laboratory testing workflows directly into production batching, permanently attaching immutable test reports to every downstream jar.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-foreground/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Nuclear Magnetic Resonance (NMR) spectroscopic fingerprinting</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Stable carbon isotope ratio analysis (C4 sugar screening)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Accredited Grade A certification issued with non-repudiable digital signatures</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="text-xs gap-1.5 h-9">
                <Link href="/login">
                  <span>View Quality Certification Modules</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONSUMER QR VERIFICATION */}
      <section id="consumer-trust" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <QrCode className="h-3.5 w-3.5" />
              <span>Public Consumer Trust</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Instant Consumer Confidence Built into Every Single Jar
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Shoppers demand transparency. By printing unit-level Honey Chain QR codes on packaging labels, brands provide an instant, frictionless mobile verification experience that reveals full botanical origin, harvest season, and certified lab tests.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-foreground/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Instant smartphone camera lookup with zero mobile app installs required</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>5-stage verified provenance timeline from mountain apiary to shelf</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Sanitized public view protecting sensitive commercial pricing and internal IDs</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button size="sm" asChild className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold h-9 px-4">
                <Link href="/verify/HC-BTL-2026-00001">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                  Test Live Verification Page
                </Link>
              </Button>
            </div>
          </div>

          {/* UI Visual Right */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-card p-5 sm:p-6 shadow-xl space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Official Verification Confirmed
                  </div>
                  <div className="font-bold text-foreground text-sm">
                    Highland Wild Multifloral Raw Honey
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    HC-BTL-2026-00001 (500 g Glass Jar)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase">Origin Region</span>
                  <p className="font-bold text-foreground text-xs mt-0.5">Chamoli, Uttarakhand</p>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase">Purity Standard</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">Grade A (99.4%)</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-background text-center text-xs">
                <Link
                  href="/verify/HC-BTL-2026-00001"
                  className="font-medium text-primary hover:underline flex items-center justify-center gap-1.5"
                >
                  <span>Open Public Consumer Verification Experience</span>
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
