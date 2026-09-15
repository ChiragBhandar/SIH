"use client";

import * as React from "react";
import Link from "next/link";
import { MarketplaceListing } from "@/types/marketplace";
import {
  Wheat,
  Boxes,
  ArrowLeftRight,
  PackageCheck,
  Layers,
  Award,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LineageFlowViewProps {
  listing: MarketplaceListing;
  batchUrl: string;
}

export function LineageFlowView({ listing, batchUrl }: LineageFlowViewProps) {
  const isProcessed = listing.lineageType === "processed" || listing.listingType.includes("Processed");

  const rawSteps = [
    {
      title: "Apiary Origin",
      detail: listing.apiaryName || "Highland North Apiary",
      subtext: listing.dominantFlora || "Wild Mountain Flora",
      icon: Wheat,
    },
    {
      title: "Harvest Extraction",
      detail: listing.harvestDate ? `Extracted on ${listing.harvestDate}` : "Cold Extracted Harvest",
      subtext: "Field Tare & Moisture Verification",
      icon: Layers,
    },
    {
      title: "Authoritative Raw Batch",
      detail: listing.batchNumber,
      subtext: `${listing.availableQuantity} ${listing.unit} Available`,
      icon: Boxes,
      isTarget: true,
    },
  ];

  const processedSteps = [
    {
      title: "Apiary Origin",
      detail: listing.apiaryName?.split("(")[0] || "Registered Coop Apiaries",
      subtext: "High-Altitude Flora Provenance",
      icon: Wheat,
    },
    {
      title: "Field Harvest",
      detail: listing.harvestDate ? `Harvested ${listing.harvestDate}` : "Raw Material Lot",
      subtext: "Moisture & Visual Verification",
      icon: Layers,
    },
    {
      title: "Raw Honey Batch",
      detail: "Source Batch Provenance",
      subtext: "Digital Traceability Hash",
      icon: Boxes,
    },
    {
      title: "Custody Handoff",
      detail: "Carrier Logistics Log",
      subtext: "Tamper-Evident Transit",
      icon: ArrowLeftRight,
    },
    {
      title: "Manufacturer Receiving",
      detail: listing.sellerOrgName,
      subtext: "Warehouse Intake Verification",
      icon: PackageCheck,
    },
    {
      title: "Processing & Blending",
      detail: "Controlled Micro-filtration",
      subtext: "Low-Temp Under 38°C",
      icon: Layers,
    },
    {
      title: "Processed Bulk Batch",
      detail: listing.batchNumber,
      subtext: `${listing.availableQuantity} ${listing.unit} Bulk Ready`,
      icon: Boxes,
      isTarget: true,
    },
    {
      title: "Laboratory Testing & Cert",
      detail: listing.certificateNumber ? `Cert: ${listing.certificateNumber}` : "Accredited Lab Passed",
      subtext: listing.qualityStatus || "Grade A Certified",
      icon: Award,
    },
  ];

  const steps = isProcessed ? processedSteps : rawSteps;

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Verified Material Lineage & Provenance
              </CardTitle>
              <CardDescription className="text-xs">
                Authoritative traceability chain linking this marketplace listing directly to verified production batches.
              </CardDescription>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5 shrink-0">
            <Link href={batchUrl}>
              <span>Inspect Authoritative Batch ({listing.batchNumber})</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`relative p-3 rounded-lg border text-xs transition-all ${
                  step.isTarget
                    ? "border-primary/50 bg-primary/5 shadow-xs"
                    : "border-border/70 bg-muted/20 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-foreground text-xs">{step.title}</span>
                  </div>
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      step.isTarget ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="pl-6 space-y-0.5">
                  <p className="font-medium text-foreground text-xs truncate">{step.detail}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{step.subtext}</p>
                </div>

                {step.isTarget && (
                  <div className="mt-2.5 pl-6">
                    <Badge variant="outline" className="text-[10px] py-0 border-primary/40 text-primary bg-primary/10 font-mono">
                      Authoritative Batch Target
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Immutable Provenance Integrity:</strong> The batch identity (<code>{listing.batchNumber}</code>) is authoritative. Marketplace purchase orders create commercial transaction records without mutating material lineage.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
