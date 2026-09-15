"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Layers,
  ArrowLeft,
  Wheat,
  Scale,
  Building,
  ExternalLink,
  ArrowDown,
  Sparkles,
  Package,
  UserCheck,
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
import { EmptyState } from "@/components/ui/empty-state";

export function ProcessingDetailContent() {
  const params = useParams();
  const jobId = params?.id as string;
  const { getProcessingJob, getBatch, isLoaded } = useTraceability();

  const job = getProcessingJob(jobId);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading processing run details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Layers}
          title="Processing job not found"
          description={`No processing or blending record found matching ID "${jobId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/processing">Back to Processing & Blending</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/processing">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Processing & Blending</span>
          </Link>
        </Button>
      </div>

      {/* Main Header / Job Identity Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {job.id}
              </h1>
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
              <Badge variant="secondary" className="font-mono text-xs">
                {job.processType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Material Transformation Run • Executed at {job.facility}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs py-1 px-3 gap-1.5 font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Immutable Processing Record</span>
            </Badge>
          </div>
        </div>

        {/* Primary Spec Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Processing Line
            </span>
            <p className="text-xs font-semibold text-foreground truncate">
              {job.line}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Total Input Weight
            </span>
            <p className="text-xs font-mono font-bold text-foreground">
              {job.totalInputQuantityKg.toFixed(1)} kg
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Output Weight
            </span>
            <p className="text-xs font-mono font-bold text-foreground">
              {job.outputQuantityKg.toFixed(1)} kg
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Yield Efficiency
            </span>
            <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {job.yieldPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Operator and Facility Banner */}
        <div className="rounded-lg bg-muted/20 border border-border/60 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              Supervising Operator:{" "}
              <strong className="text-foreground font-semibold">
                {job.operator}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span>Start: {job.startDate}</span>
            {job.endDate && <span>• End: {job.endDate}</span>}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROMINENT MATERIAL LINEAGE SECTION */}
      {/* ========================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Material Lineage & Batch Derivation
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Verifiable material flow linking source raw honey input batches, processing transformations, and the resultant processed honey batch.
                </CardDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-[11px] border-primary/30 text-primary font-mono">
              Bi-directional Linkage
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-5 pb-6 space-y-4">
          {/* STEP 1: INPUT BATCHES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Wheat className="h-4 w-4 text-primary" />
                Input Batches ({job.inputBatches.length})
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Total Used: <strong className="text-foreground">{job.totalInputQuantityKg.toFixed(1)} kg</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {job.inputBatches.map((inp, idx) => {
                const rawBatchRecord = getBatch(inp.batchId);
                const remaining = rawBatchRecord?.remainingWeightKg !== undefined
                  ? rawBatchRecord.remainingWeightKg
                  : (inp.availableQuantityKg - inp.usedQuantityKg);

                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-2.5 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/batches/${inp.batchId}`}
                        className="font-mono font-bold text-sm text-primary hover:underline flex items-center gap-1.5"
                      >
                        <span>{inp.batchNumber}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Link>

                      <Badge variant="outline" className="text-[10px] py-0 font-mono">
                        Raw Honey Batch
                      </Badge>
                    </div>

                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p className="text-foreground font-medium truncate">
                        {inp.honeyType}
                      </p>
                      <p className="text-[11px]">
                        Origin: <strong>{inp.sourceOrgName}</strong>
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px] font-mono">
                        <span className="text-primary font-semibold">
                          Used in Job: {inp.usedQuantityKg.toFixed(1)} kg
                        </span>
                        <span className="text-muted-foreground">
                          Remaining in batch: {remaining.toFixed(1)} kg
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full h-7 text-xs text-primary hover:underline hover:bg-primary/5 mt-1"
                    >
                      <Link href={`/batches/${inp.batchId}`}>
                        <span>View Original Raw Batch Details →</span>
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONNECTOR ARROW */}
          <div className="flex items-center justify-center py-1">
            <div className="flex flex-col items-center gap-1 text-primary">
              <span className="text-[10px] font-mono font-semibold tracking-wider uppercase text-muted-foreground">
                Material Transformation Flow
              </span>
              <ArrowDown className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          {/* STEP 2: PROCESSING EVENT */}
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-foreground text-sm">
                  Processing Event: {job.id}
                </h4>
                <Badge variant="default" className="text-[10px] py-0 font-mono">
                  {job.processType}
                </Badge>
              </div>

              <span className="text-xs font-mono text-muted-foreground">
                Executed: {job.startDate}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {job.facility} • {job.line} • Operator: <strong>{job.operator}</strong>
            </p>

            {job.processNotes && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-primary/20 leading-relaxed italic">
                &ldquo;{job.processNotes}&rdquo;
              </p>
            )}
          </div>

          {/* CONNECTOR ARROW */}
          <div className="flex items-center justify-center py-1">
            <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ArrowDown className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          {/* STEP 3: OUTPUT BATCH */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Output Batch
            </span>

            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-3 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/batches/${job.outputBatchId}`}
                      className="font-mono font-bold text-base text-primary hover:underline flex items-center gap-1.5"
                    >
                      <span>{job.outputBatchId}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-mono">
                      Processed Honey Batch
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    {job.outputHoneyType}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
                    Net Output Quantity
                  </span>
                  <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {job.outputQuantityKg.toFixed(1)} kg ({job.yieldPercentage.toFixed(2)}% yield)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-xs text-muted-foreground">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Container Ref
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    {job.outputContainerRef}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Storage Location
                  </span>
                  <span className="text-foreground truncate block">
                    {job.outputStorageLocation}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Derived from: <strong>{job.inputBatches.map((b) => b.batchNumber).join(", ")}</strong>
                </span>

                <Button
                  size="sm"
                  asChild
                  className="h-7 text-xs gap-1 font-semibold shadow-xs"
                >
                  <Link href={`/batches/${job.outputBatchId}`}>
                    <span>View Processed Batch Traceability →</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Details and Process Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facility & Line Specs */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Building className="h-4 w-4 text-primary" />
              <span>Facility & Line Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">
                Facility Name
              </span>
              <p className="font-medium text-foreground text-xs">
                {job.facility}
              </p>
            </div>

            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">
                Equipment Line
              </span>
              <p className="font-medium text-foreground text-xs font-mono">
                {job.line}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
              <div>
                <span>Run Reference:</span>
                <p className="font-mono text-foreground font-semibold">
                  {job.processReferenceNumber || "N/A"}
                </p>
              </div>
              <div>
                <span>Managing Organisation:</span>
                <p className="text-foreground font-semibold">
                  {job.orgName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Notes & Yield Audit */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-primary" />
              <span>Mass Balance & Yield Audit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-md bg-muted/20 border border-border/60">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Material Loss / Tare
                </span>
                <span className="font-mono font-bold text-foreground text-xs">
                  {(job.totalInputQuantityKg - job.outputQuantityKg).toFixed(1)} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Efficiency Status
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                  {job.yieldPercentage >= 95 ? "High Yield (>95%)" : "Standard Yield"}
                </span>
              </div>
            </div>

            {job.outputNotes && (
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Output Quality Observations
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                  {job.outputNotes}
                </p>
              </div>
            )}

            <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Logged By: {job.createdBy}</span>
              <span>{new Date(job.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProcessingDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Processing & Blending", href: "/processing" },
          { label: "Processing Detail", active: true },
        ]}
        defaultNavId="processing"
      >
        <ProcessingDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
