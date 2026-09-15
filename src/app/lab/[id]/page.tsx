"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  QualityParameterResult,
  LabRejectionReason,
} from "@/types/quality";
import {
  FlaskConical,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  ShieldCheck,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export function LabTestDetailContent() {
  const params = useParams();
  const testId = params?.id as string;
  const router = useRouter();

  const {
    getLabTest,
    updateLabTestResults,
    approveLabTest,
    rejectLabTest,
    requestCorrectionLabTest,
    isLoaded,
  } = useTraceability();

  const { user } = useAuthSession();

  const test = getLabTest(testId);

  // Editable parameters local state
  const [customResults, setCustomResults] = React.useState<QualityParameterResult[] | null>(null);
  const [isSavingResults, setIsSavingResults] = React.useState(false);
  const results = customResults ?? test?.results ?? [];

  // Dialog / Action forms state
  const [activeAction, setActiveAction] = React.useState<"none" | "approve" | "reject" | "correction">("none");

  // Approval form
  const now = new Date();
  const formattedToday = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;
  const defaultCertNumber = `CERT-HC-2026-${test?.batchNumber?.replace(/[^0-9]/g, "").slice(-4) || "0003"}`;

  const [approvalAnalyst, setApprovalAnalyst] = React.useState(
    user?.fullName ? `${user.fullName} (Lead Chemist)` : "Dr. Arvind Swaminathan (Lead Chromatographer)"
  );
  const [approvalDate, setApprovalDate] = React.useState(formattedToday);
  const [certificateNumber, setCertificateNumber] = React.useState(defaultCertNumber);
  const [approvalNotes, setApprovalNotes] = React.useState(
    "All physical, chemical, enzymatic, and adulteration parameters strictly comply with Honey Chain purity specifications. Quality Approved."
  );

  // Rejection form
  const [rejectionAnalyst, setRejectionAnalyst] = React.useState(
    user?.fullName ? `${user.fullName} (QA Chemist)` : "Rohan Sengupta (QA Chemist)"
  );
  const [rejectionDate, setRejectionDate] = React.useState(formattedToday);
  const [rejectionReason, setRejectionReason] = React.useState<LabRejectionReason>(
    "Quality parameter outside specification"
  );
  const [rejectionNotes, setRejectionNotes] = React.useState(
    "One or more analytical parameters failed standard reference ranges. Batch quarantined and investigation required prior to any bottling or blending."
  );

  // Correction form
  const [correctionAnalyst, setCorrectionAnalyst] = React.useState(
    user?.fullName ? `${user.fullName} (Lead Chemist)` : "Dr. Arvind Swaminathan (Lead Chromatographer)"
  );
  const [correctionDate, setCorrectionDate] = React.useState(formattedToday);
  const [correctionReason, setCorrectionReason] = React.useState(
    "Sample re-evaluation requested following corrective manufacturing de-moisturization treatment."
  );
  const [correctionNotes, setCorrectionNotes] = React.useState(
    "Corrective action plan submitted by processing facility. Supplementary verification tests initiated. Original non-conformance preserved in audit trail."
  );

  const [actionError, setActionError] = React.useState("");

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading laboratory test report and audit trail...
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={FlaskConical}
          title="Laboratory test not found"
          description={`No lab test record found matching ID "${testId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/lab">Back to Laboratory Testing</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const handleParameterStatusToggle = (paramId: string, newStatus: "pass" | "fail") => {
    setCustomResults((prev) => {
      const base = prev ?? test.results;
      return base.map((p) => (p.id === paramId ? { ...p, status: newStatus } : p));
    });
  };

  const handleParameterValueChange = (paramId: string, newValue: string) => {
    setCustomResults((prev) => {
      const base = prev ?? test.results;
      return base.map((p) => (p.id === paramId ? { ...p, value: newValue } : p));
    });
  };

  const handleSaveResults = () => {
    try {
      setIsSavingResults(true);
      updateLabTestResults(test.id, results);
      setIsSavingResults(false);
    } catch {
      setIsSavingResults(false);
    }
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionError("");
      const cert = approveLabTest(test.id, {
        analyst: approvalAnalyst,
        approvalDate,
        certificateNumber,
        notes: approvalNotes,
      });
      setActiveAction("none");
      router.push(`/certifications/${cert.id}`);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Approval failed");
    }
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionError("");
      rejectLabTest(test.id, {
        analyst: rejectionAnalyst,
        rejectionDate,
        reason: rejectionReason,
        notes: rejectionNotes,
      });
      setActiveAction("none");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Rejection failed");
    }
  };

  const handleRequestCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionError("");
      requestCorrectionLabTest(test.id, {
        analyst: correctionAnalyst,
        requestDate: correctionDate,
        reason: correctionReason,
        notes: correctionNotes,
      });
      setActiveAction("none");
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Correction request failed");
    }
  };

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "error" | "info" | "neutral" | "honey" => {
    switch (status) {
      case "Approved":
        return "success";
      case "In Analysis":
        return "info";
      case "Awaiting Analysis":
        return "honey";
      case "Rejected":
        return "error";
      case "Correction Required":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/lab">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Laboratory Testing</span>
          </Link>
        </Button>
      </div>

      {/* Main Header / Test Identity Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                {test.id}
              </h1>
              <StatusBadge status={getStatusBadgeVariant(test.status)} size="sm">
                {test.status}
              </StatusBadge>
              {test.priority === "Urgent" && (
                <Badge variant="outline" className="border-rose-200 text-rose-800 bg-rose-50 text-xs font-mono">
                  Urgent Priority
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Official Quality Gate Analysis • Linked to Processed Batch{" "}
              <Link href={`/batches/${test.batchNumber}`} className="font-mono font-bold text-foreground hover:underline">
                {test.batchNumber}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {test.certificateId && (
              <Button asChild size="sm" className="gap-1.5 shadow-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href={`/certifications/${test.certificateId}`}>
                  <Award className="h-4 w-4" />
                  <span>View Certificate ({test.certificateId})</span>
                </Link>
              </Button>
            )}

            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/5 text-xs py-1 px-3 gap-1.5 font-medium"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{test.testPanel}</span>
            </Badge>
          </div>
        </div>

        {/* Primary Spec Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Sample ID
            </span>
            <p className="text-xs font-mono font-bold text-foreground truncate">
              {test.sample.id}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {test.sample.quantity} • {test.sample.containerRef}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Submission Date
            </span>
            <p className="text-xs font-mono font-medium text-foreground">
              {test.submittedDate}
            </p>
            <p className="text-[10px] text-muted-foreground">
              By {test.submittedBy}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Testing Laboratory
            </span>
            <p className="text-xs font-medium text-foreground truncate" title={test.laboratory.name}>
              {test.laboratory.name}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {test.laboratory.accreditation}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
              Assigned Analyst
            </span>
            <p className="text-xs font-medium text-foreground truncate">
              {test.analyst.name}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              {test.analyst.licenseNumber || "Certified Lead"}
            </p>
          </div>
        </div>
      </div>

      {/* REJECTION / INVESTIGATION BANNER */}
      {test.status === "Rejected" && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-destructive text-sm">
                Quality Rejected — Investigation Required
              </h4>
              <p className="text-destructive/90 mt-0.5">
                This batch has failed one or more analytical thresholds. Commercial release is blocked until corrective investigation is logged.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveAction("correction")}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0 font-semibold"
          >
            Request Quality Correction
          </Button>
        </div>
      )}

      {/* CORRECTION REQUESTED BANNER */}
      {test.status === "Correction Required" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3 text-xs text-amber-900">
          <Clock className="h-5 w-5 text-amber-700 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">
              Quality Correction Requested — Re-evaluation Pending
            </h4>
            <p className="mt-0.5">
              Correction protocol is active. Original non-conformance history remains permanently logged in the audit trail below.
            </p>
          </div>
        </div>
      )}

      {/* TEST RESULTS SECTION */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-bold text-foreground">
                  Analytical Test Results
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-muted-foreground/30 text-muted-foreground">
                  Demo Test Metrics • Honey Chain Standard
                </Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Physical, chemical, enzymatic, and isotopic adulteration parameters verified against standard honey monograph specifications.
              </CardDescription>
            </div>

            {test.status !== "Approved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveResults}
                disabled={isSavingResults}
                className="h-8 text-xs font-semibold shrink-0"
              >
                {isSavingResults ? "Saving..." : "Save Results"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-foreground">Parameter</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">Measured Value</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">Unit</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">Standard Reference Range</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground text-center">Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((param) => (
                  <TableRow key={param.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                          {param.name}
                        </span>
                        {param.notes && (
                          <span className="text-[10px] text-muted-foreground block line-clamp-1">
                            {param.notes}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {param.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {test.status !== "Approved" ? (
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => handleParameterValueChange(param.id, e.target.value)}
                          className="w-36 rounded-sm border border-input bg-background/50 px-2 py-1 text-xs font-mono font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                        />
                      ) : (
                        <span className="font-bold text-foreground">{param.value}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {param.unit}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {param.referenceRange}
                    </TableCell>
                    <TableCell className="text-center">
                      {test.status !== "Approved" ? (
                        <div className="inline-flex items-center rounded-md border border-border bg-muted/40 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleParameterStatusToggle(param.id, "pass")}
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded-sm transition-colors ${
                              param.status === "pass"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => handleParameterStatusToggle(param.id, "fail")}
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded-sm transition-colors ${
                              param.status === "fail"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Fail
                          </button>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className={
                            param.status === "pass"
                              ? "border-emerald-200 text-emerald-800 bg-emerald-50 text-xs font-semibold"
                              : "border-rose-200 text-rose-800 bg-rose-50 text-xs font-semibold"
                          }
                        >
                          {param.status === "pass" ? "Passed" : "Failed"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* LAB DECISION ACTIONS & GATE */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
                Laboratory Quality Decision Gate
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              Current Verdict: <strong className="text-foreground font-mono">{test.status}</strong>
            </span>
          </div>
          <CardDescription className="text-xs">
            A laboratory decision is an immutable traceability event. Approving issues an official digital certificate; rejections or corrections record new events without modifying historical data.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {actionError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Action Trigger Buttons */}
          {activeAction === "none" && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setActiveAction("approve")}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold text-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve & Issue Certificate</span>
              </Button>

              <Button
                onClick={() => setActiveAction("reject")}
                variant="outline"
                className="gap-2 border-rose-300 text-rose-700 hover:bg-rose-50 shadow-xs font-semibold text-xs bg-white"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Sample</span>
              </Button>

              <Button
                onClick={() => setActiveAction("correction")}
                variant="outline"
                className="gap-2 border-amber-300 text-amber-900 hover:bg-amber-50 shadow-xs font-semibold text-xs bg-white"
              >
                <Clock className="h-4 w-4" />
                <span>Request Correction</span>
              </Button>
            </div>
          )}

          {/* APPROVE FORM */}
          {activeAction === "approve" && (
            <form onSubmit={handleApprove} className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h4 className="font-bold text-sm text-foreground">
                    Approve Quality & Issue Digital Certificate
                  </h4>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction("none")} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Certifying Analyst <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={approvalAnalyst}
                    onChange={(e) => setApprovalAnalyst(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Approval Date & Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={approvalDate}
                    onChange={(e) => setApprovalDate(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Certificate Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs font-mono font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-semibold text-foreground">
                    Approval Notes & Standards Compliance Declaration
                  </label>
                  <textarea
                    rows={2}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveAction("none")}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  <Award className="h-4 w-4 mr-1.5" />
                  <span>Approve & Issue Certificate</span>
                </Button>
              </div>
            </form>
          )}

          {/* REJECT FORM */}
          {activeAction === "reject" && (
            <form onSubmit={handleReject} className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-destructive/30 pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <h4 className="font-bold text-sm text-foreground">
                    Reject Laboratory Sample & Request Investigation
                  </h4>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction("none")} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Rejection Reason <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value as LabRejectionReason)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  >
                    <option value="Quality parameter outside specification">Quality parameter outside specification</option>
                    <option value="Adulteration concern">Adulteration concern</option>
                    <option value="Microbiological concern">Microbiological concern</option>
                    <option value="Sample integrity issue">Sample integrity issue</option>
                    <option value="Documentation issue">Documentation issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Reporting Analyst <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={rejectionAnalyst}
                    onChange={(e) => setRejectionAnalyst(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Rejection Date & Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={rejectionDate}
                    onChange={(e) => setRejectionDate(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-semibold text-foreground">
                    Rejection Notes & Specific Failure Findings <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveAction("none")}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="destructive" className="font-semibold">
                  <XCircle className="h-4 w-4 mr-1.5" />
                  <span>Confirm Rejection</span>
                </Button>
              </div>
            </form>
          )}

          {/* CORRECTION FORM */}
          {activeAction === "correction" && (
            <form onSubmit={handleRequestCorrection} className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-700" />
                  <h4 className="font-bold text-sm text-foreground">
                    Request Quality Correction / Re-evaluation Event
                  </h4>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction("none")} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Correction Reason <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Reviewing Analyst <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={correctionAnalyst}
                    onChange={(e) => setCorrectionAnalyst(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Correction Timestamp <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={correctionDate}
                    onChange={(e) => setCorrectionDate(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Correction Review Notes <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background/70 px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveAction("none")}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>Log Correction Event</span>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* IMMUTABLE AUDIT DECISION HISTORY */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
              Immutable Quality Decision History ({test.decisionsHistory.length})
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Complete chronological audit log of all decisions and corrections. Prior results are never overwritten.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {test.decisionsHistory.length === 0 ? (
            <div className="p-4 rounded-lg bg-muted/20 border border-border/50 text-xs text-muted-foreground text-center">
              No formal quality decision events logged yet. Test is currently in progress.
            </div>
          ) : (
            <div className="space-y-3">
              {test.decisionsHistory.map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                    evt.decisionType === "Approved"
                      ? "border-emerald-200 bg-emerald-50/50"
                      : evt.decisionType === "Rejected"
                      ? "border-rose-200 bg-rose-50/50"
                      : "border-amber-200 bg-amber-50/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {evt.decisionType}
                      </span>
                      {evt.reason && (
                        <Badge variant="outline" className="text-[10px] py-0 font-medium">
                          {evt.reason}
                        </Badge>
                      )}
                      {evt.certificateId && (
                        <Badge variant="secondary" className="text-[10px] font-mono py-0 text-emerald-800 bg-emerald-50">
                          {evt.certificateId}
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {evt.notes}
                  </p>

                  <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    Analyst: <strong className="text-foreground">{evt.analyst}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LabTestDetailPage() {
  return (
    <AuthGuard>
      <AppShell>
        <LabTestDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
