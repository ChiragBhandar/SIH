"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Activity,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Flower2,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  Wifi,
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

const ACTIVITY_ICONS: Record<string, typeof Activity> = {
  Inspection: ShieldCheck,
  Feeding: Sparkles,
  "Queen observation": CheckCircle2,
  "Pest treatment": ShieldAlert,
  "Floral observation": Flower2,
  "Harvest Preparation": Layers,
};

function ActivitiesContent() {
  const { activities, apiaries, isLoaded } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const filteredActivities = React.useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.hiveIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.apiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.recordedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || act.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [activities, searchQuery, typeFilter]);

  const totalActivitiesCount = activities.length;
  const inspectionsCount = activities.filter((a) => a.type === "Inspection").length;
  const treatmentsCount = activities.filter((a) => a.type === "Pest treatment").length;

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading field activities...
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
              Colony Field Activities
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              Operational Logs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Chronological field capture log of yard inspections, queen observations, and treatments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/activities/new">
              <Plus className="h-4 w-4" />
              <span>Capture Activity</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Activities Logged
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {activities.length}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Across all registered hives
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Routine Inspections
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {inspectionsCount}
              </h3>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                Brood & health verified
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pest Treatments
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {treatmentsCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Organic mite control protocols
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sync Status
              </p>
              <h3 className="text-lg font-bold tracking-tight text-emerald-700 mt-0.5">
                100% Synced
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Local state ledger consistent
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Wifi className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities by hive, apiary, notes, or operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9.5 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9.5 rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Inspection">Inspection</option>
            <option value="Feeding">Feeding</option>
            <option value="Queen observation">Queen observation</option>
            <option value="Pest treatment">Pest treatment</option>
            <option value="Floral observation">Floral observation</option>
          </select>
        </div>
      </div>

      {/* Table of Activities */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activities found"
          description="No log records match your current search and type filter. Record field inspections from apiary yards."
          action={
            <Button asChild size="default">
              <Link href="/activities/new">
                <Plus className="h-4 w-4" />
                <span>Log New Activity</span>
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[170px]">Date & Time</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Hive / Apiary</TableHead>
                <TableHead>Queen Status</TableHead>
                <TableHead className="hidden md:table-cell">Conditions</TableHead>
                <TableHead className="hidden lg:table-cell">Observations & Notes</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((act) => {
                const Icon = ACTIVITY_ICONS[act.type] || Activity;
                return (
                  <TableRow key={act.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-xs">
                      <div className="flex flex-col">
                        <span className="text-foreground font-semibold">
                          {new Date(act.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(act.timestamp).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} • {act.recordedBy}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 font-medium text-xs text-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          <Icon className="h-3 w-3" />
                        </span>
                        <span>{act.type}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/hives/${act.hiveId}`}
                          className="font-semibold text-primary text-xs hover:underline flex items-center gap-1"
                        >
                          <span>{act.hiveIdentifier}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          {act.apiaryName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={act.queenStatus} size="sm">
                        {act.queenStatus}
                      </StatusBadge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{act.weather} • {act.temperature}</span>
                        {act.floralObservation && (
                          <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                            {act.floralObservation}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[240px] truncate">
                      {act.notes}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        asChild
                        className="text-primary hover:text-primary hover:bg-amber-50 font-medium"
                      >
                        <Link href={`/hives/${act.hiveId}`}>
                          View Hive →
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

export default function ActivitiesPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Traceability", href: "#" },
          { label: "Colony Activities", active: true },
        ]}
        defaultNavId="activities"
      >
        <ActivitiesContent />
      </AppShell>
    </AuthGuard>
  );
}
