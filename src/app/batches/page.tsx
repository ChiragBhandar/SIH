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

function BatchesContent() {
  const { batches, apiaries, isLoaded } = useTraceability();

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
              Honey Batches
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              Material Registry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Raw honey batches and processed batch outputs with immutable provenance linkages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/processing/new">
              <Layers className="h-4 w-4 text-primary" />
              <span>Process Material</span>
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/batches/new">
              <Plus className="h-4 w-4" />
              <span>Create Harvest Batch</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Raw Honey Batches
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {rawBatchesCount}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {totalRawWeightKg.toFixed(1)} kg total extracted
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Boxes className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Processed Batches
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {processedBatchesCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                {totalProcessedWeightKg.toFixed(1)} kg processed output
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Sourced Apiaries
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-mono">
                {apiaries.length}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Active certified yards
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Wheat className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Traceability Chains
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                {batches.length} Active
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                100% provenance verified
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by batch ID, apiary, honey type, container..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Batches</option>
            <option value="raw">Raw Honey Only</option>
            <option value="processed">Processed Honey Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="Raw Batch Created">Raw Batch Created</option>
            <option value="Pending Custody Transfer">Pending Custody Transfer</option>
            <option value="Received">Received</option>
            <option value="Consumed partially for processing">Partially Processed</option>
            <option value="Processed Batch Created">Processed Batch Created</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Batches Table */}
      {filteredBatches.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No honey batches found"
          description="No honey batches match your search criteria. Create a new harvest batch to begin the traceability chain."
          action={
            <Button asChild size="sm">
              <Link href="/batches/new">+ Create Harvest Batch</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[180px]">Batch ID & Type</TableHead>
                <TableHead>Source / Origin</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Honey Type</TableHead>
                <TableHead className="text-right">Weight / Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Custodian</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                          variant="outline"
                          className={`text-[9px] py-0 font-mono ${
                            isProcessed
                              ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                              : "border-amber-500/40 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {isProcessed ? "Processed" : "Raw"}
                        </Badge>
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
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
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
                          View Details →
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
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Traceability", href: "#" },
          { label: "Honey Batches", active: true },
        ]}
        defaultNavId="batches"
      >
        <BatchesContent />
      </AppShell>
    </AuthGuard>
  );
}
