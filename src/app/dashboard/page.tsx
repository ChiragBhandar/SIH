"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import {
  Boxes,
  Wheat,
  FlaskConical,
  QrCode,
  ArrowRight,
  Shield,
  Activity,
  Plus,
  AlertCircle,
  Building2,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MOCK_BATCHES,
  MOCK_APIARIES,
} from "@/data";
import {
  YieldForecastChart,
  HiveHealthChart,
  HarvestAnalyticsChart,
} from "@/components/dashboard";

function DashboardContent() {
  const { user, selectedOrg, selectedRole } = useAuthSession();
  const { isHindi } = useLanguage();
  const [showAttention, setShowAttention] = React.useState(true);

  // Take top 3 recent batches for clear scannable table
  const recentBatches = React.useMemo(() => {
    return MOCK_BATCHES.slice(0, 3);
  }, []);

  // Formatted display date
  const displayDate = React.useMemo(() => {
    const now = new Date();
    if (isHindi) {
      return "सोमवार, 28 सितम्बर 2026";
    }
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).toUpperCase();
  }, [isHindi]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================================= */}
      {/* LEVEL 1: HEADER & CONTEXT GREETING                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {displayDate}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {isHindi ? "नेटवर्क समन्वित" : "Consensus Synced"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {isHindi
              ? `नमस्ते, ${user?.fullName || "ऑपरेटर"}।`
              : `Namaste, ${user?.fullName || "Operator"}.`}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            {isHindi
              ? `आपकी मधुमक्खी शालाएं और शहद लॉट सामान्य रूप से सक्रिय हैं। 3 बैच और 54 छत्ते ब्लॉकचेन नेटवर्क पर सत्यापित हैं।`
              : `Your apiary network is stable. 3 harvest batches, 54 hives, and active quality verifications are in sync.`}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 font-medium cursor-pointer shadow-2xs hover:bg-muted/80"
            asChild
          >
            <Link href="/activities/new">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>{isHindi ? "निरीक्षण दर्ज करें" : "Log Inspection"}</span>
            </Link>
          </Button>

          <Button
            size="sm"
            className="h-9 text-xs gap-1.5 font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer transition-all"
            asChild
          >
            <Link href="/batches/new">
              <Plus className="h-4 w-4" />
              <span>{isHindi ? "+ नया बैच बनाएं" : "Record Harvest"}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 2: 4 KEY OVERVIEW KPI CARDS                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Hives */}
        <Link href="/hives" className="group block focus:outline-none">
          <Card className="p-4 border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isHindi ? "सक्रिय छत्ते" : "Active Hives"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
                <Wheat className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                54
              </span>
              <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                96% {isHindi ? "स्वस्थ" : "Healthy"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {isHindi ? "3 शालाएं • 42 फ्रेम शहद युक्त" : "Across 3 apiary yards • 42 honey frames"}
            </p>
          </Card>
        </Link>

        {/* Metric 2: Total Harvested */}
        <Link href="/batches" className="group block focus:outline-none">
          <Card className="p-4 border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isHindi ? "कुल शहद उत्पादन" : "Total Harvested"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
                <Boxes className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                281.1 <span className="text-base font-medium text-muted-foreground">kg</span>
              </span>
              <Badge variant="honey" className="text-[10px] py-0 px-1.5 font-mono">
                +32 kg
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {isHindi ? "3 बैच • चमोली एवं कुल्लू उत्पादन" : "3 harvest lots • Chamoli & Kullu origin"}
            </p>
          </Card>
        </Link>

        {/* Metric 3: Lab Certified Purity */}
        <Link href="/lab" className="group block focus:outline-none">
          <Card className="p-4 border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isHindi ? "प्रमाणित शुद्धता" : "Certified Purity"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
                <FlaskConical className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                100%
              </span>
              <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                Grade A
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {isHindi ? "शून्य मिलावट • NMR एवं FSSAI पास" : "Zero adulteration • NMR & FSSAI verified"}
            </p>
          </Card>
        </Link>

        {/* Metric 4: QR Verified Bottles */}
        <Link href="/bottles" className="group block focus:outline-none">
          <Card className="p-4 border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isHindi ? "सत्यापित बोतलें" : "Traceable Units"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 group-hover:scale-105 transition-transform">
                <QrCode className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                100
              </span>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                {isHindi ? "सक्रिय" : "Live"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {isHindi ? "100% सार्वजनिक क्यूआर सत्यापन" : "100% public anti-counterfeit QR active"}
            </p>
          </Card>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 3: ACTION REQUIRED / REQUIRES ATTENTION                            */}
      {/* ========================================================================= */}
      {showAttention && (
        <div className="rounded-xl border border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40 p-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                  {isHindi
                    ? "2 कार्यों पर आपके ध्यान की आवश्यकता है"
                    : "2 items require your operational attention"}
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-800/80 dark:text-amber-300/80">
                  {isHindi
                    ? "आवक हस्तांतरण TR-2026-0079 पावती सत्यापन प्रतीक्षा में है • बैच HC-RH-2026-0001 गुणवत्ता प्रमाणन के लिए तैयार है।"
                    : "Inbound custody transfer TR-2026-0079 awaits receipt confirmation • Raw batch HC-RH-2026-0001 is ready for lab testing."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 hover:bg-amber-100/70"
                asChild
              >
                <Link href="/receiving">
                  <span>{isHindi ? "पावती समीक्षा करें" : "Review Transfer"}</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => setShowAttention(false)}
                className="text-[11px] text-amber-800/70 hover:text-amber-950 dark:hover:text-amber-200 px-2 py-1 cursor-pointer font-medium"
              >
                {isHindi ? "हटाएं" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 3.5: REAL-TIME TELEMETRY & YIELD INTELLIGENCE (CHARTS)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <YieldForecastChart />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <HiveHealthChart />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEVEL 4: TASK-ORIENTED 2-COLUMN MAIN OPERATIONAL GRID                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (7 COLS): RECENT BATCHES & APIARY OVERVIEW                  */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Harvest Velocity & Floral Diversity Analytics */}
          <HarvestAnalyticsChart />

          {/* Card: Recent Honey Batches Table */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {isHindi ? "हाल के शहद बैच" : "Recent Honey Batches"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isHindi
                    ? "आपकी मधुमक्खी शालाओं से सत्यापित उत्पादन लॉट"
                    : "Cryptographically recorded harvest lots across your network"}
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-medium hover:bg-primary/5 h-8 gap-1 cursor-pointer"
                asChild
              >
                <Link href="/batches">
                  <span>{isHindi ? "सभी देखें" : "View All"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {batch.batchNumber}
                        </span>
                        <Badge
                          variant={batch.batchType === "Raw Honey" ? "honey" : "secondary"}
                          className="text-[10px] py-0 px-1.5"
                        >
                          {batch.batchType}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {batch.honeyType}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Wheat className="h-3 w-3 text-primary/70 shrink-0" />
                        <span>{batch.sourceApiaryName}</span>
                        <span>•</span>
                        <span>{batch.harvestDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-border/30 sm:border-0">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-foreground block">
                          {batch.weightKg} kg
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Verified Yield
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1 cursor-pointer shadow-2xs"
                        asChild
                      >
                        <Link href={`/batches/${batch.id}`}>
                          <span>{isHindi ? "विवरण" : "View"}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Apiary Yard Snapshot */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {isHindi ? "मधुमक्खी शाला स्थिति" : "Apiaries & Yard Health"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isHindi
                    ? "भौगोलिक स्थिति एवं सक्रिय कॉलोनियों का अवलोकन"
                    : "Real-time colony vitality and seasonal floral forage"}
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium h-8 gap-1.5 cursor-pointer"
                asChild
              >
                <Link href="/hives/new">
                  <Plus className="h-3 w-3" />
                  <span>{isHindi ? "नया छत्ता" : "Add Hive"}</span>
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3.5">
              {MOCK_APIARIES.map((apiary) => {
                const isQuarantine = apiary.status === "quarantine";
                const healthPercentage = isQuarantine ? 85 : 100;

                return (
                  <div
                    key={apiary.id}
                    className="p-3.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground">
                            {apiary.name}
                          </h4>
                          <Badge
                            variant={isQuarantine ? "warning" : "success"}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {isQuarantine
                              ? isHindi
                                ? "निगरानी में"
                                : "Observation"
                              : isHindi
                              ? "उत्कृष्ट"
                              : "Optimal"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {apiary.location} • {apiary.dominantFlora}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs font-bold text-foreground">
                          {apiary.hiveCount} {isHindi ? "छत्ते" : "Hives"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {isHindi ? "अंतिम जांच" : "Inspected"}: {apiary.lastInspectionDate}
                        </span>
                      </div>
                    </div>

                    {/* Simple Health Vitality Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span>{isHindi ? "कॉलोनी स्वास्थ्य दर" : "Colony Health Index"}</span>
                        <span className="font-mono text-foreground font-semibold">
                          {healthPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-border/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isQuarantine ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${healthPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (5 COLS): QUICK ACTIONS, RECENT ACTIVITY & CONTEXT         */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Quick Actions */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40">
              <CardTitle className="text-base font-bold text-foreground">
                {isHindi ? "त्वरित कार्य" : "Quick Actions"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isHindi
                  ? "दैनिक संचालन के लिए मुख्य प्रवेश बिंदु"
                  : "Common tasks and operational entries"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-2">
              <Link
                href="/batches/new"
                className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block">
                      {isHindi ? "शहद फसल बैच दर्ज करें" : "Start Harvest Batch"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isHindi ? "कच्चे शहद के ड्रम पंजीकृत करें" : "Register extraction drum & origins"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/activities/new"
                className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block">
                      {isHindi ? "छत्ता निरीक्षण दर्ज करें" : "Log Hive Inspection"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isHindi ? "रानी स्थिति, पराग एवं कीट उपचार" : "Queen health, pests & forage flow"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/bottles"
                className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block">
                      {isHindi ? "क्यूआर बोतल सत्यापन" : "Verify QR Bottles"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isHindi ? "उपभोक्ता विश्वास सील जांचें" : "Inspect anti-tamper retail units"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/lab"
                className="group flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block">
                      {isHindi ? "प्रयोगशाला गुणवत्ता पोर्टल" : "Laboratory Testing"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isHindi ? "नमी, HMF एवं NMR परीक्षण समीक्षा" : "Inspect C4, moisture & purity seals"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card: Recent Activity (Scan-Friendly Chronological Feed) */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {isHindi ? "हालिया गतिविधियां" : "Recent Activity"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isHindi
                    ? "सत्यापित ऑडिट इतिहास एवं घटनाएं"
                    : "Live cryptographic event updates"}
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-medium hover:bg-primary/5 h-8 gap-1 cursor-pointer"
                asChild
              >
                <Link href="/admin/audit">
                  <span>{isHindi ? "ऑडिट देखें" : "Audit Log"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-amber-500" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      {isHindi ? "कच्चा शहद लॉट पंजीकृत" : "Harvest Lot Weighed & Sealed"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Batch <strong className="text-foreground">HC-RH-2026-0001</strong> (185.5 kg) • Highland North Apiary
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" /> 2 hours ago
                    </span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-blue-500" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      {isHindi ? "कस्टडी हस्तांतरण प्रेषित" : "Custody Handover Dispatched"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Transfer <strong className="text-foreground">TR-2026-0079</strong> sent to Golden Hive Foods
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" /> 5 hours ago
                    </span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      {isHindi ? "प्रयोगशाला शुद्धता प्रमाणन जारी" : "Purity Grade A Certificate Issued"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      PureTrace Labs verified 100% genuine Himalayan multifloral origin
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" /> Yesterday
                    </span>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-purple-500" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      {isHindi ? "100 खुदरा बोतलें प्रकाशित" : "100 Retail QR Bottles Published"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Public tamper-proof ledger activated for batch HC-PB-2026-0001
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" /> 2 days ago
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Workspace Context (Replaces old massive duplicate cards) */}
          <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                {isHindi ? "सक्रिय कार्यक्षेत्र" : "Session Context"}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                ● Connected
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground truncate">
                  {selectedOrg?.name || "Highland Apiaries Cooperative"}
                </span>
                <Link
                  href="/select-organisation"
                  className="text-[11px] text-primary hover:underline font-medium shrink-0 ml-2"
                >
                  {isHindi ? "बदलें" : "Switch"}
                </Link>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selectedOrg?.displayType || "Beekeeper Cooperative"} • ID: {selectedOrg?.shortIdentifier || "ORG-HAC-01"}
              </p>
            </div>

            <div className="border-t border-border/40 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>{selectedRole?.name || "Beekeeper"}</span>
              </div>
              <Link
                href="/select-role"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                {isHindi ? "भूमिका बदलें" : "Change Role"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Dashboard", "डैशबोर्ड"), active: true },
        ]}
        defaultNavId="dashboard"
      >
        <DashboardContent />
      </AppShell>
    </AuthGuard>
  );
}

