"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import { AdminOrgStatus } from "@/types/admin";
import {
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Eye,
  MapPin,
  Users,
} from "lucide-react";

export default function AdminOrganisationsPage() {
  const { adminOrganisations, updateOrganisationStatus } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Confirmation Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [targetOrgId, setTargetOrgId] = React.useState<string | null>(null);
  const [targetAction, setTargetAction] = React.useState<AdminOrgStatus>("Active");

  const targetOrg = adminOrganisations.find((o) => o.id === targetOrgId);

  const filteredOrgs = React.useMemo(() => {
    return adminOrganisations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || org.type === selectedType;
      const matchesStatus = selectedStatus === "all" || org.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [adminOrganisations, searchQuery, selectedType, selectedStatus]);

  const handleOpenAction = (orgId: string, action: AdminOrgStatus) => {
    setTargetOrgId(orgId);
    setTargetAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = (reason: string) => {
    if (targetOrgId) {
      updateOrganisationStatus(targetOrgId, targetAction, reason);
    }
  };

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
              <span className="text-stone-300">Organisations</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Organisations</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Registry of verified beekeeper cooperatives, manufacturers, laboratories, distributors, and statutory governance authorities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              Total: {adminOrganisations.length} Registered
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search name, code, ID or reg number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Types</option>
                <option value="Beekeeper Cooperative">Beekeeper Cooperative</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Buyer">Buyer / Distributor</option>
                <option value="Administrator">Administrator / Regulator</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organisations Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Organisation ID</th>
                  <th className="py-3.5 px-4">Organisation Name</th>
                  <th className="py-3.5 px-4">Organisation Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Members</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      No organisations match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org) => (
                    <tr
                      key={org.id}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* ID & Code */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-amber-400">
                            {org.id}
                          </span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                            Code: {org.code}
                          </span>
                        </div>
                      </td>

                      {/* Name & Location */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/organisations/${org.id}`}
                            className="font-semibold text-stone-200 group-hover:text-amber-400 transition-colors text-sm"
                          >
                            {org.name}
                          </Link>
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            {org.headquarters}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 font-medium border border-stone-700/60">
                          {org.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={org.status} variant="org" />
                      </td>

                      {/* Members */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{org.membersCount}</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-stone-400 font-mono">
                        {new Date(org.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/organisations/${org.id}`}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
                            title="View Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {org.status !== "Active" && (
                            <button
                              type="button"
                              onClick={() => handleOpenAction(org.id, "Active")}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                              title="Approve / Restore Organisation"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}

                          {org.status !== "Suspended" && (
                            <button
                              type="button"
                              onClick={() => handleOpenAction(org.id, "Suspended")}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                              title="Suspend Organisation"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            targetAction === "Active"
              ? `Approve & Activate "${targetOrg?.name}"?`
              : `Suspend "${targetOrg?.name}"?`
          }
          description={
            targetAction === "Active"
              ? "This will restore full operational participation and custody transfer authorizations for this organisation across the Honey Chain network."
              : "Suspending this organisation will temporarily freeze new batch declarations, custody dispatches, and marketplace listings while preserving all historical traceability data."
          }
          confirmText={targetAction === "Active" ? "Approve Organisation" : "Suspend Organisation"}
          variant={targetAction === "Active" ? "success" : "danger"}
          reasonPlaceholder={
            targetAction === "Active"
              ? "E.g. Completed on-site compliance audit and verified cleanroom registration."
              : "E.g. Pending investigation into batch discrepancy report EXC-2026-005."
          }
        />
      </div>
    </AdminRoleGuard>
  );
}
