"use client";

import * as React from "react";
import {
  Wheat,
  Boxes,
  Truck,
  FlaskConical,
  CheckCircle2,
  QrCode,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WorkflowSection() {
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = [
    {
      id: "step-1",
      number: "01",
      title: "Apiary Registration & Hive Tracking",
      actor: "Beekeeper & Apiary Inspector",
      icon: Wheat,
      shortDesc: "Establish geographic provenance, box identification, and botanical bloom records.",
      details: [
        "GPS coordinates and floral foraging baseline mapping",
        "Physical hive box registration and RFID/NFC pairing",
        "Periodic yard health, queen vigor, and treatment logs",
      ],
      sampleData: {
        code: "AP-HIGH-CHAMOLI-01",
        meta: "Chamoli Alpine Valley • 2,400m Altitude",
        status: "Active Apiary",
      },
    },
    {
      id: "step-2",
      number: "02",
      title: "Harvest Extraction & Raw Batching",
      actor: "Harvest Controller",
      icon: Boxes,
      shortDesc: "Extract raw honey into food-grade containers, verify moisture index, and issue batch serials.",
      details: [
        "Bulk harvest extraction and volume recording in kilograms",
        "Refractometer moisture verification (target < 18.0%)",
        "Tamper-evident container seal numbers generated on-ledger",
      ],
      sampleData: {
        code: "HC-RAW-2026-0001",
        meta: "450.0 kg • 17.2% Moisture • Wild Multifloral",
        status: "Batch Sealed",
      },
    },
    {
      id: "step-3",
      number: "03",
      title: "Custody Handoff & Logistics",
      actor: "Collector & Transport Fleet",
      icon: Truck,
      shortDesc: "Execute cryptographically signed transfer handoffs between field yards and refineries.",
      details: [
        "Dual-party digital signatures verifying sender and receiver",
        "Container seal validation and gross weight reconciliation",
        "Full chain-of-custody transfer history logged immutably",
      ],
      sampleData: {
        code: "TR-2026-0042",
        meta: "Himalayan Logistics Fleet • Truck #UK-07-9921",
        status: "Custody Accepted",
      },
    },
    {
      id: "step-4",
      number: "04",
      title: "Laboratory Testing & Certification",
      actor: "Accredited Testing Laboratory",
      icon: FlaskConical,
      shortDesc: "Conduct rigorous multi-parameter purity analysis to detect adulteration and grade quality.",
      details: [
        "NMR spectroscopy fingerprinting against botanical databases",
        "C4 carbon isotope sugar testing ensuring 100% natural origin",
        "Accredited Grade A certification issued with digital audit signatures",
      ],
      sampleData: {
        code: "CERT-HC-2026-0001",
        meta: "99.4% Purity • C4 Sugar 0.8% • Grade A Verified",
        status: "Certified Authentic",
      },
    },
    {
      id: "step-5",
      number: "05",
      title: "Packaging, Serialization & Consumer Trust",
      actor: "Packager & Retail Consumer",
      icon: QrCode,
      shortDesc: "Package certified honey into retail units with unique QR codes for instant public verification.",
      details: [
        "Micro-filtration & bottling into serialized consumer units",
        "Unique QR code generated for every individual jar",
        "Consumers scan to view complete harvest-to-shelf provenance timeline",
      ],
      sampleData: {
        code: "HC-BTL-2026-00001",
        meta: "500 g Glass Jar • Line 01 Micro-Filler • QR Active",
        status: "Consumer Verified",
      },
    },
  ];

  return (
    <section id="workflow" className="py-16 md:py-24 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Layers className="h-3.5 w-3.5" />
            <span>End-to-End Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            The 5-Stage Verification Journey
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Follow a single drop of honey from high-altitude mountain flora through laboratory purity validation to the consumer breakfast table.
          </p>
        </div>

        {/* Workflow Progression Stepper (Interactive on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Column: Step Selectors (5 steps) */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? "border-primary/50 bg-card shadow-md shadow-primary/5 ring-1 ring-primary/20"
                      : "border-border/70 bg-card/50 hover:bg-card hover:border-border"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono font-bold text-xs transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary">
                        Stage {step.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {step.actor}
                      </span>
                    </div>
                    <div className="font-bold text-foreground text-sm truncate mt-0.5">
                      {step.title}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {step.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Visual Card for Selected Step */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-primary/30 bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
              {/* Subtle top background glow */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Step Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-mono">
                      Stage {steps[activeStep].number} of 05
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Actor: <strong className="text-foreground">{steps[activeStep].actor}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1.5">
                    {steps[activeStep].title}
                  </h3>
                </div>
              </div>

              {/* Step Explanation */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[activeStep].shortDesc}
              </p>

              {/* Verified Checklist */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Stage Verification Controls:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {steps[activeStep].details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground/90"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Ledger Mock Proof Artifact */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Stage Ledger Output:
                  </span>
                  <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-800 bg-emerald-50 font-mono">
                    ✓ {steps[activeStep].sampleData.status}
                  </Badge>
                </div>
                <div className="font-mono text-sm font-bold text-foreground">
                  {steps[activeStep].sampleData.code}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {steps[activeStep].sampleData.meta}
                </div>
              </div>

              {/* Next / Previous Stepper Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer font-medium"
                >
                  ← Previous Stage
                </button>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveStep(dotIdx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeStep === dotIdx ? "w-6 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/40"
                      }`}
                      aria-label={`Go to step ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="text-xs text-primary hover:underline disabled:opacity-30 cursor-pointer font-semibold flex items-center gap-1"
                >
                  Next Stage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
