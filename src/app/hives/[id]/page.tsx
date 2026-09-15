"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Layers,
  ArrowLeft,
  Radio,
  MapPin,
  Clock,
  Activity,
  Plus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  CloudSun,
  Thermometer,
  Droplets,
  Flower2,
  Sparkles,
  Info,
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
import { EmptyState } from "@/components/ui/empty-state";

const ACTIVITY_ICONS: Record<string, typeof Activity> = {
  Inspection: ShieldCheck,
  Feeding: Sparkles,
  "Queen observation": CheckCircle2,
  "Pest treatment": ShieldAlert,
  "Floral observation": Flower2,
  "Harvest Preparation": Layers,
};

function HiveDetailContent() {
  const params = useParams();
  const hiveId = params?.id as string;
  const { getHive, getActivitiesByHive, isLoaded } = useTraceability();

  const [filterType, setFilterType] = React.useState<string>("all");

  const hive = getHive(hiveId);
  const activities = getActivitiesByHive(hiveId);

  const filteredActivities = React.useMemo(() => {
    if (filterType === "all") return activities;
    return activities.filter((a) => a.type === filterType);
  }, [activities, filterType]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading hive record...
        </div>
      </div>
    );
  }

  if (!hive) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Layers}
          title="Hive not found"
          description={`No hive found matching ID "${hiveId}". It may have been decommissioned or relocated.`}
          action={
            <Button asChild size="sm">
              <Link href="/hives">Back to Hives & Apiaries</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href={`/hives?apiary=${hive.apiaryId}`}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {hive.apiaryName}</span>
          </Link>
        </Button>
      </div>

      {/* Main Hive Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-5 rounded-lg border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {hive.identifier}
            </h1>
            <StatusBadge
              status={
                hive.status === "healthy"
                  ? "success"
                  : hive.status === "monitoring"
                  ? "warning"
                  : hive.status === "treated"
                  ? "info"
                  : "neutral"
              }
            >
              {hive.status.toUpperCase()}
            </StatusBadge>
            <Badge variant="outline" className="font-mono text-xs gap-1 border-primary/30">
              <Radio className="h-3 w-3 text-primary" />
              {hive.nfcRfidId}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span>Apiary:</span>
            <Link
              href={`/hives?apiary=${hive.apiaryId}`}
              className="font-medium text-foreground hover:underline flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-primary" />
              {hive.apiaryName}
            </Link>
            <span>•</span>
            <span>Box Code: <strong className="font-mono text-foreground">{hive.internalCode}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild className="gap-1.5 text-xs h-9 cursor-pointer shadow-xs">
            <Link href={`/activities/new?hiveId=${hive.id}`}>
              <Plus className="h-4 w-4" />
              <span>Log Activity</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Queen Status
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <StatusBadge status={hive.queenStatus} size="sm">
                {hive.queenStatus}
              </StatusBadge>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Inspected: {hive.lastInspectionDate}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hive Hardware Type
            </span>
            <h4 className="text-sm font-bold text-foreground">
              {hive.hiveType}
            </h4>
            <p className="text-[11px] text-muted-foreground pt-1">
              Standard brood frame dimensions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Yard Location
            </span>
            <h4 className="text-sm font-bold text-foreground truncate">
              {hive.locationInApiary}
            </h4>
            <p className="text-[11px] text-muted-foreground pt-1">
              Installed: {hive.installationDate}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Traceability Pairing
            </span>
            <h4 className="text-xs font-mono font-bold text-primary truncate">
              {hive.nfcRfidId}
            </h4>
            <p className="text-[11px] text-emerald-700 pt-1 font-medium">
              ✓ Hardware verified & linked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hive Notes / Environment */}
      {hive.notes && (
        <div className="rounded-md border border-border/80 bg-muted/20 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground font-medium">Colony Characteristics & Notes:</strong>{" "}
            {hive.notes}
          </div>
        </div>
      )}

      {/* Domain Distinction: Asset Ownership vs Honey Material Transfer */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-muted-foreground">
            <strong className="text-foreground">Colony Asset Governance:</strong> Hive asset ownership is distinct from honey material transfers. Transferring hive asset ownership records a physical asset event while preserving hive identity ({hive.identifier}) and does not generate honey batches or material custody records.
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono shrink-0 border-primary/30 text-primary">
          Asset Identity Preserved
        </Badge>
      </div>

      {/* Activity Timeline Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Activity Timeline</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Chronological log of inspections, pest treatments, queen status checks, and feedings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs cursor-pointer"
            >
              <option value="all">All Activity Types</option>
              <option value="Inspection">Inspection</option>
              <option value="Feeding">Feeding</option>
              <option value="Queen observation">Queen observation</option>
              <option value="Pest treatment">Pest treatment</option>
              <option value="Floral observation">Floral observation</option>
            </select>

            <Button asChild size="sm" variant="outline" className="text-xs h-9 gap-1 cursor-pointer">
              <Link href={`/activities/new?hiveId=${hive.id}`}>
                <Plus className="h-3.5 w-3.5" />
                <span>Log Activity</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Timeline Events Feed */}
        {filteredActivities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity recorded yet"
            description="No logged events found for this filter. Record field observations during yard checks."
            action={
              <Button asChild size="sm">
                <Link href={`/activities/new?hiveId=${hive.id}`}>
                  Log First Activity
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {filteredActivities.map((act) => {
              const Icon = ACTIVITY_ICONS[act.type] || Activity;
              return (
                <div key={act.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-6 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-primary text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>

                  <Card className="border-border bg-card shadow-xs hover:border-border/90 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold text-foreground">
                              {act.type}
                            </CardTitle>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(act.timestamp).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Environmental Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          {act.weather && (
                            <Badge variant="secondary" className="gap-1 font-normal text-[10px] py-0">
                              <CloudSun className="h-3 w-3 text-amber-500" />
                              {act.weather}
                            </Badge>
                          )}
                          {act.temperature && (
                            <Badge variant="outline" className="gap-1 font-mono text-[10px] py-0">
                              <Thermometer className="h-3 w-3 text-rose-500" />
                              {act.temperature}
                            </Badge>
                          )}
                          {act.humidity && (
                            <Badge variant="outline" className="gap-1 font-mono text-[10px] py-0">
                              <Droplets className="h-3 w-3 text-sky-500" />
                              {act.humidity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-2 text-xs">
                      {/* Detailed observation callouts */}
                      {act.floralObservation && (
                        <div className="flex items-start gap-1.5 text-muted-foreground bg-muted/20 p-2 rounded-md">
                          <Flower2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-foreground">Floral observation:</strong>{" "}
                            {act.floralObservation}
                          </span>
                        </div>
                      )}

                      <p className="text-foreground/90 leading-relaxed">
                        {act.notes}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[11px] text-muted-foreground">
                        <span>Recorded by: <strong>{act.recordedBy}</strong></span>
                        <StatusBadge status="success" size="sm">
                          Sync verified
                        </StatusBadge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HiveDetailPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Hives & Apiaries", href: "/hives" },
          { label: "Hive Detail", active: true },
        ]}
        defaultNavId="apiary"
      >
        <HiveDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
