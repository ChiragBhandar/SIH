"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
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
  Hexagon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PublicVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const bottleId = (params?.bottleId as string) || "";

  const { getPublicVerification, isLoaded } = useTraceability();

  const [lookupId, setLookupId] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const verification = React.useMemo(() => {
    return getPublicVerification(bottleId);
  }, [bottleId, getPublicVerification]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
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
            Querying Honey Chain Digital Registry...
          </p>
        </div>
      </div>
    );
  }

  const { verificationStatus } = verification;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER HEADER */}
      {/* ========================================================================= */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
            {/* Hexagon Mark Logo */}
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
              <Hexagon className="h-5 w-5 fill-current stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-foreground leading-tight">
                  Honey Chain
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
                  Consumer Portal
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">
                Official Digital Traceability Registry
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border border-border/60 hover:bg-muted/80"
            >
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">Back to Home</span>
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
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Share</span>
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
                  <span>Product Identity Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {verification.productName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Official digital traceability record confirmed. This product originates from regulated mountain apiaries with certified laboratory testing.
                </p>
              </div>

              {/* Bottle Key Identifiers Chips */}
              <div className="relative pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="font-mono font-bold bg-muted/60 px-3 py-1 rounded-lg border border-border text-foreground">
                  Bottle: {verification.bottleId}
                </span>
                <span className="font-mono font-medium bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 text-primary">
                  Size: {verification.bottleSize}
                </span>
                <span className="font-mono text-foreground bg-muted/60 px-3 py-1 rounded-lg border border-border">
                  Certificate: {verification.certificationReference}
                </span>
              </div>
            </div>

            {/* Public Trust Summary Badges */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verification Trust Badges</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Origin Recorded */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-primary">
                    <Wheat className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Origin Recorded
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Himalayan Region</span>
                  </span>
                </div>

                {/* 2. Traceability Complete */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Traceability Complete
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Unbroken Chain</span>
                  </span>
                </div>

                {/* 3. Quality Tested */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-emerald-500/30 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Quality Tested
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Passed Purity Panel</span>
                  </span>
                </div>

                {/* 4. Certification Verified */}
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col items-center text-center space-y-1.5 shadow-2xs hover:border-emerald-500/30 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Certification Verified
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Grade A Standard</span>
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
                    Approved Product Information
                  </h2>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
                  Verified Data
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      Botanical Origin & Region
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      {verification.originRegion}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      High altitude Himalayan wild flora
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wheat className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      Honey Variety & Type
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      {verification.honeyVariety}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      100% natural raw multifloral honey
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      Harvest Season
                    </span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {verification.harvestPeriod}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                      Accredited Quality Certificate
                    </span>
                    <p className="font-mono font-bold text-emerald-600 mt-0.5">
                      {verification.certificationReference}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {verification.disclaimer} Traceability records are generated at point of harvest, certified by accredited laboratories, and registered digitally.
                </span>
              </div>
            </div>

            {/* Public Traceability Timeline */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-foreground">
                    Public Traceability Milestones
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase font-mono">
                  5 Verified Steps
                </span>
              </div>

              <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-6 space-y-6 py-2 text-xs">
                {verification.milestones.map((milestone, idx) => (
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
                Product Not Found
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Unregistered Bottle Identifier
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                The identifier <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code> does not match any registered product in the Honey Chain digital verification ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border max-w-md mx-auto text-left text-xs space-y-2">
              <span className="font-semibold text-foreground block">Recommended Consumer Actions:</span>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-[11px]">
                <li>Double check the printed bottle code on your label or security foil.</li>
                <li>Make sure there are no typos in the identifier format (e.g. HC-BTL-2026-XXXXX).</li>
                <li>If you purchased this product from an authorized vendor, please report this code to customer support.</li>
              </ul>
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
                Verification Not Currently Available
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Verification Pending Publication
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                This bottle identity <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code> has been registered during production but has not yet been released for public consumer lookup by the manufacturer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border max-w-md mx-auto text-xs text-muted-foreground">
              Please check back shortly or scan again once retail distribution commences.
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
                Verification Suspended
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Verification Notice
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Verification for bottle <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded font-bold">{bottleId}</code> has been temporarily suspended by the issuing manufacturer or certifying authority for review.
              </p>
            </div>

            {verification.suspendedReason && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 max-w-md mx-auto text-xs text-destructive">
                <strong>Reason:</strong> {verification.suspendedReason}
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
              Verify Another Honey Chain Bottle
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (lookupId.trim()) {
                router.push(`/verify/${lookupId.trim()}`);
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="e.g. HC-BTL-2026-00001"
              className="bg-background border-border text-foreground text-xs h-9 font-mono"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-4 shrink-0 rounded-md cursor-pointer"
            >
              Verify
            </Button>
          </form>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Honey Chain Public Verification System</span>
        </div>
        <p className="text-[11px] max-w-md mx-auto px-4 text-muted-foreground">
          Independent Field-to-Bottle Traceability & Purity Assurance Protocol.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-medium">
          <Link href="/" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
        <div className="pt-2 text-[10px] text-muted-foreground">
          © 2026 Honey Chain. All digital product identities cryptographically hashed and indexed.
        </div>
      </footer>
    </div>
  );
}
