"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Boxes,
  ArrowLeft,
  Wheat,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Package,
  Warehouse,
  ExternalLink,
  ArrowLeftRight,
  Building,
  Sparkles,
  FlaskConical,
  Award,
  QrCode,
  Circle,
  Radio,
  Store,
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

function getBatchStatusBadgeVariant(
  status: string
): "success" | "warning" | "error" | "info" | "neutral" | "honey" {
  switch (status) {
    case "Received":
    case "Processed Batch Created":
    case "Quality Approved":
      return "success";
    case "Pending Custody Transfer":
    case "In Transit":
    case "Raw Batch Created":
    case "Consumed partially for processing":
    case "In Processing":
    case "Lab Testing":
      return "honey";
    case "Correction Requested":
    case "Correction Required":
      return "warning";
    case "Rejected":
      return "error";
    default:
      return "neutral";
  }
}

function BatchDetailContent() {
  const params = useParams();
  const batchId = params?.id as string;
  const {
    getBatch,
    getApiary,
    hives,
    getCustodyTransfersByBatch,
    getProcessingJobsByInputBatch,
    getProcessingJobByOutputBatch,
    getProcessingJob,
    getLabTestsByBatch,
    getLabTest,
    getCertification,
    getCertificationByBatch,
    getBottlesByBatch,
    getMarketplaceListingsByBatch,
    getMarketplaceOrdersByBatch,
    isLoaded,
  } = useTraceability();

  const batch = getBatch(batchId);
  const isProcessedBatch = batch?.batchType === "Processed Honey" || batch?.batchNumber.startsWith("HC-PB");
  
  const apiary = batch && batch.sourceApiaryId ? getApiary(batch.sourceApiaryId) : undefined;
  const linkedHives = batch && batch.sourceHiveIds ? hives.filter((h) => batch.sourceHiveIds?.includes(h.id)) : [];
  const transfers = batch ? getCustodyTransfersByBatch(batch.batchNumber) : [];
  const latestTransfer = transfers.length > 0 ? transfers[0] : undefined;

  // Marketplace activity links
  const marketplaceListings = batch ? getMarketplaceListingsByBatch(batch.batchNumber) : [];
  const marketplaceOrders = batch ? getMarketplaceOrdersByBatch(batch.batchNumber) : [];
  const hasMarketplaceActivity = marketplaceListings.length > 0 || marketplaceOrders.length > 0;

  // Bottling links
  const linkedBottles = batch ? getBottlesByBatch(batch.batchNumber) : [];

  // Processing links
  const downstreamJobs = batch ? getProcessingJobsByInputBatch(batch.batchNumber) : [];
  const parentJob = batch?.processingJobId ? getProcessingJob(batch.processingJobId) : (batch ? getProcessingJobByOutputBatch(batch.batchNumber) : undefined);

  // Laboratory & Certification links
  const labTests = batch ? getLabTestsByBatch(batch.batchNumber) : [];
  const latestLabTest = labTests.length > 0 ? labTests[0] : (batch?.labTestId ? getLabTest(batch.labTestId) : undefined);
  const cert = batch?.certificateId ? getCertification(batch.certificateId) : (batch ? getCertificationByBatch(batch.batchNumber) : undefined);

  const isCertified = batch?.status === "Quality Approved" || !!cert;
  const isEligibleForBottling = isProcessedBatch && isCertified && ((batch?.remainingWeightKg !== undefined ? batch.remainingWeightKg : batch?.weightKg) || 0) > 0;
  const canSubmitLab =
    isProcessedBatch &&
    !isCertified &&
    (!latestLabTest || latestLabTest.status === "Correction Required" || latestLabTest.status === "Rejected") &&
    batch?.status !== "Lab Testing";

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading batch traceability record...
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Boxes}
          title="Harvest batch not found"
          description={`No honey batch found matching ID "${batchId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/batches">Back to Honey Batches</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const initialWeight = batch.weightKg || 0;
  const usedWeight = batch.usedQuantityKg || 0;
  const remainingWeight = batch.remainingWeightKg !== undefined ? batch.remainingWeightKg : initialWeight;

  const canTransfer =
    !isProcessedBatch &&
    (batch.status === "Raw Batch Created" ||
      (batch.status === "Pending Custody Transfer" && !latestTransfer));

  const canProcess =
    !isProcessedBatch &&
    (batch.status === "Received" || batch.status === "Consumed partially for processing") &&
    remainingWeight > 0.05;

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
          <Link href="/batches">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Honey Batches</span>
          </Link>
        </Button>
      </div>

      {/* Main Header / Batch Identity Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {batch.batchNumber}
              </h1>
              <StatusBadge status={getBatchStatusBadgeVariant(batch.status)} size="sm">
                {batch.status}
              </StatusBadge>
              <StatusBadge
                status={isProcessedBatch ? "purple" : "honey"}
                size="sm"
                withDot={false}
              >
                {isProcessedBatch ? "Processed Honey Batch" : "Raw Bulk Honey Batch"}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isProcessedBatch
                ? `Processed & Filtered Honey Batch • Derived from verified raw material`
                : `Raw Bulk Honey Batch • Immutable provenance originating at ${batch.sourceApiaryName}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canTransfer && (
              <Button asChild size="default" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/custody/new?batchId=${batch.batchNumber}`}>
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>Initiate Custody Transfer</span>
                </Link>
              </Button>
            )}

            {canProcess && (
              <Button asChild size="default" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/processing/new?batchId=${batch.batchNumber}`}>
                  <Layers className="h-4 w-4" />
                  <span>Start Processing Run</span>
                </Link>
              </Button>
            )}

            {canSubmitLab && (
              <Button asChild size="default" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/lab/new?batchId=${batch.batchNumber}`}>
                  <FlaskConical className="h-4 w-4" />
                  <span>Submit Lab Sample</span>
                </Link>
              </Button>
            )}

            {latestLabTest && (
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-foreground">
                <Link href={`/lab/${latestLabTest.id}`}>
                  <FlaskConical className="h-4 w-4 text-primary" />
                  <span>Lab Test: {latestLabTest.id}</span>
                </Link>
              </Button>
            )}

            {cert && (
              <Button asChild size="sm" variant="success" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/certifications/${cert.id}`}>
                  <Award className="h-4 w-4" />
                  <span>Certificate: {cert.id}</span>
                </Link>
              </Button>
            )}

            {latestTransfer && latestTransfer.status === "Pending Acceptance" && (
              <Button asChild size="sm" variant="outline" className="gap-1.5 border-amber-300 text-amber-900 bg-amber-50">
                <Link href={`/custody/${latestTransfer.id}`}>
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>Transfer: {latestTransfer.id}</span>
                </Link>
              </Button>
            )}

            <StatusBadge
              status={
                isCertified
                  ? "success"
                  : isProcessedBatch
                  ? "purple"
                  : batch.status === "Received" || batch.status === "Consumed partially for processing"
                  ? "info"
                  : "warning"
              }
              size="sm"
            >
              <span>
                {isCertified
                  ? "Quality Certified & Approved"
                  : isProcessedBatch
                  ? "Lineage Derived from Source"
                  : batch.status === "Received" || batch.status === "Consumed partially for processing"
                  ? "Received by Manufacturer"
                  : batch.status === "Pending Custody Transfer"
                  ? "Custody Transfer Active"
                  : "Traceability Chain Active"}
              </span>
            </StatusBadge>
          </div>
        </div>

        {/* Primary Spec Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              {isProcessedBatch ? "Batch Type" : "Source Origin"}
            </span>
            <p className="text-xs font-semibold text-foreground truncate">
              {isProcessedBatch ? "Processed Honey" : batch.sourceApiaryName}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              {isProcessedBatch ? "Processing Date" : "Harvest Date"}
            </span>
            <p className="text-xs font-medium text-foreground">
              {isProcessedBatch ? (batch.processingDate || batch.harvestDate) : batch.harvestDate}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Honey Botanical Type
            </span>
            <p className="text-xs font-medium text-foreground">
              {batch.honeyType}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              {isProcessedBatch ? "Processed Output Weight" : "Total Harvest Weight"}
            </span>
            <p className="text-xs font-mono font-bold text-foreground">
              {initialWeight.toFixed(1)} kg
            </p>
          </div>
        </div>

        {/* Inventory & Remaining Volume Breakdown */}
        <div className="rounded-lg bg-muted/20 border border-border/60 p-3 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
              {isProcessedBatch ? "Total Processed Output" : "Original Harvest Weight"}
            </span>
            <span className="font-mono font-bold text-foreground">
              {initialWeight.toFixed(1)} kg
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
              {isProcessedBatch ? "Packaged into Bottles" : "Allocated to Processing"}
            </span>
            <span className="font-mono font-bold text-amber-700">
              {usedWeight.toFixed(1)} kg
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
              {isProcessedBatch ? "Available Remaining for Bottling" : "Available Remaining Volume"}
            </span>
            <span className="font-mono font-bold text-emerald-700">
              {remainingWeight.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Current Custody Org Banner */}
        <div className="rounded-lg bg-muted/20 border border-border/60 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary shrink-0" />
            <span>
              Current Custodian:{" "}
              <strong className="text-foreground font-semibold">
                {batch.currentCustodyOrgName || "Highland Apiaries Cooperative"}
              </strong>
            </span>
          </div>
          {latestTransfer && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span>Transfer: {latestTransfer.id}</span>
              <span>• Status: <strong>{latestTransfer.status}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LABORATORY TESTING & QUALITY APPROVAL GATE (FOR PROCESSED BATCHES) */}
      {/* ========================================================================= */}
      {isProcessedBatch && (
        <Card className={`border shadow-xs ${
          isCertified
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500/5 via-card to-card"
            : batch.status === "Rejected"
            ? "border-destructive/40 bg-destructive/5"
            : batch.status === "Correction Requested" || batch.status === "Correction Required"
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border bg-card"
        }`}>
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                {isCertified ? (
                  <Award className="h-4 w-4 text-emerald-600" />
                ) : (
                  <FlaskConical className="h-4 w-4 text-primary" />
                )}
                <CardTitle className="text-sm font-bold text-foreground">
                  Laboratory Testing & Quality Approval Gate
                </CardTitle>
                <StatusBadge
                  status={isCertified ? "success" : batch.status === "Rejected" ? "error" : "honey"}
                  size="sm"
                >
                  {isCertified ? "Quality Approved" : batch.status}
                </StatusBadge>
              </div>

              {canSubmitLab && (
                <Button asChild size="sm" className="h-7 text-xs gap-1.5 bg-primary hover:bg-amber-600">
                  <Link href={`/lab/new?batchId=${batch.batchNumber}`}>
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span>Submit Lab Sample</span>
                  </Link>
                </Button>
              )}
            </div>
            <CardDescription className="text-xs">
              Every processed honey batch must pass independent accredited laboratory testing before packaging and retail release.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            {/* If Approved & Certified */}
            {isCertified && cert && (
              <div className="rounded-xl border border-emerald-200 bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sm text-foreground flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>{cert.id}</span>
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Issued by {cert.issuedBy} • {cert.issuedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="success" size="sm">
                      QUALITY APPROVED
                    </StatusBadge>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                      <Link href={`/certifications/${cert.id}`}>
                        <span>View Certificate</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Packaging Readiness Indicator */}
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <QrCode className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong>Packaging Readiness:</strong> Eligible for bottle creation and retail QR generation.
                    </span>
                  </div>
                  <StatusBadge status="success" size="sm">
                    Step 8 Gateway Ready
                  </StatusBadge>
                </div>
              </div>
            )}

            {/* If Under Analysis / Awaiting Analysis */}
            {!isCertified && latestLabTest && (
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground text-sm">
                      {latestLabTest.id}
                    </span>
                    <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                      {latestLabTest.testPanel}
                    </Badge>
                    <StatusBadge status={getBatchStatusBadgeVariant(latestLabTest.status)} size="sm">
                      {latestLabTest.status}
                    </StatusBadge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Sample <strong>{latestLabTest.sample.id}</strong> ({latestLabTest.sample.quantity}) • Analyst: <strong>{latestLabTest.analyst.name}</strong>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Laboratory: {latestLabTest.laboratory.name}
                  </p>
                </div>

                <Button asChild size="sm" className="h-7 text-xs">
                  <Link href={`/lab/${latestLabTest.id}`}>
                    <span>Review Lab Test →</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* If Eligible but No Test Yet */}
            {!isCertified && !latestLabTest && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Eligible for Laboratory Testing:</strong> This completed processed batch is ready for composite sample extraction and purity panel certification.
                  </span>
                </div>
                <Button asChild size="sm" className="h-7 text-xs font-semibold shrink-0">
                  <Link href={`/lab/new?batchId=${batch.batchNumber}`}>
                    <FlaskConical className="h-3.5 w-3.5 mr-1" />
                    <span>Submit Sample</span>
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PACKAGING & BOTTLING SECTION (FOR PROCESSED BATCHES) */}
      {/* ========================================================================= */}
      {isProcessedBatch && (
        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Packaging & Bottle Creation ({linkedBottles.length} Bottles)
                </CardTitle>
              </div>
              <StatusBadge
                status={isEligibleForBottling ? "success" : isCertified ? "info" : "neutral"}
                size="sm"
              >
                {isEligibleForBottling ? "Eligible for Bottle Creation" : isCertified ? "Packaged" : "Requires Quality Approval"}
              </StatusBadge>
            </div>
            <CardDescription className="text-xs">
              Quality-approved bulk processed honey is packaged into individual serialized retail bottles with consumer verification QR codes.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 space-y-3">
            {/* Inventory stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/20 border border-border/80 text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
                  Processed Output
                </span>
                <span className="font-mono font-bold text-foreground">
                  {initialWeight.toFixed(1)} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
                  Packaged into Bottles
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {usedWeight.toFixed(1)} kg ({linkedBottles.length} units)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block font-semibold">
                  Remaining Bulk
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {remainingWeight.toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* If eligible for bottling callout */}
            {isEligibleForBottling && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    <strong>Ready for Packaging:</strong> {remainingWeight.toFixed(1)} kg certified honey available for bottling.
                  </span>
                </div>
                <Button asChild size="sm" className="h-7 text-xs shrink-0 gap-1">
                  <Link href={`/bottles/new?batch=${batch.id}`}>
                    <Package className="h-3 w-3" />
                    <span>Create Bottles</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* List of created bottles if any */}
            {linkedBottles.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Packaged Bottles & QR Identifiers</span>
                  <Button asChild variant="link" className="p-0 h-auto text-xs text-primary">
                    <Link href={`/bottles?batch=${batch.id}`}>
                      View All in Registry →
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {linkedBottles.slice(0, 6).map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <Link
                          href={`/bottles/${b.id}`}
                          className="font-mono font-bold text-primary hover:underline block truncate"
                        >
                          {b.id}
                        </Link>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {b.bottleSize} • {b.qrIdentifier}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 shrink-0 ${
                          b.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        }`}
                      >
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* DERIVED FROM SECTION (FOR PROCESSED BATCHES) */}
      {/* ========================================================================= */}
      {isProcessedBatch && batch.derivedFromBatches && batch.derivedFromBatches.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Derived From Source Raw Material ({batch.derivedFromBatches.length})
                </CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Parent Batch Lineage
              </Badge>
            </div>
            <CardDescription className="text-xs">
              This processed honey batch was created by transforming the following raw material batch(es). Complete original provenance remains intact.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 space-y-3">
            {batch.derivedFromBatches.map((src, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-sm">
                      {src.batchNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 font-mono">
                      Raw Batch
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Botanical: <strong>{src.honeyType}</strong> • Source: <strong>{src.sourceOrgName}</strong>
                  </p>
                  <p className="font-mono text-[11px] text-foreground">
                    Contributed Input: <strong>{src.usedQuantityKg.toFixed(1)} kg</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <Link href={`/batches/${src.batchId}`}>
                      <span>Inspect Source Raw Batch</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {parentJob && (
              <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
                <span className="text-muted-foreground">
                  Processing Job: <strong className="font-mono text-foreground">{parentJob.id}</strong> ({parentJob.processType} on {parentJob.line})
                </span>
                <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary hover:underline">
                  <Link href={`/processing/${parentJob.id}`}>
                    <span>View Processing Run Record →</span>
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* DOWNSTREAM PROCESSING JOBS (FOR RAW BATCHES) */}
      {/* ========================================================================= */}
      {!isProcessedBatch && downstreamJobs.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Downstream Processing Runs ({downstreamJobs.length})
                </CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                Material Lineage Active
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Material from this raw batch has been utilized in the following downstream processing and blending runs.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 space-y-3">
            {downstreamJobs.map((job) => {
              const matchedInput = job.inputBatches.find((b) => b.batchId === batch.batchNumber);
              return (
                <div
                  key={job.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground text-sm">
                        {job.id}
                      </span>
                      <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                        {job.processType}
                      </Badge>
                      <StatusBadge status="success" size="sm">
                        {job.status}
                      </StatusBadge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Used <strong>{matchedInput?.usedQuantityKg.toFixed(1) || 0} kg</strong> → Resulted in Processed Batch{" "}
                      <Link href={`/batches/${job.outputBatchId}`} className="font-mono text-primary font-semibold hover:underline">
                        {job.outputBatchId}
                      </Link>{" "}
                      ({job.outputQuantityKg.toFixed(1)} kg, {job.yieldPercentage.toFixed(1)}% yield)
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Facility: {job.facility.split(",")[0]} • Line: {job.line} • Operator: {job.operator}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                      <Link href={`/processing/${job.id}`}>
                        <span>View Processing Details</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>

                    <Button asChild size="sm" className="h-7 text-xs">
                      <Link href={`/batches/${job.outputBatchId}`}>
                        <span>Output Batch →</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MARKETPLACE ACTIVITY SECTION */}
      {/* ========================================================================= */}
      {hasMarketplaceActivity && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Marketplace Activity ({marketplaceListings.length} Listing{marketplaceListings.length === 1 ? "" : "s"}, {marketplaceOrders.length} Order{marketplaceOrders.length === 1 ? "" : "s"})
                </CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30 bg-primary/10">
                Commercial Records Linked
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Commercial marketplace listings and orders referencing authoritative batch <strong>{batch.batchNumber}</strong>. Material custody and physical batch lineage remain authoritatively distinct.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 space-y-3">
            {marketplaceListings.map((listing) => {
              const linkedOrders = marketplaceOrders.filter((o) => o.listingId === listing.id);
              return (
                <div
                  key={listing.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-3.5 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-border/60">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-semibold">Listing:</span>
                        <Link
                          href={`/marketplace/${listing.id}`}
                          className="font-mono font-bold text-primary hover:underline"
                        >
                          {listing.id}
                        </Link>
                        <Badge variant="outline" className="text-[10px] py-0 font-medium">
                          {listing.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Seller: <strong>{listing.sellerOrgName}</strong> • Available: <strong>{listing.availableQuantity} {listing.unit}</strong>
                      </p>
                    </div>

                    <Button asChild size="sm" variant="outline" className="h-7 text-xs shrink-0">
                      <Link href={`/marketplace/${listing.id}`}>
                        <span>View Marketplace Listing</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {/* Linked Orders */}
                  {linkedOrders.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Commercial Orders Placed on this Listing
                      </span>
                      {linkedOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-2.5 rounded-md border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-medium">Order:</span>
                              <Link
                                href={`/marketplace/orders/${ord.id}`}
                                className="font-mono font-bold text-foreground hover:underline"
                              >
                                {ord.id}
                              </Link>
                              <StatusBadge
                                status={
                                  ord.status === "Accepted"
                                    ? "success"
                                    : ord.status === "Pending"
                                    ? "warning"
                                    : "neutral"
                                }
                                size="sm"
                              >
                                {ord.status}
                              </StatusBadge>
                            </div>
                            <p className="text-muted-foreground text-[11px]">
                              Buyer: <strong>{ord.buyerOrgName}</strong> • Quantity: <strong className="font-mono text-emerald-700">{ord.quantity} {ord.unit}</strong> • Ref: <code>{ord.buyerReference}</code>
                            </p>
                          </div>

                          <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary hover:underline shrink-0">
                            <Link href={`/marketplace/orders/${ord.id}`}>
                              <span>Order Details →</span>
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">
                      No orders placed on this listing yet.
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* UNIFIED TRACEABILITY TIMELINE */}
      {/* ========================================================================= */}
      <Card className="border-border bg-card shadow-2xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Unified Batch Traceability Timeline
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {isProcessedBatch
                  ? "Verifiable lineage tracing back from output container to processing run, manufacturer intake, and original apiary harvest."
                  : "Complete verifiable custody chain linking physical apiary origins, harvest weighing, custody dispatch, manufacturer intake, and processing events."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 pb-6">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:sm:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-border">
            {batch.timeline.map((step, idx) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";

              return (
                <div key={idx} className="relative group">
                  {/* Timeline icon indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary animate-pulse"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    ) : (
                      <Circle className="h-2 w-2" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg border p-3.5 transition-colors ${
                      isCurrent
                        ? "border-primary/40 bg-primary/5 shadow-xs"
                        : isCompleted
                        ? "border-border bg-card"
                        : "border-dashed border-border/70 bg-muted/10 opacity-70"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {step.title}
                        </h4>
                        {step.badge && (
                          <Badge
                            variant={isCurrent ? "default" : "secondary"}
                            className="text-[10px] py-0 font-mono"
                          >
                            {step.badge}
                          </Badge>
                        )}
                      </div>

                      <span className="text-[11px] text-muted-foreground font-mono">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    {step.actor && (
                      <div className="text-[10px] text-muted-foreground mt-2 pt-1.5 border-t border-border/50">
                        Actor: <strong className="text-foreground">{step.actor}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custody Transfers & Receiving Records Module (if any) */}
      {transfers.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-primary" />
              <span>Custody Transfers for this Batch ({transfers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            {transfers.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-border/70 bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground text-sm">
                      {t.id}
                    </span>
                    <StatusBadge
                      status={
                        t.status === "Accepted"
                          ? "success"
                          : t.status === "Pending Acceptance"
                          ? "honey"
                          : "error"
                      }
                      size="sm"
                    >
                      {t.status}
                    </StatusBadge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    From <strong>{t.sourceOrgName}</strong> → To <strong>{t.destinationOrgName}</strong> ({t.quantityKg} kg)
                  </p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    Carrier: {t.transportRef} • Dispatched: {t.transferDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <Link href={`/custody/${t.id}`}>
                      <span>View Transfer Timeline</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                  {t.status === "Pending Acceptance" && (
                    <Button asChild size="sm" className="h-7 text-xs">
                      <Link href={`/receiving/${t.id}`}>
                        <span>Receive Intake</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Source Information & Provenance Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Origin Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wheat className="h-3.5 w-3.5 text-primary" />
              {isProcessedBatch ? "Parent Provenance" : "Source Apiary Origin"}
            </span>
            <CardTitle className="text-base font-bold text-foreground mt-1">
              {batch.sourceApiaryName}
            </CardTitle>
            <CardDescription className="text-xs">
              {apiary?.location || "Regional Himalayan Cooperative Network"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-md bg-muted/20 border border-border/60">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Geo Coordinates
                </span>
                <span className="font-mono text-foreground text-[11px]">
                  {apiary ? `${apiary.latitude.toFixed(4)}° N, ${apiary.longitude.toFixed(4)}° E` : "30.3956° N, 79.3308° E"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Elevation
                </span>
                <span className="font-medium text-foreground text-[11px]">
                  {apiary?.elevation || "1,850 m"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Botanical Flora
              </span>
              <p className="font-medium text-foreground text-xs mt-0.5">
                {apiary?.dominantFlora || batch.honeyType}
              </p>
            </div>

            {!isProcessedBatch && batch.sourceApiaryId && (
              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs h-7 text-primary hover:text-primary gap-1 cursor-pointer"
                >
                  <Link href={`/hives?apiary=${batch.sourceApiaryId}`}>
                    <span>View Apiary Details</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Details Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              Container & Storage Metadata
            </span>
            <CardTitle className="text-base font-bold text-foreground mt-1">
              {batch.containerRef}
            </CardTitle>
            <CardDescription className="text-xs">
              {isProcessedBatch ? "Certified Processing Storage Vessel" : "Sealed food-grade bulk container"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block flex items-center gap-1">
                <Warehouse className="h-3 w-3 text-muted-foreground" />
                Storage Facility Location
              </span>
              <p className="font-medium text-foreground text-xs">
                {batch.storageLocation}
              </p>
            </div>

            {batch.notes && (
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Batch Notes
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                  {batch.notes}
                </p>
              </div>
            )}

            <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Created by: <strong>{batch.createdBy}</strong></span>
              <span className="font-mono">
                {new Date(batch.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linked Hives Section (for raw batches) */}
      {!isProcessedBatch && batch.sourceHiveIdentifiers && batch.sourceHiveIdentifiers.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Linked Source Hive Colonies ({batch.sourceHiveIdentifiers.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Individual boxes harvested into this extraction batch.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {batch.sourceHiveIdentifiers.map((hiveIdentifier, idx) => {
                const matchedHive = linkedHives.find((h) => h.identifier === hiveIdentifier);
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-foreground">
                        {hiveIdentifier}
                      </span>
                      {matchedHive && (
                        <Badge variant="outline" className="text-[10px] py-0 font-mono">
                          {matchedHive.queenStatus}
                        </Badge>
                      )}
                    </div>

                    {matchedHive && (
                      <>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <Radio className="h-2.5 w-2.5 text-primary" />
                          <span>{matchedHive.nfcRfidId}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Stand: {matchedHive.locationInApiary}
                        </p>
                        <div className="pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-6 text-[10px] px-1.5 text-primary hover:underline hover:bg-transparent"
                          >
                            <Link href={`/hives/${matchedHive.id}`}>
                              View Hive Details →
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BatchDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Honey Batches", href: "/batches" },
          { label: "Batch Detail", active: true },
        ]}
        defaultNavId="batches"
      >
        <BatchDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
