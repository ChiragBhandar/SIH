"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-pulse text-amber-400 font-bold font-mono">
            HC
          </div>
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            Querying Honey Chain Digital Registry...
          </p>
        </div>
      </div>
    );
  }

  const { verificationStatus } = verification;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER HEADER */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Crest Logo */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-mono shadow-md shadow-amber-500/20">
              HC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100">
                  Honey Chain
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Consumer Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Official Digital Traceability Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 text-xs gap-1.5 border-slate-700 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
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
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900/90 p-6 sm:p-8 shadow-xl shadow-emerald-950/20 text-center space-y-4">
              <div className="inline-flex p-3.5 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>Product Identity Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                  {verification.productName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Official digital traceability record confirmed. This product originates from regulated mountain apiaries with certified laboratory testing.
                </p>
              </div>

              {/* Bottle Key Identifiers Pill */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="font-mono font-bold bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 text-slate-200">
                  Bottle: {verification.bottleId}
                </span>
                <span className="font-mono font-medium bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 text-amber-400">
                  Size: {verification.bottleSize}
                </span>
                <span className="font-mono text-slate-300 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                  Certificate: {verification.certificationReference}
                </span>
              </div>
            </div>

            {/* Public Trust Summary Badges */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verification Trust Badges</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Origin Recorded */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center text-center space-y-1.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Wheat className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Origin Recorded
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Himalayan Region</span>
                  </span>
                </div>

                {/* 2. Traceability Complete */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center text-center space-y-1.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Traceability Complete
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Unbroken Chain</span>
                  </span>
                </div>

                {/* 3. Quality Tested */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center text-center space-y-1.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Quality Tested
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Passed Purity Panel</span>
                  </span>
                </div>

                {/* 4. Certification Verified */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center text-center space-y-1.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    Certification Verified
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Grade A Standard</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Public Source Information Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-slate-200">
                    Approved Product Information
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  Verified Data
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">
                      Botanical Origin & Region
                    </span>
                    <p className="font-semibold text-slate-200 text-sm mt-0.5">
                      {verification.originRegion}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      High altitude Himalayan wild flora
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wheat className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">
                      Honey Variety & Type
                    </span>
                    <p className="font-semibold text-slate-200 text-sm mt-0.5">
                      {verification.honeyVariety}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      100% natural raw multifloral honey
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">
                      Harvest Season
                    </span>
                    <p className="font-semibold text-slate-200 mt-0.5">
                      {verification.harvestPeriod}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">
                      Accredited Quality Certificate
                    </span>
                    <p className="font-mono font-bold text-emerald-400 mt-0.5">
                      {verification.certificationReference}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {verification.disclaimer} Traceability records are generated at point of harvest, certified by accredited laboratories, and registered digitally.
                </span>
              </div>
            </div>

            {/* Public Traceability Timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-slate-200">
                    Public Traceability Milestones
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                  5 Verified Steps
                </span>
              </div>

              <div className="relative border-l-2 border-emerald-500/40 ml-4 pl-6 space-y-6 py-2 text-xs">
                {verification.milestones.map((milestone, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle icon marker */}
                    <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-slate-950 border-2 border-emerald-400 text-emerald-400 shadow-md">
                      {idx === 0 && <Wheat className="h-3.5 w-3.5" />}
                      {idx === 1 && <Layers className="h-3.5 w-3.5" />}
                      {idx === 2 && <FlaskConical className="h-3.5 w-3.5" />}
                      {idx === 3 && <Award className="h-3.5 w-3.5" />}
                      {idx === 4 && <Package className="h-3.5 w-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-slate-100 text-sm">
                          {milestone.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {milestone.dateOrPeriod}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
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
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-900 p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3.5 rounded-full bg-red-500/20 border-2 border-red-500/40 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                Product Not Found
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                Unregistered Bottle Identifier
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                The identifier <code className="font-mono text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{bottleId}</code> does not match any registered product in the Honey Chain digital verification ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
              <span className="font-semibold text-slate-300 block">Recommended Consumer Actions:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
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
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3.5 rounded-full bg-amber-500/20 border-2 border-amber-500/40 text-amber-400">
              <Clock className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                Verification Not Currently Available
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                Verification Pending Publication
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                This bottle identity <code className="font-mono text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{bottleId}</code> has been registered during production but has not yet been released for public consumer lookup by the manufacturer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto text-xs text-slate-400">
              Please check back shortly or scan again once retail distribution commences.
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STATE 4: SUSPENDED / VERIFICATION SUSPENDED */}
        {/* ===================================================================== */}
        {verificationStatus === "SUSPENDED" && (
          <div className="rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3.5 rounded-full bg-red-500/20 border-2 border-red-500/40 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                Verification Suspended
              </Badge>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                Verification Notice
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Verification for bottle <code className="font-mono text-slate-100 bg-slate-800 px-1.5 py-0.5 rounded">{bottleId}</code> has been temporarily suspended by the issuing manufacturer or certifying authority for review.
              </p>
            </div>

            {verification.suspendedReason && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 max-w-md mx-auto text-xs text-red-300">
                <strong>Reason:</strong> {verification.suspendedReason}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOOKUP ANOTHER BOTTLE SEARCH BOX */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">
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
              className="bg-slate-950 border-slate-800 text-slate-200 text-xs h-9 font-mono"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-9 px-4 shrink-0"
            >
              Verify
            </Button>
          </form>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* PUBLIC CONSUMER FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Honey Chain Public Verification System</span>
        </div>
        <p className="text-[11px] max-w-md mx-auto px-4 text-slate-400">
          Independent Field-to-Bottle Traceability & Purity Assurance Protocol.
        </p>
        <div className="pt-2 text-[10px] text-slate-400">
          © 2026 Honey Chain. All digital product identities cryptographically hashed and indexed.
        </div>
      </footer>
    </div>
  );
}
