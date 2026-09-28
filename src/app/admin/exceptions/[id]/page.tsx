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

import { useLanguage } from "@/context/language-context";

export default function ExceptionDetailPage() {
  const { tr, trStatus } = useLanguage();
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
          <h2 className="text-lg font-bold text-foreground">
            {tr("Exception Not Found", "अपवाद नहीं मिला")}
          </h2>
          <p className="text-muted-foreground text-xs mt-1 mb-4">
            {tr(
              `The exception case (${excId}) was not found in the compliance ledger.`,
              `अनुपालन बहीखाते में अपवाद मामला (${excId}) नहीं मिला।`
            )}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/exceptions">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {tr("Back to Exceptions List", "अपवाद सूची पर वापस")}
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
      setResolveError(
        tr(
          "A verified root-cause resolution explanation is mandatory.",
          "सत्यापित मूल कारण समाधान स्पष्टीकरण अनिवार्य है।"
        )
      );
      return;
    }
    if (!correctiveAction.trim()) {
      setResolveError(
        tr(
          "Documented corrective action is required.",
          "दस्तावेजी सुधारात्मक कार्रवाई आवश्यक है।"
        )
      );
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
                {tr("Administration", "प्रशासन")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link href="/admin/exceptions" className="hover:text-primary transition-colors">
                {tr("Exceptions", "अपवाद")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-mono font-semibold">{exc.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
                {exc.id}
              </h1>
              <span className="text-base font-semibold text-muted-foreground">
                • {tr(exc.type, exc.type)}
              </span>
              <StatusBadge status={exc.severity} variant="severity" size="sm" />
              <StatusBadge status={exc.status} variant="exceptionStatus" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr("Logged on", "दर्ज किया गया")}{" "}
              <span className="font-mono text-foreground font-medium">
                {new Date(exc.createdDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>{" "}
              {tr("by", "द्वारा")}{" "}
              <strong className="text-foreground">{exc.reportedBy.name}</strong> (
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
                <span>{tr("All Exceptions", "सभी अपवाद")}</span>
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
                {tr("Start Investigation", "जांच शुरू करें")}
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
                  {tr("Resolve Exception", "अपवाद हल करें")}
                </Button>

                <Button
                  type="button"
                  onClick={handleOpenDismiss}
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  {tr("Dismiss", "खारिज करें")}
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
                <FileText className="w-4 h-4 text-rose-600" />
                {tr("Incident Description & Anomalous Observation", "घटना विवरण एवं असामान्य अवलोकन")}
              </h3>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-muted/40 p-3.5 rounded-lg border border-border/60">
                {exc.description}
              </p>

              {exc.investigationNotes && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block">
                    {tr("Ongoing Investigation Notes:", "चल रही जांच की टिप्पणियां:")}
                  </span>
                  <p className="text-xs text-foreground leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-200/60">
                    {exc.investigationNotes}
                  </p>
                </div>
              )}

              {exc.resolution && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {tr(
                        `Case Formally Resolved by ${exc.resolution.resolvedBy}`,
                        `मामला आधिकारिक रूप से ${exc.resolution.resolvedBy} द्वारा हल किया गया`
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong className="text-foreground">
                        {tr("Root-Cause Conclusion:", "मूल कारण निष्कर्ष:")}
                      </strong>{" "}
                      {exc.resolution.reason}
                    </p>
                    <p>
                      <strong className="text-foreground">
                        {tr("Corrective Measure:", "सुधारात्मक उपाय:")}
                      </strong>{" "}
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
                {tr("Impacted Record / Entity", "प्रभावित रिकॉर्ड / निकाय")}
              </h3>

              <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Entity Classification:", "इकाई वर्गीकरण:")}
                  </span>
                  <span className="font-semibold text-foreground text-xs uppercase">
                    {exc.relatedEntity.type}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Identifier:", "पहचानकर्ता:")}
                  </span>
                  <span className="font-mono text-amber-700 text-xs font-bold">
                    {exc.relatedEntity.id}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Entity Label:", "इकाई लेबल:")}
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
                        <span>{tr("View Record", "रिकॉर्ड देखें")}</span>
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
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {tr(`Resolve Exception ${exc.id}`, `अपवाद ${exc.id} हल करें`)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tr(
                      "Provide verified justification and corrective actions for the immutable ledger.",
                      "अपरिवर्तनीय लेज़र के लिए सत्यापित औचित्य और सुधारात्मक कार्रवाइयां प्रदान करें।"
                    )}
                  </p>
                </div>
              </div>

              <form onSubmit={handleConfirmResolve} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {tr("Root Cause Finding / Justification", "मूल कारण निष्कर्ष / औचित्य")}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={resolveReason}
                    onChange={(e) => {
                      setResolveReason(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={3}
                    placeholder={tr(
                      "E.g. Sample re-tested with HPLC confirmative protocol; temperature spike was brief and enzyme degradation remained below 10 mg/kg...",
                      "उदाहरण: एचपीएलसी पुष्टिकरण प्रोटोकॉल के साथ नमूने का पुन: परीक्षण किया गया; तापमान में वृद्धि संक्षिप्त थी..."
                    )}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {tr("Corrective Measure Taken", "की गई सुधारात्मक कार्रवाई")}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={correctiveAction}
                    onChange={(e) => {
                      setCorrectiveAction(e.target.value);
                      if (resolveError) setResolveError("");
                    }}
                    rows={2}
                    placeholder={tr(
                      "E.g. Cold storage logger replaced; receiving manifest updated to reflect calibrated net weight...",
                      "उदाहरण: कोल्ड स्टोरेज लॉगर को बदला गया; सही शुद्ध वजन दर्शाने के लिए पावती विवरण अद्यतन किया गया..."
                    )}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {resolveError && (
                  <p className="text-xs text-rose-600 font-medium">{resolveError}</p>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setResolveDialogOpen(false)}
                    className="text-xs"
                  >
                    {tr("Cancel", "रद्द करें")}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {tr("Resolve & Log Event", "हल करें एवं इवेंट दर्ज करें")}
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
          title={tr(`Dismiss Exception ${exc.id}?`, `अपवाद ${exc.id} खारिज करें?`)}
          description={tr(
            "Dismissing will close this exception case without sanction. The dismissal rationale will be permanently recorded to the audit log.",
            "खारिज करने पर यह अपवाद मामला बिना किसी दंड के बंद हो जाएगा। बर्खास्तगी का कारण ऑडिट लॉग में स्थायी रूप से दर्ज किया जाएगा।"
          )}
          confirmText={tr("Dismiss Exception", "अपवाद खारिज करें")}
          variant="warning"
          reasonPlaceholder={tr(
            "Enter rationale for dismissing this exception (e.g. false positive sensor spike)...",
            "इस अपवाद को खारिज करने का कारण दर्ज करें (उदा. गलत सेंसर रीडिंग)..."
          )}
        />
      </div>
    </AdminRoleGuard>
  );
}
