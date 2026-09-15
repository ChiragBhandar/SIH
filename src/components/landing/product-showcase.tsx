"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Shield,
  Wheat,
  Boxes,
  Activity,
  FlaskConical,
  Award,
  CheckCircle2,
  Sparkles,
  QrCode,
  ArrowRight,
  Check,
  FileText,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "lab" | "custody" | "verify">("dashboard");

  return (
    <section id="overview" className="py-16 md:py-24 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Platform Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            A Purpose-Built Operating System for Honey Traceability
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Experience how Honey Chain connects every link of the supply chain with unified role workspaces, tamper-evident audit trails, and automated quality governance.
          </p>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Operational Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("lab")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "lab"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Lab Testing & Certs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custody")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "custody"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Custody Transfers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("verify")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "verify"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Consumer QR Trust</span>
            </button>
          </div>
        </div>

        {/* Product Showcase Window */}
        <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/40 backdrop-blur-xs text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground pl-2 hidden sm:inline">
                honeychain.internal.io/
                {activeTab === "dashboard"
                  ? "dashboard"
                  : activeTab === "lab"
                  ? "lab/certifications/CERT-HC-2026-0001"
                  : activeTab === "custody"
                  ? "custody/transfers/TR-2026-0042"
                  : "verify/HC-BTL-2026-00001"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono py-0 px-2 gap-1 border-primary/30 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ledger Connected
              </Badge>
              <Button size="sm" variant="ghost" asChild className="h-7 text-[11px] px-2 text-primary hover:text-primary/80">
                <Link href="/login">Launch Live →</Link>
              </Button>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-[460px]">
            {/* VIEW 1: OPERATIONAL DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Org & Role Proof Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-primary/20 bg-card p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        Active Organisation
                      </span>
                      <span className="text-[11px] text-primary font-mono font-medium">ORG-HAC-01</span>
                    </div>
                    <div className="font-bold text-foreground text-sm">Highland Apiaries Cooperative</div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Chamoli Alpine Sector • 48 Registered Hives • Organic Forest Certified
                    </p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-card p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        Authenticated Role
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">RBAC Full Access</span>
                    </div>
                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      <Wheat className="h-4 w-4 text-primary" />
                      Lead Beekeeper & Harvest Controller
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Authorized for batch seal creation, moisture testing & custody handoffs.
                    </p>
                  </div>
                </div>

                {/* Live Harvest Batches In Progress */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Boxes className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Active Harvest Batches in Pipeline</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">3 Lots Active</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-border/80 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">HC-RAW-2026-0001</span>
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] py-0">
                            Lab Certified
                          </Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Wild Multifloral • 450.0 kg • Chamoli Valley Box #01–#24
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-foreground">17.2% Moisture</div>
                          <div className="text-[10px] text-emerald-700 font-medium">Refractometer Passed</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs font-medium" asChild>
                          <Link href="/login">View Lot</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border/80 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">HC-RAW-2026-0002</span>
                          <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] py-0">
                            In Transit (Custody)
                          </Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Acacia Monofloral • 280.0 kg • Solan Apiary Yard
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-foreground">16.8% Moisture</div>
                          <div className="text-[10px] text-amber-700 font-medium">Carrier Transferred</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs font-medium" asChild>
                          <Link href="/login">Track</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: LAB TESTING & CERTIFICATION */}
            {activeTab === "lab" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">Accredited Quality Certificate</span>
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                          Grade A Standard
                        </Badge>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">CERT-HC-2026-0001 • Issued by Apex Purity Labs</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-emerald-200 text-emerald-800 bg-emerald-50 self-start sm:self-auto">
                    Cryptographic Signature Valid
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">NMR Purity Index</span>
                    <div className="text-base font-bold text-emerald-700 font-mono">99.4%</div>
                    <span className="text-[10px] text-muted-foreground">Pure Blossom Origin</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">C4 Sugar Analysis</span>
                    <div className="text-base font-bold text-emerald-700 font-mono">0.8%</div>
                    <span className="text-[10px] text-muted-foreground">Target &lt; 7.0% (Passed)</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">HMF (Hydroxymethyl)</span>
                    <div className="text-base font-bold text-emerald-700 font-mono">11.2 mg/kg</div>
                    <span className="text-[10px] text-muted-foreground">Target &lt; 40 mg/kg</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Pollen Density</span>
                    <div className="text-base font-bold text-emerald-700 font-mono">88.5% Wild</div>
                    <span className="text-[10px] text-muted-foreground">Himalayan Flora Spec</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      Laboratory test records are automatically attached to downstream packaging runs.
                    </span>
                  </div>
                  <span className="text-primary font-medium">Ready for Serialization</span>
                </div>
              </div>
            )}

            {/* VIEW 3: CUSTODY TRANSFERS */}
            {activeTab === "custody" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">Verified Chain-of-Custody Handoff</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">Dual-Party Signed</span>
                  </div>

                  <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-4 py-2 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 p-1 rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Release from Apiary Yard</span>
                        <span className="text-[10px] font-mono text-muted-foreground">2026-09-14 09:30</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Dispatched by Highland Apiaries Co-op (Operator: Rajesh Sharma). Seal #SL-8831 verified.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 p-1 rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Transit via Himalayan Logistics Fleet</span>
                        <span className="text-[10px] font-mono text-muted-foreground">2026-09-14 13:45</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Temperature controlled vehicle #UK-07-TA-9921. GPS route logged continuously.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 p-1 rounded-full bg-emerald-600 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Receipt & Verification at Packaging Facility</span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">Accepted</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Golden Hive Packaging Line 1 (Solan). Weight reconciled: 450.0 kg exact match.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: CONSUMER QR VERIFICATION */}
            {activeTab === "verify" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-foreground">
                            Highland Wild Multifloral Raw Honey
                          </span>
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                            Verified Authentic
                          </Badge>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          Bottle Serial: HC-BTL-2026-00001 • 500 g Glass Jar
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold" asChild>
                      <Link href="/verify/HC-BTL-2026-00001">
                        Open Full Consumer Page <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-border bg-card text-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Botanical Origin</span>
                      <p className="font-bold text-foreground mt-0.5">Chamoli, Uttarakhand</p>
                      <span className="text-[10px] text-emerald-700 font-medium">Alpine Wild Flora</span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card text-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Harvest Season</span>
                      <p className="font-bold text-foreground mt-0.5">September 2026</p>
                      <span className="text-[10px] text-muted-foreground">Autumn Extraction</span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card text-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Laboratory Purity</span>
                      <p className="font-bold text-emerald-700 mt-0.5">Grade A (99.4%)</p>
                      <span className="text-[10px] text-muted-foreground">NMR Spectroscopy</span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card text-center">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Tamper Status</span>
                      <p className="font-bold text-foreground mt-0.5">Active & Sealed</p>
                      <span className="text-[10px] text-emerald-700 font-medium">QR-HC-00001</span>
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
