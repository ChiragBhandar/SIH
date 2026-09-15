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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  ChevronRight,
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
        <Card className="border-border/80 bg-card shadow-xs min-h-[40vh] flex flex-col items-center justify-center text-center p-8">
          <AlertTriangle className="w-10 h-10 text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold text-foreground">Exception Not Found</h2>
          <p className="text-muted-foreground text-xs mt-1 mb-4">
            The exception case ({excId}) was not found in the compliance ledger.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/exceptions">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Exceptions List
            </Link>
          </Button>
        </Card>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
              <Link href="/admin" className="hover:text-primary transition-colors">
                Administration
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link href="/admin/exceptions" className="hover:text-primary transition-colors">
                Exceptions
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-mono font-semibold">{exc.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
                {exc.id}
              </h1>
              <span className="text-base font-semibold text-muted-foreground">• {exc.type}</span>
              <StatusBadge status={exc.severity} variant="severity" size="sm" />
              <StatusBadge status={exc.status} variant="exceptionStatus" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged on{" "}
              <span className="font-mono text-foreground font-medium">
                {new Date(exc.createdDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>{" "}
              by <strong className="text-foreground">{exc.reportedBy.name}</strong> (
              {exc.reportedBy.organisation})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
            >
              <Link href="/admin/exceptions">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Exceptions</span>
              </Link>
            </Button>

            {/* Action Buttons */}
            {exc.status === "open" && (
              <Button
                type="button"
                onClick={handleStartInvestigation}
                size="sm"
                className="text-xs font-semibold gap-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-xs"
              >
                <Activity className="w-3.5 h-3.5" />
                Start Investigation
              </Button>
            )}

            {(exc.status === "open" || exc.status === "investigating") && (
              <>
                <Button
                  type="button"
                  onClick={handleOpenResolve}
                  size="sm"
                  className="text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve Exception
                </Button>

                <Button
                  type="button"
                  onClick={handleOpenDismiss}
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  Dismiss
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Case Description & Entity Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Description */}
          <Card className="md:col-span-2 border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Incident Description & Anomalous Observation
              </h3>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-muted/40 p-3.5 rounded-lg border border-border/60">
                {exc.description}
              </p>

              {exc.investigationNotes && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                    Ongoing Investigation Notes:
                  </span>
                  <p className="text-xs text-foreground leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                    {exc.investigationNotes}
                  </p>
                </div>
              )}

              {exc.resolution && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Case Formally Resolved by {exc.resolution.resolvedBy}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong className="text-foreground">Root-Cause Conclusion:</strong>{" "}
                      {exc.resolution.reason}
                    </p>
                    <p>
                      <strong className="text-foreground">Corrective Measure:</strong>{" "}
                      {exc.resolution.correctiveAction}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Entity Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Impacted Record / Entity
              </h3>

              <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Entity Classification:
                  </span>
                  <span className="font-semibold text-foreground text-xs uppercase">
                    {exc.relatedEntity.type}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Identifier:
                  </span>
                  <span className="font-mono text-amber-700 dark:text-amber-400 text-xs font-bold">
                    {exc.relatedEntity.id}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Entity Label:
                  </span>
                  <span className="text-foreground text-xs font-medium">
                    {exc.relatedEntity.title}
                  </span>
                </div>

                {exc.relatedEntity.href && (
                  <div className="pt-2">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="text-xs gap-1.5 h-7"
                    >
                      <Link href={exc.relatedEntity.href}>
                        <span>View Record</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traceability Context Lineage Chain */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-5">
            <TraceabilityLineageView steps={exc.lineageTrace} />
          </CardContent>
        </Card>

        {/* Custom Resolve Dialog */}
        {resolveDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-card border border-border rounded-xl p-6 shadow-xl text-foreground">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Resolve Exception {exc.id}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide verified justification and corrective actions for the immutable ledger.
                  </p>
                </div>
              </div>

              <form onSubmit={handleConfirmResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Root Cause Finding / Justification <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={resolveReason}
                    onChange={(e) => {
                      setResolveReason(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={3}
                    placeholder="E.g. Sample re-tested with HPLC confirmative protocol; temperature spike was brief and enzyme degradation remained below 10 mg/kg..."
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Corrective Measure Taken <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={correctiveAction}
                    onChange={(e) => {
                      setCorrectiveAction(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={2}
                    placeholder="E.g. Cold storage logger replaced; receiving manifest updated to reflect calibrated net weight..."
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {resolveError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{resolveError}</p>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setResolveDialogOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Resolve & Log Event
                  </Button>
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
