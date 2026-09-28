"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "@/context/language-context";

export default function AccessRequestDetailPage() {
  const { tr, trStatus, trRole, trOrgType } = useLanguage();
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
        <Card className="border-border/80 bg-card shadow-xs min-h-[40vh] flex flex-col items-center justify-center text-center p-8">
          <KeyRound className="w-10 h-10 text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold text-foreground">
            {tr("Request Not Found", "अनुरोध नहीं मिला")}
          </h2>
          <p className="text-muted-foreground text-xs mt-1 mb-4">
            {tr(
              `The requested access clearance identifier (${requestId}) was not found.`,
              `अनुरोधित पहुंच मंजूरी पहचानकर्ता (${requestId}) नहीं मिला।`
            )}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/access-requests">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />{" "}
              {tr("Back to Access Requests", "पहुंच अनुरोधों पर वापस जाएं")}
            </Link>
          </Button>
        </Card>
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
      <div className="space-y-6 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
              <Link href="/admin" className="hover:text-primary transition-colors">
                {tr("Administration", "प्रशासन")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link href="/admin/access-requests" className="hover:text-primary transition-colors">
                {tr("Access Requests", "पहुंच अनुरोध")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-mono font-semibold">{req.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
                {req.id}
              </h1>
              <StatusBadge status={req.status} variant="accessStatus" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {tr(
                "Restricted data disclosure clearance review for",
                "प्रतिबंधित डेटा प्रकटीकरण निकासी समीक्षा:"
              )}{" "}
              <strong className="text-foreground">{req.requester.name}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
            >
              <Link href="/admin/access-requests">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{tr("All Requests", "सभी अनुरोध")}</span>
              </Link>
            </Button>

            {req.status === "pending" && (
              <>
                <Button
                  type="button"
                  onClick={() => setApproveOpen(true)}
                  size="sm"
                  className="text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {tr("Grant Clearance", "मंजूरी प्रदान करें")}
                </Button>
                <Button
                  type="button"
                  onClick={() => setDenyOpen(true)}
                  size="sm"
                  variant="outline"
                  className="text-xs font-medium gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {tr("Deny Request", "अनुरोध अस्वीकार करें")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Access Decision Notice Banner */}
        {req.decision && (
          <div
            className={`rounded-xl p-4 border ${
              req.decision.decision === "approved"
                ? "bg-emerald-50/70 border-emerald-200"
                : "bg-rose-50/70 border-rose-200"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  req.decision.decision === "approved"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-rose-100 text-rose-700 border border-rose-300"
                }`}
              >
                {req.decision.decision === "approved" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">
                    {tr("Access Decision:", "पहुंच निर्णय:")}{" "}
                    {trStatus(req.decision.decision).toUpperCase()}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {tr("Decided by", "द्वारा निर्धारित")} {req.decision.decidedBy}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">
                    {tr("Justification:", "औचित्य:")}
                  </strong>{" "}
                  {req.decision.reason}
                </p>
                {req.decision.grantedScope && req.decision.grantedScope.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-semibold block mt-2 mb-1">
                      {tr("Scopes Granted to Requester:", "अनुरोधकर्ता को दिए गए कार्यक्षेत्र:")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {req.decision.grantedScope.map((scope, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] border border-emerald-200"
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
                      className="text-primary hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                    >
                      {tr("Audit Record Reference:", "ऑडिट रिकॉर्ड संदर्भ:")}{" "}
                      {req.decision.auditEventId} &rarr;
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
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {tr("Requester Identity", "अनुरोधकर्ता पहचान")}
              </h3>

              <div className="space-y-2.5 text-xs divide-y divide-border/60">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">{tr("Full Name:", "पूरा नाम:")}</span>
                  <span className="font-semibold text-foreground">{req.requester.name}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">{tr("Role in Ecosystem:", "पारिस्थितिकी तंत्र में भूमिका:")}</span>
                  <span className="font-semibold text-foreground">{trRole(req.requester.role)}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">{tr("Official Email:", "आधिकारिक ईमेल:")}</span>
                  <span className="font-mono text-foreground">{req.requester.email}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">{tr("Affiliated Organisation:", "संबद्ध संगठन:")}</span>
                  <span className="font-medium text-foreground">{req.organisation}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">{tr("Request Date:", "अनुरोध तिथि:")}</span>
                  <span className="font-mono text-foreground">
                    {new Date(req.requestedAt).toLocaleString("en-GB", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requested Resource & Rationale */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                {tr("Requested Protected Resource", "अनुरोधित संरक्षित संसाधन")}
              </h3>

              <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {tr("Resource Name:", "संसाधन नाम:")}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                  {req.requestedResource}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  {tr("Stated Purpose / Operational Reason:", "उद्देश्य / परिचालन कारण:")}
                </span>
                <p className="text-xs text-foreground leading-relaxed bg-muted/40 p-3 rounded-lg border border-border/60">
                  {req.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scopes Breakdown */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                {tr(
                  `Requested Permission Scopes (${req.requestedScope.length})`,
                  `अनुरोधित अनुमति कार्यक्षेत्र (${req.requestedScope.length})`
                )}
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {tr("RBAC Telemetry Matrix", "आरबीएसी टेलीमेट्री मैट्रिक्स")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {req.requestedScope.map((scope, idx) => (
                <div
                  key={idx}
                  className="bg-muted/30 p-3 rounded-lg border border-border/60 flex items-center justify-between text-xs"
                >
                  <div className="font-mono text-primary font-medium">{scope}</div>
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {tr("Protected Scope", "संरक्षित कार्यक्षेत्र")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grant Approval Dialog */}
        {approveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-card border border-border rounded-xl p-6 shadow-xl text-foreground">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {tr(`Grant Access Clearance (${req.id})`, `पहुंच मंजूरी प्रदान करें (${req.id})`)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tr(
                      `Select exactly what information is being granted to ${req.requester.name}.`,
                      `चुनें कि ${req.requester.name} को कौन सी सटीक जानकारी प्रदान की जा रही है।`
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    {tr("Authorized Scope Grants:", "अधिकृत कार्यक्षेत्र अनुदान:")}
                  </label>
                  <div className="space-y-2">
                    {req.requestedScope.map((scope, idx) => {
                      const isChecked = selectedScopes.includes(scope);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleScope(scope)}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? "bg-emerald-50/80 border-emerald-300 text-emerald-900"
                              : "bg-background border-border/80 text-muted-foreground hover:border-border"
                          }`}
                        >
                          <span className="font-mono text-xs">{scope}</span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-input bg-background"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-xs text-muted-foreground">
                  <p>
                    {tr(
                      "Clearance will be active for 72 hours. This authorization decision will be logged to the immutable Honey Chain audit trail.",
                      "मंजूरी 72 घंटों के लिए सक्रिय रहेगी। यह प्राधिकरण निर्णय अपरिवर्तनीय हनी चेन ऑडिट ट्रेल में दर्ज किया जाएगा।"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApproveOpen(false)}
                  className="text-xs"
                >
                  {tr("Cancel", "रद्द करें")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmApprove}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {tr("Confirm & Grant Access", "पुष्टि करें एवं पहुंच प्रदान करें")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Deny Confirmation Modal */}
        <ConfirmationModal
          isOpen={denyOpen}
          onClose={() => setDenyOpen(false)}
          onConfirm={handleConfirmDeny}
          title={tr(`Deny Access Request ${req.id}?`, `पहुंच अनुरोध ${req.id} अस्वीकार करें?`)}
          description={tr(
            `Provide the compliance or privacy justification for withholding disclosure to ${req.requester.name}.`,
            `${req.requester.name} को प्रकटीकरण रोकने के लिए अनुपालन या गोपनीयता औचित्य प्रदान करें।`
          )}
          confirmText={tr("Deny Access Request", "पहुंच अनुरोध अस्वीकार करें")}
          variant="danger"
          reasonPlaceholder={tr(
            "Enter reason for access refusal (e.g. proprietary pricing disclosure not authorized)...",
            "पहुंच अस्वीकृति का कारण दर्ज करें (उदा. मालिकाना मूल्य निर्धारण प्रकटीकरण अधिकृत नहीं है)..."
          )}
        />
      </div>
    </AdminRoleGuard>
  );
}
