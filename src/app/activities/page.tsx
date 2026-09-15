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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Field Logs
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {totalActivitiesCount}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Across {apiaries.length} apiaries
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Routine Inspections
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {inspectionsCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Brood & health verified
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Pest Treatments
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {treatmentsCount}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Organic mite control protocols
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Sync Status
              </p>
              <h3 className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-0.5">
                100% Synced
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Local state ledger consistent
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wifi className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities by hive, apiary, notes, or operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Activity Types</option>
            <option value="Inspection">Inspection</option>
            <option value="Queen observation">Queen observation</option>
            <option value="Feeding">Feeding</option>
            <option value="Pest treatment">Pest treatment</option>
            <option value="Floral observation">Floral observation</option>
            <option value="Harvest Preparation">Harvest Preparation</option>
          </select>
        </div>
      </div>

      {/* Activities Table */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No field activities found"
          description="No activity entries match your current search and filter settings."
          action={
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[180px]">Date / Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target Hive & Apiary</TableHead>
                <TableHead>Queen Status</TableHead>
                <TableHead className="hidden md:table-cell">Weather / Flora</TableHead>
                <TableHead className="hidden lg:table-cell">Notes</TableHead>
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
                        <span className="font-semibold text-foreground">
                          {new Date(act.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(act.timestamp).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {act.type}
                        </span>
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
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0 ${
                          act.queenStatus.includes("Active")
                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                            : act.queenStatus === "Virgin"
                            ? "border-sky-500/40 text-sky-600 dark:text-sky-400"
                            : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {act.queenStatus}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{act.weather} • {act.temperature}</span>
                        {act.floralObservation && (
                          <span className="text-[10px] text-muted-foreground/80 truncate max-w-[180px]">
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
                        size="sm"
                        asChild
                        className="h-7 text-xs px-2 text-primary hover:text-primary hover:bg-primary/10"
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
