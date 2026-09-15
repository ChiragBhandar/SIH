"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  ArrowLeftRight,
  Plus,
  Search,
  SlidersHorizontal,
  Boxes,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function CustodyTransfersContent() {
  const { custodyTransfers, isLoaded } = useTraceability();
  const { selectedOrg } = useAuthSession();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredTransfers = React.useMemo(() => {
    return custodyTransfers.filter((transfer) => {
      const matchesSearch =
        transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.sourceOrgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.destinationOrgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.transportRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transfer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [custodyTransfers, searchTerm, statusFilter]);

  const stats = React.useMemo(() => {
    const total = custodyTransfers.length;
    const pending = custodyTransfers.filter((t) => t.status === "Pending Acceptance").length;
    const accepted = custodyTransfers.filter((t) => t.status === "Accepted").length;
    const totalWeight = custodyTransfers
      .filter((t) => t.status === "Accepted" || t.status === "Pending Acceptance")
      .reduce((sum, t) => sum + (Number(t.quantityKg) || 0), 0);
    return { total, pending, accepted, totalWeight };
  }, [custodyTransfers]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading custody transfer records...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Custody Transfers
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track and verify physical handovers between beekeepers and manufacturers while preserving batch provenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 shadow-xs font-medium">
            <Link href="/custody/new">
              <Plus className="h-4 w-4" />
              <span>Create Custody Transfer</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="p-4 pb-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Total Transfers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <CardTitle className="text-2xl font-mono font-bold text-foreground mt-1">
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            All registered chain transfers
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="p-4 pb-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Pending Acceptance</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <CardTitle className="text-2xl font-mono font-bold text-amber-700 mt-1">
              {stats.pending}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Awaiting manufacturer receiving
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="p-4 pb-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Accepted Transfers</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <CardTitle className="text-2xl font-mono font-bold text-emerald-700 mt-1">
              {stats.accepted}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Intake verified & received
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="p-4 pb-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Volume In Transit</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                <Truck className="h-3.5 w-3.5" />
              </div>
            </div>
            <CardTitle className="text-2xl font-mono font-bold text-foreground mt-1">
              {stats.totalWeight.toFixed(1)} <span className="text-xs font-normal text-muted-foreground font-sans">kg</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Physical raw honey in flow
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transfer ID, batch, org..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Transfers" },
            { id: "Pending", label: "Pending" },
            { id: "In Transit", label: "In Transit" },
            { id: "Completed", label: "Completed" },
            { id: "Rejected", label: "Rejected" },
            { id: "Draft", label: "Draft" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Transfers Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Transfer ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Batch ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">From Organisation</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">To Organisation</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Quantity</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Transfer Date</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Created By</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <EmptyState
                      icon={ArrowLeftRight}
                      title="No custody transfers found"
                      description="No custody transfers match your search or filter criteria."
                      action={
                        <Button asChild size="sm" variant="outline">
                          <Link href="/custody/new">Initiate New Transfer</Link>
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => {
                  const isCurrentOrgSource = selectedOrg?.id === transfer.sourceOrgId;
                  const isCurrentOrgDest = selectedOrg?.id === transfer.destinationOrgId;

                  return (
                    <TableRow key={transfer.id} className="group">
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        <Link
                          href={`/custody/${transfer.id}`}
                          className="hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span>{transfer.id}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </Link>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-foreground">
                        <Link
                          href={`/batches/${transfer.batchId}`}
                          className="hover:underline flex items-center gap-1 text-primary"
                        >
                          <Boxes className="h-3 w-3 shrink-0" />
                          <span>{transfer.batchId}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[150px] font-medium text-foreground">
                            {transfer.sourceOrgName}
                          </span>
                          {isCurrentOrgSource && (
                            <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate max-w-[150px] font-medium text-foreground">
                            {transfer.destinationOrgName}
                          </span>
                          {isCurrentOrgDest && (
                            <Badge variant="honey" className="text-[9px] py-0 px-1 font-mono">
                              Recipient
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-right font-bold text-foreground">
                        {transfer.quantityKg.toFixed(1)} kg
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transfer.transferDate}
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          status={getStatusBadgeVariant(transfer.status)}
                          size="sm"
                        >
                          {transfer.status}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground truncate max-w-[130px]">
                        {transfer.createdBy}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          asChild
                          className="text-primary hover:text-primary font-medium"
                        >
                          <Link href={`/custody/${transfer.id}`}>
                            <span>View</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function CustodyTransfersPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Custody Transfers", active: true },
        ]}
        defaultNavId="custody"
      >
        <CustodyTransfersContent />
      </AppShell>
    </AuthGuard>
  );
}
