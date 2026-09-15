"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import { TestPanelType, TestPriority } from "@/types/quality";
import {
  FlaskConical,
  ArrowLeft,
  Boxes,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
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

export function SubmitSampleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledBatchId = searchParams.get("batchId") || "";

  const {
    batches,
    getEligibleLabTestingBatches,
    getProcessingJob,
    submitLabSample,
    labTests,
    isLoaded,
  } = useTraceability();

  const { user, selectedOrg } = useAuthSession();

  const eligibleBatches = React.useMemo(() => {
    const list = getEligibleLabTestingBatches();
    // If a prefilled batch is given, ensure it's in list
    if (prefilledBatchId && !list.some((b) => b.batchNumber === prefilledBatchId || b.id === prefilledBatchId)) {
      const specific = batches.find((b) => b.batchNumber === prefilledBatchId || b.id === prefilledBatchId);
      if (specific) return [specific, ...list];
    }
    return list;
  }, [getEligibleLabTestingBatches, batches, prefilledBatchId]);

  // Selected batch state (initialize directly from prefill or first eligible batch)
  const [selectedBatchId, setSelectedBatchId] = React.useState(prefilledBatchId);

  const effectiveBatchId = selectedBatchId || prefilledBatchId || (eligibleBatches[0]?.batchNumber ?? "");

  const selectedBatch = React.useMemo(() => {
    return batches.find(
      (b) => b.batchNumber === effectiveBatchId || b.id === effectiveBatchId
    );
  }, [batches, effectiveBatchId]);

  const parentProcessingJob = React.useMemo(() => {
    if (!selectedBatch?.processingJobId) return undefined;
    return getProcessingJob(selectedBatch.processingJobId);
  }, [selectedBatch, getProcessingJob]);

  // Sample form fields
  const sampleNumberSeq = String(labTests.length + 1).padStart(4, "0");
  const [sampleId, setSampleId] = React.useState(`SAMPLE-LAB-2026-${sampleNumberSeq}`);
  const [sampleQuantity, setSampleQuantity] = React.useState("500 g");
  const [sampleContainerRef, setSampleContainerRef] = React.useState("SEALED-STERILE-JAR-01");
  
  const now = new Date();
  const todayStr = `${now.toISOString().split("T")[0]} 16:00`;
  const [collectionDateTime, setCollectionDateTime] = React.useState(todayStr);
  const [collectedBy, setCollectedBy] = React.useState(
    user?.fullName ? `${user.fullName} (${selectedOrg?.name || "Manufacturer Quality Lead"})` : "Vikram Mehta (Plant Manager)"
  );
  const [samplingNotes, setSamplingNotes] = React.useState(
    "Aseptic composite sample drawn across upper, middle, and lower levels of the storage tank under clean protocol."
  );

  // Test Plan fields
  const [testPanel, setTestPanel] = React.useState<TestPanelType>("Full honey quality panel");
  const [priority, setPriority] = React.useState<TestPriority>("Normal");
  const [expectedCompletionDate, setExpectedCompletionDate] = React.useState("2026-09-16");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) {
      setErrorMsg("Please select an eligible processed honey batch.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const createdTest = submitLabSample({
        batchId: selectedBatch.batchNumber,
        sampleId,
        sampleQuantity,
        sampleContainerRef,
        collectionDateTime,
        collectedBy,
        samplingNotes,
        testPanel,
        priority,
        expectedCompletionDate,
      });

      router.push(`/lab/${createdTest.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit laboratory sample.";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading batch records and sample submission form...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/lab">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Laboratory Testing</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Submit Sample for Testing
          </h1>
          <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary bg-primary/5">
            Quality Verification
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Register an official laboratory sample from a processed honey batch to initiate purity and standard compliance analysis.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3.5 flex items-center gap-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PROCESSED BATCH SELECTION */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
                1. Select Processed Honey Batch
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Choose the completed processed honey batch from which this laboratory sample was collected.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Processed Batch ID <span className="text-destructive">*</span>
              </label>
              <select
                value={effectiveBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                {eligibleBatches.map((b) => (
                  <option key={b.id} value={b.batchNumber}>
                    {b.batchNumber} — {b.honeyType} ({b.weightKg} kg) • {b.status}
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sm text-foreground">
                      {selectedBatch.batchNumber}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedBatch.honeyType}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-800 bg-emerald-50 font-mono text-xs">
                    Output: {selectedBatch.weightKg.toFixed(1)} kg
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Source Lineage
                    </span>
                    <span className="font-medium text-foreground truncate block">
                      {selectedBatch.sourceApiaryName || "Highland North Apiary Origin"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Processing Event
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {selectedBatch.processingJobId || parentProcessingJob?.id || "PRC-2026-0001 (Micro-filtered)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Storage Container
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedBatch.containerRef} ({selectedBatch.storageLocation})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 2: SAMPLE METADATA */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
                2. Sample Collection Details
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Record physical sample quantity, container security seal, and sampling conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Sample ID / Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Sample Quantity <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={sampleQuantity}
                  onChange={(e) => setSampleQuantity(e.target.value)}
                  placeholder="e.g. 500 g, 250 ml"
                  required
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Sample Container / Seal Reference <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={sampleContainerRef}
                  onChange={(e) => setSampleContainerRef(e.target.value)}
                  placeholder="e.g. SEALED-JAR-PTL-01"
                  required
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Collection Date & Time <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={collectionDateTime}
                  onChange={(e) => setCollectionDateTime(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Collected By (Technician / Quality Officer) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Sampling Protocol Notes
                </label>
                <textarea
                  rows={2}
                  value={samplingNotes}
                  onChange={(e) => setSamplingNotes(e.target.value)}
                  placeholder="Notes on composite sampling method, temperature, container cleanliness..."
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: TEST PLAN & PANEL */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
                3. Test Plan & Analytical Panel
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Select standard analytical battery and priority for PureTrace Labs testing queue.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Test Panel <span className="text-destructive">*</span>
                </label>
                <select
                  value={testPanel}
                  onChange={(e) => setTestPanel(e.target.value as TestPanelType)}
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="Full honey quality panel">Full honey quality panel (Recommended)</option>
                  <option value="Basic quality panel">Basic quality panel</option>
                  <option value="Adulteration screening">Adulteration screening (C4/C3 & NMR)</option>
                  <option value="Microbiological panel">Microbiological panel</option>
                  <option value="Custom">Custom quality panel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Testing Priority <span className="text-destructive">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TestPriority)}
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  <option value="Normal">Normal (Standard turnaround)</option>
                  <option value="Urgent">Urgent (Priority fast-track)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: TRACEABILITY PREVIEW */}
        <Card className="border-border bg-gradient-to-b from-card to-muted/20 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Traceability Chain Preview</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Preview the cryptographic linkage before creating the laboratory test record.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Step 1 */}
                <div className="flex-1 space-y-1 p-2 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    SOURCE BATCH
                  </span>
                  <p className="font-mono font-bold text-foreground text-xs">
                    {selectedBatch?.batchNumber || "HC-PB-2026-0003"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Processed Honey
                  </p>
                </div>

                <div className="hidden sm:flex items-center text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Step 2 */}
                <div className="flex-1 space-y-1 p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">
                    LAB SAMPLE
                  </span>
                  <p className="font-mono font-bold text-foreground text-xs">
                    {sampleId}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {sampleQuantity} Sealed
                  </p>
                </div>

                <div className="hidden sm:flex items-center text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Step 3 */}
                <div className="flex-1 space-y-1 p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    TEST PANEL
                  </span>
                  <p className="font-medium text-foreground text-xs">
                    {testPanel}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Priority: {priority}
                  </p>
                </div>

                <div className="hidden sm:flex items-center text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Step 4 */}
                <div className="flex-1 space-y-1 p-2 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    STATUS
                  </span>
                  <p className="font-bold text-foreground text-xs">
                    Pending Lab Review
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Awaiting Analysis
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Traceability Link Active:</strong> Laboratory test will be immutably linked to processed batch{" "}
                  <code className="font-mono font-bold text-foreground">{selectedBatch?.batchNumber || "HC-PB-2026-0003"}</code>.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" asChild size="sm">
            <Link href="/lab">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedBatch}
            size="sm"
            className="gap-2 font-semibold shadow-xs"
          >
            <FlaskConical className="h-4 w-4" />
            <span>{isSubmitting ? "Submitting Sample..." : "Submit Sample & Initiate Test"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SubmitSamplePage() {
  return (
    <AuthGuard>
      <AppShell>
        <SubmitSampleContent />
      </AppShell>
    </AuthGuard>
  );
}
