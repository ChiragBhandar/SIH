"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  ArrowLeftRight,
  ArrowLeft,
  Boxes,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Circle,
  FileCheck,
  AlertTriangle,
  PackageCheck,
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
import { CustodyStatus } from "@/types/custody";

function getStatusBadgeVariant(
  status: CustodyStatus
): "success" | "warning" | "error" | "info" | "neutral" | "honey" {
  switch (status) {
    case "Accepted":
      return "success";
    case "Pending Acceptance":
      return "honey";
    case "Rejected":
      return "error";
    case "Draft":
    case "Cancelled":
    default:
      return "neutral";
  }
}

function CustodyDetailContent() {
  const params = useParams();
  const transferId = params?.id as string;

  const { getCustodyTransfer, getReceivingRecordByTransfer, isLoaded } = useTraceability();
  const { selectedOrg } = useAuthSession();

  const transfer = getCustodyTransfer(transferId);
  const receivingRecord = transfer ? getReceivingRecordByTransfer(transfer.id) : undefined;

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading custody record...
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={ArrowLeftRight}
          title="Custody transfer not found"
          description={`No custody transfer record found matching ID "${transferId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/custody">Back to Custody Transfers</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isCurrentOrgRecipient = selectedOrg?.id === transfer.destinationOrgId;
  const isPending = transfer.status === "Pending Acceptance";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back navigation */}
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

      {/* Main Identity Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {transfer.id}
              </h1>
              <StatusBadge status={getStatusBadgeVariant(transfer.status)} size="sm">
                {transfer.status}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              Inter-Organisation Custody Handover Document • Preserves Batch Provenance
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPending && isCurrentOrgRecipient && (
              <Button asChild size="sm" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/receiving/${transfer.id}`}>
                  <PackageCheck className="h-4 w-4" />
                  <span>Review & Receive Intake</span>
                </Link>
              </Button>
            )}

            <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
              <Link href={`/batches/${transfer.batchId}`}>
                <Boxes className="h-3.5 w-3.5 text-primary" />
                <span>View Batch Provenance</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Source -> Destination Visual Bridge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              Source Organisation
            </span>
            <p className="text-xs font-bold text-foreground">
              {transfer.sourceOrgName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Origin: {transfer.sourceApiaryName}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1 flex flex-col justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-primary">
              Consignment Quantity
            </span>
            <p className="text-base font-mono font-bold text-foreground">
              {transfer.quantityKg.toFixed(1)} kg
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">
              Ref: {transfer.transportRef}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3 text-primary" />
              Destination Organisation
            </span>
            <p className="text-xs font-bold text-foreground">
              {transfer.destinationOrgName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {transfer.destinationFacility}
            </p>
          </div>
        </div>
      </div>

      {/* Origin Batch Reference Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <span>Immutable Batch Provenance Reference</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 text-xs text-primary hover:underline hover:bg-transparent"
            >
              <Link href={`/batches/${transfer.batchId}`}>
                Open Batch Record →
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Batch ID
              </span>
              <span className="font-mono font-bold text-foreground">
                {transfer.batchId}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Honey Variety
              </span>
              <span className="font-medium text-foreground">
                {transfer.honeyType}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Harvest Date
              </span>
              <span className="font-medium text-foreground">
                {transfer.harvestDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                Source Apiary
              </span>
              <span className="font-medium text-foreground truncate block">
                {transfer.sourceApiaryName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CUSTODY TIMELINE */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Custody Transfer Timeline
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Verifiable progression of physical custody from dispatch to manufacturer receipt.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 pb-6">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:sm:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-border">
            {transfer.events.map((event, idx) => {
              const isCompleted = event.status === "completed";
              const isCurrent = event.status === "current";
              const isAlert = event.status === "alert";

              return (
                <div key={idx} className="relative group">
                  {/* Timeline icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isAlert
                        ? "border-rose-500 bg-rose-50 text-rose-600"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary animate-pulse"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {isAlert ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    ) : (
                      <Circle className="h-2 w-2" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg border p-3.5 transition-colors ${
                      isAlert
                        ? "border-rose-500/50 bg-rose-500/10 shadow-xs"
                        : isCurrent
                        ? "border-primary/40 bg-primary/5 shadow-xs"
                        : isCompleted
                        ? "border-border bg-card"
                        : "border-dashed border-border/70 bg-muted/10 opacity-70"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {event.title}
                        </h4>
                        {event.badge && (
                          <Badge
                            variant={isCurrent ? "default" : isAlert ? "destructive" : "secondary"}
                            className="text-[10px] py-0 font-mono"
                          >
                            {event.badge}
                          </Badge>
                        )}
                      </div>

                      <span className="text-[11px] text-muted-foreground font-mono">
                        {event.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="text-[10px] text-muted-foreground mt-2 pt-1.5 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                      <span>
                        Actor: <strong className="text-foreground">{event.actor}</strong>
                      </span>
                      {event.orgName && (
                        <span>
                          Organisation: <strong className="text-foreground">{event.orgName}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Logistics & Manifest Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary" />
              <span>Logistics & Transport Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">
                Carrier Reference / Docket Number
              </span>
              <span className="font-mono font-bold text-foreground text-xs">
                {transfer.transportRef}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Dispatched Date
                </span>
                <span className="font-mono text-foreground font-medium">
                  {transfer.transferDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Expected Arrival
                </span>
                <span className="font-mono text-foreground font-medium">
                  {transfer.expectedArrivalDate}
                </span>
              </div>
            </div>

            {transfer.notes && (
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Handling Notes
                </span>
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">
                  {transfer.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Receiving Record (if received) */}
        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span>Receiving Intake Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            {receivingRecord ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-emerald-50 border border-emerald-200">
                  <span className="font-mono font-bold text-emerald-800">
                    {receivingRecord.id}
                  </span>
                  <StatusBadge status="success" size="sm">
                    {receivingRecord.decision}
                  </StatusBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Received Weight
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {receivingRecord.receivedQuantityKg.toFixed(1)} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      Condition
                    </span>
                    <span className="font-medium text-foreground">
                      {receivingRecord.condition}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-1.5">
                  Received by: <strong>{receivingRecord.receivedBy}</strong> on{" "}
                  <span className="font-mono">{receivingRecord.receivedDate}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border border-dashed border-border/70 bg-muted/10 space-y-2">
                <Clock className="h-6 w-6 text-muted-foreground/60 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  No receiving record logged yet. Consignment is currently in transit or awaiting intake inspection.
                </p>
                {isPending && isCurrentOrgRecipient && (
                  <Button asChild size="sm" className="mt-2 text-xs">
                    <Link href={`/receiving/${transfer.id}`}>
                      Proceed to Intake Receiving
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CustodyDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Custody Transfers", href: "/custody" },
          { label: "Transfer Detail", active: true },
        ]}
        defaultNavId="custody"
      >
        <CustodyDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
