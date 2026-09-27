"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, FlaskConical, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface HoneyBottleVisualProps {
  bottleId?: string;
  variety?: string;
  volume?: string;
}

export function HoneyBottleVisual({
  bottleId = "HC-BTL-2026-00001",
  variety,
  volume = "500 g",
}: HoneyBottleVisualProps) {
  const { t, isHindi } = useLanguage();
  const displayVariety = variety || (isHindi ? "प्राकृतिक वन" : "Wild Forest");
  return (
    <div className="relative w-full max-w-[420px] flex flex-col items-center justify-center select-none py-4">
      {/* Background Golden Circle Halo */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] sm:w-[360px] sm:h-[360px] rounded-full pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, #F7E7C6 0%, #FAEFD8 65%, rgba(250, 248, 245, 0) 100%)",
        }}
      />

      {/* Hexagonal Beehive Outlines Behind Bottle (Top Right & Left) */}
      <svg
        className="absolute -top-4 right-0 sm:-right-4 w-52 sm:w-60 h-52 sm:h-60 pointer-events-none -z-10"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#E3CEAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Top Right Beehive Cells matching screenshot */}
          <polygon points="120,15 160,38 160,84 120,107 80,84 80,38" />
          <polygon points="200,61 240,84 240,130 200,153 160,130 160,84" />
          <polygon points="120,107 160,130 160,176 120,199 80,176 80,130" />
          <polygon points="200,153 240,176 240,222 200,245 160,222 160,176" />
        </g>
      </svg>

      {/* The Central Honey Bottle Card Anchor */}
      <Link
        href={`/verify/${bottleId}`}
        className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none"
        aria-label={`Verify Honey Chain Bottle ${bottleId}`}
      >
        {/* Black Fluted Cap */}
        <div 
          className="relative z-20 w-24 sm:w-28 h-10 sm:h-11 rounded-t-lg shadow-sm"
          style={{
            backgroundColor: "#201B18",
            backgroundImage: "repeating-linear-gradient(90deg, #27221E 0px, #27221E 3px, #14110F 3px, #14110F 7px)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          {/* Cap Top Chamfer */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 rounded-t-lg" />
        </div>

        {/* Honey Bottle Body */}
        <div
          className="relative z-10 w-[205px] sm:w-[228px] h-[330px] sm:h-[360px] rounded-[38px] overflow-hidden flex flex-col items-center justify-center p-3 transition-shadow duration-300"
          style={{
            background: "linear-gradient(150deg, #E68A00 0%, #D97706 25%, #B45309 60%, #873800 100%)",
            boxShadow: "0 24px 36px -4px rgba(180, 83, 9, 0.32), 0 8px 16px -2px rgba(0,0,0,0.06)",
          }}
        >
          {/* Bottle Glass Specular Reflection / Left Gloss */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/35 via-white/15 to-transparent" />
          <div className="pointer-events-none absolute top-0 inset-x-8 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/20 to-transparent" />

          {/* Crisp Paper Honey Label */}
          <div className="relative z-10 w-[158px] sm:w-[174px] h-[225px] sm:h-[248px] bg-[#FAF8F3] rounded-[3px] border-2 border-[#143D2B] px-3 py-3.5 flex flex-col items-center justify-between text-center shadow-xs">
            {/* Brand Header */}
            <div>
              <span className="font-sans font-bold text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] text-[#143D2B] block">
                Honey Chain
              </span>
              <div className="w-6 h-[2px] bg-[#D97706] rounded-full mx-auto mt-1 mb-2" />
            </div>

            {/* Variety Title */}
            <div className="my-auto py-1">
              <h3 className="font-heading font-extrabold text-[20px] sm:text-[23px] text-[#143D2B] leading-[1.12] tracking-tight">
                {displayVariety}
              </h3>
              <span className="font-sans font-semibold text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] text-[#143D2B]/80 block mt-1">
                {t.hero.pureIndianHoney}
              </span>
            </div>

            {/* Serialized QR Code Visual */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <div className="p-1 rounded bg-white border border-[#E7E3DB]/80 shadow-2xs group-hover:border-[#143D2B] transition-colors">
                <svg
                  className="w-10 h-10 text-[#143D2B]"
                  viewBox="0 0 36 36"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Top-Left Finder */}
                  <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="5" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
                  
                  {/* Top-Right Finder */}
                  <rect x="24" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="27" y="5" width="4" height="4" rx="0.5" fill="currentColor" />
                  
                  {/* Bottom-Left Finder */}
                  <rect x="2" y="24" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="5" y="27" width="4" height="4" rx="0.5" fill="currentColor" />
                  
                  {/* Data Dots */}
                  <rect x="15" y="4" width="2.5" height="2.5" />
                  <rect x="19" y="4" width="2.5" height="2.5" />
                  <rect x="16" y="9" width="3" height="3" />
                  <rect x="4" y="15" width="3" height="2.5" />
                  <rect x="10" y="16" width="3" height="3" />
                  <rect x="16" y="15" width="4" height="4" rx="1" fill="#D97706" />
                  <rect x="23" y="16" width="3" height="3" />
                  <rect x="29" y="15" width="3" height="3" />
                  <rect x="16" y="22" width="3" height="3" />
                  <rect x="22" y="24" width="3" height="3" />
                  <rect x="28" y="24" width="4" height="3" />
                  <rect x="24" y="30" width="3" height="3" />
                  <rect x="30" y="29" width="3" height="3" />
                </svg>
              </div>

              {/* Volume / Weight */}
              <span className="font-sans font-bold text-[11px] sm:text-[11.5px] text-[#143D2B]">
                {volume}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Floating Badge 1 (Left): Wild Forest */}
      <div className="absolute left-0 sm:-left-3 top-[26%] z-30 flex flex-col items-start">
        <div className="rounded-xl border border-[#E7E3DB] bg-white px-3.5 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2">
          <Leaf className="h-4 w-4 text-[#143D2B]" />
          <span className="text-xs font-bold text-[#143D2B] tracking-tight">{t.hero.wildForest}</span>
        </div>
        {/* Small Decorative Honey Amber Diamond */}
        <div className="w-2.5 h-2.5 border-1.5 border-[#D97706] rotate-45 ml-5 mt-2 opacity-80" />
      </div>

      {/* Floating Badge 2 (Right): Lab Tested */}
      <div className="absolute right-0 sm:-right-4 top-[44%] z-30">
        <div className="rounded-xl border border-[#E7E3DB] bg-white px-3.5 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-[#143D2B]" />
          <span className="text-xs font-bold text-[#143D2B] tracking-tight">{t.hero.labTested}</span>
        </div>
      </div>

      {/* Floating Seal (Bottom Right): VERIFIED 5-stage Provenance */}
      <Link
        href={`/verify/${bottleId}`}
        className="group absolute -right-2 sm:-right-5 bottom-2 sm:bottom-4 z-30 w-25 h-25 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(180,83,9,0.22)]"
        style={{
          background: "linear-gradient(135deg, #FBE8BE 0%, #F5D78B 50%, #E7C267 100%)",
          border: "1px solid #DFBE65",
        }}
        title={`${t.hero.verifiedSeal} • ${t.hero.provenanceSubtext}`}
      >
        {/* Stitched Dashed Ring */}
        <div className="pointer-events-none absolute inset-1 sm:inset-1.5 rounded-full border-[1.5px] border-dashed border-[#A4761C]/65" />
        
        <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#143D2B] mb-0.5" />
        <span className="font-heading font-extrabold text-[11px] sm:text-[11.5px] uppercase tracking-wider text-[#143D2B] leading-none block">
          {t.hero.verifiedSeal}
        </span>
        <span className="text-[8px] sm:text-[8.5px] font-semibold text-[#5B4210] tracking-tight mt-0.5 block leading-tight">
          {t.hero.provenanceSubtext}
        </span>
      </Link>

      {/* Interactive Micro-Cue Underneath */}
      <div className="mt-4 pt-1 flex items-center gap-1.5 text-[11.5px] text-[#5F6B64]">
        <span>{t.hero.liveVerifiedSample}</span>
        <Link
          href={`/verify/${bottleId}`}
          className="font-mono font-semibold text-[#B45309] hover:underline inline-flex items-center gap-0.5"
        >
          {bottleId}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
