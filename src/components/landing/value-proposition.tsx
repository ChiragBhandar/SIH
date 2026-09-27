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
import { useLanguage } from "@/context/language-context";

export function ValueProposition() {
  const { t } = useLanguage();

  const valueIcons = [Wheat, FlaskConical, Truck, QrCode];

  return (
    <section id="values" className="py-16 md:py-24 border-b border-border/70 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D97706]" />
            <span>{t.values.badge}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.12]">
            {t.values.heading}
          </h2>
          <p className="text-base text-[#5F6B64] leading-relaxed">
            {t.values.subheading}
          </p>
        </div>

        {/* 4 Value Proposition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {t.values.items.map((val, idx) => {
            const Icon = valueIcons[idx] || Wheat;
            return (
              <div
                key={val.number}
                className="group relative rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-7 hover:border-[#D97706]/40 transition-all duration-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] transition-transform group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-2xl font-extrabold text-[#D97706]/40 font-mono">
                      {val.number}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6B64] leading-relaxed pt-1.5">
                    {val.description}
                  </p>
                </div>

                <div className="border-t border-[#E7E3DB] pt-4 mt-5 space-y-2">
                  {val.bulletPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-foreground/85">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#143D2B] shrink-0 mt-0.5" />
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
