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

import { useLanguage } from "@/context/language-context";

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
  const { tr, trStatus } = useLanguage();
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
          {tr("Loading custody record...", "कस्टडी रिकॉर्ड लोड हो रहा है...")}
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={ArrowLeftRight}
          title={tr("Custody transfer not found", "कस्टडी ट्रांसफर नहीं मिला")}
          description={tr(
            `No custody transfer record found matching ID "${transferId}".`,
            `"${transferId}" आईडी से मेल खाता कोई कस्टडी ट्रांसफर रिकॉर्ड नहीं मिला।`
          )}
          action={
            <Button asChild size="sm">
              <Link href="/custody">{tr("Back to Custody Transfers", "कस्टडी ट्रांसफर पर वापस")}</Link>
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
            <span>{tr("Back to Custody Transfers", "कस्टडी ट्रांसफर पर वापस")}</span>
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
                {trStatus(transfer.status)}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              {tr(
                "Inter-Organisation Custody Handover Document • Preserves Batch Provenance",
                "अंतर-संगठन कस्टडी हस्तांतरण दस्तावेज • बैच उत्पत्ति संरक्षित रखता है"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPending && isCurrentOrgRecipient && (
              <Button asChild size="sm" className="gap-1.5 shadow-xs font-semibold">
                <Link href={`/receiving/${transfer.id}`}>
                  <PackageCheck className="h-4 w-4" />
                  <span>{tr("Review & Receive Intake", "समीक्षा करें एवं आवक प्राप्त करें")}</span>
                </Link>
              </Button>
            )}

            <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
              <Link href={`/batches/${transfer.batchId}`}>
                <Boxes className="h-3.5 w-3.5 text-primary" />
                <span>{tr("View Batch Provenance", "बैच उत्पत्ति देखें")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Source -> Destination Visual Bridge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3 text-muted-foreground" />
              {tr("Source Organisation", "स्रोत संगठन")}
            </span>
            <p className="text-xs font-bold text-foreground">
              {transfer.sourceOrgName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {tr("Origin:", "उत्पत्ति:")} {transfer.sourceApiaryName}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1 flex flex-col justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-primary">
              {tr("Consignment Quantity", "खेप की मात्रा")}
            </span>
            <p className="text-base font-mono font-bold text-foreground">
              {transfer.quantityKg.toFixed(1)} {tr("kg", "किग्रा")}
            </p>
            <span className="text-[10px] font-mono text-muted-foreground">
              {tr("Ref:", "संदर्भ:")} {transfer.transportRef}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3 text-primary" />
              {tr("Destination Organisation", "गंतव्य संगठन")}
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
              <span>{tr("Immutable Batch Provenance Reference", "अपरिवर्तनीय बैच उत्पत्ति संदर्भ")}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 text-xs text-primary hover:underline hover:bg-transparent"
            >
              <Link href={`/batches/${transfer.batchId}`}>
                {tr("Open Batch Record →", "बैच रिकॉर्ड खोलें →")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                {tr("Batch ID", "बैच आईडी")}
              </span>
              <span className="font-mono font-bold text-foreground">
                {transfer.batchId}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                {tr("Honey Variety", "शहद की किस्म")}
              </span>
              <span className="font-medium text-foreground">
                {transfer.honeyType}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                {tr("Harvest Date", "कटाई तिथि")}
              </span>
              <span className="font-medium text-foreground">
                {transfer.harvestDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-foreground block">
                {tr("Source Apiary", "स्रोत मधुमक्खी फार्म")}
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
                {tr("Custody Transfer Timeline", "कस्टडी ट्रांसफर समयरेखा")}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {tr(
                  "Verifiable progression of physical custody from dispatch to manufacturer receipt.",
                  "प्रेषण से लेकर निर्माता पावती तक भौतिक कस्टडी की सत्यापन योग्य प्रगति।"
                )}
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
                        {tr("Actor:", "कर्ता:")} <strong className="text-foreground">{event.actor}</strong>
                      </span>
                      {event.orgName && (
                        <span>
                          {tr("Organisation:", "संगठन:")} <strong className="text-foreground">{event.orgName}</strong>
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
              <span>{tr("Logistics & Transport Verification", "रसद एवं परिवहन सत्यापन")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="p-2.5 rounded-md bg-muted/20 border border-border/60 space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block">
                {tr("Carrier Reference / Docket Number", "कैरियर संदर्भ / डॉकेट नंबर")}
              </span>
              <span className="font-mono font-bold text-foreground text-xs">
                {transfer.transportRef}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {tr("Dispatched Date", "प्रेषण तिथि")}
                </span>
                <span className="font-mono text-foreground font-medium">
                  {transfer.transferDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {tr("Expected Arrival", "अपेक्षित आगमन")}
                </span>
                <span className="font-mono text-foreground font-medium">
                  {transfer.expectedArrivalDate}
                </span>
              </div>
            </div>

            {transfer.notes && (
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {tr("Handling Notes", "हैंडलिंग नोट्स")}
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
              <span>{tr("Receiving Intake Summary", "आवक प्राप्ति सारांश")}</span>
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
                    {trStatus(receivingRecord.decision)}
                  </StatusBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Received Weight", "प्राप्त वजन")}
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {receivingRecord.receivedQuantityKg.toFixed(1)} {tr("kg", "किग्रा")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Condition", "स्थिति")}
                    </span>
                    <span className="font-medium text-foreground">
                      {receivingRecord.condition}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-1.5">
                  {tr("Received by:", "द्वारा प्राप्त:")} <strong>{receivingRecord.receivedBy}</strong> {tr("on", "को")}{" "}
                  <span className="font-mono">{receivingRecord.receivedDate}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border border-dashed border-border/70 bg-muted/10 space-y-2">
                <Clock className="h-6 w-6 text-muted-foreground/60 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  {tr(
                    "No receiving record logged yet. Consignment is currently in transit or awaiting intake inspection.",
                    "अभी तक कोई पावती रिकॉर्ड दर्ज नहीं किया गया है। खेप वर्तमान में पारगमन में है या आवक निरीक्षण की प्रतीक्षा कर रही है।"
                  )}
                </p>
                {isPending && isCurrentOrgRecipient && (
                  <Button asChild size="sm" className="mt-2 text-xs">
                    <Link href={`/receiving/${transfer.id}`}>
                      {tr("Proceed to Intake Receiving", "आवक प्राप्ति के लिए आगे बढ़ें")}
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
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Custody Transfers", "कस्टडी ट्रांसफर"), href: "/custody" },
          { label: tr("Transfer Detail", "ट्रांसफर विवरण"), active: true },
        ]}
        defaultNavId="custody"
      >
        <CustodyDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
