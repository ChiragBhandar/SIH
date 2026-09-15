"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Truck,
  Building,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustodyTransfer } from "@/types/custody";

const MOCK_FACILITIES: Record<string, string[]> = {
  "org-ghf-02": [
    "Golden Hive Processing Plant Unit 4, Solan Industrial Area, HP",
    "Golden Hive Cold Storage Hub, Chandigarh",
    "Golden Hive Extraction & Packaging Plant 1, Delhi NCR",
  ],
  "org-ptl-03": [
    "PureTrace Analytical Testing Facility, Mohali Science Park",
  ],
  "org-hac-01": [
    "Highland Apiaries Central Storage, Chamoli, Uttarakhand",
  ],
};

function CreateCustodyTransferForm() {
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batchId") || "";

  const { batches, addCustodyTransfer, isLoaded } = useTraceability();
  const { selectedOrg, selectedRole, user, allOrganisations } = useAuthSession();

  // Filter batches that belong to the active organisation or are available for transfer
  const eligibleBatches = React.useMemo(() => {
    return batches.filter(
      (b) => b.status === "Raw Batch Created" || b.status === "Pending Custody Transfer"
    );
  }, [batches]);

  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    preselectedBatchId && eligibleBatches.some((b) => b.id === preselectedBatchId)
      ? preselectedBatchId
      : eligibleBatches[0]?.id || ""
  );

  const selectedBatch = React.useMemo(() => {
    return batches.find((b) => b.id === selectedBatchId || b.batchNumber === selectedBatchId);
  }, [batches, selectedBatchId]);

  // Destination Org: default to Golden Hive Foods
  const defaultDestOrg = allOrganisations.find((o) => o.id === "org-ghf-02") || allOrganisations[1] || allOrganisations[0];
  const [destinationOrgId, setDestinationOrgId] = React.useState<string>(defaultDestOrg?.id || "org-ghf-02");

  const destinationOrg = React.useMemo(() => {
    return allOrganisations.find((o) => o.id === destinationOrgId) || defaultDestOrg;
  }, [allOrganisations, destinationOrgId, defaultDestOrg]);

  const availableFacilities = MOCK_FACILITIES[destinationOrgId] || [
    "Standard Intake Facility 1",
  ];
  const [destinationFacility, setDestinationFacility] = React.useState<string>(
    availableFacilities[0] || ""
  );

  const handleDestinationOrgChange = (newOrgId: string) => {
    setDestinationOrgId(newOrgId);
    const facilities = MOCK_FACILITIES[newOrgId] || ["Standard Intake Facility 1"];
    setDestinationFacility(facilities[0] || "");
  };

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    const target = batches.find((b) => b.id === batchId || b.batchNumber === batchId);
    if (target) {
      setQuantityKg(target.weightKg.toString());
    }
  };

  // Form Fields
  const [quantityKg, setQuantityKg] = React.useState<string>(
    selectedBatch ? selectedBatch.weightKg.toString() : "95.6"
  );
  const [transferDate, setTransferDate] = React.useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0] || "2026-09-14";
  });
  const [expectedArrivalDate, setExpectedArrivalDate] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0] || "2026-09-15";
  });
  const [transportRef, setTransportRef] = React.useState<string>("LOG-TR-2026-8841");
  const [notes, setNotes] = React.useState<string>(
    "Cold extraction bulk drum sealed with tamper-evident security tags. En route to manufacturing facility for intake testing."
  );

  // Workflow states: "form" | "review" | "success"
  const [step, setStep] = React.useState<"form" | "review" | "success">("form");
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [createdTransfer, setCreatedTransfer] = React.useState<CustodyTransfer | null>(null);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedBatchId || !selectedBatch) {
      setErrorMsg("Please select a valid source honey batch.");
      return;
    }
    if (!destinationOrgId) {
      setErrorMsg("Please select a receiving destination organisation.");
      return;
    }
    if (!quantityKg || Number(quantityKg) <= 0) {
      setErrorMsg("Please enter a valid transfer quantity.");
      return;
    }
    if (!transportRef.trim()) {
      setErrorMsg("Please provide a carrier transport reference or vehicle registration.");
      return;
    }

    setStep("review");
  };

  const handleFinalSubmit = () => {
    if (!selectedBatch) return;

    try {
      const transfer = addCustodyTransfer({
        batchId: selectedBatch.id,
        destinationOrgId,
        destinationFacility,
        quantityKg: Number(quantityKg),
        transferDate,
        expectedArrivalDate,
        transportRef: transportRef.trim(),
        notes: notes.trim(),
        createdBy: `${user?.fullName || "Rajesh Rawat"} (${selectedRole?.name || "Beekeeper"})`,
      });

      setCreatedTransfer(transfer);
      setStep("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create custody transfer.";
      setErrorMsg(message);
      setStep("form");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading batch provenance data...
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (step === "success" && createdTransfer) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center space-y-4 shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Custody Transfer Dispatched & Logged
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              The physical transfer has been committed to the batch traceability history with status{" "}
              <strong className="text-amber-800">Pending Acceptance</strong>.
            </p>
          </div>

          {/* Transfer Summary Badge Grid */}
          <div className="rounded-lg border border-border/70 bg-card p-4 text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">Transfer ID</span>
              <span className="font-mono text-xs font-bold text-primary">
                {createdTransfer.id}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">Batch ID</span>
              <span className="font-mono text-xs font-bold text-foreground">
                {createdTransfer.batchId}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">Destination Organisation</span>
              <span className="text-xs font-semibold text-foreground">
                {createdTransfer.destinationOrgName}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">Transferred Weight</span>
              <span className="font-mono text-xs font-bold text-foreground">
                {createdTransfer.quantityKg.toFixed(1)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Custody Status</span>
              <StatusBadge status="honey" size="sm">
                Pending Acceptance
              </StatusBadge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild className="w-full sm:w-auto gap-1.5">
              <Link href={`/custody/${createdTransfer.id}`}>
                <span>View Custody Transfer Detail</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/batches/${createdTransfer.batchId}`}>
                <span>View Batch Timeline</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full sm:w-auto text-xs">
              <Link href="/custody">Back to Transfers List</Link>
            </Button>
          </div>
        </div>
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
          <Link href="/custody">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Custody Transfers</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Initiate Custody Transfer
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Hand over physical raw honey material to a verified manufacturer or processing partner.
        </p>
      </div>

      {/* PROVENANCE ARCHITECTURE BANNER: SOURCE -> DESTINATION */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Source Box */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Origin / Dispatcher
              </span>
              <p className="text-sm font-bold text-foreground">
                {selectedOrg?.name || "Highland Apiaries Cooperative"}
              </p>
              <span className="text-[11px] text-muted-foreground">
                Role: {selectedRole?.name || "Beekeeper"}
              </span>
            </div>
          </div>

          {/* Middle Arrow */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-background border border-border shadow-2xs self-center">
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              Transfer Custody
            </span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>

          {/* Destination Box */}
          <div className="flex items-center gap-3 md:justify-end">
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Recipient / Manufacturer
              </span>
              <p className="text-sm font-bold text-foreground">
                {destinationOrg?.name || "Golden Hive Foods"}
              </p>
              <span className="text-[11px] text-muted-foreground">
                {destinationOrg?.displayType || "Manufacturer"}
              </span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM STEP */}
      {step === "form" && (
        <form onSubmit={handleProceedToReview} className="space-y-6">
          {/* Section 1: Source Material Selection */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                <span>1. Select Source Harvest Batch</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Select the raw honey batch stored in your cooperative inventory to transfer.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Source Raw Batch *
                </label>
                <Select value={selectedBatchId} onValueChange={handleBatchSelect}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select raw batch to transfer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleBatches.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        <span className="font-mono font-bold mr-2">{b.batchNumber}</span>
                        <span>• {b.honeyType} ({b.weightKg} kg)</span>
                        <span className="text-muted-foreground ml-2">[{b.sourceApiaryName}]</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Source Batch Information Card */}
              {selectedBatch && (
                <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-muted-foreground">
                      Source Provenance Details
                    </span>
                    <StatusBadge status="honey" size="sm">
                      {selectedBatch.status}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Source Apiary
                      </span>
                      <p className="font-semibold text-foreground truncate">
                        {selectedBatch.sourceApiaryName}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Harvest Date
                      </span>
                      <p className="font-medium text-foreground">
                        {selectedBatch.harvestDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Honey Type
                      </span>
                      <p className="font-medium text-foreground truncate">
                        {selectedBatch.honeyType}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        Available Weight
                      </span>
                      <p className="font-mono font-bold text-foreground">
                        {selectedBatch.weightKg.toFixed(1)} kg
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Origin Container: <strong>{selectedBatch.containerRef}</strong></span>
                    <span>Storage: <strong>{selectedBatch.storageLocation}</strong></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Destination & Facility Details */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>2. Receiving Destination & Intake Facility</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Specify the enterprise partner receiving this raw material shipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Receiving Organisation <span className="text-rose-500">*</span>
                  </label>
                  <Select value={destinationOrgId} onValueChange={handleDestinationOrgChange}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select destination..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allOrganisations
                        .filter((o) => o.id !== (selectedOrg?.id || "org-hac-01"))
                        .map((org) => (
                          <SelectItem key={org.id} value={org.id} className="text-xs">
                            {org.name} ({org.displayType})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Receiving Facility / Location <span className="text-rose-500">*</span>
                  </label>
                  <Select value={destinationFacility} onValueChange={setDestinationFacility}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select facility..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFacilities.map((fac, idx) => (
                        <SelectItem key={idx} value={fac} className="text-xs">
                          {fac}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Quantity & Logistics Details */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>3. Transfer Logistics & Transport Data</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enter shipment weight, transport carrier reference, and dispatch dates.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    Transfer Quantity (kg) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={selectedBatch?.weightKg || 1000}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    required
                  />
                  {selectedBatch && (
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      Max available: {selectedBatch.weightKg.toFixed(1)} kg
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    Carrier / Transport Reference <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={transportRef}
                    onChange={(e) => setTransportRef(e.target.value)}
                    placeholder="e.g. LOG-TR-2026-8841 (Freight Truck #UK-07-TA-9921)"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    Dispatch Date <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    Expected Intake Arrival <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={expectedArrivalDate}
                    onChange={(e) => setExpectedArrivalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground block">
                  Dispatch Notes & Handling Instructions
                </label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Temperature constraints, handling requirements, or handover observations..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" asChild size="default">
                  <Link href="/custody">Cancel</Link>
                </Button>
                <Button type="submit" size="default">
                  <span>Review Transfer →</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* REVIEW STEP */}
      {step === "review" && (
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground">
                Review Custody Transfer Details
              </CardTitle>
              <CardDescription className="text-xs">
                Please verify the handover details before initiating the transfer.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Immutable Provenance Warning */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Immutable Traceability Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Once submitted, this transfer becomes part of the batch traceability history. The batch ID{" "}
                  <strong className="font-mono">{selectedBatch?.batchNumber}</strong> remains unchanged and is preserved through manufacturer receiving.
                </p>
              </div>

              {/* Review Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Source Batch
                  </span>
                  <p className="font-mono font-bold text-sm text-foreground">
                    {selectedBatch?.batchNumber}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {selectedBatch?.honeyType} • {selectedBatch?.sourceApiaryName}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Transfer Quantity
                  </span>
                  <p className="font-mono font-bold text-sm text-foreground">
                    {Number(quantityKg).toFixed(1)} kg
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Container: {selectedBatch?.containerRef}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Source Organisation
                  </span>
                  <p className="font-semibold text-foreground">
                    {selectedOrg?.name || "Highland Apiaries Cooperative"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Dispatched by: {user?.fullName} ({selectedRole?.name})
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Destination Organisation
                  </span>
                  <p className="font-semibold text-foreground">
                    {destinationOrg?.name || "Golden Hive Foods"}
                  </p>
                  <p className="text-muted-foreground text-[11px] truncate">
                    {destinationFacility}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Dates
                  </span>
                  <p className="font-mono text-foreground">
                    Dispatched: {transferDate}
                  </p>
                  <p className="font-mono text-muted-foreground text-[11px]">
                    Expected Arrival: {expectedArrivalDate}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Transport Reference ID
                  </span>
                  <p className="font-mono font-bold text-foreground">
                    {transportRef}
                  </p>
                </div>
              </div>

              {notes && (
                <div className="rounded-md border border-border/60 p-3 bg-muted/10 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Dispatch Notes
                  </span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("form")}
            >
              ← Edit Details
            </Button>
            <Button
              onClick={handleFinalSubmit}
              size="sm"
              className="gap-1.5 font-bold shadow-xs bg-primary text-primary-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Dispatch Transfer</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateCustodyTransferPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Custody Transfers", href: "/custody" },
          { label: "New Transfer", active: true },
        ]}
        defaultNavId="custody"
      >
        <React.Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-sm text-muted-foreground animate-pulse">
                Loading transfer form...
              </div>
            </div>
          }
        >
          <CreateCustodyTransferForm />
        </React.Suspense>
      </AppShell>
    </AuthGuard>
  );
}
