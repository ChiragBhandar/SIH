"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  ArrowLeft,
  Package,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { BottleSize } from "@/types/bottle";
import { BOTTLE_SIZE_WEIGHTS } from "@/data/mock-bottles";

export function CreateBottlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch");

  const {
    getEligibleBottlingBatches,
    getBatch,
    getCertification,
    getCertificationByBatch,
    bottles,
    createPackagingRun,
    isLoaded,
  } = useTraceability();

  const eligibleBatches = getEligibleBottlingBatches();

  // Form State
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    preselectedBatchId || (eligibleBatches.length > 0 ? eligibleBatches[0].id : "")
  );
  const [productName, setProductName] = React.useState("Highland Wild Mountain Raw Honey");
  const [bottleSize, setBottleSize] = React.useState<BottleSize>("500 g");
  const [numberOfBottles, setNumberOfBottles] = React.useState<number>(100);
  const [packagingDate, setPackagingDate] = React.useState("2026-09-14");
  const [packagingFacility, setPackagingFacility] = React.useState(
    "Golden Hive Bottling Plant, Solan Industrial Facility"
  );
  const [packagingLine, setPackagingLine] = React.useState("Line 01 - Automatic Micro-Filler");
  const [lotReferenceCode, setLotReferenceCode] = React.useState("LOT-2026-09-B2");
  const [notes, setNotes] = React.useState(
    "Packaged from verified certified mountain honey batch. Sealed with tamper-evident security foil."
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Auto-sync if batch changes
  const selectedBatch = getBatch(selectedBatchId);
  const cert = selectedBatch
    ? selectedBatch.certificateId
      ? getCertification(selectedBatch.certificateId)
      : getCertificationByBatch(selectedBatch.batchNumber)
    : undefined;

  const availableWeightKg = selectedBatch
    ? selectedBatch.remainingWeightKg !== undefined
      ? selectedBatch.remainingWeightKg
      : selectedBatch.weightKg
    : 0;

  const unitWeightKg = BOTTLE_SIZE_WEIGHTS[bottleSize] || 0.5;
  const totalPackagedKg = Number((numberOfBottles * unitWeightKg).toFixed(2));
  const remainingWeightKg = Number((availableWeightKg - totalPackagedKg).toFixed(2));

  const isOverLimit = totalPackagedKg > availableWeightKg;

  // Next Bottle ID sequence preview
  const nextStartNum = bottles.length + 1;
  const nextEndNum = nextStartNum + Math.max(1, numberOfBottles) - 1;
  const previewStartId = `HC-BTL-2026-${String(nextStartNum).padStart(5, "0")}`;
  const previewEndId = `HC-BTL-2026-${String(nextEndNum).padStart(5, "0")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) {
      setErrorMsg("Please select a quality-approved processed honey batch.");
      return;
    }

    if (numberOfBottles <= 0) {
      setErrorMsg("Number of bottles must be greater than 0.");
      return;
    }

    if (isOverLimit) {
      setErrorMsg(
        `Total packaged weight (${totalPackagedKg} kg) exceeds available batch weight (${availableWeightKg} kg).`
      );
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = createPackagingRun({
        sourceBatchId: selectedBatch.id,
        productName: productName.trim() || `${selectedBatch.honeyType} Raw Honey`,
        bottleSize,
        numberOfBottles,
        packagingDate,
        packagingFacility,
        packagingLine,
        lotReferenceCode,
        notes,
      });

      // Redirect to the first bottle or bottles list
      if (result.bottles.length > 0) {
        router.push(`/bottles/${result.bottles[0].id}`);
      } else {
        router.push("/bottles");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create bottles run.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading batch and quality certificate data...
        </div>
      </div>
    );
  }

  if (eligibleBatches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={Award}
          title="No Quality-Approved Batches Eligible"
          description="Bottle identities can only be created from processed honey batches that have completed laboratory quality testing and received a valid certification."
          action={
            <div className="flex items-center gap-2">
              <Button asChild size="sm">
                <Link href="/lab">View Laboratory Testing</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/processing">Processing Runs</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/bottles">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Bottles & QR Verification</span>
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span>Create Bottles & Generate QR Identities</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Transform quality-approved bulk processed honey into serialized individual consumer retail bottles.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: SOURCE BATCH */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Source Processed Batch
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Select Approved Processed Batch
            </CardTitle>
            <CardDescription className="text-xs">
              Only batches with verified laboratory certification and positive remaining weight are eligible.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1.5">
              <label htmlFor="sourceBatch" className="text-xs font-medium">
                Approved Batch Selection *
              </label>
              <Select
                value={selectedBatchId}
                onValueChange={(val) => {
                  setSelectedBatchId(val);
                  setErrorMsg(null);
                }}
              >
                <SelectTrigger id="sourceBatch" className="h-10 text-xs">
                  <SelectValue placeholder="Select quality-approved processed batch" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleBatches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs">
                      <span className="font-mono font-bold text-foreground">{b.batchNumber}</span>
                      <span className="text-muted-foreground"> — {b.honeyType} ({b.remainingWeightKg ?? b.weightKg} kg available)</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Batch Details Callout */}
            {selectedBatch && (
              <div className="rounded-lg border border-primary/20 bg-muted/30 p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {selectedBatch.batchNumber}
                    </span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                      Quality Approved
                    </Badge>
                  </div>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>Eligible for bottle creation</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Honey Variety
                    </span>
                    <span className="font-medium text-foreground text-[11px]">
                      {selectedBatch.honeyType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Available Weight
                    </span>
                    <span className="font-bold text-foreground font-mono text-[11px]">
                      {availableWeightKg} kg
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Processing Date
                    </span>
                    <span className="font-mono text-foreground text-[11px]">
                      {selectedBatch.processingDate || "2026-09-14"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Certification ID
                    </span>
                    <span className="font-mono font-medium text-primary text-[11px]">
                      {cert?.id || selectedBatch.certificateId || "CERT-HC-2026-0003"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: PACKAGING SPECIFICATIONS */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              Packaging Specifications
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Bottle Configuration & Packaging Parameters
            </CardTitle>
            <CardDescription className="text-xs">
              Configure product label title, individual bottle size, quantity, and packaging line metadata.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label htmlFor="productName" className="text-xs font-medium">
                Consumer Product Name *
              </label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Highland Wild Mountain Raw Honey"
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Bottle Size & Quantity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="bottleSize" className="text-xs font-medium">
                  Bottle Size / Unit Volume *
                </label>
                <Select
                  value={bottleSize}
                  onValueChange={(val: BottleSize) => setBottleSize(val)}
                >
                  <SelectTrigger id="bottleSize" className="h-9 text-xs">
                    <SelectValue placeholder="Select bottle size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="250 g" className="text-xs">
                      250 g (0.25 kg net)
                    </SelectItem>
                    <SelectItem value="500 g" className="text-xs">
                      500 g (0.50 kg net)
                    </SelectItem>
                    <SelectItem value="750 g" className="text-xs">
                      750 g (0.75 kg net)
                    </SelectItem>
                    <SelectItem value="1 kg" className="text-xs">
                      1 kg (1.00 kg net)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="numberOfBottles" className="text-xs font-medium">
                  Number of Bottles *
                </label>
                <Input
                  id="numberOfBottles"
                  type="number"
                  min="1"
                  max="10000"
                  value={numberOfBottles}
                  onChange={(e) => setNumberOfBottles(parseInt(e.target.value) || 0)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* Live Calculation Banner */}
            <div
              className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                isOverLimit
                  ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4" />
                  <span>Batch Weight Allocation Balance</span>
                </span>
                {isOverLimit ? (
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    Allocation Exceeds Batch Limit!
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Valid Allocation</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50 text-[11px] font-mono">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Available Batch
                  </span>
                  <span className="font-bold text-foreground">
                    {availableWeightKg.toFixed(1)} kg
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Total Packaged
                  </span>
                  <span className="font-bold text-foreground">
                    {numberOfBottles} × {bottleSize} = {totalPackagedKg.toFixed(1)} kg
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Remaining Batch
                  </span>
                  <span
                    className={`font-bold ${
                      isOverLimit ? "text-red-600" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {remainingWeightKg.toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Packaging Facility, Line & Lot Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="packagingDate" className="text-xs font-medium">
                  Packaging Date *
                </label>
                <Input
                  id="packagingDate"
                  type="date"
                  value={packagingDate}
                  onChange={(e) => setPackagingDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="packagingFacility" className="text-xs font-medium">
                  Packaging Facility *
                </label>
                <Input
                  id="packagingFacility"
                  value={packagingFacility}
                  onChange={(e) => setPackagingFacility(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="packagingLine" className="text-xs font-medium">
                  Packaging Line *
                </label>
                <Input
                  id="packagingLine"
                  value={packagingLine}
                  onChange={(e) => setPackagingLine(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lotCode" className="text-xs font-medium">
                Lot / Reference Code *
              </label>
              <Input
                id="lotCode"
                value={lotReferenceCode}
                onChange={(e) => setLotReferenceCode(e.target.value)}
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-medium">
                Packaging Notes & Quality Observations
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: BOTTLE ID & QR GENERATION PREVIEW */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Digital Identity & QR Preview
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Sequential Bottle & QR Code Generation
            </CardTitle>
            <CardDescription className="text-xs">
              Each packaged unit will receive a distinct immutable identifier and public consumer QR code.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Generated Bottle Range ({numberOfBottles} units)
                </span>
                <span className="font-mono font-bold text-foreground text-xs mt-0.5 block">
                  {previewStartId} {numberOfBottles > 1 ? `→ ${previewEndId}` : ""}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  QR Identifier Format
                </span>
                <span className="font-mono text-foreground text-xs mt-0.5 block">
                  QR-HC-{String(nextStartNum).padStart(5, "0")} → QR-HC-{String(nextEndNum).padStart(5, "0")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                Bottles are created in <strong>Created</strong> status with generated QR representations. You can inspect the source lineage and publish them for public consumer scanning once labeling is verified.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" asChild type="button" className="cursor-pointer">
            <Link href="/bottles">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isOverLimit || !selectedBatch}
            className="gap-1.5 min-w-36 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Generating Bottles...</span>
            ) : (
              <>
                <Package className="h-4 w-4" />
                <span>Create {numberOfBottles} Bottles</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewBottlesPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Product & Market", href: "/bottles" },
          { label: "Create Bottles", active: true },
        ]}
        defaultNavId="bottles"
      >
        <CreateBottlesContent />
      </AppShell>
    </AuthGuard>
  );
}
