"use client";

import * as React from "react";
import {
  Shield,
  Layers,
  ShoppingBag,
  QrCode,
  FlaskConical,
  Wheat,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FeatureShowcase() {
  return (
    <section id="features" className="py-16 md:py-24 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Core Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for Precision Across Every Supply Chain Role
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Enterprise-grade tooling designed specifically for beekeeper cooperatives, testing laboratories, commercial processors, and consumer brands.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bento Item 1: Large Featured Card (2 Columns) */}
          <Card className="md:col-span-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md flex flex-col justify-between overflow-hidden relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-mono">
                  Full Role Specialization
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono">6 Dedicated Personas</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Role-Based Operational Workspaces
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                Custom-tailored operational consoles built for every actor in the ecosystem — beekeepers registering apiaries, lab technicians certifying purity, collectors signing transfer manifests, and packagers serializing jars.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Wheat className="h-3.5 w-3.5 text-primary" />
                    <span>Beekeeper</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Yard inspections & harvest</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5 text-primary" />
                    <span>Lab Analyst</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">NMR purity & C4 tests</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>Processor</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Blending & batch lineage</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5 text-primary" />
                    <span>Packager</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Bottle QR serialization</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                    <span>Procurement</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">B2B bulk marketplace</p>
                </div>

                <div className="p-2.5 rounded-lg border border-border/80 bg-background/80">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span>Admin</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Audit log & governance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 2: Batch Lineage & Blending */}
          <Card className="border-border bg-card shadow-2xs hover:border-primary/40 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                Batch Lineage & Blending Engine
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                Track complex blending ratios, composite parent lots, and micro-filtration loss with full forward and backward traceability.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs font-mono text-muted-foreground space-y-1">
                <div className="text-foreground font-semibold">HC-PB-2026-0001 (Processed Lot)</div>
                <div className="text-[11px]">← 100% from Raw Lot HC-RAW-2026-0001</div>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 3: B2B Marketplace */}
          <Card className="border-border bg-card shadow-2xs hover:border-primary/40 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                Verified B2B Bulk Marketplace
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                Connect certified honey producers directly with industrial packagers and retailers. Review lab certificates prior to placing orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs flex items-center justify-between">
                <span className="font-semibold text-foreground">Alpine Multifloral (450 kg)</span>
                <Badge variant="outline" className="text-[10px] text-emerald-800 bg-emerald-50 border-emerald-200">
                  Lab Certified
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 4: Unit Bottle Serialization (2 Columns) */}
          <Card className="md:col-span-2 border-border bg-card shadow-2xs hover:border-primary/40 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <QrCode className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Granular QR Identification
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-foreground">
                Unit-Level Serialization & Tamper Controls
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Each packaged bottle is assigned a globally unique serialized identifier and QR code. Packaging runs allow batch publishing, lot recalls, and immediate suspension if QC flags occur.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <div className="font-mono font-semibold text-foreground">HC-BTL-2026-00001</div>
                  <span className="text-[10px] text-emerald-700 font-medium">Published & Active QR</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <div className="font-mono font-semibold text-foreground">HC-BTL-2026-00003</div>
                  <span className="text-[10px] text-muted-foreground">Pre-release Staging</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <div className="font-mono font-semibold text-foreground">HC-BTL-2026-00004</div>
                  <span className="text-[10px] text-amber-700 font-medium">Suspended QC Review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
