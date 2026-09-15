"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, EventTypeBadge } from "@/components/admin";
import {
  Building2,
  Users,
  History,
  AlertTriangle,
  KeyRound,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Scale,
  Sparkles,
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

export default function AdminDashboardPage() {
  const {
    adminOrganisations,
    adminUsers,
    auditEvents,
    exceptions,
    accessRequests,
    plausibilityAlerts,
  } = useTraceability();

  // Metrics calculations
  const totalOrgs = adminOrganisations.length;
  const pendingOrgs = adminOrganisations.filter((o) => o.status === "Pending").length;
  const suspendedOrgs = adminOrganisations.filter((o) => o.status === "Suspended").length;

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;

  const openExceptions = exceptions.filter(
    (e) => e.status === "open" || e.status === "investigating"
  ).length;
  const criticalExceptions = exceptions.filter(
    (e) => (e.status === "open" || e.status === "investigating") && e.severity === "critical"
  ).length;

  const pendingRequests = accessRequests.filter((r) => r.status === "pending").length;
  const totalAuditLogs = auditEvents.length;

  // Recent system activity
  const recentEvents = auditEvents.slice(0, 8);

  return (
    <AdminRoleGuard>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="font-mono text-xs border-amber-500/30 text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300">
                Governance & Control Plane
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Ledger Sync: Operational
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Administration
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Govern organisations, permissions, audit records, exceptions, and operational controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/admin/audit">
                <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>View Immutable Audit Log</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/admin/plausibility">
                <Activity className="w-4 h-4" />
                <span>Plausibility Review</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Organisations */}
          <Link href="/admin/organisations" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Organisations
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalOrgs}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {pendingOrgs > 0 && (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">{pendingOrgs} Pending</span>
                    )}
                    {suspendedOrgs > 0 && (
                      <span className="text-destructive font-semibold">• {suspendedOrgs} Suspended</span>
                    )}
                    {pendingOrgs === 0 && suspendedOrgs === 0 && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">All Active & Verified</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Users */}
          <Link href="/admin/users" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Users & Roles
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalUsers}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{activeUsers} Active</span>
                    <span>across 8 entities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Open Exceptions */}
          <Link href="/admin/exceptions" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Open Exceptions
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1 flex items-baseline gap-2">
                    {openExceptions}
                    {criticalExceptions > 0 && (
                      <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                        {criticalExceptions} Critical
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{exceptions.length - openExceptions} Resolved or Dismissed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Access Requests */}
          <Link href="/admin/access-requests" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Access Requests
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1 flex items-baseline gap-2">
                    {pendingRequests}
                    {pendingRequests > 0 && (
                      <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Needs Review
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>Restricted Data Scopes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Audit Events */}
          <Link href="/admin/audit" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Audit Events
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <History className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalAuditLogs}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Append-Only Chain</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Administration Modules Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Operational Governance Modules
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Access core administrative consoles and statutory compliance controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Organisations */}
            <Link href="/admin/organisations" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Organisations
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Manage registered beekeeper cooperatives, manufacturers, analytical laboratories, distributors, and regulatory bodies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalOrgs} Registered Entities</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Manage Orgs <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 2: Users & Roles */}
            <Link href="/admin/users" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Users & Roles
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Provision multiple operational and governance roles per account across cooperatives, facilities, and departments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalUsers} Provisioned Accounts</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Assign Roles <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 3: Complete Audit History */}
            <Link href="/admin/audit" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Complete Audit History
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Searchable and filterable append-only audit log covering operational, custody, lab certification, and administrative events.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalAuditLogs} Verified Audit Events</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Log <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 4: Exceptions & Anomalies */}
            <Link href="/admin/exceptions" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Exceptions & Anomalies
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Investigate temperature violations, quality parameter failures, weight mismatches, and traceability gaps with full context.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{openExceptions} Active Cases</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Triage Cases <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 5: Access Requests */}
            <Link href="/admin/access-requests" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Access Requests
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Review requests for restricted raw spectrometry data, precise GPS geofences, and supply chain telemetry clearance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{pendingRequests} Pending Decisions</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Review Scopes <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 6: Field vs Sales Plausibility */}
            <Link href="/admin/plausibility" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    Field vs Sales Plausibility
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Reconcile harvest production vs processing yield vs commercial sales commitments with human review safeguards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{plausibilityAlerts.length} Plausibility Envelopes</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Envelopes <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* System Activity Section */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    System Activity
                  </CardTitle>
                  <Badge variant="outline" className="text-[11px] font-semibold border-emerald-500/30 text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Live Feed
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Chronological stream of verified events across organisations, traceability checkpoints, and governance actions.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-semibold hover:text-primary">
                <Link href="/admin/audit">
                  All Events ({totalAuditLogs}) &rarr;
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="py-3.5 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <EventTypeBadge type={evt.eventType} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-xs sm:text-sm">{evt.action}</span>
                        <span className="font-mono text-xs text-muted-foreground">({evt.id})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                        <span>
                          Actor: <strong className="text-foreground font-medium">{evt.actor.name}</strong> ({evt.actor.role})
                        </span>
                        <span>•</span>
                        <span>
                          Org: <strong className="text-foreground font-medium">{evt.organisation.name}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Link href={`/admin/audit/${evt.id}`}>
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoleGuard>
  );
}
