"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Scale,
  ArrowRight,
  ExternalLink,
  PackageCheck,
  Wheat,
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

export function ProcessingContent() {
  const { processingJobs, getEligibleProcessingBatches, isLoaded } = useTraceability();
  const { selectedOrg } = useAuthSession();
  const { tr, trStatus } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [processTypeFilter, setProcessTypeFilter] = React.useState("all");

  const eligibleInputBatches = React.useMemo(() => {
    return getEligibleProcessingBatches(selectedOrg?.id);
  }, [getEligibleProcessingBatches, selectedOrg?.id]);

  const filteredJobs = React.useMemo(() => {
    return processingJobs.filter((job) => {
      const inputBatchStrings = job.inputBatches.map((b) => b.batchNumber).join(" ");
      const matchesSearch =
        job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.outputBatchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inputBatchStrings.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesType = processTypeFilter === "all" || job.processType === processTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [processingJobs, searchQuery, statusFilter, processTypeFilter]);

  // Metrics
  const readyForProcessingCount = eligibleInputBatches.length;
  const inProcessingCount = processingJobs.filter((j) => j.status === "In Progress").length;
  const completedJobsCount = processingJobs.filter((j) => j.status === "Completed").length;
  const totalOutputVolumeKg = processingJobs
    .filter((j) => j.status === "Completed")
    .reduce((sum, j) => sum + (j.outputQuantityKg || 0), 0);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading processing runs and eligible material...", "प्रसंस्करण कार्य और पात्र सामग्री लोड हो रही है...")}
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
              {tr("Processing & Blending", "प्रसंस्करण एवं सम्मिश्रण")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-amber-300 text-amber-900 bg-amber-50">
              {tr("Material Transformation", "सामग्री रूपांतरण")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Transform received honey batches while preserving complete input lineage.",
              "कच्चे शहद के लॉट को पूर्ण वंशावली व ट्रैसेबिलिटी संरक्षित करते हुए संसाधित करें।"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/processing/new">
              <Plus className="h-4 w-4" />
              <span>{tr("Start Processing", "प्रसंस्करण प्रारंभ करें")}</span>
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
                {tr("Ready for Processing", "प्रसंस्करण हेतु तैयार")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <PackageCheck className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {readyForProcessingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Received raw honey batches", "प्राप्त कच्चे शहद के बैच")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("In Processing", "प्रसंस्करण में")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {inProcessingCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Active processing runs", "सक्रिय प्रसंस्करण प्रक्रिया")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Completed Runs", "पूर्ण प्रक्रियाएं")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {completedJobsCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Verifiable output batches created", "सत्यापन योग्य आउटपुट बैच तैयार")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Output Volume", "उत्पादन मात्रा")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                <Scale className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {totalOutputVolumeKg.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{tr("kg", "किग्रा")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Total processed yield", "कुल प्रसंस्कृत उत्पादन")}
          </CardContent>
        </Card>
      </div>

      {/* Available Input Material Section */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  {tr("Available Input Material", "उपलब्ध कच्ची सामग्री")} ({eligibleInputBatches.length})
                </CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                {tr(
                  "Raw material batches accepted into manufacturer custody eligible for processing and blending.",
                  "निर्माता के पास स्वीकार किए गए कच्चे शहद के बैच जो प्रसंस्करण एवं सम्मिश्रण के योग्य हैं।"
                )}
              </CardDescription>
            </div>

            <Badge variant="outline" className="text-[11px] py-1 font-normal w-fit">
              {tr("Only received batches appear as eligible inputs", "केवल प्राप्त बैच ही प्रसंस्करण के पात्र हैं")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          {eligibleInputBatches.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {tr(
                "No received batches currently available in inventory. Receive inbound consignments in the Receiving module first.",
                "वर्तमान में इन्वेंट्री में कोई प्राप्त बैच उपलब्ध नहीं है। पहले प्राप्ति मॉड्यूल में आवक खेप स्वीकार करें।"
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {eligibleInputBatches.map((b) => {
                const availableKg = b.remainingWeightKg !== undefined ? b.remainingWeightKg : b.weightKg;
                return (
                  <div
                    key={b.id}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2.5 transition-colors hover:border-primary/40 hover:bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-foreground text-xs">
                          {b.batchNumber}
                        </span>
                        <StatusBadge
                          status={b.status === "Received" ? "success" : "honey"}
                          size="sm"
                        >
                          {b.status === "Consumed partially for processing"
                            ? tr("Partial", "आंशिक")
                            : tr("Received", "प्राप्त")}
                        </StatusBadge>
                      </div>

                      <span className="font-mono font-bold text-xs text-primary">
                        {availableKg.toFixed(1)} {tr("kg avl", "किग्रा उपलब्ध")}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="text-foreground font-medium truncate">
                        {b.honeyType}
                      </p>
                      <p className="text-[11px] truncate">
                        {tr("Source:", "स्रोत:")} <strong>{b.currentCustodyOrgName || b.sourceApiaryName}</strong>
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-1 font-mono text-muted-foreground">
                        <span>{tr("Ref:", "संदर्भ:")} {b.containerRef}</span>
                        <span>{tr("Harvest:", "कटाई:")} {b.harvestDate}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/batches/${b.id}`}>
                          <span>{tr("View Batch", "बैच देखें")}</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        asChild
                        className="h-7 text-[11px] px-2.5 gap-1 font-semibold shadow-xs"
                      >
                        <Link href={`/processing/new?batchId=${b.batchNumber}`}>
                          <span>{tr("Process Batch", "संसाधित करें")}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Jobs Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tr("Search by Job ID, batch, facility, operator, output...", "जॉब आईडी, बैच, संयंत्र, ऑपरेटर से खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>{tr("Process:", "प्रक्रिया:")}</span>
          </div>
          <select
            value={processTypeFilter}
            onChange={(e) => setProcessTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">{tr("All Types", "सभी प्रकार")}</option>
            <option value="Filtering">{tr("Filtering", "छानना")}</option>
            <option value="Settling">{tr("Settling", "स्थिरीकरण")}</option>
            <option value="Blending">{tr("Blending", "मिश्रण")}</option>
            <option value="Heating">{tr("Heating", "गरम करना")}</option>
            <option value="Filling preparation">{tr("Filling preparation", "भरने की तैयारी")}</option>
            <option value="Other">{tr("Other", "अन्य")}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
            <option value="Completed">{tr("Completed", "पूर्ण")}</option>
            <option value="In Progress">{tr("In Progress", "प्रगति पर")}</option>
            <option value="Ready">{tr("Ready", "तैयार")}</option>
            <option value="Cancelled">{tr("Cancelled", "रद्द")}</option>
          </select>
        </div>
      </div>

      {/* Processing Jobs Table */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={tr("No processing jobs found", "कोई प्रसंस्करण कार्य नहीं मिला")}
          description={tr(
            "No processing or blending runs match your filter. Select eligible raw material and start a new processing run.",
            "फ़िल्टर से मेल खाता कोई कार्य नहीं मिला। पात्र कच्चा माल चुनें और नया प्रसंस्करण कार्य शुरू करें।"
          )}
          action={
            <Button asChild size="sm">
              <Link href="/processing/new">+ {tr("Start Processing Run", "नया प्रसंस्करण प्रारंभ करें")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[150px]">{tr("Processing ID", "प्रसंस्करण आईडी")}</TableHead>
                <TableHead>{tr("Input Batch(es)", "इनपुट बैच")}</TableHead>
                <TableHead>{tr("Process Type", "प्रक्रिया प्रकार")}</TableHead>
                <TableHead className="text-right">{tr("Input Weight", "इनपुट वजन")}</TableHead>
                <TableHead className="text-right">{tr("Output Weight", "आउटपुट वजन")}</TableHead>
                <TableHead className="text-right">{tr("Yield %", "उत्पादन दर %")}</TableHead>
                <TableHead className="hidden md:table-cell">{tr("Facility & Line", "संयंत्र और लाइन")}</TableHead>
                <TableHead>{tr("Status", "स्थिति")}</TableHead>
                <TableHead className="text-right">{tr("Action", "कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs font-semibold">
                    <Link
                      href={`/processing/${job.id}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{job.id}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                    {job.processReferenceNumber && (
                      <span className="text-[10px] text-muted-foreground font-sans block">
                        {tr("Ref:", "संदर्भ:")} {job.processReferenceNumber}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-0.5">
                      {job.inputBatches.map((inp, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Link
                            href={`/batches/${inp.batchId}`}
                            className="font-mono font-medium text-foreground hover:text-primary hover:underline"
                          >
                            {inp.batchNumber}
                          </Link>
                          <span className="text-[10px] text-muted-foreground">
                            ({inp.usedQuantityKg} {tr("kg", "किग्रा")})
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="text-[10px] py-0 font-medium">
                      {job.processType}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs font-mono font-semibold text-foreground text-right whitespace-nowrap">
                    {job.totalInputQuantityKg.toFixed(1)} {tr("kg", "किग्रा")}
                  </TableCell>

                  <TableCell className="text-xs text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-foreground">
                        {job.outputQuantityKg.toFixed(1)} {tr("kg", "किग्रा")}
                      </span>
                      <Link
                        href={`/batches/${job.outputBatchId}`}
                        className="font-mono text-[10px] text-primary hover:underline"
                      >
                        {job.outputBatchId}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-mono font-bold text-right text-emerald-700 whitespace-nowrap">
                    {job.yieldPercentage.toFixed(2)}%
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                    <div className="flex flex-col truncate">
                      <span className="text-foreground font-medium truncate">
                        {job.facility.split(",")[0]}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {job.line}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={
                        job.status === "Completed"
                          ? "success"
                          : job.status === "In Progress"
                          ? "honey"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {trStatus(job.status)}
                    </StatusBadge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      asChild
                      className="text-primary hover:text-primary hover:bg-primary/10 font-medium"
                    >
                      <Link href={`/processing/${job.id}`}>
                        {tr("View Details →", "विवरण देखें →")}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function ProcessingPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Traceability", "ट्रेसेबिलिटी"), href: "#" },
          { label: tr("Processing & Blending", "प्रसंस्करण एवं सम्मिश्रण"), active: true },
        ]}
        defaultNavId="processing"
      >
        <ProcessingContent />
      </AppShell>
    </AuthGuard>
  );
}
