"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  PackageCheck,
  Thermometer,
  XCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ReceivingCondition, RejectionReason } from "@/types/custody";

function ReceivingDetailContent() {
  const params = useParams();
  const transferId = params?.id as string;

  const {
    getCustodyTransfer,
    getBatch,
    getReceivingRecordByTransfer,
    acceptReceiving,
    rejectReceiving,
    isLoaded,
  } = useTraceability();

  const { selectedRole, user } = useAuthSession();

  const transfer = getCustodyTransfer(transferId);
  const batch = transfer ? getBatch(transfer.batchId) : undefined;
  const existingRecord = transfer ? getReceivingRecordByTransfer(transfer.id) : undefined;

  // Receiving Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const [receivedQuantityKg, setReceivedQuantityKg] = React.useState<string>(
    transfer ? transfer.quantityKg.toString() : "0"
  );
  const [containerRef, setContainerRef] = React.useState<string>(
    batch ? `${batch.containerRef} (Security Seal Checked)` : "DRUM-SEAL-VERIFIED"
  );
  const [receivedDate, setReceivedDate] = React.useState<string>(todayStr);
  const [condition, setCondition] = React.useState<ReceivingCondition>("Good");
  const [temperatureCelsius, setTemperatureCelsius] = React.useState<string>("18.5");
  const [packagingCondition, setPackagingCondition] = React.useState<string>(
    "Seals intact, food-grade steel drums verified, zero leakage or contamination observed."
  );
  const [notes, setNotes] = React.useState<string>(
    "Inbound quality and moisture field check verified within standard commercial specifications."
  );

  // Rejection Dialog State
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState<RejectionReason>("Quantity mismatch");
  const [rejectionNotes, setRejectionNotes] = React.useState<string>("");

  // Feedback State
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    type: "success" | "destructive";
    title: string;
    description: string;
  } | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading shipment intake record...
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={PackageCheck}
          title="Consignment transfer not found"
          description={`No transfer record found matching ID "${transferId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/receiving">Back to Receiving Queue</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isPending = transfer.status === "Pending Acceptance";
  const isAccepted = transfer.status === "Accepted";
  const isRejected = transfer.status === "Rejected";

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      acceptReceiving(transfer.id, {
        receivedQuantityKg: Number(receivedQuantityKg) || transfer.quantityKg,
        containerRef,
        receivedDate,
        condition,
        temperatureCelsius: temperatureCelsius ? Number(temperatureCelsius) : undefined,
        packagingCondition,
        notes,
        receivedBy: `${user?.fullName || "Vikram Mehta"} (${selectedRole?.name || "Manufacturer"})`,
      });

      setFeedbackMessage({
        type: "success",
        title: "Raw material intake verified and received",
        description: `Batch ${transfer.batchId} status updated to "Received" in ${transfer.destinationOrgName} inventory. Immutable traceability timeline updated.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to accept shipment.";
      setFeedbackMessage({
        type: "destructive",
        title: "Intake Error",
        description: msg,
      });
    }
  };

  const handleConfirmReject = () => {
    if (!rejectionNotes.trim()) {
      alert("Please provide rejection explanation notes for the investigation audit.");
      return;
    }

    try {
      rejectReceiving(transfer.id, {
        rejectionReason,
        rejectionNotes: rejectionNotes.trim(),
        receivedDate,
        rejectedBy: `${user?.fullName || "Vikram Mehta"} (${selectedRole?.name || "Manufacturer"})`,
      });

      setIsRejectDialogOpen(false);
      setFeedbackMessage({
        type: "destructive",
        title: "Receipt rejected — investigation required",
        description: `Transfer ${transfer.id} marked as Rejected due to: ${rejectionReason}. Consignment flagged for compliance audit.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject shipment.";
      setFeedbackMessage({
        type: "destructive",
        title: "Rejection Error",
        description: msg,
      });
    }
  };

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
          <Link href="/receiving">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Receiving Queue</span>
          </Link>
        </Button>
      </div>

      {/* Header Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                Intake: {transfer.id}
              </h1>
              <StatusBadge
                status={
                  isAccepted
                    ? "success"
                    : isPending
                    ? "honey"
                    : "error"
                }
                size="sm"
              >
                {isPending ? "Awaiting Receipt" : transfer.status}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              Manufacturer Inbound Raw Material Receiving Inspection • Intake Facility:{" "}
              <strong className="text-foreground">{transfer.destinationFacility}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
              <Link href={`/batches/${transfer.batchId}`}>
                <Boxes className="h-3.5 w-3.5 text-primary" />
                <span>View Batch #{transfer.batchId}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decision Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`rounded-lg border p-4 text-xs space-y-1 ${
            feedbackMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-700 shrink-0" />
            )}
            <span>{feedbackMessage.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed pl-6">
            {feedbackMessage.description}
          </p>
        </div>
      )}

      {/* Section 1: Source Material & Transfer Provenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Material Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5 text-primary" />
              <span>Source Material Provenance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Original Batch ID</span>
              <Link
                href={`/batches/${transfer.batchId}`}
                className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{transfer.batchId}</span>
              </Link>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Source Organisation</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {transfer.sourceOrgName}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Origin Apiary</span>
              <span className="text-foreground">{transfer.sourceApiaryName}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Honey Variety</span>
              <span className="text-foreground">{transfer.honeyType}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Harvest Date</span>
              <span className="font-mono text-foreground">{transfer.harvestDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Transferred Weight</span>
              <span className="font-mono font-bold text-foreground">
                {transfer.quantityKg.toFixed(1)} kg
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Logistics Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" />
              <span>Transfer Logistics Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Custody Transfer ID</span>
              <span className="font-mono font-bold text-foreground">{transfer.id}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Carrier / Docket Ref</span>
              <span className="font-mono font-bold text-foreground">{transfer.transportRef}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Dispatch Date</span>
              <span className="font-mono text-foreground">{transfer.transferDate}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Expected Arrival</span>
              <span className="font-mono text-foreground">{transfer.expectedArrivalDate}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Dispatched By</span>
              <span className="text-foreground">{transfer.createdBy}</span>
            </div>

            {transfer.notes && (
              <div className="pt-1">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Supplier Dispatch Notes
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                  {transfer.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Receiving Inspection & Decision */}
      {isPending ? (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              <span>Physical Intake Verification & Quality Check</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Complete physical intake inspection before logging this consignment into manufacturing storage.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleAccept} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Received Quantity (kg) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="text-xs font-mono"
                    value={receivedQuantityKg}
                    onChange={(e) => setReceivedQuantityKg(e.target.value)}
                    required
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Expected: {transfer.quantityKg.toFixed(1)} kg
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Container / Security Seal Ref *
                  </label>
                  <Input
                    type="text"
                    className="text-xs font-mono"
                    value={containerRef}
                    onChange={(e) => setContainerRef(e.target.value)}
                    required
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Verify physical barrel tag
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Receiving Date *
                  </label>
                  <Input
                    type="date"
                    className="text-xs font-mono"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Material Condition *
                  </label>
                  <Select
                    value={condition}
                    onValueChange={(val) => setCondition(val as ReceivingCondition)}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select condition..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good" className="text-xs">
                        Good (Meets all intake quality standards)
                      </SelectItem>
                      <SelectItem value="Minor issue" className="text-xs">
                        Minor issue (Requires supervisor sign-off)
                      </SelectItem>
                      <SelectItem value="Damaged" className="text-xs">
                        Damaged (Container breached or compromised)
                      </SelectItem>
                      <SelectItem value="Contaminated / Suspect" className="text-xs">
                        Contaminated / Suspect (Hold for quarantine)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5 text-primary" />
                    <span>Inbound Temperature (°C, Optional)</span>
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 18.5"
                    className="text-xs font-mono"
                    value={temperatureCelsius}
                    onChange={(e) => setTemperatureCelsius(e.target.value)}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Ideal cold storage: under 22°C
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Packaging & Tamper Seal Condition
                </label>
                <Input
                  type="text"
                  className="text-xs"
                  value={packagingCondition}
                  onChange={(e) => setPackagingCondition(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Intake Inspection Notes
                </label>
                <Textarea
                  className="text-xs min-h-[60px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Decision Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRejectDialogOpen(true)}
                  className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50 bg-white w-full sm:w-auto"
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  <span>Reject Receipt</span>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="gap-1.5 font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept Receipt & Log Inbound Batch</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Completed Receiving Audit Certificate */
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Receiving Audit Record: {existingRecord?.id || "RCV-LOGGED"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Permanent verified intake record locked into the batch traceability chain.
                  </CardDescription>
                </div>
              </div>

              <StatusBadge
                status={isAccepted ? "success" : "error"}
                size="sm"
              >
                {existingRecord?.decision || transfer.status}
              </StatusBadge>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {isRejected ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs space-y-2 text-rose-900">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4 text-rose-700" />
                  <span>Receipt Rejected — Investigation Required</span>
                </div>
                <p className="text-xs">
                  Rejection Reason: <strong>{existingRecord?.rejectionReason || "Quantity mismatch"}</strong>
                </p>
                <p className="text-[11px] leading-relaxed">
                  {existingRecord?.rejectionNotes || "Consignment held in quarantine. Supplier notified for investigation."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Received Quantity
                  </span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {existingRecord?.receivedQuantityKg.toFixed(1) || transfer.quantityKg.toFixed(1)} kg
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Condition
                  </span>
                  <span className="font-semibold text-foreground">
                    {existingRecord?.condition || "Good"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Receiving Date
                  </span>
                  <span className="font-mono text-foreground">
                    {existingRecord?.receivedDate || transfer.transferDate}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Intake Temperature
                  </span>
                  <span className="font-mono text-foreground">
                    {existingRecord?.temperatureCelsius ? `${existingRecord.temperatureCelsius}°C` : "18.5°C"}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-2">
              <span>
                Received by: <strong className="text-foreground">{existingRecord?.receivedBy || user?.fullName}</strong>
              </span>
              <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Link href={`/batches/${transfer.batchId}`}>
                  <span>Inspect Unified Batch Timeline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REJECT DECISION MODAL DIALOG */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>Reject Raw Material Consignment</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Rejecting this shipment will lock the custody record with an investigation flag and notify the supplying cooperative.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Rejection Reason *
              </label>
              <Select
                value={rejectionReason}
                onValueChange={(v) => setRejectionReason(v as RejectionReason)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quantity mismatch">Quantity mismatch (Gross weight deviation)</SelectItem>
                  <SelectItem value="Packaging damage">Packaging damage (Broken seal / leaking drum)</SelectItem>
                  <SelectItem value="Quality concern">Quality concern (Off-odor / high moisture)</SelectItem>
                  <SelectItem value="Incorrect shipment">Incorrect shipment (Batch docket mismatch)</SelectItem>
                  <SelectItem value="Other">Other (Special investigation required)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Detailed Investigation Findings & Explanation *
              </label>
              <Textarea
                placeholder="Explain the specific quality, packaging, or weight discrepancies observed during intake..."
                className="text-xs min-h-[90px]"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReject}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Confirm Rejection & Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReceivingDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Receiving", href: "/receiving" },
          { label: "Intake Review", active: true },
        ]}
        defaultNavId="receiving"
      >
        <ReceivingDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
