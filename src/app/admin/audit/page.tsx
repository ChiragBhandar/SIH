"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, EventTypeBadge } from "@/components/admin";
import { AuditEventType } from "@/types/admin";
import {
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";

const EVENT_TYPE_OPTIONS: AuditEventType[] = [
  "Apiary Registered",
  "Hive Registered",
  "Activity Recorded",
  "Harvest Created",
  "Batch Created",
  "Custody Transfer",
  "Receiving",
  "Processing",
  "Laboratory Test",
  "Certification",
  "Bottle Created",
  "Bottle Published",
  "Marketplace Listing",
  "Marketplace Order",
  "Access Request",
  "Role Assignment",
  "Exception",
  "Administrative Action",
];

export default function CompleteAuditHistoryPage() {
  const { auditEvents, adminOrganisations } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedOrg, setSelectedOrg] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const filteredEvents = React.useMemo(() => {
    return auditEvents.filter((evt) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        evt.id.toLowerCase().includes(q) ||
        evt.action.toLowerCase().includes(q) ||
        evt.actor.name.toLowerCase().includes(q) ||
        evt.organisation.name.toLowerCase().includes(q) ||
        evt.entity.id.toLowerCase().includes(q) ||
        evt.entity.title.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || evt.eventType === selectedType;
      const matchesOrg = selectedOrg === "all" || evt.organisation.id === selectedOrg;
      const matchesStatus = selectedStatus === "all" || evt.status === selectedStatus;

      return matchesSearch && matchesType && matchesOrg && matchesStatus;
    });
  }, [auditEvents, searchQuery, selectedType, selectedOrg, selectedStatus]);

  return (
    <AdminRoleGuard>
      <div className="space-y-6 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Administration
              </Link>
              <span>/</span>
              <span className="text-stone-300">Audit History</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight">
                Audit History
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Append-Only Verified
              </span>
            </div>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Append-only record of operational, custody, quality, commercial, and administrative events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl text-xs font-mono text-stone-300 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{auditEvents.length} Immutable Cryptographic Blocks</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                placeholder="Search event ID, action, actor, entity ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Event Type Filter */}
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Event Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Event Types ({EVENT_TYPE_OPTIONS.length})</option>
                  {EVENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organisation Filter */}
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Organisation:</span>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Organisations</option>
                  {adminOrganisations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="flagged">Flagged</option>
                  <option value="corrected">Corrected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Events Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Organisation</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-stone-500">
                      No audit events match your selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr
                      key={evt.id}
                      className="hover:bg-stone-800/40 transition-colors group cursor-pointer"
                    >
                      {/* Event ID */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/audit/${evt.id}`}
                          className="font-mono font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          {evt.id}
                        </Link>
                      </td>

                      {/* Event Type */}
                      <td className="py-4 px-4">
                        <EventTypeBadge type={evt.eventType} />
                      </td>

                      {/* Actor */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-200">
                            {evt.actor.name}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {evt.actor.role}
                          </span>
                        </div>
                      </td>

                      {/* Organisation */}
                      <td className="py-4 px-4">
                        <span className="text-stone-300 font-medium">
                          {evt.organisation.name}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="font-medium text-stone-200 truncate">
                            {evt.entity.title}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">
                            ID: {evt.entity.id}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                        {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px] border border-stone-700/60">
                          {evt.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={evt.status} variant="auditStatus" />
                      </td>

                      {/* Action button */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/audit/${evt.id}`}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3 text-amber-400" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminRoleGuard>
  );
}
