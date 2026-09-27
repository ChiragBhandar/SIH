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
import { BeehiveCluster } from "@/components/landing/beehive-pattern";
import { useLanguage } from "@/context/language-context";

export function FeatureShowcase() {
  const { t } = useLanguage();

  const personaIcons = [
    { icon: Wheat, color: "text-[#D97706]" },
    { icon: FlaskConical, color: "text-[#143D2B]" },
    { icon: Layers, color: "text-[#D97706]" },
    { icon: QrCode, color: "text-[#D97706]" },
    { icon: ShoppingBag, color: "text-[#143D2B]" },
    { icon: Shield, color: "text-[#143D2B]" },
  ];

  return (
    <section id="features" className="py-16 md:py-24 border-b border-border/70 relative overflow-hidden">
      {/* Subtle Ambient Beehive Honeycomb Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <BeehiveCluster 
          className="top-12 -right-16 w-[400px] h-[360px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.4}
          opacity={0.16}
        />
        <BeehiveCluster 
          className="bottom-6 -left-20 w-[350px] h-[320px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.4}
          opacity={0.15}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
            <span>{t.features.badge}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.12]">
            {t.features.heading}
          </h2>
          <p className="text-base text-[#5F6B64] leading-relaxed">
            {t.features.subheading}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bento Item 1: Large Featured Card (2 Columns) */}
          <div className="md:col-span-2 rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between overflow-hidden relative group hover:border-[#D97706]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {t.features.bento1.pill}
                </span>
                <span className="text-[11px] text-[#5F6B64] font-mono font-medium">{t.features.bento1.personasPill}</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                {t.features.bento1.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B64] leading-relaxed pt-2">
                {t.features.bento1.description}
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {t.features.bento1.personas.map((persona, idx) => {
                  const Icon = personaIcons[idx]?.icon || Wheat;
                  const color = personaIcons[idx]?.color || "text-[#D97706]";
                  return (
                    <div key={idx} className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-[#FAF8F5]/80 transition-colors">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span>{persona.title}</span>
                      </div>
                      <p className="text-[11px] text-[#5F6B64] mt-1">{persona.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bento Item 2: Batch Lineage & Blending */}
          <div className="rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-7 shadow-2xs hover:border-[#D97706]/40 transition-colors flex flex-col justify-between group">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] mb-4 transition-transform group-hover:scale-105">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {t.features.bento2.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B64] leading-relaxed pt-2">
                {t.features.bento2.description}
              </p>
            </div>
            <div className="pt-5">
              <div className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] text-xs font-mono text-[#5F6B64] space-y-1">
                <div className="text-foreground font-semibold">{t.features.bento2.lotText}</div>
                <div className="text-[11px] text-[#D97706] font-medium">{t.features.bento2.lineageText}</div>
              </div>
            </div>
          </div>

          {/* Bento Item 3: B2B Marketplace */}
          <div className="rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-7 shadow-2xs hover:border-[#D97706]/40 transition-colors flex flex-col justify-between group">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] mb-4 transition-transform group-hover:scale-105">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                {t.features.bento3.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B64] leading-relaxed pt-2">
                {t.features.bento3.description}
              </p>
            </div>
            <div className="pt-5">
              <div className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] text-xs flex items-center justify-between">
                <span className="font-semibold text-foreground">{t.features.bento3.itemText}</span>
                <span className="text-[10px] font-bold text-[#143D2B] bg-[#EAF3EE] border border-[#C6DDD0] px-2 py-0.5 rounded-full">
                  {t.features.bento3.certifiedBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Unit Bottle Serialization (2 Columns) */}
          <div className="md:col-span-2 rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-8 shadow-2xs hover:border-[#D97706]/40 transition-colors flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] transition-transform group-hover:scale-105">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10.5px] font-semibold text-[#5F6B64] bg-[#FAF8F5] border border-[#E7E3DB] px-2.5 py-1 rounded-md">
                  {t.features.bento4.pill}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {t.features.bento4.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6B64] leading-relaxed pt-2">
                {t.features.bento4.description}
              </p>
            </div>
            <div className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <div className="font-mono font-bold text-foreground text-xs">HC-BTL-2026-00001</div>
                  <span className="text-[10.5px] text-[#143D2B] font-bold block mt-1">{t.features.bento4.stat1}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <div className="font-mono font-bold text-foreground text-xs">HC-BTL-2026-00003</div>
                  <span className="text-[10.5px] text-[#5F6B64] font-medium block mt-1">{t.features.bento4.stat2}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5]">
                  <div className="font-mono font-bold text-foreground text-xs">HC-BTL-2026-00004</div>
                  <span className="text-[10.5px] text-[#B45309] font-bold block mt-1">{t.features.bento4.stat3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
