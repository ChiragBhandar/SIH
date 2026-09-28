"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Wheat,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { useLanguage } from "@/context/language-context";

function BatchesContent() {
  const { batches, apiaries, isLoaded } = useTraceability();
  const { isHindi, tr } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");

  const filteredBatches = React.useMemo(() => {
    return batches.filter((b) => {
      const isProcessed = b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB");
      const matchesSearch =
        b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.sourceApiaryName && b.sourceApiaryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        b.honeyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.containerRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "raw" && !isProcessed) ||
        (typeFilter === "processed" && isProcessed);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [batches, searchQuery, statusFilter, typeFilter]);

  const rawBatchesCount = batches.filter(
    (b) => b.batchType !== "Processed Honey" && !b.batchNumber.startsWith("HC-PB")
  ).length;
  const processedBatchesCount = batches.filter(
    (b) => b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB")
  ).length;
  const totalRawWeightKg = batches
    .filter((b) => b.batchType !== "Processed Honey" && !b.batchNumber.startsWith("HC-PB"))
    .reduce((acc, b) => acc + (b.weightKg || 0), 0);
  const totalProcessedWeightKg = batches
    .filter((b) => b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB"))
    .reduce((acc, b) => acc + (b.weightKg || 0), 0);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading honey batches...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {tr("Honey Batches", "शहद के बैच")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {tr("Material Registry", "सामग्री रजिस्ट्री")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Raw honey batches and processed batch outputs with immutable provenance linkages.",
              "कच्चे शहद के बैच और प्रसंस्कृत बैच आउटपुट, अपरिवर्तनीय स्रोत लिंकेज के साथ।"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/processing/new">
              <Layers className="h-4 w-4 text-primary" />
              <span>{tr("Process Material", "सामग्री प्रसंस्करण करें")}</span>
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/batches/new">
              <Plus className="h-4 w-4" />
              <span>{tr("Create Harvest Batch", "कटाई बैच बनाएं")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Raw Honey Batches", "कच्चा शहद बैच")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {rawBatchesCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isHindi ? `${totalRawWeightKg.toFixed(1)} किग्रा कुल निकाला गया` : `${totalRawWeightKg.toFixed(1)} kg total extracted`}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Boxes className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Processed Batches", "प्रसंस्कृत बैच")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {processedBatchesCount}
              </h3>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                {isHindi ? `${totalProcessedWeightKg.toFixed(1)} किग्रा प्रसंस्कृत आउटपुट` : `${totalProcessedWeightKg.toFixed(1)} kg processed output`}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Sourced Apiaries", "स्रोत मधुमक्खी फार्म")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {apiaries.length}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Active certified yards", "सक्रिय प्रमाणित फार्म")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <Wheat className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Traceability Chains", "ट्रेसेबिलिटी श्रृंखला")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-700 mt-0.5 font-mono">
                {isHindi ? `${batches.length} सक्रिय` : `${batches.length} Active`}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("100% provenance verified", "100% स्रोत सत्यापित")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tr(
              "Search batches by batch #, apiary, honey type, or custodian...",
              "बैच #, फार्म, शहद प्रकार या संरक्षक द्वारा खोजें..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9.5 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>{tr("Type:", "प्रकार:")}</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9.5 rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">{tr("All Batches", "सभी बैच")}</option>
            <option value="Raw">{tr("Raw Honey", "कच्चा शहद")}</option>
            <option value="Processed">{tr("Processed Honey", "प्रसंस्कृत शहद")}</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      {filteredBatches.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={tr("No batches found", "कोई बैच नहीं मिला")}
          description={tr("No honey batches match your current search and type filters. Log a new harvest from an apiary.", "कोई शहद बैच आपके वर्तमान खोज और प्रकार फ़िल्टर से मेल नहीं खाता। फार्म से नई कटाई दर्ज करें।")}
          action={
            <Button asChild size="default">
              <Link href="/batches/new">
                <Plus className="h-4 w-4" />
                <span>{tr("Log New Harvest Batch", "नया कटाई बैच दर्ज करें")}</span>
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[180px]">{tr("Batch Number", "बैच नंबर")}</TableHead>
                <TableHead>{tr("Source / Origin", "स्रोत / मूल")}</TableHead>
                <TableHead>{tr("Harvest Date", "कटाई दिनांक")}</TableHead>
                <TableHead>{tr("Honey Type", "शहद प्रकार")}</TableHead>
                <TableHead className="text-right">{tr("Weight / Available", "भार / उपलब्ध")}</TableHead>
                <TableHead>{tr("Status", "स्थिति")}</TableHead>
                <TableHead className="hidden md:table-cell">{tr("Custodian", "संरक्षक")}</TableHead>
                <TableHead className="text-right">{tr("Action", "कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => {
                const isProcessed = batch.batchType === "Processed Honey" || batch.batchNumber.startsWith("HC-PB");
                const remaining = batch.remainingWeightKg !== undefined ? batch.remainingWeightKg : batch.weightKg;

                return (
                  <TableRow key={batch.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-semibold">
                      <Link
                        href={`/batches/${batch.id}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <span>{batch.batchNumber}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StatusBadge
                          status={isProcessed ? "purple" : "honey"}
                          size="sm"
                          withDot={false}
                        >
                          {isProcessed ? "Processed" : "Raw"}
                        </StatusBadge>
                        <span className="text-[10px] text-muted-foreground font-sans">
                          Ref: {batch.containerRef}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {batch.sourceApiaryName}
                        </span>
                        {!isProcessed && batch.sourceHiveIdentifiers && (
                          <span className="text-[10px] text-muted-foreground">
                            {batch.sourceHiveIdentifiers.length} linked hive(s)
                          </span>
                        )}
                        {isProcessed && batch.derivedFromBatches && (
                          <span className="text-[10px] text-primary font-mono">
                            Derived: {batch.derivedFromBatches.map((b) => b.batchNumber).join(", ")}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {isProcessed ? (batch.processingDate || batch.harvestDate) : batch.harvestDate}
                    </TableCell>

                    <TableCell className="text-xs font-medium text-foreground">
                      {batch.honeyType}
                    </TableCell>

                    <TableCell className="text-xs text-right whitespace-nowrap">
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-foreground">
                          {batch.weightKg.toFixed(1)} kg
                        </span>
                        {!isProcessed && (
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                            {remaining.toFixed(1)} kg avl
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={
                          batch.status === "Received" || batch.status === "Processed Batch Created"
                            ? "success"
                            : batch.status === "Rejected"
                            ? "error"
                            : "honey"
                        }
                        size="sm"
                      >
                        {batch.status}
                      </StatusBadge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground truncate max-w-[140px]">
                      {batch.currentCustodyOrgName || "Cooperative"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        asChild
                        className="text-primary hover:text-primary hover:bg-primary/10 font-medium"
                      >
                        <Link href={`/batches/${batch.id}`}>
                          {tr("View Details →", "विवरण देखें →")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function BatchesPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Traceability", "ट्रेसेबिलिटी"), href: "#" },
          { label: tr("Honey Batches", "शहद के बैच"), active: true },
        ]}
        defaultNavId="batches"
      >
        <BatchesContent />
      </AppShell>
    </AuthGuard>
  );
}

