"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import {
  QrCode,
  Plus,
  Search,
  Package,
  ExternalLink,
  Layers,
  Award,
  Eye,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { BottleStatus, QRStatus } from "@/types/bottle";
import { getVerifyUrl } from "@/lib/constants";


export function BottlesListContent() {
  const {
    bottles,
    getEligibleBottlingBatches,
  } = useTraceability();
  const { tr, trStatus } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const eligibleBatches = getEligibleBottlingBatches();

  // Metrics
  const totalBottles = bottles.length;
  const publishedBottles = bottles.filter((b) => b.status === "Published").length;
  const verificationReady = bottles.filter((b) => b.qrStatus === "Active").length;
  const eligibleBatchesCount = eligibleBatches.length;

  const filteredBottles = React.useMemo(() => {
    return bottles.filter((bottle) => {
      const matchesSearch =
        searchQuery === "" ||
        bottle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bottle.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bottle.sourceBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bottle.honeyVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bottle.qrIdentifier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && bottle.status === "Published") ||
        (statusFilter === "created" && (bottle.status === "Created" || bottle.status === "Draft")) ||
        (statusFilter === "suspended" && bottle.status === "Suspended");

      return matchesSearch && matchesStatus;
    });
  }, [bottles, searchQuery, statusFilter]);

  const handleCopyLink = (bottleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const url = getVerifyUrl(bottleId);
      navigator.clipboard.writeText(url);
      setCopiedId(bottleId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getStatusBadge = (status: BottleStatus) => {
    switch (status) {
      case "Published":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
            {tr("Published", "प्रकाशित")}
          </Badge>
        );
      case "Created":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
            {tr("Created", "निर्मित")}
          </Badge>
        );
      case "Draft":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
            {tr("Draft", "प्रारूप")}
          </Badge>
        );
      case "Suspended":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">
            {tr("Suspended", "निलंबित")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{trStatus(status)}</Badge>;
    }
  };

  const getQRBadge = (qrStatus: QRStatus) => {
    switch (qrStatus) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {tr("Active", "सक्रिय")}
          </span>
        );
      case "Generated":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {tr("Generated", "उत्पन्न")}
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            {tr("Suspended", "निलंबित")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-muted" />
            {tr("Not Generated", "उत्पन्न नहीं")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <QrCode className="h-6 w-6 text-primary" />
              <span>{tr("Bottles & QR Verification", "बोतलें व क्यूआर सत्यापन")}</span>
            </h1>
            <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-300 text-xs">
              {tr("Consumer Trust", "उपभोक्ता विश्वास")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {tr(
              "Create individual product identities and publish approved consumer verification records.",
              "व्यक्तिगत उत्पाद पहचान बनाएं और स्वीकृत उपभोक्ता सत्यापन रिकॉर्ड प्रकाशित करें।"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/bottles/new">
              <Plus className="h-4 w-4" />
              <span>{tr("Create Bottles", "बोतलें बनाएं")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Eligible Batches */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {tr("Eligible Batches", "पात्र बैच")}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {eligibleBatchesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr("Quality-approved processed batches ready for packaging", "गुणवत्ता-स्वीकृत प्रसंस्कृत बैच पैकेजिंग हेतु तैयार")}
            </p>
          </CardContent>
        </Card>

        {/* Bottles Created */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {tr("Bottles Created", "निर्मित बोतलें")}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {totalBottles}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr("Individual digital identities registered", "व्यक्तिगत डिजिटल पहचान पंजीकृत")}
            </p>
          </CardContent>
        </Card>

        {/* Published */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {tr("Published", "प्रकाशित")}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Globe className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {publishedBottles}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr("Public verification accessible to consumers", "उपभोक्ताओं के लिए सार्वजनिक सत्यापन सुलभ")}
            </p>
          </CardContent>
        </Card>

        {/* Verification Ready */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {tr("Verification Ready", "सत्यापन हेतु तैयार")}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <QrCode className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {verificationReady}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr("Active QR identifiers in circulation", "प्रचलन में सक्रिय क्यूआर पहचानकर्ता")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Eligible Batch Alert Banner */}
      {eligibleBatchesCount > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0 mt-0.5 sm:mt-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <span>
                  {eligibleBatchesCount}{" "}
                  {tr(
                    `Processed Batch${eligibleBatchesCount > 1 ? "es" : ""} Eligible for Bottle Creation`,
                    `प्रसंस्कृत बैच बोतल निर्माण हेतु पात्र`
                  )}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tr(
                  `Quality certification is complete for ${eligibleBatches.map((b) => b.batchNumber).join(", ")}. You can now generate unique packaging runs and consumer QR codes.`,
                  `${eligibleBatches.map((b) => b.batchNumber).join(", ")} के लिए गुणवत्ता प्रमाणीकरण पूर्ण है। अब आप पैकेजिंग और उपभोक्ता क्यूआर कोड जनरेट कर सकते हैं।`
                )}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5 cursor-pointer">
            <Link href={`/bottles/new?batch=${eligibleBatches[0].id}`}>
              <Plus className="h-3.5 w-3.5" />
              <span>{tr("Package", "पैकेज करें")} {eligibleBatches[0].batchNumber}</span>
            </Link>
          </Button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tr("Search by bottle ID, product, batch or QR...", "बोतल आईडी, उत्पाद, बैच या क्यूआर से खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={statusFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="h-8 text-xs cursor-pointer"
          >
            {tr("All", "सभी")} ({bottles.length})
          </Button>
          <Button
            variant={statusFilter === "published" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("published")}
            className="h-8 text-xs text-emerald-700 cursor-pointer"
          >
            {tr("Published", "प्रकाशित")} ({publishedBottles})
          </Button>
          <Button
            variant={statusFilter === "created" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("created")}
            className="h-8 text-xs text-amber-800 cursor-pointer"
          >
            {tr("Created / Draft", "निर्मित / प्रारूप")} ({bottles.filter((b) => b.status === "Created" || b.status === "Draft").length})
          </Button>
          <Button
            variant={statusFilter === "suspended" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("suspended")}
            className="h-8 text-xs text-rose-700 cursor-pointer"
          >
            {tr("Suspended", "निलंबित")} ({bottles.filter((b) => b.status === "Suspended").length})
          </Button>
        </div>
      </div>

      {/* Bottles Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/40 text-[11px] uppercase tracking-wider">
                <TableHead className="font-semibold text-foreground">{tr("Bottle ID", "बोतल आईडी")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Product", "उत्पाद")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Source Batch", "स्रोत बैच")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Honey Variety", "शहद किस्म")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Bottle Size", "बोतल आकार")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Created Date", "निर्माण तिथि")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("Status", "स्थिति")}</TableHead>
                <TableHead className="font-semibold text-foreground">{tr("QR Status", "क्यूआर स्थिति")}</TableHead>
                <TableHead className="font-semibold text-foreground text-right">{tr("Action", "कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBottles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <EmptyState
                      icon={QrCode}
                      title={tr("No bottles found", "कोई बोतल नहीं मिली")}
                      description={
                        searchQuery
                          ? tr("No packaging records match your search criteria.", "कोई रिकॉर्ड खोज से मेल नहीं खाता।")
                          : tr(
                              "No bottles have been packaged yet. Select an approved processed batch to create bottles.",
                              "अभी तक कोई बोतल पैक नहीं की गई है। बोतल बनाने के लिए स्वीकृत प्रसंस्कृत बैच चुनें।"
                            )
                      }
                      action={
                        eligibleBatchesCount > 0 ? (
                          <Button asChild size="sm">
                            <Link href="/bottles/new">{tr("Create First Bottles", "पहली बोतलें बनाएं")}</Link>
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredBottles.map((bottle) => (
                  <TableRow key={bottle.id} className="hover:bg-muted/30 text-xs transition-colors">
                    {/* Bottle ID */}
                    <TableCell className="font-mono font-bold text-foreground">
                      <Link
                        href={`/bottles/${bottle.id}`}
                        className="hover:underline hover:text-primary flex items-center gap-1.5"
                      >
                        <span>{bottle.id}</span>
                      </Link>
                    </TableCell>

                    {/* Product */}
                    <TableCell className="font-medium text-foreground">
                      {bottle.productName}
                    </TableCell>

                    {/* Source Batch */}
                    <TableCell>
                      <Link
                        href={`/batches/${bottle.sourceBatchId}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {bottle.sourceBatchNumber}
                      </Link>
                    </TableCell>

                    {/* Honey Variety */}
                    <TableCell className="text-muted-foreground">
                      {bottle.honeyVariety}
                    </TableCell>

                    {/* Bottle Size */}
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {bottle.bottleSize}
                      </Badge>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-muted-foreground font-mono text-[11px]">
                      {new Date(bottle.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(bottle.status)}</TableCell>

                    {/* QR Status */}
                    <TableCell>{getQRBadge(bottle.qrStatus)}</TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          asChild
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/bottles/${bottle.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">{tr("Details", "विवरण")}</span>
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => handleCopyLink(bottle.id, e)}
                          className="text-muted-foreground hover:text-foreground"
                          title={tr("Copy public verification link", "सार्वजनिक सत्यापन लिंक कॉपी करें")}
                        >
                          {copiedId === bottle.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="xs"
                          asChild
                          className="border-primary/30 text-primary hover:bg-primary/5"
                          title={tr("Open public consumer verification page", "उपभोक्ता सत्यापन पृष्ठ खोलें")}
                        >
                          <Link href={`/verify/${bottle.id}`} target="_blank">
                            <ExternalLink className="h-3 w-3" />
                            <span className="sr-only sm:not-sr-only sm:text-[10px]">{tr("Verify", "सत्यापित")}</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function BottlesPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Product & Market", "उत्पाद एवं बाजार"), href: "/bottles" },
          { label: tr("Bottles & QR Verification", "बोतलें व क्यूआर सत्यापन"), active: true },
        ]}
        defaultNavId="bottles"
      >
        <BottlesListContent />
      </AppShell>
    </AuthGuard>
  );
}
