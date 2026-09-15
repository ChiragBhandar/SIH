"use client";

import * as React from "react";
import {
  ShieldCheck,
  Wheat,
  FlaskConical,
  Truck,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ValueProposition() {
  const values = [
    {
      number: "01",
      title: "Hive-to-Bottle Traceability",
      description:
        "Establish unambiguous origin provenance with GPS-anchored apiary registrations, box RFID pairing, and field harvest records that follow raw honey across every processing step.",
      icon: Wheat,
      bulletPoints: [
        "Geofenced apiary coordinates & box registration",
        "Field inspection & floral foraging bloom logs",
        "Raw harvest lot extraction & bulk container tracking",
      ],
    },
    {
      number: "02",
      title: "Accredited Lab Purity Governance",
      description:
        "Protect brand integrity and eliminate sugar adulteration risks by digitally attaching multi-parameter laboratory purity panels directly to harvest and blended batches.",
      icon: FlaskConical,
      bulletPoints: [
        "NMR spectroscopy & C4 sugar adulteration tests",
        "Moisture index & HMF freshness parameter checks",
        "Accredited Grade A digital certificates with cryptographic hashes",
      ],
    },
    {
      number: "03",
      title: "Verifiable Chain of Custody",
      description:
        "Replace fragmented paper receipts with multi-party digital handoffs. Transfer batches seamlessly between beekeepers, collectors, testing laboratories, and packagers.",
      icon: Truck,
      bulletPoints: [
        "Dual-party digital signature handoffs",
        "Container tamper-seal verification codes",
        "Automatic weight reconciliation & carrier logging",
      ],
    },
    {
      number: "04",
      title: "Direct-to-Consumer Trust Engine",
      description:
        "Empower shoppers to verify authenticity in seconds. Scanning unit-level QR codes reveals authentic origin maps, harvest dates, and accredited laboratory certificates.",
      icon: QrCode,
      bulletPoints: [
        "Individual unit-level bottle serialization",
        "Public registry verification portal without app downloads",
        "Active tamper-alert and suspension controls",
      ],
    },
  ];

  return (
    <section id="values" className="py-16 md:py-24 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Why Honey Chain</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Everything Your Honey Supply Chain Needs, Connected in One Place
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Eliminate operational blind spots, combat adulteration, and provide unshakeable proof of quality from remote mountain apiaries to supermarket shelves.
          </p>
        </div>

        {/* 4 Value Proposition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <Card
                key={val.number}
                className="relative overflow-hidden border-border/80 bg-card/70 hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground/60 bg-muted/60 px-2.5 py-1 rounded-md">
                      {val.number}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {val.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {val.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="border-t border-border/60 pt-3.5 space-y-2">
                    {val.bulletPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-[12px]">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
