"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge } from "@/components/admin";
import {
  AlertTriangle,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Eye,
} from "lucide-react";

export default function ExceptionsListPage() {
  const { exceptions } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Summary card counts
  const openCount = exceptions.filter((e) => e.status === "open").length;
  const investigatingCount = exceptions.filter((e) => e.status === "investigating").length;
  const resolvedCount = exceptions.filter((e) => e.status === "resolved").length;
  const criticalCount = exceptions.filter(
    (e) => (e.status === "open" || e.status === "investigating") && e.severity === "critical"
  ).length;

  const filteredExceptions = React.useMemo(() => {
    return exceptions.filter((exc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        exc.id.toLowerCase().includes(q) ||
        exc.type.toLowerCase().includes(q) ||
        exc.description.toLowerCase().includes(q) ||
        exc.reportedBy.name.toLowerCase().includes(q) ||
        exc.reportedBy.organisation.toLowerCase().includes(q) ||
        exc.relatedEntity.id.toLowerCase().includes(q) ||
        exc.relatedEntity.title.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || exc.type === selectedType;
      const matchesSeverity = selectedSeverity === "all" || exc.severity === selectedSeverity;
      const matchesStatus = selectedStatus === "all" || exc.status === selectedStatus;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [exceptions, searchQuery, selectedType, selectedSeverity, selectedStatus]);

  return (
    <AdminRoleGuard>
      <div className="space-y-8 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Administration
              </Link>
              <span>/</span>
              <span className="text-stone-300">Exceptions</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Exceptions</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Investigate operational anomalies, rejected records, and traceability issues.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              Total Logged: {exceptions.length} Cases
            </span>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Open */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Open Cases
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {openCount}
            </div>
            <p className="text-xs text-stone-400">Awaiting triage & response</p>
          </div>

          {/* Investigating */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Investigating
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {investigatingCount}
            </div>
            <p className="text-xs text-stone-400">Active root-cause trace in progress</p>
          </div>

          {/* Resolved */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Resolved
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-100 mb-1 tracking-tight">
              {resolvedCount}
            </div>
            <p className="text-xs text-stone-400">Corrective actions completed</p>
          </div>

          {/* Critical */}
          <div className="bg-stone-900/90 border border-rose-900/40 rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br from-rose-950/20 to-stone-900">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Critical Severity
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertOctagon className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-300 mb-1 tracking-tight">
              {criticalCount}
            </div>
            <p className="text-xs text-rose-400/80">Immediate quarantine priority</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search exception ID, type, batch, actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type */}
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Types</option>
                <option value="Receiving Rejection">Receiving Rejection</option>
                <option value="Quality Rejection">Quality Rejection</option>
                <option value="Quantity Mismatch">Quantity Mismatch</option>
                <option value="Missing Traceability Link">Missing Traceability Link</option>
                <option value="Suspicious Yield">Suspicious Yield</option>
                <option value="Access Issue">Access Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exceptions Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Exception ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Related Entity</th>
                  <th className="py-3.5 px-4">Reported By</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredExceptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500">
                      No compliance exceptions match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExceptions.map((exc) => (
                    <tr key={exc.id} className="hover:bg-stone-800/40 transition-colors">
                      {/* Exception ID */}
                      <td className="py-4 px-4 font-mono font-bold text-rose-400">
                        <Link href={`/admin/exceptions/${exc.id}`} className="hover:underline">
                          {exc.id}
                        </Link>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 font-semibold text-stone-200">
                        {exc.type}
                      </td>

                      {/* Related Entity */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="font-medium text-stone-300 truncate">
                            {exc.relatedEntity.title}
                          </span>
                          <span className="font-mono text-[10px] text-amber-400">
                            {exc.relatedEntity.id}
                          </span>
                        </div>
                      </td>

                      {/* Reported By */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-200">
                            {exc.reportedBy.name}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {exc.reportedBy.organisation}
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                        {new Date(exc.createdDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Severity */}
                      <td className="py-4 px-4">
                        <StatusBadge status={exc.severity} variant="severity" />
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={exc.status} variant="exceptionStatus" />
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/exceptions/${exc.id}`}
                          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold inline-flex items-center gap-1.5 transition-colors text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Investigate</span>
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
