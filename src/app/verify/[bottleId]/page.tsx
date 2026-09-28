"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wheat,
  Layers,
  FlaskConical,
  Award,
  Package,
  Sparkles,
  Search,
  Share2,
  Check,
  Info,
  MapPin,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { PublicConsumerVerification } from "@/types/bottle";
import { normalizeBottleId, findBottle, buildPublicVerification } from "@/data/mock-bottles";
import { getVerifyUrl } from "@/lib/constants";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function PublicVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const bottleId = (params?.bottleId as string) || "";

  const { t, isHindi } = useLanguage();

  // Fetch verification data directly from public API — no auth, no context required
  const [verification, setVerification] = React.useState<PublicConsumerVerification | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [lookupId, setLookupId] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Fetch public verification data from API — works without login or context
  React.useEffect(() => {
    if (!bottleId) return;
    const cleanId = normalizeBottleId(bottleId);

    // Signal loading state via Promise microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => setIsLoaded(false));
    fetch(`/api/verify/${encodeURIComponent(cleanId || bottleId)}`)
      .then(async (res) => {
        const data = await res.json();
        // If not found in static data, check if bottle was created in active session's localStorage
        if (data.verificationStatus === "UNKNOWN" && typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("traceability_state_v1");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed.bottles)) {
                const localBottle = findBottle(cleanId || bottleId, parsed.bottles);
                if (localBottle) {
                  setVerification(buildPublicVerification(localBottle));
                  return;
                }
              }
            }
          } catch {
            // keep standard API response
          }
        }
        setVerification(data);
      })
      .catch(() => {
        // On network failure, check localStorage before falling back to unknown
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("traceability_state_v1");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed.bottles)) {
                const localBottle = findBottle(cleanId || bottleId, parsed.bottles);
                if (localBottle) {
                  setVerification(buildPublicVerification(localBottle));
                  return;
                }
              }
            }
          } catch {
            // continue to error fallback
          }
        }
        setVerification({
          bottleId: cleanId || bottleId,
          productName: "Unknown Product",
          honeyVariety: "Unknown",
          bottleSize: "500 g",
          originRegion: "Unknown",
          harvestPeriod: "Unknown",
          processingStatus: "Unknown",
          qualityApprovalStatus: "Unknown",
          certificationReference: "None",
          verificationStatus: "UNKNOWN",
          trustBadges: {
            originRecorded: false,
            traceabilityComplete: false,
            qualityTested: false,
            certificationVerified: false,
          },
          milestones: [],
          disclaimer: "Could not connect to verification server.",
        });
      })
      .finally(() => setIsLoaded(true));
  }, [bottleId]);

  const localizedMilestones = React.useMemo(() => {
    if (!verification?.milestones) return [];
    if (!isHindi) return verification.milestones;
    const hindiMilestones = [
      {
        title: "एपियरी उत्पत्ति और निष्कर्षण",
        description: "चमोली अल्पाइन सेक्टर के उच्च पर्वतीय हाइव्स से 100% शुद्ध कच्चे शहद का निष्कर्षण।",
      },
      {
        title: "प्राप्ति और थोक बैचिंग",
        description: "खाद्य-ग्रेड कंटेनरों में सुरक्षित संग्रह, वजन और डिजिटल सीलिंग की पुष्टि।",
      },
      {
        title: "प्रयोगशाला शुद्धता परीक्षण",
        description: "स्वतंत्र प्रयोगशाला में NMR स्पेक्ट्रोस्कोपी और C4 शर्करा विश्लेषण में 99.4% शुद्धता प्रमाणित।",
      },
      {
        title: "गुणवत्ता प्रमाणन",
        description: "अधिकृत परीक्षण प्रयोगशाला द्वारा डिजिटल ऑडिट हस्ताक्षर सहित ग्रेड ए प्रमाण पत्र जारी।",
      },
      {
        title: "पैकेजिंग और क्यूआर क्रमांकन",
        description: "खुदरा कांच के जार में माइक्रो-निस्पंदन बॉटलिंग और इकाई-स्तरीय क्यूआर पहचान जारी।",
      },
    ];
    return verification.milestones.map((m, idx) => ({
      ...m,
      title: hindiMilestones[idx]?.title || m.title,
      description: hindiMilestones[idx]?.description || m.description,
    }));
  }, [isHindi, verification]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Always share the production Vercel URL, not the local dev server
      const shareUrl = getVerifyUrl(bottleId);
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center animate-pulse text-primary font-bold font-mono">
            HC
          </div>
          <p className="text-xs text-muted-foreground font-medium animate-pulse">
            {t.verifyPage.queryingLedger}
          </p>
        </div>
      </div>
    );
  }

  // Derive display values — null-safe since verification may not be loaded yet
  const verificationStatus = verification?.verificationStatus ?? "UNKNOWN";
  const productName = isHindi && verification?.productName?.includes("Highland")
    ? "हाईलैंड वाइल्ड मल्टीफ्लोरल प्राकृतिक कच्चा शहद"
    : (verification?.productName ?? "");
  const originRegion = isHindi && verification?.originRegion?.includes("Chamoli")
    ? "चमोली, उत्तराखंड"
    : (verification?.originRegion ?? "");
  const honeyVariety = isHindi && verification?.honeyVariety?.includes("Multifloral")
    ? "जंगली मल्टीफ्लोरल"
    : (verification?.honeyVariety ?? "");
  const harvestPeriod = isHindi ? "सितंबर 2026" : (verification?.harvestPeriod ?? "");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER HEADER */}
      {/* ========================================================================= */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
            <BrandLogo size="md" priority />
            <div className="hidden sm:flex flex-col border-l border-border pl-2.5">
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono w-fit">
                {t.verifyPage.consumerPortal}
              </span>
              <p className="text-[9.5px] text-muted-foreground font-medium mt-0.5">
                {t.verifyPage.officialRegistry}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border border-border/60 hover:bg-muted/80"
            >
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">{t.verifyPage.backToHome}</span>
                <span className="xs:hidden sm:hidden">Home</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 text-xs gap-1.5 border-border bg-card text-foreground hover:bg-muted cursor-pointer rounded-lg"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">{t.verifyPage.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{t.verifyPage.share}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        {/* ===================================================================== */}
        {/* STATE 1: VALID / PRODUCT VERIFIED */}
        {/* ===================================================================== */}
        {verificationStatus === "VALID" && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Status Hero Card */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-card p-6 sm:p-8 shadow-md text-center space-y-4">
              {/* Subtle Warm Amber / Emerald Glow in Card */}
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl rounded-full" />

              <div className="relative inline-flex p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="relative space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>{t.verifyPage.valid.badge}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {productName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  {t.verifyPage.valid.confirmedRecord}
                </p>
              </div>

              {/* Bottle Key Identifiers Chips */}
              <div className="relative pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="font-mono font-bold bg-muted/60 px-3 py-1 rounded-lg border border-border text-foreground">
                  {t.verifyPage.valid.bottleLabel}: {verification?.bottleId}
                </span>
                <span className="font-mono font-medium bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 text-primary">
                  {t.verifyPage.valid.sizeLabel}: {verification?.bottleSize}
                </span>
                <span className="font-mono text-foreground bg-muted/60 px-3 py-1 rounded-lg border border-border">
                  {t.verifyPage.valid.certLabel}: {verification?.certificationReference}
                </span>
              </div>
            </div>

            {/* Public Trust Summary Badges */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t.verifyPage.valid.trustBadgesHeading}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Origin Recorded */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-primary">
                    <Wheat className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {t.verifyPage.valid.badges.originRecorded}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>{t.verifyPage.valid.badges.himalayanRegion}</span>
                  </span>
                </div>

                {/* 2. Traceability Complete */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {t.verifyPage.valid.badges.traceabilityComplete}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>{t.verifyPage.valid.badges.unbrokenChain}</span>
                  </span>
                </div>

                {/* 3. Quality Tested */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-emerald-500/30 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {t.verifyPage.valid.badges.qualityTested}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>{t.verifyPage.valid.badges.passedPanel}</span>
                  </span>
                </div>

                {/* 4. Certification Verified */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-emerald-500/30 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {t.verifyPage.valid.badges.certVerified}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>{t.verifyPage.valid.badges.gradeA}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Public Source Information Card */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground">
                    {t.verifyPage.valid.approvedInfoHeading}
                  </h2>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
                  {t.verifyPage.valid.verifiedDataPill}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      {t.verifyPage.valid.botanicalOriginLabel}
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      {originRegion}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t.verifyPage.valid.botanicalFloraSub}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wheat className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      {t.verifyPage.valid.varietyLabel}
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      {honeyVariety}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t.verifyPage.valid.varietySub}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      {t.verifyPage.valid.harvestSeasonLabel}
                    </span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {harvestPeriod}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      {t.verifyPage.valid.qualityCertLabel}
                    </span>
                    <p className="font-mono font-bold text-emerald-600 mt-0.5">
                      {verification?.certificationReference}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {isHindi
                    ? "यह उत्पाद आधिकारिक रूप से पंजीकृत है और गुणवत्ता मानकों पर खरा उतरा है।"
                    : verification?.disclaimer}{" "}
                  {t.verifyPage.valid.disclaimerSuffix}
                </span>
              </div>
            </div>

            {/* Public Traceability Timeline */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-foreground">
                    {t.verifyPage.valid.milestonesHeading}
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase font-mono">
                  {t.verifyPage.valid.verifiedStepsCount}
                </span>
              </div>

              <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-6 space-y-6 py-2 text-xs">
                {localizedMilestones.map((milestone, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle icon marker */}
                    <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-card border-2 border-emerald-500 text-emerald-600 shadow-xs">
                      {idx === 0 && <Wheat className="h-3.5 w-3.5" />}
                      {idx === 1 && <Layers className="h-3.5 w-3.5" />}
                      {idx === 2 && <FlaskConical className="h-3.5 w-3.5" />}
                      {idx === 3 && <Award className="h-3.5 w-3.5" />}
                      {idx === 4 && <Package className="h-3.5 w-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-foreground text-sm">
                          {milestone.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {milestone.dateOrPeriod}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STATE 2: UNKNOWN / PRODUCT NOT FOUND */}
        {/* ===================================================================== */}
        {verificationStatus === "UNKNOWN" && (
          <div className="rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex p-3.5 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                {t.verifyPage.unknown.badge}
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.verifyPage.unknown.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t.verifyPage.unknown.descriptionStart}{" "}
                <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code>{" "}
                {t.verifyPage.unknown.descriptionEnd}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border max-w-md mx-auto text-left text-xs space-y-3">
              <span className="font-semibold text-foreground block">{t.verifyPage.unknown.actionsHeading}</span>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-[11px]">
                <li>{t.verifyPage.unknown.action1}</li>
                <li>{t.verifyPage.unknown.action2}</li>
                <li>{t.verifyPage.unknown.action3}</li>
              </ul>

              {/* Quick Sample Bottle Helpers */}
              <div className="pt-2 border-t border-border/80">
                <span className="text-[10.5px] font-semibold text-foreground/80 block mb-1.5">
                  {isHindi ? "सत्यापित नमूना बोतलें आज़माएं:" : "Or test with official verified sample bottles:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => router.push("/verify/HC-BTL-2026-00001")}
                    className="font-mono text-primary hover:bg-primary hover:text-white transition-colors bg-primary/10 px-2 py-1 rounded text-[10.5px] font-semibold cursor-pointer border border-primary/20"
                  >
                    HC-BTL-2026-00001
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/verify/HC-BTL-2026-00002")}
                    className="font-mono text-primary hover:bg-primary hover:text-white transition-colors bg-primary/10 px-2 py-1 rounded text-[10.5px] font-semibold cursor-pointer border border-primary/20"
                  >
                    HC-BTL-2026-00002
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/verify/HC-BTL-2026-00005")}
                    className="font-mono text-primary hover:bg-primary hover:text-white transition-colors bg-primary/10 px-2 py-1 rounded text-[10.5px] font-semibold cursor-pointer border border-primary/20"
                  >
                    HC-BTL-2026-00005
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STATE 3: UNPUBLISHED / VERIFICATION PENDING */}
        {/* ===================================================================== */}
        {verificationStatus === "UNPUBLISHED" && (
          <div className="rounded-2xl border border-warning/40 bg-card p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex p-3.5 rounded-full bg-warning/10 border border-warning/30 text-warning">
              <Clock className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                {t.verifyPage.unpublished.badge}
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.verifyPage.unpublished.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t.verifyPage.unpublished.descriptionStart}{" "}
                <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code>{" "}
                {t.verifyPage.unpublished.descriptionEnd}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border max-w-md mx-auto text-xs text-muted-foreground">
              {t.verifyPage.unpublished.note}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STATE 4: SUSPENDED / VERIFICATION SUSPENDED */}
        {/* ===================================================================== */}
        {verificationStatus === "SUSPENDED" && (
          <div className="rounded-2xl border border-destructive/40 bg-card p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex p-3.5 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                {t.verifyPage.suspended.badge}
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.verifyPage.suspended.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t.verifyPage.suspended.descriptionStart}{" "}
                <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code>{" "}
                {t.verifyPage.suspended.descriptionEnd}
              </p>
            </div>

            {verification?.suspendedReason && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 max-w-md mx-auto text-xs text-destructive">
                <strong>{t.verifyPage.suspended.reasonPrefix}</strong> {verification?.suspendedReason}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOOKUP ANOTHER BOTTLE SEARCH BOX */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">
              {t.verifyPage.lookup.heading}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (lookupId.trim()) {
                const targetId = normalizeBottleId(lookupId);
                router.push(`/verify/${encodeURIComponent(targetId)}`);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder={t.verifyPage.lookup.placeholder}
              className="bg-background border-border text-foreground text-xs h-9 font-mono"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 shrink-0 rounded-md cursor-pointer"
            >
              {t.verifyPage.lookup.submitBtn}
            </Button>
          </form>

          {/* Quick Sample Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground border-t border-border/60">
            <span className="text-[10px] uppercase font-semibold text-foreground/70">
              {isHindi ? "नमूना बोतलें:" : "Samples:"}
            </span>
            <button
              type="button"
              onClick={() => router.push("/verify/HC-BTL-2026-00001")}
              className="font-mono text-primary hover:underline cursor-pointer font-semibold text-[10.5px]"
            >
              #00001
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push("/verify/HC-BTL-2026-00002")}
              className="font-mono text-primary hover:underline cursor-pointer font-semibold text-[10.5px]"
            >
              #00002
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push("/verify/HC-BTL-2026-00005")}
              className="font-mono text-primary hover:underline cursor-pointer font-semibold text-[10.5px]"
            >
              #00005
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push("/verify/HC-BTL-2026-00003")}
              className="font-mono text-amber-600 hover:underline cursor-pointer font-semibold text-[10.5px]"
            >
              #00003 ({isHindi ? "अप्रकाशित" : "Unpublished"})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push("/verify/HC-BTL-2026-00004")}
              className="font-mono text-rose-600 hover:underline cursor-pointer font-semibold text-[10.5px]"
            >
              #00004 ({isHindi ? "निलंबित" : "Suspended"})
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>{t.verifyPage.footer.title}</span>
        </div>
        <p className="text-[11px] max-w-md mx-auto px-4 text-muted-foreground">
          {t.verifyPage.footer.subtitle}
        </p>
        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-medium">
          <Link href="/" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.verifyPage.footer.returnLink}</span>
          </Link>
        </div>
        <div className="pt-2 text-[10px] text-muted-foreground">
          {t.verifyPage.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
