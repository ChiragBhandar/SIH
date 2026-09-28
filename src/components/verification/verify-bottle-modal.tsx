"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  Search,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { normalizeBottleId } from "@/data/mock-bottles";

interface VerifyBottleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerifyBottleModal({ open, onOpenChange }: VerifyBottleModalProps) {
  const router = useRouter();
  const { t, isHindi } = useLanguage();
  const [bottleInput, setBottleInput] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"code" | "qr">("code");
  const [isScanning, setIsScanning] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setErrorMsg(null);
      setIsScanning(false);
    }
  }, [open]);

  const normalized = React.useMemo(() => {
    if (!bottleInput.trim()) return "";
    return normalizeBottleId(bottleInput);
  }, [bottleInput]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = bottleInput.trim();
    if (!clean) {
      setErrorMsg(
        isHindi
          ? "कृपया बोतल कोड दर्ज करें या नीचे दिए गए नमूनों में से एक चुनें।"
          : "Please enter a bottle code, or choose one of the sample bottles below."
      );
      return;
    }

    const targetId = normalizeBottleId(clean);
    onOpenChange(false);
    router.push(`/verify/${encodeURIComponent(targetId)}`);
  };

  const handleSelectSample = (sampleId: string) => {
    onOpenChange(false);
    router.push(`/verify/${sampleId}`);
  };

  const handleSimulateScan = (bottleId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onOpenChange(false);
      router.push(`/verify/${bottleId}`);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border border-[#E7E3DB] shadow-2xl rounded-2xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#143D2B] to-[#1E543D] px-6 py-5 text-white relative">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-[#D97706] shadow-xs">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-heading font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{isHindi ? "शहद की बोतल सत्यापित करें" : "Verify Honey Authenticity"}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#D97706] text-white font-bold">
                  {isHindi ? "लाइव लेजर" : "Live Ledger"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-white/80 mt-0.5">
                {isHindi
                  ? "सील पर दिया गया बोतल क्रमांक दर्ज करें या क्यूआर कोड स्कैन करें।"
                  : "Enter the serial code or scan the QR code printed on the bottle's tamper-proof seal."}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E7E3DB] bg-[#FAF8F5] px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "code"
                ? "border-[#D97706] text-[#D97706]"
                : "border-transparent text-[#5F6B64] hover:text-foreground"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>{isHindi ? "कोड दर्ज करें" : "Enter Bottle Code"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "qr"
                ? "border-[#D97706] text-[#D97706]"
                : "border-transparent text-[#5F6B64] hover:text-foreground"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>{isHindi ? "क्यूआर कोड स्कैन करें" : "Scan QR Code"}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {activeTab === "code" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  {isHindi ? "बोतल सीरियल या पहचान कोड" : "Bottle Serial or Identification Code"}
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F6B64]" />
                  <Input
                    autoFocus
                    type="text"
                    value={bottleInput}
                    onChange={(e) => {
                      setBottleInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={
                      isHindi
                        ? "उदा. HC-BTL-2026-00001 या सिर्फ 00001"
                        : "e.g. HC-BTL-2026-00001 or just 00001"
                    }
                    className="h-11 pl-10 pr-9 text-xs sm:text-sm bg-[#FAF8F5] border-[#E7E3DB] font-mono text-foreground placeholder:text-[#5F6B64]/70 rounded-xl focus-visible:ring-[#D97706]"
                  />
                  {bottleInput && (
                    <button
                      type="button"
                      onClick={() => setBottleInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Live Normalization Helper Preview */}
                {bottleInput.trim() && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#143D2B] bg-[#EAF3EE] border border-[#C6DDD0] px-2.5 py-1 rounded-lg font-mono">
                    <Sparkles className="h-3 w-3 text-[#D97706]" />
                    <span>
                      {isHindi ? "सत्यापन कोड: " : "Lookup target: "}
                      <strong>{normalized}</strong>
                    </span>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium animate-in fade-in duration-200">
                    {errorMsg}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-xs sm:text-sm font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer rounded-xl transition-all active:scale-98"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                <span>{isHindi ? "बोतल सत्यापित करें" : "Verify Bottle Now"}</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>
          ) : (
            /* QR Scan Simulation View */
            <div className="space-y-4 text-center">
              <div className="relative mx-auto w-48 h-48 rounded-2xl border-2 border-dashed border-[#D97706]/60 bg-[#FAF8F5] flex flex-col items-center justify-center p-4 overflow-hidden group">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-2 animate-pulse">
                    <QrCode className="h-16 w-16 text-[#D97706]" />
                    <span className="text-xs font-mono font-bold text-[#143D2B]">
                      {isHindi ? "क्यूआर पढ़ा जा रहा है..." : "Decoding QR..."}
                    </span>
                    <div className="absolute inset-x-0 h-0.5 bg-[#D97706] shadow-[0_0_8px_#D97706] animate-bounce" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-10 w-10 text-[#5F6B64] group-hover:text-[#D97706] transition-colors" />
                    <p className="text-[11px] text-[#5F6B64] leading-tight">
                      {isHindi
                        ? "कैमरा दृश्य या सिमुलेशन चुनें"
                        : "Simulate mobile camera QR scan"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSimulateScan("HC-BTL-2026-00001")}
                  disabled={isScanning}
                  className="text-xs font-mono border-[#E7E3DB] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  <QrCode className="h-3 w-3 mr-1.5 text-[#D97706]" />
                  {isHindi ? "स्कैन बोतल #00001" : "Scan Bottle #00001"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSimulateScan("HC-BTL-2026-00002")}
                  disabled={isScanning}
                  className="text-xs font-mono border-[#E7E3DB] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  <QrCode className="h-3 w-3 mr-1.5 text-[#D97706]" />
                  {isHindi ? "स्कैन बोतल #00002" : "Scan Bottle #00002"}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Clickable Sample Bottles */}
          <div className="pt-3 border-t border-[#E7E3DB] space-y-2">
            <span className="text-[11px] font-bold text-[#5F6B64] uppercase tracking-wider block">
              {isHindi ? "परीक्षण हेतु प्रामाणिक नमूना बोतलें:" : "Test with verified sample bottles:"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSelectSample("HC-BTL-2026-00001")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-[#D97706] hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="font-mono font-bold text-foreground text-xs group-hover:text-[#D97706] transition-colors">
                    HC-BTL-2026-00001
                  </div>
                  <div className="text-[10.5px] text-[#5F6B64]">
                    {isHindi ? "चमोली अल्पाइन • ग्रेड ए शुद्ध" : "Chamoli Alpine • Grade A Pure"}
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {isHindi ? "सत्यापित" : "Verified"}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample("HC-BTL-2026-00002")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-[#D97706] hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="font-mono font-bold text-foreground text-xs group-hover:text-[#D97706] transition-colors">
                    HC-BTL-2026-00002
                  </div>
                  <div className="text-[10.5px] text-[#5F6B64]">
                    {isHindi ? "500 ग्राम जार • प्रयोगशाला प्रमाणित" : "500 g Jar • Lab Certified"}
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {isHindi ? "सत्यापित" : "Verified"}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample("HC-BTL-2026-00003")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-amber-400 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="font-mono font-bold text-foreground text-xs group-hover:text-amber-700 transition-colors">
                    HC-BTL-2026-00003
                  </div>
                  <div className="text-[10.5px] text-[#5F6B64]">
                    {isHindi ? "प्री-रिलीज़ • गुणवत्ता समीक्षा जारी" : "Pre-release • QC Pending"}
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  {isHindi ? "अप्रकाशित" : "Unpublished"}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample("HC-BTL-2026-00004")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-rose-400 hover:shadow-xs transition-all text-left cursor-pointer group"
              >
                <div>
                  <div className="font-mono font-bold text-foreground text-xs group-hover:text-rose-700 transition-colors">
                    HC-BTL-2026-00004
                  </div>
                  <div className="text-[10.5px] text-[#5F6B64]">
                    {isHindi ? "निलंबित इकाई • पैकिंग ऑडिट" : "Suspended • Packaging Audit"}
                  </div>
                </div>
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] shrink-0">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {isHindi ? "निलंबित" : "Suspended"}
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link to Dedicated Portal */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-t border-[#E7E3DB] flex items-center justify-between text-xs text-[#5F6B64]">
          <span className="font-medium">
            {isHindi ? "आधिकारिक उपभोक्ता सत्यापन रजिस्ट्री" : "Official Public Registry"}
          </span>
          <Link
            href="/verify"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1 font-semibold text-[#D97706] hover:text-[#B45309] transition-colors"
          >
            <span>{isHindi ? "पूर्ण रजिस्ट्री पोर्टल खोलें" : "Open Verify Portal"}</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
