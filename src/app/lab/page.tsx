"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  FlaskConical,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  Award,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { useLanguage } from "@/context/language-context";

export function LaboratoryDashboardContent() {
  const { labTests, getEligibleLabTestingBatches, isLoaded } = useTraceability();
  const { isHindi, tr } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [panelFilter, setPanelFilter] = React.useState<string>("all");

  const eligibleBatches = React.useMemo(() => {
    return getEligibleLabTestingBatches();
  }, [getEligibleLabTestingBatches]);

  const filteredTests = React.useMemo(() => {
    return labTests.filter((test) => {
      const matchesSearch =
        test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.sample.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.analyst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.testPanel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        test.status.toLowerCase().replace(" ", "_") === statusFilter.toLowerCase().replace(" ", "_") ||
        test.status === statusFilter;

      const matchesPanel = panelFilter === "all" || test.testPanel === panelFilter;

      return matchesSearch && matchesStatus && matchesPanel;
    });
  }, [labTests, searchQuery, statusFilter, panelFilter]);

  // Counts
  const awaitingCount = labTests.filter((t) => t.status === "Awaiting Analysis").length;
  const inAnalysisCount = labTests.filter((t) => t.status === "In Analysis").length;
  const approvedCount = labTests.filter((t) => t.status === "Approved").length;
  const rejectedCount = labTests.filter((t) => t.status === "Rejected" || t.status === "Correction Required").length;

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "error" | "info" | "neutral" | "honey" => {
    switch (status) {
      case "Approved":
        return "success";
      case "In Analysis":
        return "info";
      case "Awaiting Analysis":
        return "honey";
      case "Rejected":
        return "error";
      case "Correction Required":
        return "warning";
      default:
        return "neutral";
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading laboratory testing data and quality gate records...", "प्रयोगशाला परीक्षण डेटा और गुणवत्ता रिकॉर्ड लोड हो रहे हैं...")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {tr("Laboratory Testing", "प्रयोगशाला परीक्षण")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary bg-primary/5">
              {tr("Quality Approval Gate", "गुणवत्ता स्वीकृति द्वार")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Review samples, record test results, and issue quality certifications.",
              "नमूनों की समीक्षा करें, परीक्षण परिणाम दर्ज करें और गुणवत्ता प्रमाणपत्र जारी करें।"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/lab/new">
              <Plus className="h-4 w-4" />
              <span>{tr("Submit Sample", "नमूना जमा करें")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Awaiting Sample / Analysis", "नमूना / विश्लेषण प्रतीक्षित")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {awaitingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Queued for lab intake", "प्रयोगशाला जांच हेतु कतारबद्ध")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Under Analysis", "विश्लेषण जारी")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                <FlaskConical className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {inAnalysisCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Chromatography & screening running", "क्रोमैटोग्राफी और स्क्रीनिंग जारी")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Quality Approved", "गुणवत्ता स्वीकृत")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {approvedCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Certified & ready for packaging", "प्रमाणित और पैकेजिंग हेतु तैयार")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Rejected / Correction", "अस्वीकृत / सुधार आवश्यक")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {rejectedCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Investigation / Review required", "जांच / समीक्षा आवश्यक")}
          </CardContent>
        </Card>
      </div>

      {/* Eligible Batches for Lab Submission Section */}
      {eligibleBatches.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-600" />
                  <CardTitle className="text-base font-bold text-foreground">
                    {tr(
                      "Processed Batches Eligible for Laboratory Submission",
                      "प्रयोगशाला जमा हेतु पात्र प्रसंस्कृत बैच"
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="border-amber-300 text-amber-900 bg-amber-50 font-mono text-[10px]">
                    {isHindi ? `${eligibleBatches.length} पात्र` : `${eligibleBatches.length} Eligible`}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  {tr(
                    "Only completed processed honey batches are eligible for laboratory sample collection and certification testing.",
                    "केवल पूर्ण प्रसंस्कृत शहद बैच ही प्रयोगशाला नमूना संग्रह और प्रमाणीकरण परीक्षण के पात्र हैं।"
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {eligibleBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-3 hover:border-amber-400 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground text-sm">
                          {batch.batchNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 border-emerald-200 text-emerald-800 bg-emerald-50">
                          {tr("Eligible", "पात्र")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {batch.honeyType}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {batch.weightKg.toFixed(1)} kg
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/50 text-muted-foreground">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block font-semibold">
                        {tr("Processing Date", "प्रसंस्करण दिनांक")}
                      </span>
                      <span className="font-medium text-foreground">{batch.processingDate || batch.harvestDate || "2026-09-14"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block font-semibold">
                        {tr("Current Status", "वर्तमान स्थिति")}
                      </span>
                      <span className="font-medium text-amber-800">
                        {tr("Completed", "पूर्ण")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs flex-1">
                      <Link href={`/batches/${batch.batchNumber}`}>
                        <span>{tr("Batch Details", "बैच विवरण")}</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="h-7 text-xs gap-1.5 flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                      <Link href={`/lab/new?batchId=${batch.batchNumber}`}>
                        <FlaskConical className="h-3.5 w-3.5" />
                        <span>{tr("Submit Sample", "नमूना जमा करें")}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Testing & Samples Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <FlaskConical className="h-4 w-4" />
                </div>
                <span>{tr("Laboratory Tests & Analysis Queue", "प्रयोगशाला परीक्षण एवं विश्लेषण कतार")}</span>
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {tr(
                  "Audit and log immutable laboratory test determinations, chemical parameters, and certification decisions.",
                  "अपरिवर्तनीय प्रयोगशाला परीक्षण निर्धारण, रासायनिक पैरामीटर और प्रमाणीकरण निर्णयों का ऑडिट और रिकॉर्ड करें।"
                )}
              </CardDescription>
            </div>

            {/* Filter Pills / Tabs with Count Badges */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/60">
              {[
                { id: "all", label: tr("All Tests", "सभी परीक्षण"), count: labTests.length },
                { id: "Awaiting Analysis", label: tr("Awaiting", "प्रतीक्षित"), count: awaitingCount },
                { id: "In Analysis", label: tr("In Analysis", "विश्लेषण जारी"), count: inAnalysisCount },
                { id: "Approved", label: tr("Approved", "स्वीकृत"), count: approvedCount },
                { id: "Rejected", label: tr("Correction / Reject", "सुधार / अस्वीकृत"), count: rejectedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    statusFilter === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search bar & Panel selector */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr(
                  "Search by Test ID, Batch ID, Sample ID, analyst, or panel...",
                  "परीक्षण आईडी, बैच आईडी, नमूना आईडी, विश्लेषक या पैनल से खोजें..."
                )}
                className="w-full rounded-lg border border-input bg-background/60 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <select
              value={panelFilter}
              onChange={(e) => setPanelFilter(e.target.value)}
              className="rounded-lg border border-input bg-background/60 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:w-56 font-medium"
            >
              <option value="all">{tr("All Test Panels", "सभी परीक्षण पैनल")}</option>
              <option value="Full honey quality panel">{tr("Full honey quality panel", "पूर्ण शहद गुणवत्ता पैनल")}</option>
              <option value="Basic quality panel">{tr("Basic quality panel", "बुनियादी गुणवत्ता पैनल")}</option>
              <option value="Adulteration screening">{tr("Adulteration screening", "मिलावट जांच (स्क्रीनिंग)")}</option>
              <option value="Microbiological panel">{tr("Microbiological panel", "माइक्रोबायोलॉजिकल पैनल")}</option>
              <option value="Custom">{tr("Custom", "कस्टम")}</option>
            </select>
          </div>

          {/* Result counter row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>
              {isHindi ? (
                <>कुल {labTests.length} में से <strong className="text-foreground">{filteredTests.length}</strong> प्रयोगशाला रिकॉर्ड प्रदर्शित</>
              ) : (
                <>Showing <strong className="text-foreground">{filteredTests.length}</strong> of {labTests.length} laboratory records</>
              )}
            </span>
            {(searchQuery || statusFilter !== "all" || panelFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPanelFilter("all");
                }}
                className="text-primary hover:underline font-semibold text-xs"
              >
                {tr("Clear Filters", "फ़िल्टर हटाएं")}
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTests.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={FlaskConical}
                title={tr("No laboratory tests found", "कोई प्रयोगशाला परीक्षण नहीं मिला")}
                description={
                  searchQuery || statusFilter !== "all" || panelFilter !== "all"
                    ? tr("No lab test records matched your filter criteria.", "आपके फ़िल्टर मानदंडों से मेल खाने वाला कोई परीक्षण रिकॉर्ड नहीं मिला।")
                    : tr("No laboratory samples have been submitted yet.", "अभी तक कोई प्रयोगशाला नमूना जमा नहीं किया गया है।")
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/lab/new">{tr("Submit First Sample", "पहला नमूना जमा करें")}</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40 border-b border-border/80">
                  <TableRow className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <TableHead className="whitespace-nowrap min-w-[110px] pl-3.5">{tr("Test ID", "परीक्षण आईडी")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[120px]">{tr("Batch ID", "बैच आईडी")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[135px]">{tr("Sample Spec", "नमूना विवरण")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[135px]">{tr("Submitted By", "जमाकर्ता")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[105px]">{tr("Date", "दिनांक")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[145px]">{tr("Test Type", "परीक्षण प्रकार")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[105px]">{tr("Status", "स्थिति")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[135px]">{tr("Lab Analyst", "लैब विश्लेषक")}</TableHead>
                    <TableHead className="whitespace-nowrap min-w-[130px] text-right pr-3.5">{tr("Action", "कार्रवाई")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => (
                    <TableRow key={test.id} className="hover:bg-amber-500/5 transition-colors border-b border-border/50 text-xs">
                      {/* Test ID Badge */}
                      <TableCell className="pl-3.5 whitespace-nowrap">
                        <Link
                          href={`/lab/${test.id}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2 py-0.5 rounded-md transition-all shadow-2xs group"
                        >
                          <FlaskConical className="h-3 w-3 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
                          <span>{test.id}</span>
                        </Link>
                      </TableCell>

                      {/* Batch ID Pill */}
                      <TableCell className="whitespace-nowrap">
                        <Link
                          href={`/batches/${test.batchNumber}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground/90 hover:text-primary bg-muted/60 hover:bg-muted px-1.5 py-0.5 rounded border border-border/70 transition-colors"
                        >
                          <span>{test.batchNumber}</span>
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground opacity-60" />
                        </Link>
                      </TableCell>

                      {/* Sample Info */}
                      <TableCell className="whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-bold text-foreground tracking-tight block">
                            {test.sample.id}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="px-1.5 py-0.2 rounded bg-muted font-mono font-medium text-[10px] text-foreground/80">
                              {test.sample.quantity}
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="truncate max-w-[110px] font-medium">{test.sample.containerRef}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Submitted By */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                            {test.submittedBy.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-foreground truncate max-w-[130px]" title={test.submittedBy}>
                              {test.submittedBy.includes("(") ? test.submittedBy.split("(")[0].trim() : test.submittedBy}
                            </div>
                            {test.submittedBy.includes("(") && (
                              <div className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                                {test.submittedBy.slice(test.submittedBy.indexOf("(") + 1, -1)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Submitted Date & Time */}
                      <TableCell className="whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-foreground">
                            {test.submittedDate.split(" ")[0]}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 text-muted-foreground/70" />
                            <span>{test.submittedDate.split(" ")[1] || "12:00"} IST</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Test Panel & Priority */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="secondary" className="text-[11px] font-medium py-0.5 px-2 bg-secondary/80 border border-border/60">
                            {test.testPanel}
                          </Badge>
                          {test.priority === "Urgent" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                              {tr("Urgent", "अति आवश्यक")}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge status={getStatusBadgeVariant(test.status)} size="sm">
                          {test.status}
                        </StatusBadge>
                      </TableCell>

                      {/* Lab Analyst */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-border flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-[10px] shrink-0">
                            {test.analyst.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate block max-w-[130px]" title={test.analyst.name}>
                              {test.analyst.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate block max-w-[130px]">
                              {test.laboratory?.name || "PureTrace Lab"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {test.certificateId && (
                            <Button asChild size="sm" variant="outline" className="h-7 text-xs border-emerald-300 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 font-semibold px-2">
                              <Link href={`/certifications/${test.certificateId}`}>
                                <Award className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                <span>{tr("Cert", "प्रमाणपत्र")}</span>
                              </Link>
                            </Button>
                          )}
                          <Button asChild size="sm" variant={test.status === "Approved" ? "outline" : "default"} className={`h-7 text-xs font-semibold px-2.5 ${test.status !== "Approved" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}`}>
                            <Link href={`/lab/${test.id}`} className="gap-1">
                              <span>{test.status === "Approved" ? tr("Audit", "ऑडिट") : tr("Review", "समीक्षा")}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LaboratoryPage() {
  return (
    <AuthGuard>
      <AppShell>
        <LaboratoryDashboardContent />
      </AppShell>
    </AuthGuard>
  );
}
