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
} from "lucide-react";

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
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Governance & Control Plane
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ledger Sync: Operational
              </span>
            </div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Administration</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Govern organisations, permissions, audit records, exceptions, and operational controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/audit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 hover:border-stone-700 transition-colors shadow-sm"
            >
              <History className="w-4 h-4 text-amber-400" />
              View Immutable Audit Log
            </Link>
            <Link
              href="/admin/plausibility"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Activity className="w-4 h-4" />
              Plausibility Review
            </Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Organisations */}
          <Link
            href="/admin/organisations"
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Organisations
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-amber-500/10 border border-stone-700 group-hover:border-amber-500/30 flex items-center justify-center text-stone-300 group-hover:text-amber-400 transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {totalOrgs}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              {pendingOrgs > 0 && (
                <span className="text-amber-400 font-semibold">{pendingOrgs} Pending</span>
              )}
              {suspendedOrgs > 0 && (
                <span className="text-rose-400 font-semibold">• {suspendedOrgs} Suspended</span>
              )}
              {pendingOrgs === 0 && suspendedOrgs === 0 && (
                <span className="text-emerald-400 font-medium">All Active & Verified</span>
              )}
            </div>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Users & Roles
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-amber-500/10 border border-stone-700 group-hover:border-amber-500/30 flex items-center justify-center text-stone-300 group-hover:text-amber-400 transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {totalUsers}
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <span className="text-emerald-400 font-semibold">{activeUsers} Active</span>
              <span>across 8 entities</span>
            </div>
          </Link>

          {/* Open Exceptions */}
          <Link
            href="/admin/exceptions"
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Open Exceptions
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-rose-500/10 border border-stone-700 group-hover:border-rose-500/30 flex items-center justify-center text-stone-300 group-hover:text-rose-400 transition-colors">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight flex items-baseline gap-2">
              {openExceptions}
              {criticalExceptions > 0 && (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                  {criticalExceptions} Critical
                </span>
              )}
            </div>
            <div className="text-xs text-stone-400">
              <span>{exceptions.length - openExceptions} Resolved or Dismissed</span>
            </div>
          </Link>

          {/* Pending Access Requests */}
          <Link
            href="/admin/access-requests"
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Access Requests
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-amber-500/10 border border-stone-700 group-hover:border-amber-500/30 flex items-center justify-center text-stone-300 group-hover:text-amber-400 transition-colors">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight flex items-baseline gap-2">
              {pendingRequests}
              {pendingRequests > 0 && (
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Needs Review
                </span>
              )}
            </div>
            <div className="text-xs text-stone-400">
              <span>Restricted Data Scopes</span>
            </div>
          </Link>

          {/* Audit Events */}
          <Link
            href="/admin/audit"
            className="group relative bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Audit Events
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-800 group-hover:bg-emerald-500/10 border border-stone-700 group-hover:border-emerald-500/30 flex items-center justify-center text-stone-300 group-hover:text-emerald-400 transition-colors">
                <History className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {totalAuditLogs}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Append-Only Chain</span>
            </div>
          </Link>
        </div>

        {/* Administration Modules Grid */}
        <div>
          <h2 className="text-base font-bold text-stone-200 tracking-tight mb-4 flex items-center gap-2">
            <span>Operational Governance Modules</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Organisations */}
            <Link
              href="/admin/organisations"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-amber-400 transition-colors">
                  Organisations
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Manage registered beekeeper cooperatives, manufacturers, analytical laboratories, distributors, and regulatory bodies.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-amber-400">
                <span>{totalOrgs} Registered Entities</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage Orgs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Card 2: Users & Roles */}
            <Link
              href="/admin/users"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-blue-400 transition-colors">
                  Users & Roles
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Provision multiple operational and governance roles per account across cooperatives, facilities, and departments.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-blue-400">
                <span>{totalUsers} Provisioned Accounts</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Assign Roles <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Card 3: Audit History */}
            <Link
              href="/admin/audit"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-emerald-400 transition-colors">
                  Complete Audit History
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Searchable and filterable append-only audit log covering operational, custody, lab certification, and administrative events.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-emerald-400">
                <span>{totalAuditLogs} Verified Audit Events</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Log <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Card 4: Exceptions */}
            <Link
              href="/admin/exceptions"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-rose-400 transition-colors">
                  Exceptions & Anomalies
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Investigate temperature violations, quality parameter failures, weight mismatches, and traceability gaps with full context.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-rose-400">
                <span>{openExceptions} Active Cases</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Triage Cases <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Card 5: Access Requests */}
            <Link
              href="/admin/access-requests"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-purple-400 transition-colors">
                  Access Requests
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Review requests for restricted raw spectrometry data, precise GPS geofences, and supply chain telemetry clearance.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-purple-400">
                <span>{pendingRequests} Pending Decisions</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Review Scopes <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Card 6: Field vs Sales Plausibility */}
            <Link
              href="/admin/plausibility"
              className="group p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-100 text-lg group-hover:text-amber-400 transition-colors">
                  Field vs Sales Plausibility
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Reconcile harvest production vs processing yield vs commercial sales commitments with human review safeguards.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80 text-xs font-semibold text-amber-400">
                <span>{plausibilityAlerts.length} Plausibility Envelopes</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Envelopes <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* System Activity Section */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-stone-100 tracking-tight flex items-center gap-2">
                <span>System Activity</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Feed
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Chronological stream of verified events across organisations, traceability checkpoints, and governance actions.
              </p>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              All Events ({totalAuditLogs}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-stone-800/60">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:bg-stone-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <EventTypeBadge type={evt.eventType} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-stone-200 text-sm">{evt.action}</span>
                      <span className="font-mono text-xs text-stone-400">({evt.id})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-1">
                      <span>
                        Actor: <strong className="text-stone-300 font-medium">{evt.actor.name}</strong> ({evt.actor.role})
                      </span>
                      <span>•</span>
                      <span>
                        Org: <strong className="text-stone-300 font-medium">{evt.organisation.name}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono text-stone-400">
                    {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Link
                    href={`/admin/audit/${evt.id}`}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-amber-400 hover:bg-stone-700 transition-colors text-xs inline-flex items-center gap-1 font-medium"
                    title="Inspect Audit Event"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminRoleGuard>
  );
}
