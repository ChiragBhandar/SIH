"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Boxes,
  ArrowLeft,
  Wheat,
  Layers,
  Scale,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Package,
  Warehouse,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CreateBatchContent() {
  const { apiaries, hives, batches, addBatch, isLoaded } = useTraceability();

  // Generated Batch ID Preview
  const nextBatchNumber = React.useMemo(() => {
    const nextCount = batches.length + 1;
    return `HC-RH-2026-${nextCount.toString().padStart(4, "0")}`;
  }, [batches]);

  const [userSourceApiaryId, setUserSourceApiaryId] = React.useState<string>("");
  const sourceApiaryId = userSourceApiaryId || (apiaries.length > 0 ? apiaries[0].id : "");

  // Hives available for currently selected apiary
  const availableHives = React.useMemo(() => {
    if (!sourceApiaryId) return [];
    return hives.filter((h) => h.apiaryId === sourceApiaryId);
  }, [hives, sourceApiaryId]);

  const [userSelectedHiveIds, setUserSelectedHiveIds] = React.useState<string[] | null>(null);

  const selectedHiveIds = React.useMemo(() => {
    if (userSelectedHiveIds !== null) {
      const filtered = userSelectedHiveIds.filter((id) => availableHives.some((h) => h.id === id));
      return filtered.length > 0 ? filtered : (availableHives.length > 0 ? [availableHives[0].id] : []);
    }
    return availableHives.length > 0 ? [availableHives[0].id] : [];
  }, [userSelectedHiveIds, availableHives]);

  const [harvestDate, setHarvestDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [honeyType, setHoneyType] = React.useState<string>(
    "Himalayan Wild Multifloral"
  );
  const [weightKg, setWeightKg] = React.useState<string>("120.0");
  const [containerRef, setContainerRef] = React.useState<string>(
    `DRUM-HAC-${(batches.length + 1).toString().padStart(3, "0")}`
  );
  const [storageLocation, setStorageLocation] = React.useState<string>(
    "Chamoli Cooperative Vault Room 1"
  );
  const [notes, setNotes] = React.useState<string>(
    "Cold centrifuged extraction below 35°C. Unpasteurized and unfiltered raw honey."
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [createdBatchId, setCreatedBatchId] = React.useState<string | null>(null);

  const selectedApiary = React.useMemo(() => {
    return apiaries.find((a) => a.id === sourceApiaryId);
  }, [apiaries, sourceApiaryId]);

  const toggleHiveSelection = (id: string) => {
    setUserSelectedHiveIds((prev) => {
      const current = prev !== null ? prev : selectedHiveIds;
      if (current.includes(id)) {
        if (current.length === 1) return current; // At least one hive required
        return current.filter((item) => item !== id);
      } else {
        return [...current, id];
      }
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!sourceApiaryId) errs.apiary = "Source Apiary is required.";
    if (selectedHiveIds.length === 0) errs.hives = "At least one source hive must be selected.";
    if (!harvestDate) errs.date = "Harvest date is required.";
    if (!honeyType.trim()) errs.honeyType = "Honey floral type is required.";
    if (!weightKg.trim() || isNaN(Number(weightKg)) || Number(weightKg) <= 0) {
      errs.weight = "Valid harvest weight (kg) is required.";
    }
    if (!containerRef.trim()) errs.container = "Container/drum reference identifier is required.";
    if (!storageLocation.trim()) errs.storage = "Storage location is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPreviewOpen(true);
  };

  const handleConfirmCreate = () => {
    const created = addBatch({
      sourceApiaryId,
      sourceHiveIds: selectedHiveIds,
      harvestDate,
      honeyType: honeyType.trim(),
      weightKg: parseFloat(weightKg),
      containerRef: containerRef.trim(),
      storageLocation: storageLocation.trim(),
      notes: notes.trim(),
      createdBy: "Chirag Operator (Beekeeper)",
    });

    setIsPreviewOpen(false);
    setCreatedBatchId(created.id);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Initializing harvest workflow...
        </div>
      </div>
    );
  }

  // If successfully created, show confirmation view with required details
  if (createdBatchId) {
    const createdBatch = batches.find((b) => b.id === createdBatchId);
    return (
      <div className="max-w-2xl mx-auto py-8 animate-in fade-in-50 space-y-6">
        <Card className="border-emerald-500/30 bg-card shadow-md">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Harvest Batch Successfully Created
            </CardTitle>
            <CardDescription className="text-xs">
              The raw honey batch has been minted and linked to source colony records.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/25 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Batch Identifier</span>
                <span className="font-mono text-sm font-bold text-primary">
                  {createdBatch?.batchNumber || createdBatchId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Source Apiary</span>
                <span className="font-semibold text-foreground">
                  {createdBatch?.sourceApiaryName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Linked Source Hives</span>
                <span className="font-mono text-foreground font-medium">
                  {createdBatch?.sourceHiveIdentifiers?.join(", ") || "None"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Harvest Date</span>
                <span className="text-foreground">{createdBatch?.harvestDate}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">Extracted Weight</span>
                <span className="font-mono font-bold text-foreground">
                  {createdBatch?.weightKg.toFixed(1)} kg
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Traceability Status</span>
                <Badge variant="outline" className="gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 text-[11px] py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {createdBatch?.traceabilityStatus || "Traceability chain started"}
                </Badge>
              </div>
            </div>

            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>
                Immutable origin metadata recorded. All downstream processing, laboratory testing, and bottle certifications will remain cryptographically bound to this root batch.
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-6">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs w-full sm:w-auto"
            >
              <Link href="/batches">Back to Batches List</Link>
            </Button>

            <Button
              size="sm"
              asChild
              className="text-xs gap-1.5 w-full sm:w-auto shadow-xs cursor-pointer"
            >
              <Link href={`/batches/${createdBatchId}`}>
                <span>View Batch Details & Timeline</span>
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
            <span>Back to Batches</span>
          </Link>
        </Button>
      </div>

      {/* Traceability Guarantee Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 text-xs">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-foreground">
            Traceability Provenance Contract
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Source information will remain linked to this batch throughout the traceability chain.</strong>{" "}
            The selected apiary coordinates, botanical flora, and paired hive identifiers will permanently anchor every downstream custody transfer and consumer verification QR code.
          </p>
        </div>
      </div>

      {/* Main Creation Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Create Harvest Batch
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Register extracted raw bulk honey and establish root origin link.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/40 border border-border px-2.5 py-1 rounded-md">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Minting Batch ID:
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {nextBatchNumber}
              </span>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleOpenPreview}>
          <CardContent className="space-y-4 pt-4 text-xs">
            {/* Source Apiary Selection */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1">
                <Wheat className="h-3.5 w-3.5 text-primary" />
                Source Apiary <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceApiaryId}
                onChange={(e) => {
                  setUserSourceApiaryId(e.target.value);
                  setUserSelectedHiveIds(null);
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {apiaries.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.location} ({a.dominantFlora})
                  </option>
                ))}
              </select>
              {errors.apiary && (
                <span className="text-[11px] text-rose-500">{errors.apiary}</span>
              )}
            </div>

            {/* Source Hives Selection */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Source Hive(s) Extracted <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {selectedHiveIds.length} hive(s) selected
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Select the specific colony boxes harvested for this raw extraction run.
              </p>

              {availableHives.length === 0 ? (
                <div className="p-4 rounded-md border border-dashed text-center text-xs text-muted-foreground">
                  No hives registered for this apiary.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md bg-muted/15">
                  {availableHives.map((h) => {
                    const isChecked = selectedHiveIds.includes(h.id);
                    return (
                      <div
                        key={h.id}
                        onClick={() => toggleHiveSelection(h.id)}
                        className={`p-2.5 rounded-md border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          isChecked
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-foreground truncate">
                              {h.identifier}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                              {h.internalCode} • {h.queenStatus}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 shrink-0 font-mono"
                        >
                          {h.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.hives && (
                <span className="text-[11px] text-rose-500">{errors.hives}</span>
              )}
            </div>

            {/* Harvest Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  Harvest Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.date && (
                  <span className="text-[11px] text-rose-500">{errors.date}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  Honey Type / Floral Origin <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={honeyType}
                  onChange={(e) => setHoneyType(e.target.value)}
                  placeholder="e.g. Himalayan Wild Multifloral, White Clover & Acacia"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.honeyType && (
                  <span className="text-[11px] text-rose-500">{errors.honeyType}</span>
                )}
              </div>
            </div>

            {/* Weight and Container Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Scale className="h-3 w-3 text-muted-foreground" />
                  Raw Honey Weight (kg) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.weight && (
                  <span className="text-[11px] text-rose-500">{errors.weight}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  Container / Bulk Drum Reference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={containerRef}
                  onChange={(e) => setContainerRef(e.target.value)}
                  placeholder="e.g. DRUM-HAC-004"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.container && (
                  <span className="text-[11px] text-rose-500">{errors.container}</span>
                )}
              </div>
            </div>

            {/* Storage Location and Field Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Warehouse className="h-3 w-3 text-muted-foreground" />
                  Storage Facility / Vault Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="e.g. Chamoli Cooperative Secure Storage Unit 1"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-foreground">
                  Extraction & Batch Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Moisture content field reading, centrifuge speed, visual amber clarity..."
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 pb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <Link href="/batches">Cancel</Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              className="text-xs min-w-[140px] shadow-xs cursor-pointer gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Review Batch</span>
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Review / Preview Modal Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Review Harvest Batch Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm batch origin parameters before committing to the Honey Chain local registry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs pt-1">
            <div className="rounded-md bg-muted/30 border p-3 space-y-2.5">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Batch Number</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {nextBatchNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Source Apiary</span>
                <span className="font-medium text-foreground">
                  {selectedApiary?.name}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Extracted Hives</span>
                <span className="font-mono text-foreground font-medium">
                  {availableHives
                    .filter((h) => selectedHiveIds.includes(h.id))
                    .map((h) => h.identifier)
                    .join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Harvest Date</span>
                <span className="text-foreground">{harvestDate}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Honey Variety</span>
                <span className="text-foreground font-medium">{honeyType}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Net Weight & Container</span>
                <span className="font-mono font-bold text-foreground">
                  {parseFloat(weightKg || "0").toFixed(1)} kg ({containerRef})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Vault Storage</span>
                <span className="text-foreground truncate max-w-[220px]">
                  {storageLocation}
                </span>
              </div>
            </div>

            <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-2.5 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Origin linking is permanent. This batch will initialize the immutable digital ledger timeline.
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs"
            >
              Edit Details
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmCreate}
              className="text-xs min-w-[140px]"
            >
              Confirm & Create Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreateBatchPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Honey Batches", href: "/batches" },
          { label: "Create Harvest Batch", active: true },
        ]}
        defaultNavId="batches"
      >
        <CreateBatchContent />
      </AppShell>
    </AuthGuard>
  );
}
