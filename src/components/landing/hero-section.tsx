"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoneyBottleVisual } from "@/components/landing/honey-bottle-visual";
import { BeehiveCluster } from "@/components/landing/beehive-pattern";
import { useLanguage } from "@/context/language-context";
import { normalizeBottleId } from "@/data/mock-bottles";

export function HeroSection() {
  const router = useRouter();
  const { t, isHindi } = useLanguage();
  const [bottleLookup, setBottleLookup] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const normalizedPreview = React.useMemo(() => {
    if (!bottleLookup.trim()) return "";
    return normalizeBottleId(bottleLookup);
  }, [bottleLookup]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = bottleLookup.trim();
    if (!clean) {
      setErrorMsg(
        isHindi
          ? "कृपया बोतल कोड दर्ज करें (उदा. HC-BTL-2026-00001) या नीचे दिए गए नमूने पर क्लिक करें।"
          : "Please enter a bottle code (e.g. HC-BTL-2026-00001) or click a sample bottle below."
      );
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    const targetId = normalizeBottleId(clean);
    router.push(`/verify/${encodeURIComponent(targetId)}`);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-22 border-b border-border/70">
      {/* Background Subtle Warm Gradient & Light Honeycomb Motif */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#D97706]/5 blur-[140px]" />
        <div className="absolute -top-12 -right-12 h-96 w-96 rounded-full bg-[#143D2B]/4 blur-[120px]" />
        
        {/* Subtle decorative geometric honeycomb pattern */}
        <BeehiveCluster 
          className="absolute -top-10 -right-8 w-[380px] h-[360px]" 
          strokeColor="#E4D2B2"
          strokeWidth={1.5}
          opacity={0.35}
        />
        <BeehiveCluster 
          className="absolute -bottom-16 -left-20 w-[320px] h-[300px]" 
          strokeColor="#E4D2B2"
          strokeWidth={1.4}
          opacity={0.2}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Balanced 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-5 text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 w-fit shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-[#143D2B]" />
              <span className="uppercase font-mono text-[10.5px] tracking-wider text-[#143D2B] font-bold">
                {t.hero.eyebrow}
              </span>
            </div>

            {/* Headline with single accent */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-foreground leading-[1.12]">
              {t.hero.titleStart}
              <span className="text-[#143D2B] block sm:inline">
                {t.hero.titleAccent}
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-[#5F6B64] max-w-xl leading-relaxed">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button
                size="lg"
                asChild
                className="h-11 px-6 text-sm font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer group rounded-lg transition-all active:scale-98"
              >
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <span>{t.hero.signInBtn}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 px-5 text-sm font-semibold border-[#E7E3DB] bg-white text-foreground hover:bg-[#FAF8F5] cursor-pointer rounded-lg shadow-2xs"
              >
                <a href="#workflow" className="flex items-center justify-center gap-1.5">
                  <span>{t.hero.exploreWorkflowBtn}</span>
                  <ChevronRight className="h-4 w-4 text-[#5F6B64]" />
                </a>
              </Button>
            </div>

            {/* Compact Quick Verification Lookup */}
            <div className="pt-2 max-w-xl">
              <div className="rounded-xl border border-[#E7E3DB] bg-white p-3 sm:p-3.5 shadow-2xs space-y-2">
                <form onSubmit={handleVerifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F6B64]" />
                    <Input
                      type="text"
                      value={bottleLookup}
                      onChange={(e) => {
                        setBottleLookup(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder={t.hero.inputPlaceholder}
                      className={`h-10 pl-10 pr-8 text-xs bg-[#FAF8F5] font-mono text-foreground placeholder:text-[#5F6B64]/70 rounded-lg focus-visible:ring-[#D97706] ${
                        errorMsg ? "border-rose-400 focus-visible:ring-rose-400" : "border-[#E7E3DB]"
                      }`}
                    />
                    {bottleLookup && (
                      <button
                        type="button"
                        onClick={() => {
                          setBottleLookup("");
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 text-xs font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs shrink-0 cursor-pointer rounded-lg transition-colors whitespace-nowrap active:scale-98"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                    {isSubmitting ? (isHindi ? "खोज रहे हैं..." : "Verifying...") : t.hero.verifyBtn}
                  </Button>
                </form>

                {/* Normalization Helper */}
                {bottleLookup.trim() && (
                  <div className="text-[11px] text-[#143D2B] bg-[#EAF3EE] border border-[#C6DDD0] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                    <span className="font-sans text-[10px] text-[#5F6B64]">{isHindi ? "सत्यापित लक्ष्य:" : "Target ID:"}</span>
                    <strong className="text-[#143D2B]">{normalizedPreview}</strong>
                  </div>
                )}

                {/* Inline Error Message */}
                {errorMsg && (
                  <div className="text-[11.5px] text-rose-600 font-medium animate-in fade-in duration-150">
                    {errorMsg}
                  </div>
                )}

                {/* Sample Bottle Chips */}
                <div className="pt-2 border-t border-[#E7E3DB]/70 flex flex-wrap items-center gap-1.5 text-[11px] text-[#5F6B64]">
                  <span className="font-semibold text-foreground/80 shrink-0">{t.hero.sampleLabel}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBottleLookup("HC-BTL-2026-00001");
                      router.push("/verify/HC-BTL-2026-00001");
                    }}
                    className="font-mono text-[#B45309] hover:bg-[#B45309] hover:text-white transition-colors bg-[#FEF6E8] px-2 py-0.5 rounded border border-[#FCDDB5] cursor-pointer text-[10.5px] font-semibold flex items-center gap-1"
                  >
                    <span>HC-BTL-2026-00001</span>
                    <span className="text-[9px] opacity-75 hidden sm:inline">(Chamoli)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBottleLookup("HC-BTL-2026-00002");
                      router.push("/verify/HC-BTL-2026-00002");
                    }}
                    className="font-mono text-[#B45309] hover:bg-[#B45309] hover:text-white transition-colors bg-[#FEF6E8] px-2 py-0.5 rounded border border-[#FCDDB5] cursor-pointer text-[10.5px] font-semibold flex items-center gap-1"
                  >
                    <span>HC-BTL-2026-00002</span>
                    <span className="text-[9px] opacity-75 hidden sm:inline">(500g Jar)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBottleLookup("HC-BTL-2026-00005");
                      router.push("/verify/HC-BTL-2026-00005");
                    }}
                    className="font-mono text-[#B45309] hover:bg-[#B45309] hover:text-white transition-colors bg-[#FEF6E8] px-2 py-0.5 rounded border border-[#FCDDB5] cursor-pointer text-[10.5px] font-semibold flex items-center gap-1"
                  >
                    <span>HC-BTL-2026-00005</span>
                    <span className="text-[9px] opacity-75 hidden sm:inline">(Retail)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Honey Bottle with Floating Badges & Provenance Seal */}
          <div className="lg:col-span-5 flex justify-center">
            <HoneyBottleVisual 
              bottleId="HC-BTL-2026-00001"
              volume="500 g"
            />
          </div>
        </div>

        {/* Clean Statistics Strip (Section 13) */}
        <div className="mt-14 sm:mt-18 border border-[#E7E3DB] bg-white rounded-2xl shadow-2xs overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-[#E7E3DB]">
            <div className="py-6 px-6 sm:px-8 flex flex-col justify-center">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">{t.stats.hivesValue}</div>
              <div className="text-[12px] font-bold text-foreground mt-1">{t.stats.hivesLabel}</div>
              <p className="text-[11.5px] text-[#5F6B64] mt-0.5 leading-snug">{t.stats.hivesDesc}</p>
            </div>
            <div className="py-6 px-6 sm:px-8 flex flex-col justify-center">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">{t.stats.collectivesValue}</div>
              <div className="text-[12px] font-bold text-foreground mt-1">{t.stats.collectivesLabel}</div>
              <p className="text-[11.5px] text-[#5F6B64] mt-0.5 leading-snug">{t.stats.collectivesDesc}</p>
            </div>
            <div className="py-6 px-6 sm:px-8 flex flex-col justify-center">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">{t.stats.bottlesValue}</div>
              <div className="text-[12px] font-bold text-foreground mt-1">{t.stats.bottlesLabel}</div>
              <p className="text-[11.5px] text-[#5F6B64] mt-0.5 leading-snug">{t.stats.bottlesDesc}</p>
            </div>
            <div className="py-6 px-6 sm:px-8 flex flex-col justify-center">
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">{t.stats.labsValue}</div>
              <div className="text-[12px] font-bold text-foreground mt-1">{t.stats.labsLabel}</div>
              <p className="text-[11.5px] text-[#5F6B64] mt-0.5 leading-snug">{t.stats.labsDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
