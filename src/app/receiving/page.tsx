"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  PackageCheck,
  Boxes,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ChevronRight,
  ExternalLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

function ReceivingContent() {
  const { custodyTransfers, isLoaded } = useTraceability();
  const { selectedOrg, switchOrganisation } = useAuthSession();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [tabFilter, setTabFilter] = React.useState<"awaiting" | "all" | "accepted" | "rejected">("awaiting");

  // Inbound transfers targeting the currently selected organisation
  // (If super admin or inspecting, allow viewing all incoming)
  const incomingTransfers = React.useMemo(() => {
    return custodyTransfers.filter((t) => {
      if (!selectedOrg) return true;
      // Show if current org is destination, or if beekeeper coop show outgoing transfers with status
      return t.destinationOrgId === selectedOrg.id;
    });
  }, [custodyTransfers, selectedOrg]);

  const filteredTransfers = React.useMemo(() => {
    return incomingTransfers.filter((transfer) => {
      const matchesSearch =
        transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.sourceOrgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.transportRef.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (tabFilter === "awaiting") {
        return transfer.status === "Pending Acceptance";
      }
      if (tabFilter === "accepted") {
        return transfer.status === "Accepted";
      }
      if (tabFilter === "rejected") {
        return transfer.status === "Rejected";
      }
      return true;
    });
  }, [incomingTransfers, searchTerm, tabFilter]);

  const stats = React.useMemo(() => {
    const total = incomingTransfers.length;
    const awaiting = incomingTransfers.filter((t) => t.status === "Pending Acceptance").length;
    const accepted = incomingTransfers.filter((t) => t.status === "Accepted").length;
    const rejected = incomingTransfers.filter((t) => t.status === "Rejected").length;
    const totalWeight = incomingTransfers
      .filter((t) => t.status === "Accepted" || t.status === "Pending Acceptance")
      .reduce((sum, t) => sum + (Number(t.quantityKg) || 0), 0);
    return { total, awaiting, accepted, rejected, totalWeight };
  }, [incomingTransfers]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading manufacturer receiving queue...
        </div>
      </div>
    );
  }

  const isManufacturer = selectedOrg?.type === "processor" || selectedOrg?.id === "org-ghf-02";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <PackageCheck className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manufacturer Receiving
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Intake inspection, physical weight verification, and acceptance of raw honey consignments.
          </p>
        </div>

        {/* Organisation Context Switcher Tip if not manufacturer */}
        {!isManufacturer && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-xs">
            <span className="text-amber-700 dark:text-amber-400 font-medium">
              Active Org: {selectedOrg?.name}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20"
              onClick={() => switchOrganisation("org-ghf-02")}
            >
              Switch to Golden Hive Foods →
            </Button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>Awaiting Receipt</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
              {stats.awaiting}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Requires intake inspection
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Accepted Into Plant</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {stats.accepted}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Verified & ready for processing
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              <span>Rejected / Flagged</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {stats.rejected}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Non-compliant shipments
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              <span>Inbound Raw Volume</span>
              <Truck className="h-3.5 w-3.5 text-primary" />
            </CardDescription>
            <CardTitle className="text-2xl font-mono font-bold text-foreground">
              {stats.totalWeight.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">kg</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-muted-foreground">
            Total consignment intake
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incoming batch or supplier..."
            className="pl-8 h-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "awaiting", label: `Awaiting Receipt (${stats.awaiting})` },
            { id: "all", label: `All Inbound (${stats.total})` },
            { id: "accepted", label: `Accepted (${stats.accepted})` },
            { id: "rejected", label: `Rejected (${stats.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabFilter(tab.id as typeof tabFilter)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                tabFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Incoming Transports Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Incoming Batch ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Source Supplier</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Origin Apiary</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Transferred Weight</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Carrier / Ref</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Dispatch Date</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Receiving Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Intake Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <EmptyState
                      icon={PackageCheck}
                      title="No incoming shipments found"
                      description={
                        !isManufacturer
                          ? `Currently viewing as "${selectedOrg?.name}". Switch active organisation to Golden Hive Foods to review inbound manufacturer shipments.`
                          : "No shipments currently in queue matching your filter criteria."
                      }
                      action={
                        !isManufacturer ? (
                          <Button
                            size="sm"
                            onClick={() => switchOrganisation("org-ghf-02")}
                          >
                            Switch to Golden Hive Foods
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => {
                  const isPending = transfer.status === "Pending Acceptance";

                  return (
                    <TableRow key={transfer.id} className="group">
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        <Link
                          href={`/batches/${transfer.batchId}`}
                          className="hover:underline flex items-center gap-1.5 text-primary"
                        >
                          <Boxes className="h-3.5 w-3.5 shrink-0" />
                          <span>{transfer.batchId}</span>
                        </Link>
                        <span className="text-[10px] text-muted-foreground block font-sans font-normal mt-0.5">
                          {transfer.honeyType}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[170px]">
                            {transfer.sourceOrgName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {transfer.sourceApiaryName}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-right font-bold text-foreground">
                        {transfer.quantityKg.toFixed(1)} kg
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {transfer.transportRef}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transfer.transferDate}
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          status={
                            transfer.status === "Accepted"
                              ? "success"
                              : transfer.status === "Pending Acceptance"
                              ? "honey"
                              : "error"
                          }
                          size="sm"
                        >
                          {transfer.status === "Pending Acceptance" ? "Awaiting Receipt" : transfer.status}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="text-right">
                        {isPending ? (
                          <Button
                            asChild
                            size="xs"
                          >
                            <Link href={`/receiving/${transfer.id}`}>
                              <span>Review & Receive</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="xs"
                            asChild
                            className="text-primary hover:text-primary font-medium"
                          >
                            <Link href={`/receiving/${transfer.id}`}>
                              <span>View Intake</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
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

export default function ReceivingPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Receiving", active: true },
        ]}
        defaultNavId="receiving"
      >
        <ReceivingContent />
      </AppShell>
    </AuthGuard>
  );
}
