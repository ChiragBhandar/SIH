"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTraceability } from "@/context/traceability-context";
import {
  AdminRoleGuard,
  StatusBadge,
  TraceabilityLineageView,
  ConfirmationModal,
} from "@/components/admin";
import {
  AlertTriangle,
  ArrowLeft,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
} from "lucide-react";

export default function ExceptionDetailPage() {
  const params = useParams();
  const excId = typeof params?.id === "string" ? params.id : "";

  const { getException, updateExceptionStatus } = useTraceability();
  const exc = getException(excId);

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);

  // Custom Resolve Dialog State
  const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false);
  const [resolveReason, setResolveReason] = React.useState("");
  const [correctiveAction, setCorrectiveAction] = React.useState("");
  const [resolveError, setResolveError] = React.useState("");

  if (!exc) {
    return (
      <AdminRoleGuard>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
          <AlertTriangle className="w-12 h-12 text-stone-600 mb-3" />
          <h2 className="text-xl font-bold text-stone-200">Exception Not Found</h2>
          <p className="text-stone-400 text-sm mt-1 mb-4">
            The exception case ({excId}) was not found in the compliance ledger.
          </p>
          <Link
            href="/admin/exceptions"
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold"
          >
            &larr; Back to Exceptions List
          </Link>
        </div>
      </AdminRoleGuard>
    );
  }

  const handleStartInvestigation = () => {
    updateExceptionStatus(
      exc.id,
      "investigating",
      "Formal root-cause inquiry opened by Compliance Lead.",
      "Auditor assigned to review calibration and transit logs."
    );
  };

  const handleOpenDismiss = () => {
    setModalOpen(true);
  };

  const handleConfirmDismiss = (reason: string) => {
    updateExceptionStatus(exc.id, "dismissed", reason, "Case closed without penalty.");
  };

  const handleOpenResolve = () => {
    setResolveReason("");
    setCorrectiveAction("");
    setResolveError("");
    setResolveDialogOpen(true);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveReason.trim()) {
      setResolveError("A verified root-cause resolution explanation is mandatory.");
      return;
    }
    if (!correctiveAction.trim()) {
      setResolveError("Documented corrective action is required.");
      return;
    }

    updateExceptionStatus(
      exc.id,
      "resolved",
      resolveReason.trim(),
      undefined,
      correctiveAction.trim()
    );
    setResolveDialogOpen(false);
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
              <Link href="/admin/exceptions" className="hover:text-amber-400 transition-colors">
                Exceptions
              </Link>
              <span>/</span>
              <span className="text-stone-300 font-mono">{exc.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight font-mono">
                {exc.id}
              </h1>
              <span className="text-lg font-bold text-stone-300">• {exc.type}</span>
              <StatusBadge status={exc.severity} variant="severity" size="lg" />
              <StatusBadge status={exc.status} variant="exceptionStatus" size="lg" />
            </div>
            <p className="text-stone-400 text-sm mt-1">
              Logged on{" "}
              <span className="font-mono text-stone-300">
                {new Date(exc.createdDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>{" "}
              by <strong className="text-stone-200">{exc.reportedBy.name}</strong> (
              {exc.reportedBy.organisation})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/exceptions"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Exceptions
            </Link>

            {/* Action Buttons */}
            {exc.status === "open" && (
              <button
                type="button"
                onClick={handleStartInvestigation}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
              >
                <Activity className="w-4 h-4" />
                Start Investigation
              </button>
            )}

            {(exc.status === "open" || exc.status === "investigating") && (
              <>
                <button
                  type="button"
                  onClick={handleOpenResolve}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolve Exception
                </button>

                <button
                  type="button"
                  onClick={handleOpenDismiss}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Dismiss
                </button>
              </>
            )}
          </div>
        </div>

        {/* Case Description & Entity Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Description */}
          <div className="md:col-span-2 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-400" />
              Incident Description & Anomalous Observation
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
              {exc.description}
            </p>

            {exc.investigationNotes && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                  Ongoing Investigation Notes:
                </span>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                  {exc.investigationNotes}
                </p>
              </div>
            )}

            {exc.resolution && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Case Formally Resolved by {exc.resolution.resolvedBy}</span>
                </div>
                <div className="text-xs text-stone-300 space-y-1">
                  <p>
                    <strong className="text-stone-200">Root-Cause Conclusion:</strong>{" "}
                    {exc.resolution.reason}
                  </p>
                  <p>
                    <strong className="text-stone-200">Corrective Measure:</strong>{" "}
                    {exc.resolution.correctiveAction}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Related Entity Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Impacted Record / Entity
            </h3>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Entity Classification:
                </span>
                <span className="font-semibold text-stone-200 text-xs uppercase">
                  {exc.relatedEntity.type}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Identifier:
                </span>
                <span className="font-mono text-amber-400 text-xs font-bold">
                  {exc.relatedEntity.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Entity Label:
                </span>
                <span className="text-stone-200 text-xs font-medium">
                  {exc.relatedEntity.title}
                </span>
              </div>

              {exc.relatedEntity.href && (
                <div className="pt-2">
                  <Link
                    href={exc.relatedEntity.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold transition-colors"
                  >
                    <span>View Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Traceability Context Lineage Chain */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
          <TraceabilityLineageView steps={exc.lineageTrace} />
        </div>

        {/* Custom Resolve Dialog */}
        {resolveDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-100">
                    Resolve Exception {exc.id}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Provide verified justification and corrective actions for the immutable ledger.
                  </p>
                </div>
              </div>

              <form onSubmit={handleConfirmResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Root Cause Finding / Justification <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={resolveReason}
                    onChange={(e) => {
                      setResolveReason(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={3}
                    placeholder="E.g. Sample re-tested with HPLC confirmative protocol; temperature spike was brief and enzyme degradation remained below 10 mg/kg..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Corrective Measure Taken <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={correctiveAction}
                    onChange={(e) => {
                      setCorrectiveAction(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={2}
                    placeholder="E.g. Cold storage logger replaced; receiving manifest updated to reflect calibrated net weight..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {resolveError && (
                  <p className="text-xs text-rose-400 font-medium">{resolveError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResolveDialogOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950"
                  >
                    Resolve & Log Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dismiss Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmDismiss}
          title={`Dismiss Exception ${exc.id}?`}
          description="Dismissing will close this exception case without sanction. The dismissal rationale will be permanently recorded to the audit log."
          confirmText="Dismiss Exception"
          variant="warning"
          reasonPlaceholder="Enter rationale for dismissing this exception (e.g. false positive sensor spike)..."
        />
      </div>
    </AdminRoleGuard>
  );
}
