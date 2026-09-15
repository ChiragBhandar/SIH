"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

export default function AccessRequestsListPage() {
  const { accessRequests, decideAccessRequest } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Deny Modal State
  const [denyModalOpen, setDenyModalOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);

  const activeRequest = accessRequests.find((r) => r.id === selectedRequestId);

  const filteredRequests = React.useMemo(() => {
    return accessRequests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.id.toLowerCase().includes(q) ||
        req.requester.name.toLowerCase().includes(q) ||
        req.organisation.toLowerCase().includes(q) ||
        req.requestedResource.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === "all" || req.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [accessRequests, searchQuery, selectedStatus]);

  const handleQuickApprove = (requestId: string) => {
    decideAccessRequest(requestId, "approved", "Standard verifiable research clearance granted.");
  };

  const handleOpenDeny = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDenyModalOpen(true);
  };

  const handleConfirmDeny = (reason: string) => {
    if (selectedRequestId) {
      decideAccessRequest(selectedRequestId, "denied", reason);
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
              <span className="text-stone-300">Access Requests</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Access Requests</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Review requests for restricted traceability information and administrative access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              Total: {accessRequests.length} Requests Logged
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search requester, resource, or org..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Requests Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Requester</th>
                  <th className="py-3.5 px-4">Organisation</th>
                  <th className="py-3.5 px-4">Requested Resource</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Requested At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-500">
                      No access requests found matching the filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-800/40 transition-colors">
                      {/* Request ID */}
                      <td className="py-4 px-4 font-mono font-bold text-amber-400">
                        <Link
                          href={`/admin/access-requests/${req.id}`}
                          className="hover:underline"
                        >
                          {req.id}
                        </Link>
                      </td>

                      {/* Requester */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-200">
                            {req.requester.name}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {req.requester.role} • {req.requester.email}
                          </span>
                        </div>
                      </td>

                      {/* Organisation */}
                      <td className="py-4 px-4 text-stone-300 font-medium">
                        {req.organisation}
                      </td>

                      {/* Requested Resource */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="font-medium text-stone-200 line-clamp-2">
                          {req.requestedResource}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="text-stone-400 text-[11px] line-clamp-2">
                          {req.reason}
                        </span>
                      </td>

                      {/* Requested At */}
                      <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                        {new Date(req.requestedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={req.status} variant="accessStatus" />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/access-requests/${req.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </Link>

                          {req.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleQuickApprove(req.id)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="Approve Request"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeny(req.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                                title="Deny Request"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
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

        {/* Deny Confirmation Modal */}
        <ConfirmationModal
          isOpen={denyModalOpen}
          onClose={() => setDenyModalOpen(false)}
          onConfirm={handleConfirmDeny}
          title={`Deny Access Request ${activeRequest?.id}?`}
          description={`Provide the official justification for withholding access to "${activeRequest?.requestedResource}". This refusal decision will be immutably recorded in the Honey Chain audit ledger.`}
          confirmText="Deny Request"
          variant="danger"
          reasonPlaceholder="Enter compliance reason for access denial..."
        />
      </div>
    </AdminRoleGuard>
  );
}
