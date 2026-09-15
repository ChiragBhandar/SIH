"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Lock,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function AccessRequestDetailPage() {
  const params = useParams();
  const requestId = typeof params?.id === "string" ? params.id : "";

  const { getAccessRequest, decideAccessRequest } = useTraceability();
  const req = getAccessRequest(requestId);

  // Approve dialog state
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>(
    () => req?.requestedScope || []
  );

  // Deny modal state
  const [denyOpen, setDenyOpen] = React.useState(false);

  if (!req) {
    return (
      <AdminRoleGuard>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
          <KeyRound className="w-12 h-12 text-stone-600 mb-3" />
          <h2 className="text-xl font-bold text-stone-200">Request Not Found</h2>
          <p className="text-stone-400 text-sm mt-1 mb-4">
            The requested access clearance identifier ({requestId}) was not found.
          </p>
          <Link
            href="/admin/access-requests"
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold"
          >
            &larr; Back to Access Requests
          </Link>
        </div>
      </AdminRoleGuard>
    );
  }

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleConfirmApprove = () => {
    decideAccessRequest(
      req.id,
      "approved",
      "Verified research and compliance clearance granted for selected telemetry scopes.",
      selectedScopes
    );
    setApproveOpen(false);
  };

  const handleConfirmDeny = (reason: string) => {
    decideAccessRequest(req.id, "denied", reason);
  };

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
              <Link href="/admin/access-requests" className="hover:text-amber-400 transition-colors">
                Access Requests
              </Link>
              <span>/</span>
              <span className="text-stone-300 font-mono">{req.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight font-mono">
                {req.id}
              </h1>
              <StatusBadge status={req.status} variant="accessStatus" size="lg" />
            </div>
            <p className="text-stone-400 text-sm mt-1">
              Restricted data disclosure clearance review for{" "}
              <strong className="text-stone-200">{req.requester.name}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/access-requests"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Requests
            </Link>

            {req.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => setApproveOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Grant Clearance
                </button>
                <button
                  type="button"
                  onClick={() => setDenyOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Deny Request
                </button>
              </>
            )}
          </div>
        </div>

        {/* Access Decision Notice Banner */}
        {req.decision && (
          <div
            className={`rounded-2xl p-6 border ${
              req.decision.decision === "approved"
                ? "bg-emerald-950/20 border-emerald-500/30"
                : "bg-rose-950/20 border-rose-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  req.decision.decision === "approved"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {req.decision.decision === "approved" ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-100 text-sm">
                    Access Decision: {req.decision.decision.toUpperCase()}
                  </span>
                  <span className="text-stone-400 font-mono">
                    Decided by {req.decision.decidedBy}
                  </span>
                </div>
                <p className="text-stone-300">
                  <strong className="text-stone-200">Justification:</strong> {req.decision.reason}
                </p>
                {req.decision.grantedScope && req.decision.grantedScope.length > 0 && (
                  <div>
                    <span className="text-stone-400 font-semibold block mt-2 mb-1">
                      Scopes Granted to Requester:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {req.decision.grantedScope.map((scope, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[11px] border border-emerald-500/20"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {req.decision.auditEventId && (
                  <div className="pt-1">
                    <Link
                      href={`/admin/audit/${req.decision.auditEventId}`}
                      className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                    >
                      Audit Record Reference: {req.decision.auditEventId} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Request Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Requester Profile */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Requester Identity
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Full Name:</span>
                <span className="font-semibold text-stone-200">{req.requester.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Role in Ecosystem:</span>
                <span className="font-semibold text-stone-200">{req.requester.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Official Email:</span>
                <span className="font-mono text-stone-300">{req.requester.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Affiliated Organisation:</span>
                <span className="font-medium text-stone-200">{req.organisation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Request Date:</span>
                <span className="font-mono text-stone-300">
                  {new Date(req.requestedAt).toLocaleString("en-GB", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Requested Resource & Rationale */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Requested Protected Resource
            </h3>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Resource Name:
              </span>
              <p className="text-sm font-semibold text-stone-200 leading-relaxed">
                {req.requestedResource}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                Stated Purpose / Operational Reason:
              </span>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                {req.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Scopes Breakdown */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Requested Permission Scopes ({req.requestedScope.length})
            </h3>
            <span className="text-xs font-mono text-stone-500">RBAC Telemetry Matrix</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {req.requestedScope.map((scope, idx) => (
              <div
                key={idx}
                className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-center justify-between text-xs"
              >
                <div className="font-mono text-amber-300">{scope}</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-800 text-stone-400">
                  Protected Scope
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grant Approval Dialog */}
        {approveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-100">
                    Grant Access Clearance ({req.id})
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Select exactly what information is being granted to {req.requester.name}.
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Authorized Scope Grants:
                  </label>
                  <div className="space-y-2">
                    {req.requestedScope.map((scope, idx) => {
                      const isChecked = selectedScopes.includes(scope);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleScope(scope)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                              : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          <span className="font-mono text-xs">{scope}</span>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-400 text-stone-950 font-bold"
                                : "border-stone-700 bg-stone-900"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-400">
                  <p>
                    Clearance will be active for 72 hours. This authorization decision will be logged to the immutable Honey Chain audit trail.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApproveOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950"
                >
                  Confirm & Grant Access
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deny Confirmation Modal */}
        <ConfirmationModal
          isOpen={denyOpen}
          onClose={() => setDenyOpen(false)}
          onConfirm={handleConfirmDeny}
          title={`Deny Access Request ${req.id}?`}
          description={`Provide the compliance or privacy justification for withholding disclosure to ${req.requester.name}.`}
          confirmText="Deny Access Request"
          variant="danger"
          reasonPlaceholder="Enter reason for access refusal (e.g. proprietary pricing disclosure not authorized)..."
        />
      </div>
    </AdminRoleGuard>
  );
}
