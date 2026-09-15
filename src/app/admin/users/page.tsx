"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import {
  Search,
  Filter,
  Ban,
  RotateCcw,
  Key,
} from "lucide-react";

export default function AdminUsersPage() {
  const {
    adminUsers,
    adminOrganisations,
    assignUserRole,
    updateUserStatus,
  } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedOrg, setSelectedOrg] = React.useState<string>("all");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");

  // Role Assignment Modal State
  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [newRoleInput, setNewRoleInput] = React.useState("Organisation Admin");
  const [roleReason, setRoleReason] = React.useState("");
  const [roleError, setRoleError] = React.useState("");

  // Status Change Confirmation Modal State
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [targetStatusUserId, setTargetStatusUserId] = React.useState<string | null>(null);
  const [targetStatus, setTargetStatus] = React.useState<"Active" | "Disabled">("Active");

  const activeTargetUser = adminUsers.find((u) => u.id === selectedUserId);
  const targetStatusUser = adminUsers.find((u) => u.id === targetStatusUserId);

  const filteredUsers = React.useMemo(() => {
    return adminUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organizationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrg = selectedOrg === "all" || user.organizationId === selectedOrg;
      const matchesRole =
        selectedRole === "all" ||
        user.roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));

      return matchesSearch && matchesOrg && matchesRole;
    });
  }, [adminUsers, searchQuery, selectedOrg, selectedRole]);

  const handleOpenRoleModal = (userId: string) => {
    setSelectedUserId(userId);
    setNewRoleInput("Organisation Admin");
    setRoleReason("");
    setRoleError("");
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleReason.trim()) {
      setRoleError("Audit justification is required for role modification.");
      return;
    }
    if (selectedUserId) {
      assignUserRole(selectedUserId, newRoleInput, roleReason.trim());
      setRoleModalOpen(false);
    }
  };

  const handleOpenStatusModal = (userId: string, newStatus: "Active" | "Disabled") => {
    setTargetStatusUserId(userId);
    setTargetStatus(newStatus);
    setStatusModalOpen(true);
  };

  const handleConfirmStatus = (reason: string) => {
    if (targetStatusUserId) {
      updateUserStatus(targetStatusUserId, targetStatus, reason);
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
              <span className="text-stone-300">Users & Roles</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Users & Roles</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Govern user permissions, provision multi-role credentials across organisations, and audit authorization history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              Total: {adminUsers.length} Provisioned Accounts
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search user name, email, or org..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Organisation:</span>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Organisations</option>
                {adminOrganisations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Roles</option>
                <option value="Beekeeper">Beekeeper</option>
                <option value="Processor">Processor</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Buyer">Buyer</option>
                <option value="Organisation Admin">Organisation Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Organisation</th>
                  <th className="py-3.5 px-4">Roles & Capabilities</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-500">
                      No users match the search filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-800/40 transition-colors">
                      {/* User identity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-amber-400 text-sm shrink-0">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-100 text-sm block">
                              {user.fullName}
                            </span>
                            <span className="text-stone-400 text-[11px] font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Organisation */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/organisations/${user.organizationId}`}
                            className="font-medium text-stone-200 hover:text-amber-400 transition-colors"
                          >
                            {user.organizationName}
                          </Link>
                          {user.directDepartment && (
                            <span className="text-[10px] text-stone-400">
                              {user.directDepartment}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Roles */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {user.roles.map((r, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                r.includes("Admin")
                                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20 font-semibold"
                                  : "bg-stone-800 text-stone-300 border-stone-700"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={user.status} variant="userStatus" />
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                        {user.lastActivity}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenRoleModal(user.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            title="Assign or add role"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            Assign Role
                          </button>

                          {user.status === "Active" ? (
                            <button
                              type="button"
                              onClick={() => handleOpenStatusModal(user.id, "Disabled")}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 border border-stone-700/60 transition-colors"
                              title="Disable Account"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenStatusModal(user.id, "Active")}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Enable Account"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
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

        {/* Assign Role Custom Modal */}
        {roleModalOpen && activeTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-100">
                    Assign Role to {activeTargetUser.fullName}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Organisation: {activeTargetUser.organizationName}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Select Role to Provision:
                  </label>
                  <select
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  >
                    <option value="Beekeeper">Beekeeper (Field & Harvest Registration)</option>
                    <option value="Apiary Master">Apiary Master (Colony & Hive Management)</option>
                    <option value="Processor">Processor (Micro-filtration & Blending)</option>
                    <option value="Packaging Line Operator">Packaging Line Operator</option>
                    <option value="Lab Technician">Lab Technician (Testing & Analysis)</option>
                    <option value="Buyer">Buyer (Commercial Procurement)</option>
                    <option value="Organisation Admin">Organisation Admin (Team Management)</option>
                    <option value="Super Admin">Super Admin (System Governance)</option>
                    <option value="Regulatory Officer">Regulatory Officer (Anti-Fraud Sentinel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Current Active Roles:
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                    {activeTargetUser.roles.map((r, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Mandatory Audit Justification <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={roleReason}
                    onChange={(e) => {
                      setRoleReason(e.target.value);
                      if (roleError) setRoleError("");
                    }}
                    rows={3}
                    placeholder="Provide justification for provisioning this administrative capability..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                      roleError ? "border-rose-500" : "border-stone-800"
                    }`}
                  />
                  {roleError && <p className="text-xs text-rose-400 mt-1">{roleError}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
                  >
                    Provision Role & Log Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Status Modal */}
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={handleConfirmStatus}
          title={
            targetStatus === "Disabled"
              ? `Disable User Account "${targetStatusUser?.fullName}"?`
              : `Enable User Account "${targetStatusUser?.fullName}"?`
          }
          description={
            targetStatus === "Disabled"
              ? "This will deactivate simulated login access and revoke signing privileges while keeping historical cryptographic audit events untouched."
              : "This will restore active login privileges and allow the user to record activities."
          }
          confirmText={targetStatus === "Disabled" ? "Disable Account" : "Enable Account"}
          variant={targetStatus === "Disabled" ? "danger" : "success"}
          reasonPlaceholder="Enter operational reason for status change..."
        />
      </div>
    </AdminRoleGuard>
  );
}
