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
        <Card className="border-border/80 bg-card shadow-xs min-h-[40vh] flex flex-col items-center justify-center text-center p-8">
          <KeyRound className="w-10 h-10 text-muted-foreground mb-3" />
          <h2 className="text-lg font-bold text-foreground">Request Not Found</h2>
          <p className="text-muted-foreground text-xs mt-1 mb-4">
            The requested access clearance identifier ({requestId}) was not found.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/access-requests">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Access Requests
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
                Administration
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link href="/admin/access-requests" className="hover:text-primary transition-colors">
                Access Requests
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
              Restricted data disclosure clearance review for{" "}
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
                <span>All Requests</span>
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
                  Grant Clearance
                </Button>
                <Button
                  type="button"
                  onClick={() => setDenyOpen(true)}
                  size="sm"
                  variant="outline"
                  className="text-xs font-medium gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Deny Request
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
                ? "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                : "bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  req.decision.decision === "approved"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
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
                    Access Decision: {req.decision.decision.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    Decided by {req.decision.decidedBy}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Justification:</strong> {req.decision.reason}
                </p>
                {req.decision.grantedScope && req.decision.grantedScope.length > 0 && (
                  <div>
                    <span className="text-muted-foreground font-semibold block mt-2 mb-1">
                      Scopes Granted to Requester:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {req.decision.grantedScope.map((scope, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-mono text-[11px] border border-emerald-200 dark:border-emerald-800"
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
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Requester Identity
              </h3>

              <div className="space-y-2.5 text-xs divide-y divide-border/60">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-semibold text-foreground">{req.requester.name}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">Role in Ecosystem:</span>
                  <span className="font-semibold text-foreground">{req.requester.role}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">Official Email:</span>
                  <span className="font-mono text-foreground">{req.requester.email}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">Affiliated Organisation:</span>
                  <span className="font-medium text-foreground">{req.organisation}</span>
                </div>
                <div className="flex justify-between pt-2 pb-1">
                  <span className="text-muted-foreground">Request Date:</span>
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
                Requested Protected Resource
              </h3>

              <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Resource Name:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                  {req.requestedResource}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Stated Purpose / Operational Reason:
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
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Requested Permission Scopes ({req.requestedScope.length})
              </h3>
              <span className="text-xs font-mono text-muted-foreground">RBAC Telemetry Matrix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {req.requestedScope.map((scope, idx) => (
                <div
                  key={idx}
                  className="bg-muted/30 p-3 rounded-lg border border-border/60 flex items-center justify-between text-xs"
                >
                  <div className="font-mono text-primary font-medium">{scope}</div>
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    Protected Scope
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
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Grant Access Clearance ({req.id})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select exactly what information is being granted to {req.requester.name}.
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
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
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200"
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
                    Clearance will be active for 72 hours. This authorization decision will be logged to the immutable Honey Chain audit trail.
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
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmApprove}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm & Grant Access
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
