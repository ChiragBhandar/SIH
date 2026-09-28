"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Camera,
  Wheat,
  FlaskConical,
  Award,
  Layers,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useLanguage } from "@/context/language-context";
import { normalizeBottleId } from "@/data/mock-bottles";

export default function VerificationPortalPage() {
  const router = useRouter();
  const { t, isHindi } = useLanguage();
  const [lookupInput, setLookupInput] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"code" | "qr">("code");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);

  const normalized = React.useMemo(() => {
    if (!lookupInput.trim()) return "";
    return normalizeBottleId(lookupInput);
  }, [lookupInput]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = lookupInput.trim();
    if (!clean) {
      setErrorMsg(
        isHindi
          ? "कृपया बोतल कोड दर्ज करें (उदा. HC-BTL-2026-00001) या नीचे दिए गए नमूनों में से एक चुनें।"
          : "Please enter a bottle code (e.g. HC-BTL-2026-00001) or pick a sample below."
      );
      return;
    }
    setErrorMsg(null);
    const targetId = normalizeBottleId(clean);
    router.push(`/verify/${encodeURIComponent(targetId)}`);
  };

  const handleSimulateScan = (bottleId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      router.push(`/verify/${bottleId}`);
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <header className="border-b border-[#E7E3DB] bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo
            href="/"
            size="md"
            subtitle={isHindi ? "सार्वजनिक सत्यापन रजिस्ट्री" : "Public Verification Registry"}
            priority
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs h-9 px-3.5 border-[#E7E3DB] bg-white hover:bg-[#FAF8F5] text-foreground cursor-pointer rounded-lg shadow-2xs"
            >
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.verifyPage.backToHome}</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Hero Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143D2B]/10 border border-[#143D2B]/20 text-[#143D2B] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D97706]" />
            <span>{isHindi ? "उपभोक्ता प्रामाणिकता पोर्टल" : "Consumer Verification Portal"}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isHindi ? "अपनी शहद की बोतल की प्रामाणिकता जांचें" : "Verify Your Honey Bottle Authenticity"}
          </h1>
          <p className="text-sm sm:text-base text-[#5F6B64] leading-relaxed">
            {isHindi
              ? "सील पर दिया गया सीरियल नंबर दर्ज करें या क्यूआर कोड स्कैन करके हिमालयी एपियरी, निष्कर्षण, लैब शुद्धता और प्रमाणपत्र तुरंत सत्यापित करें।"
              : "Enter your bottle's serialized identity code or scan the QR code to trace the exact Himalayan apiary origin, extraction date, and certified lab purity report."}
          </p>
        </div>

        {/* Primary Interactive Search Card */}
        <div className="rounded-3xl border border-[#E7E3DB] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Mode Switcher */}
          <div className="flex border-b border-[#E7E3DB] -mx-6 sm:-mx-8 px-6 sm:px-8 pb-3 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 pb-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "border-[#D97706] text-[#D97706]"
                  : "border-transparent text-[#5F6B64] hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{isHindi ? "बोतल कोड दर्ज करें" : "Enter Bottle Code"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-2 pb-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "qr"
                  ? "border-[#D97706] text-[#D97706]"
                  : "border-transparent text-[#5F6B64] hover:text-foreground"
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>{isHindi ? "क्यूआर कोड स्कैनर" : "Scan QR Code"}</span>
            </button>
          </div>

          {activeTab === "code" ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto pt-2">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5F6B64]" />
                  <Input
                    autoFocus
                    type="text"
                    value={lookupInput}
                    onChange={(e) => {
                      setLookupInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={
                      isHindi
                        ? "उदा. HC-BTL-2026-00001 या संख्या जैसे 00001, 1, 42"
                        : "e.g. HC-BTL-2026-00001 or numbers like 00001, 1, 42"
                    }
                    className={`h-12 pl-12 pr-10 text-sm sm:text-base bg-[#FAF8F5] font-mono text-foreground placeholder:text-[#5F6B64]/70 rounded-xl focus-visible:ring-[#D97706] ${
                      errorMsg ? "border-rose-400" : "border-[#E7E3DB]"
                    }`}
                  />
                  {lookupInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setLookupInput("");
                        setErrorMsg(null);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Normalization preview */}
                {lookupInput.trim() && (
                  <div className="text-xs text-[#143D2B] bg-[#EAF3EE] border border-[#C6DDD0] px-3 py-1.5 rounded-lg font-mono flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                    <span>
                      {isHindi ? "सत्यापित लक्ष्य आईडी: " : "Lookup target: "}
                      <strong>{normalized}</strong>
                    </span>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-sm sm:text-base font-semibold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer rounded-xl transition-all active:scale-98"
              >
                <ShieldCheck className="h-5 w-5 mr-2" />
                <span>{isHindi ? "बोतल रिकॉर्ड सत्यापित करें" : "Verify Bottle Record"}</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          ) : (
            /* Interactive QR Scanner Simulator */
            <div className="space-y-5 text-center max-w-md mx-auto pt-2">
              <div className="relative mx-auto w-56 h-56 rounded-2xl border-2 border-dashed border-[#D97706]/70 bg-[#FAF8F5] flex flex-col items-center justify-center p-6 overflow-hidden">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3 animate-pulse">
                    <QrCode className="h-20 w-20 text-[#D97706]" />
                    <span className="text-xs font-mono font-bold text-[#143D2B]">
                      {isHindi ? "क्यूआर कोड पढ़ा जा रहा है..." : "Decoding Secure QR..."}
                    </span>
                    <div className="absolute inset-x-0 h-1 bg-[#D97706] shadow-[0_0_12px_#D97706] animate-bounce" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Camera className="h-12 w-12 text-[#5F6B64]" />
                    <p className="text-xs text-[#5F6B64]">
                      {isHindi
                        ? "बोतल की सील पर मुद्रित क्यूआर कोड को स्कैन करें"
                        : "Aim camera at bottle seal QR or simulate below"}
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
                  <QrCode className="h-3.5 w-3.5 mr-1.5 text-[#D97706]" />
                  {isHindi ? "स्कैन बोतल #00001" : "Scan Bottle #00001"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSimulateScan("HC-BTL-2026-00002")}
                  disabled={isScanning}
                  className="text-xs font-mono border-[#E7E3DB] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  <QrCode className="h-3.5 w-3.5 mr-1.5 text-[#D97706]" />
                  {isHindi ? "स्कैन बोतल #00002" : "Scan Bottle #00002"}
                </Button>
              </div>
            </div>
          )}

          {/* Sample Bottles Showcase */}
          <div className="pt-6 border-t border-[#E7E3DB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F6B64]">
                {isHindi ? "सत्यापित लाइव नमूना बोतलें" : "Live Registered Registry Units"}
              </span>
              <span className="text-[11px] text-[#5F6B64]">
                {isHindi ? "तत्काल पूर्वावलोकन हेतु क्लिक करें" : "Click any unit to inspect"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => router.push("/verify/HC-BTL-2026-00001")}
                className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-[#D97706] hover:shadow-xs transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground group-hover:text-[#D97706] transition-colors">
                    HC-BTL-2026-00001
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {isHindi ? "सत्यापित" : "Verified"}
                  </Badge>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {isHindi ? "हाईलैंड वाइल्ड मल्टीफ्लोरल कच्चा शहद" : "Highland Wild Multifloral Raw Honey"}
                </div>
                <div className="text-[10px] text-[#5F6B64]">
                  {isHindi ? "चमोली, उत्तराखंड • ग्रेड ए 99.4%" : "Chamoli, Uttarakhand • Grade A 99.4%"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/verify/HC-BTL-2026-00002")}
                className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-[#D97706] hover:shadow-xs transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground group-hover:text-[#D97706] transition-colors">
                    HC-BTL-2026-00002
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {isHindi ? "सत्यापित" : "Verified"}
                  </Badge>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {isHindi ? "500 ग्राम कांच का जार" : "500 g Glass Jar Retail Unit"}
                </div>
                <div className="text-[10px] text-[#5F6B64]">
                  {isHindi ? "बैच HC-PB-2026-0001 • सोलन पैकिंग" : "Batch HC-PB-2026-0001 • Solan Line 01"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/verify/HC-BTL-2026-00005")}
                className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-[#D97706] hover:shadow-xs transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground group-hover:text-[#D97706] transition-colors">
                    HC-BTL-2026-00005
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {isHindi ? "सत्यापित" : "Verified"}
                  </Badge>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {isHindi ? "खुदरा बॉटलिंग रन" : "Retail Packaging Unit"}
                </div>
                <div className="text-[10px] text-[#5F6B64]">
                  {isHindi ? "सक्रिय क्यूआर • डिजिटल सील" : "Active QR • Tamper-proof Seal"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/verify/HC-BTL-2026-00003")}
                className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-amber-400 hover:shadow-xs transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground group-hover:text-amber-700 transition-colors">
                    HC-BTL-2026-00003
                  </span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    {isHindi ? "अप्रकाशित" : "Unpublished"}
                  </Badge>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {isHindi ? "प्री-रिलीज़ इन्वेंट्री यूनिट" : "Pre-Release Inventory Unit"}
                </div>
                <div className="text-[10px] text-[#5F6B64]">
                  {isHindi ? "पैकेजिंग गुणवत्ता समीक्षा लंबित" : "Held in staging area for release"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => router.push("/verify/HC-BTL-2026-00004")}
                className="p-3.5 rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] hover:bg-white hover:border-rose-400 hover:shadow-xs transition-all text-left cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground group-hover:text-rose-700 transition-colors">
                    HC-BTL-2026-00004
                  </span>
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {isHindi ? "निलंबित" : "Suspended"}
                  </Badge>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {isHindi ? "गुणवत्ता ऑडिट हेतु रुका" : "Packaging QC Flagged Unit"}
                </div>
                <div className="text-[10px] text-[#5F6B64]">
                  {isHindi ? "सत्यापन अस्थायी रूप से रोका गया" : "Verification temporarily paused"}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Verification Trust */}
        <div className="space-y-4">
          <h2 className="text-center font-heading text-xl sm:text-2xl font-extrabold text-foreground">
            {isHindi ? "हनी चेन सार्वजनिक सत्यापन कैसे काम करता है" : "How Public Traceability Verification Works"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[#E7E3DB] bg-white space-y-2 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-primary flex items-center justify-center font-bold">
                <Wheat className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                {isHindi ? "1. एपियरी उत्पत्ति रिकॉर्ड" : "1. Apiary Provenance"}
              </h3>
              <p className="text-[11.5px] text-[#5F6B64] leading-relaxed">
                {isHindi
                  ? "प्रत्येक कच्चा बैच सटीक जीपीएस निर्देशांक, हाइव आईडी और बीकीपर हस्ताक्षर से जुड़ा होता है।"
                  : "Every raw batch links directly to verified GPS apiary coordinates and registered hive IDs."}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E7E3DB] bg-white space-y-2 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-primary flex items-center justify-center font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                {isHindi ? "2. अभिरक्षा व तापमान" : "2. Cold Chain Custody"}
              </h3>
              <p className="text-[11.5px] text-[#5F6B64] leading-relaxed">
                {isHindi
                  ? "परिवहन और प्राप्ति में डिजिटल सील और तापमान रिकॉर्ड अखंड श्रृंखला बनाए रखते हैं।"
                  : "Tamper-evident transport seals and controlled low-temp logs safeguard native enzymes."}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E7E3DB] bg-white space-y-2 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <FlaskConical className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                {isHindi ? "3. एनएमआर व शुद्धता लैब" : "3. Certified Lab Testing"}
              </h3>
              <p className="text-[11.5px] text-[#5F6B64] leading-relaxed">
                {isHindi
                  ? "ISO 17025 मान्यता प्राप्त प्रयोगशाला द्वारा नमी, HMF और C4 शर्करा विश्लेषण की पुष्टि।"
                  : "Independent ISO 17025 testing verifying purity, moisture, and absence of adulterants."}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E7E3DB] bg-white space-y-2 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-foreground">
                {isHindi ? "4. इकाई-स्तरीय क्यूआर सील" : "4. Unit-Level QR Identity"}
              </h3>
              <p className="text-[11.5px] text-[#5F6B64] leading-relaxed">
                {isHindi
                  ? "प्रत्येक व्यक्तिगत बोतल को गैर-अनुमानित सीरियल कोड जारी किया जाता है।"
                  : "Individual unit-level serialized QR code issued directly onto tamper-proof security seals."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E3DB] bg-white py-6 text-center text-xs text-[#5F6B64] space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>{t.verifyPage.footer.title}</span>
        </div>
        <p className="text-[11px] max-w-md mx-auto px-4 text-[#5F6B64]">
          {t.verifyPage.footer.subtitle}
        </p>
        <div className="pt-2 text-[10px] text-[#5F6B64]">
          {t.verifyPage.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
