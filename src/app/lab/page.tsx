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

export function LaboratoryDashboardContent() {
  const { labTests, getEligibleLabTestingBatches, isLoaded } = useTraceability();

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
          Loading laboratory testing data and quality gate records...
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
              Laboratory Testing
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary bg-primary/5">
              Quality Approval Gate
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review samples, record test results, and issue quality certifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/lab/new">
              <Plus className="h-4 w-4" />
              <span>Submit Sample</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Awaiting Sample / Analysis
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {awaitingCount}
              </h3>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                Queued for lab intake
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Under Analysis
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {inAnalysisCount}
              </h3>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                Chromatography & screening running
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FlaskConical className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Quality Approved
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {approvedCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Certified & ready for packaging
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Rejected / Correction
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {rejectedCount}
              </h3>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                Investigation / Review required
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eligible Batches for Lab Submission Section */}
      {eligibleBatches.length > 0 && (
        <Card className="border-border bg-gradient-to-r from-amber-500/5 via-card to-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-base font-bold text-foreground">
                    Processed Batches Eligible for Laboratory Submission
                  </CardTitle>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
                    {eligibleBatches.length} Eligible
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Only completed processed honey batches are eligible for laboratory sample collection and certification testing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {eligibleBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="rounded-xl border border-amber-500/30 bg-card p-4 space-y-3 hover:border-amber-500/60 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground text-sm">
                          {batch.batchNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
                          Eligible
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
                      <span className="text-[9px] uppercase tracking-wider block font-semibold">Processing Date</span>
                      <span className="font-medium text-foreground">{batch.processingDate || batch.harvestDate || "2026-09-14"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block font-semibold">Current Status</span>
                      <span className="font-medium text-amber-700 dark:text-amber-300">Completed</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs flex-1">
                      <Link href={`/batches/${batch.batchNumber}`}>
                        <span>Batch Details</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="h-7 text-xs gap-1.5 flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                      <Link href={`/lab/new?batchId=${batch.batchNumber}`}>
                        <FlaskConical className="h-3.5 w-3.5" />
                        <span>Submit Sample</span>
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
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                <span>Laboratory Tests & Analysis Queue</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Audit and log immutable laboratory test determinations, chemical parameters, and certification decisions.
              </CardDescription>
            </div>

            {/* Filter Pills / Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60">
              {[
                { id: "all", label: "All Tests" },
                { id: "Awaiting Analysis", label: "Awaiting Analysis" },
                { id: "In Analysis", label: "In Analysis" },
                { id: "Approved", label: "Approved" },
                { id: "Rejected", label: "Rejected / Correction" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === tab.id
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar & Panel selector */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Test ID, Batch ID, Sample ID, analyst, or panel..."
                className="w-full rounded-md border border-input bg-background/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
            </div>
            <select
              value={panelFilter}
              onChange={(e) => setPanelFilter(e.target.value)}
              className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring sm:w-56"
            >
              <option value="all">All Test Panels</option>
              <option value="Full honey quality panel">Full honey quality panel</option>
              <option value="Basic quality panel">Basic quality panel</option>
              <option value="Adulteration screening">Adulteration screening</option>
              <option value="Microbiological panel">Microbiological panel</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTests.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={FlaskConical}
                title="No laboratory tests found"
                description={
                  searchQuery || statusFilter !== "all" || panelFilter !== "all"
                    ? "No lab test records matched your filter criteria."
                    : "No laboratory samples have been submitted yet."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/lab/new">Submit First Sample</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-foreground">Test ID</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Batch ID</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Sample</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Submitted By</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Submitted Date</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Test Type</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Lab Analyst</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => (
                    <TableRow key={test.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-foreground">
                        <Link href={`/lab/${test.id}`} className="hover:underline flex items-center gap-1 text-primary">
                          <span>{test.id}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground">
                        <Link href={`/batches/${test.batchNumber}`} className="hover:underline flex items-center gap-1">
                          <span>{test.batchNumber}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-medium text-foreground block">
                            {test.sample.id}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {test.sample.quantity} • {test.sample.containerRef}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {test.submittedBy}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {test.submittedDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[11px] font-medium py-0">
                            {test.testPanel}
                          </Badge>
                          {test.priority === "Urgent" && (
                            <Badge variant="outline" className="text-[10px] py-0 border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusBadgeVariant(test.status)} size="sm">
                          {test.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        <span className="truncate max-w-[140px] block" title={test.analyst.name}>
                          {test.analyst.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {test.certificateId && (
                            <Button asChild size="xs" variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                              <Link href={`/certifications/${test.certificateId}`}>
                                <Award className="h-3 w-3" />
                                <span>Cert</span>
                              </Link>
                            </Button>
                          )}
                          <Button asChild size="xs" variant={test.status === "Approved" ? "outline" : "default"}>
                            <Link href={`/lab/${test.id}`}>
                              <span>{test.status === "Approved" ? "View Audit" : "Review Test"}</span>
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
