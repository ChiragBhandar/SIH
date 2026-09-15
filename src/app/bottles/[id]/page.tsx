"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  QrCode,
  ArrowLeft,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Wheat,
  ArrowLeftRight,
  FlaskConical,
  ShieldCheck,
  Globe,
  Radio,
  Building,
  Calendar,
  Ban,
  UploadCloud,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { QRCodeView } from "@/components/bottles/qr-code-view";

export function BottleDetailContent() {
  const params = useParams();
  const bottleId = params?.id as string;

  const {
    getBottle,
    getCertification,
    publishBottle,
    suspendBottle,
    isLoaded,
  } = useTraceability();

  const [isPublishModalOpen, setIsPublishModalOpen] = React.useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = React.useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = React.useState<string | null>(null);

  const bottle = getBottle(bottleId);
  const cert = bottle?.certificationId ? getCertification(bottle.certificationId) : undefined;
  const lineage = bottle?.sourceLineage;

  const handlePublish = () => {
    if (!bottle) return;
    publishBottle(bottle.id);
    setIsPublishModalOpen(false);
    setActionSuccessMsg("Bottle published successfully! Public verification is now active.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleSuspend = () => {
    if (!bottle) return;
    suspendBottle(bottle.id, "Verification temporarily suspended for quality review");
    setIsSuspendModalOpen(false);
    setActionSuccessMsg("Bottle verification status updated to Suspended.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading bottle digital identity and lineage records...
        </div>
      </div>
    );
  }

  if (!bottle) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Package}
          title="Bottle Not Found"
          description={`No packaging record found matching identity "${bottleId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/bottles">Back to Bottles List</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isPublished = bottle.status === "Published";
  const isSuspended = bottle.status === "Suspended";

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
          <Link href="/bottles">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Bottles & QR Verification</span>
          </Link>
        </Button>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Header / Bottle Identity Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {bottle.id}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs uppercase font-semibold ${
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                    : isSuspended
                    ? "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
                }`}
              >
                {bottle.status}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                QR: {bottle.qrStatus}
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {bottle.productName} • {bottle.bottleSize}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {!isPublished ? (
              <Button
                onClick={() => setIsPublishModalOpen(true)}
                className="gap-1.5 shadow-xs cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Publish for Consumer Verification</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsSuspendModalOpen(true)}
                className="gap-1.5 text-red-600 border-red-500/30 hover:bg-red-500/5 cursor-pointer text-xs h-8"
                size="sm"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Suspend Public Verification</span>
              </Button>
            )}

            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8 cursor-pointer">
              <Link href={bottle.verificationUrl} target="_blank">
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>View Public Consumer Page</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs">
          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Source Batch
            </span>
            <Link
              href={`/batches/${bottle.sourceBatchId}`}
              className="font-mono font-bold text-primary hover:underline text-xs flex items-center gap-1 mt-0.5"
            >
              <span>{bottle.sourceBatchNumber}</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Quality Certificate
            </span>
            {cert ? (
              <Link
                href={`/certifications/${cert.id}`}
                className="font-mono font-medium text-primary hover:underline text-xs flex items-center gap-1 mt-0.5"
              >
                <span>{cert.id}</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            ) : (
              <span className="font-mono text-muted-foreground text-xs mt-0.5 block">
                {bottle.certificationId}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Packaging Run
            </span>
            <span className="font-mono text-foreground text-xs mt-0.5 block">
              {bottle.packagingRunId}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-muted-foreground block">
              Lot Reference
            </span>
            <span className="font-mono font-medium text-foreground text-xs mt-0.5 block">
              {bottle.lotReferenceCode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: QR Code Card & Product Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Verification Representation Card */}
        <Card className="border-border bg-card shadow-xs lg:col-span-1">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-primary" />
              Consumer QR Representation
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Dynamic Verification QR
            </CardTitle>
            <CardDescription className="text-xs">
              Resolves directly to the standalone public verification route.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 flex flex-col items-center">
            <QRCodeView
              bottleId={bottle.id}
              qrIdentifier={bottle.qrIdentifier}
              productName={bottle.productName}
              status={bottle.qrStatus}
              size={180}
            />
          </CardContent>
        </Card>

        {/* Product Identity & Packaging Metadata */}
        <Card className="border-border bg-card shadow-xs lg:col-span-2 space-y-4">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              Product Identity
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              Retail Bottle Attributes & Facility Metadata
            </CardTitle>
            <CardDescription className="text-xs">
              Verified physical identity parameters bound to this serialized unit.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-muted/20 border border-border/80">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Product Name
                </span>
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {bottle.productName}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Honey Variety
                </span>
                <p className="font-medium text-foreground text-xs mt-0.5">
                  {bottle.honeyVariety}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Origin Region
                </span>
                <p className="font-medium text-foreground text-xs mt-0.5">
                  {bottle.originRegion}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Bottle Size / Net Weight
                </span>
                <p className="font-mono font-bold text-foreground text-xs mt-0.5">
                  {bottle.bottleSize} ({bottle.bottleSizeKg} kg)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground block flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" />
                  Packaging Date & Season
                </span>
                <p className="font-mono text-foreground text-xs">
                  {bottle.packagingDate} ({bottle.harvestPeriod})
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground block flex items-center gap-1">
                  <Building className="h-3 w-3 text-primary" />
                  Packaging Line & Lineage
                </span>
                <p className="text-foreground text-xs">
                  {bottle.packagingLine || "Line 01 - Automatic Micro-Filler"}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
              <span className="text-[10px] uppercase text-muted-foreground block flex items-center gap-1">
                <Building className="h-3 w-3 text-primary" />
                Packaging Facility
              </span>
              <p className="text-foreground text-xs">
                {bottle.packagingFacility}
              </p>
            </div>

            {bottle.notes && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-xs">
                <span className="text-[10px] uppercase text-muted-foreground block font-medium">
                  Packaging Notes
                </span>
                <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                  {bottle.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section: FULL SOURCE LINEAGE (Apiary → Hive → Activity → Harvest → Raw Batch → Custody → Receiving → Processing → Processed Batch → Laboratory → Certification → Bottle) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Complete Provenance Lineage
          </span>
          <CardTitle className="text-base font-bold text-foreground">
            End-to-End Traceability Chain
          </CardTitle>
          <CardDescription className="text-xs">
            Unbroken physical and digital provenance linking this bottle back to its primary apiary origin.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-6 py-2 text-xs">
            {/* Step 1: Apiary Origin */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-primary/20 border border-primary text-primary">
                <Wheat className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">1. Apiary Origin</span>
                  <Badge variant="outline" className="text-[10px] font-mono py-0">Chamoli, UK</Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {lineage?.apiaryName || "Highland North Apiary"} • {lineage?.apiaryLocation || "Chamoli, Uttarakhand"}
                </p>
                {lineage?.apiaryId && (
                  <Button variant="link" asChild className="p-0 h-auto text-[11px] text-primary">
                    <Link href={`/hives?apiary=${lineage.apiaryId}`}>
                      View Apiary Details →
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Hives & Colony */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-primary/20 border border-primary text-primary">
                <Radio className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">2. Source Hives</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {lineage?.hiveIdentifiers?.join(", ") || "HIVE-HN-01, HIVE-HN-02, HIVE-HN-04"}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Registered NFC/RFID tagged colonies monitored through digital colony inspections.
                </p>
              </div>
            </div>

            {/* Step 3: Harvest & Raw Honey Batch */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-primary/20 border border-primary text-primary">
                <Package className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">3. Raw Honey Extraction Batch</span>
                  <Link
                    href={`/batches/${lineage?.rawBatchId || "HC-RH-2026-0003"}`}
                    className="font-mono font-bold text-primary hover:underline"
                  >
                    {lineage?.rawBatchNumber || "HC-RH-2026-0003"}
                  </Link>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Harvested on {lineage?.harvestDate || "2026-09-13"}. Raw mountain multifloral extraction.
                </p>
              </div>
            </div>

            {/* Step 4: Custody Transfer & Manufacturer Receiving */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-primary/20 border border-primary text-primary">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">4. Custody Transfer & Intake</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Transfer: {lineage?.transferId || "TR-2026-0081"} • Receiving: {lineage?.receivingRecordId || "RCV-2026-0042"}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Dispatched under digital chain of custody and formally inspected at Golden Hive Foods facility.
                </p>
                <div className="flex items-center gap-3 pt-0.5">
                  <Button variant="link" asChild className="p-0 h-auto text-[11px] text-primary">
                    <Link href={`/custody/${lineage?.transferId || "TR-2026-0081"}`}>
                      View Transfer →
                    </Link>
                  </Button>
                  <Button variant="link" asChild className="p-0 h-auto text-[11px] text-primary">
                    <Link href={`/receiving/${lineage?.receivingRecordId || "RCV-2026-0042"}`}>
                      View Receiving →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 5: Processing & Processed Batch */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-primary/20 border border-primary text-primary">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">5. Processing & Processed Honey Batch</span>
                  <Link
                    href={`/batches/${bottle.sourceBatchId}`}
                    className="font-mono font-bold text-primary hover:underline"
                  >
                    {bottle.sourceBatchNumber}
                  </Link>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Job: {lineage?.processingJobId || "PRC-2026-0003"} • Low-temp micro-filtration & clarification preserving live pollen.
                </p>
              </div>
            </div>

            {/* Step 6: Laboratory Quality Testing & Certification */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-600 dark:text-emerald-400">
                <FlaskConical className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">6. Laboratory Testing & Certification</span>
                  <Link
                    href={`/certifications/${bottle.certificationId}`}
                    className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {bottle.certificationId}
                  </Link>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Passed full honey quality panel (HPLC, EA-IRMS isotopic adulteration screening, moisture & HMF checks) at PureTrace Labs.
                </p>
                <div className="flex items-center gap-3 pt-0.5">
                  <Button variant="link" asChild className="p-0 h-auto text-[11px] text-primary">
                    <Link href={`/lab/${lineage?.labTestId || "TEST-2026-0003"}`}>
                      View Lab Test →
                    </Link>
                  </Button>
                  <Button variant="link" asChild className="p-0 h-auto text-[11px] text-primary">
                    <Link href={`/certifications/${bottle.certificationId}`}>
                      View Certificate →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 7: Packaging & Bottle Creation */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400">
                <Package className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">7. Packaging & Public Identity</span>
                  <span className="font-mono font-bold text-foreground">{bottle.id}</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  {bottle.bottleSize} unit sealed on {bottle.packagingDate} under run {bottle.packagingRunId}. QR identity {bottle.qrIdentifier} generated.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PUBLISH CONFIRMATION MODAL */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5 text-emerald-600" />
              <span>Publish this bottle for public verification?</span>
            </DialogTitle>
            <DialogDescription className="text-xs pt-1 text-muted-foreground leading-relaxed">
              Consumers will be able to scan the QR code and view approved public product information, origin provenance, and laboratory certification.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bottle Identity:</span>
              <span className="font-mono font-bold text-foreground">{bottle.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium text-foreground">{bottle.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificate:</span>
              <span className="font-mono text-primary">{bottle.certificationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verification URL:</span>
              <span className="font-mono text-muted-foreground">{bottle.verificationUrl}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPublishModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Publish</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SUSPEND CONFIRMATION MODAL */}
      <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Suspend Public Verification?</span>
            </DialogTitle>
            <DialogDescription className="text-xs pt-1 text-muted-foreground leading-relaxed">
              Temporarily pauses consumer verification for this bottle. Anyone scanning the QR code will be notified that verification is suspended for review.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSuspendModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleSuspend}
              className="cursor-pointer gap-1.5"
            >
              <Ban className="h-4 w-4" />
              <span>Suspend Bottle</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BottleDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Product & Market", href: "/bottles" },
          { label: "Bottle Detail", active: true },
        ]}
        defaultNavId="bottles"
      >
        <BottleDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
