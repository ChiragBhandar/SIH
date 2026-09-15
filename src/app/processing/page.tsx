"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
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
          Loading processing runs and eligible material...
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
              Processing & Blending
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-amber-500/40 text-amber-700 dark:text-amber-300">
              Material Transformation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Transform received honey batches while preserving complete input lineage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="gap-2 shadow-xs font-semibold cursor-pointer text-xs h-9">
            <Link href="/processing/new">
              <Plus className="h-4 w-4" />
              <span>Start Processing</span>
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
                Ready for Processing
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {readyForProcessingCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Received raw honey batches
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <PackageCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                In Processing
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {inProcessingCount}
              </h3>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                Active processing runs
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
                Completed Runs
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {completedJobsCount}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Verifiable output batches created
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Output Volume
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {totalOutputVolumeKg.toFixed(1)} kg
              </h3>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-0.5">
                Total processed yield
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Scale className="h-5 w-5" />
            </div>
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
                  Available Input Material ({eligibleInputBatches.length})
                </CardTitle>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Raw material batches accepted into manufacturer custody eligible for processing and blending.
              </CardDescription>
            </div>

            <Badge variant="outline" className="text-[11px] py-1 font-normal w-fit">
              Only received batches appear as eligible inputs
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          {eligibleInputBatches.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No received batches currently available in inventory. Receive inbound consignments in the Receiving module first.
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
                          {b.status === "Consumed partially for processing" ? "Partial" : "Received"}
                        </StatusBadge>
                      </div>

                      <span className="font-mono font-bold text-xs text-primary">
                        {availableKg.toFixed(1)} kg avl
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="text-foreground font-medium truncate">
                        {b.honeyType}
                      </p>
                      <p className="text-[11px] truncate">
                        Source: <strong>{b.currentCustodyOrgName || b.sourceApiaryName}</strong>
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-1 font-mono text-muted-foreground">
                        <span>Ref: {b.containerRef}</span>
                        <span>Harvest: {b.harvestDate}</span>
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
                          <span>View Batch</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        asChild
                        className="h-7 text-[11px] px-2.5 gap-1 font-semibold shadow-xs"
                      >
                        <Link href={`/processing/new?batchId=${b.batchNumber}`}>
                          <span>Process Batch</span>
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
            placeholder="Search by Job ID, batch, facility, operator, output..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Process:</span>
          </div>
          <select
            value={processTypeFilter}
            onChange={(e) => setProcessTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="Filtering">Filtering</option>
            <option value="Settling">Settling</option>
            <option value="Blending">Blending</option>
            <option value="Heating">Heating</option>
            <option value="Filling preparation">Filling preparation</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready">Ready</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Processing Jobs Table */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No processing jobs found"
          description="No processing or blending runs match your filter. Select eligible raw material and start a new processing run."
          action={
            <Button asChild size="sm">
              <Link href="/processing/new">+ Start Processing Run</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[150px]">Processing ID</TableHead>
                <TableHead>Input Batch(es)</TableHead>
                <TableHead>Process Type</TableHead>
                <TableHead className="text-right">Input Weight</TableHead>
                <TableHead className="text-right">Output Weight</TableHead>
                <TableHead className="text-right">Yield %</TableHead>
                <TableHead className="hidden md:table-cell">Facility & Line</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                        Ref: {job.processReferenceNumber}
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
                            ({inp.usedQuantityKg} kg)
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
                    {job.totalInputQuantityKg.toFixed(1)} kg
                  </TableCell>

                  <TableCell className="text-xs text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-foreground">
                        {job.outputQuantityKg.toFixed(1)} kg
                      </span>
                      <Link
                        href={`/batches/${job.outputBatchId}`}
                        className="font-mono text-[10px] text-primary hover:underline"
                      >
                        {job.outputBatchId}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-mono font-bold text-right text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
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
                      {job.status}
                    </StatusBadge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-7 text-xs px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Link href={`/processing/${job.id}`}>
                        View Details →
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
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Traceability", href: "#" },
          { label: "Processing & Blending", active: true },
        ]}
        defaultNavId="processing"
      >
        <ProcessingContent />
      </AppShell>
    </AuthGuard>
  );
}
