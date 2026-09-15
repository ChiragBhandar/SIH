"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, ConfirmationModal } from "@/components/admin";
import { PlausibilityAlert } from "@/types/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale,
  TrendingUp,
  Boxes,
  ShoppingBag,
  Layers,
  ExternalLink,
  Info,
  ChevronRight,
} from "lucide-react";

export default function FieldVsSalesPlausibilityPage() {
  const { plausibilityAlerts, updatePlausibilityStatus } = useTraceability();

  const [selectedAlertId, setSelectedAlertId] = React.useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
  const [targetStatus, setTargetStatus] = React.useState<PlausibilityAlert["status"]>("under_review");

  // Totals calculations across active alerts
  const totalHarvestVolume = plausibilityAlerts.reduce((acc, a) => acc + a.harvestVolumeKg, 0);
  const totalProcessedVolume = plausibilityAlerts.reduce((acc, a) => acc + a.processedVolumeKg, 0);
  const totalListedVolume = plausibilityAlerts.reduce((acc, a) => acc + a.listedVolumeKg, 0);
  const totalSoldVolume = plausibilityAlerts.reduce((acc, a) => acc + a.soldVolumeKg, 0);

  const handleOpenReview = (alertId: string, status: PlausibilityAlert["status"]) => {
    setSelectedAlertId(alertId);
    setTargetStatus(status);
    setReviewModalOpen(true);
  };

  const handleConfirmReview = (reason: string) => {
    if (selectedAlertId) {
      updatePlausibilityStatus(selectedAlertId, targetStatus, reason);
    }
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
              <span className="text-foreground font-semibold">Plausibility</span>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Field vs Sales Plausibility
              </h1>
              <Badge variant="outline" className="gap-1.5 text-xs bg-amber-50 text-amber-800 border-amber-200">
                <Scale className="w-3.5 h-3.5" />
                Yield & Mass Balance Sentinel
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Review relationships between operational production records and commercial activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              Envelopes Tracked: {plausibilityAlerts.length}
            </Badge>
          </div>
        </div>

        {/* Mandatory Human Review Guard Notice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-200/80 text-amber-900 border border-amber-300">
                  Plausibility alert — requires human review.
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed pt-0.5">
                Plausibility indicators flag statistical or volume variances across physical apiary yields, extraction logs, and marketplace transactions.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An alert is <strong className="text-foreground">NOT proof of fraud or tampering</strong>. Factors such as weather variations, seasonal blooming shifts, or delayed receiving scans can trigger temporary volume variances. Human review and documentation are mandatory before taking enforcement action.
              </p>
            </div>
          </div>
        </div>

        {/* Mass Balance Aggregate Cards */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span>Ecosystem Mass-Balance Overview (Live Aggregates)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Harvest Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Raw Harvest Total
                  </span>
                  <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Boxes className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalHarvestVolume.toFixed(1)} kg
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Recorded from registered apiaries</p>
              </CardContent>
            </Card>

            {/* Processed Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Purified & Blended
                  </span>
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalProcessedVolume.toFixed(1)} kg
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Yield Ratio: {((totalProcessedVolume / totalHarvestVolume) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            {/* Listed Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Wholesale Listed
                  </span>
                  <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalListedVolume.toFixed(1)} kg
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Active lot offers on marketplace</p>
              </CardContent>
            </Card>

            {/* Sold Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Executed Sales
                  </span>
                  <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalSoldVolume.toFixed(1)} kg
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Escrow contracted purchase volume</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plausibility Cases & Envelopes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Plausibility Verification Envelopes
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {plausibilityAlerts.length} Monitored Production Batches
            </span>
          </div>

          <div className="space-y-3.5">
            {plausibilityAlerts.map((alert) => {
              const isBalanced = alert.severity === "normal";
              const isAlert = alert.severity === "alert";

              return (
                <Card
                  key={alert.id}
                  className={`border transition-all shadow-xs ${
                    isBalanced
                      ? "border-border/80 bg-card hover:border-emerald-500/40"
                      : isAlert
                      ? "border-rose-200 bg-rose-50/20 hover:border-rose-400"
                      : "border-amber-200 bg-amber-50/20 hover:border-amber-400"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-border/60">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-primary">
                            {alert.id}
                          </span>
                          <span className="text-muted-foreground/40">•</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              isBalanced
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isAlert
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {alert.alertMessage}
                          </span>
                          {alert.requiresHumanReview && (
                            <Badge variant="outline" className="text-[10px] font-normal bg-background">
                              Plausibility alert — requires human review
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-foreground">{alert.title}</h3>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono text-muted-foreground">
                          Status: <strong className="text-foreground capitalize">{alert.status.replace("_", " ")}</strong>
                        </span>

                        {alert.status !== "verified_balanced" && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleOpenReview(alert.id, "verified_balanced")}
                            className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Balanced
                          </Button>
                        )}

                        {alert.status !== "investigation_opened" && alert.requiresHumanReview && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleOpenReview(alert.id, "investigation_opened")}
                            className="h-7 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-amber-950"
                          >
                            Open Review Case
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Volume Ratio Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-b border-border/60 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">Recorded Harvest</span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.harvestVolumeKg.toFixed(1)} kg
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">Output Processed</span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.processedVolumeKg.toFixed(1)} kg
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">Marketplace Listed</span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.listedVolumeKg.toFixed(1)} kg
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">Contracted Sales</span>
                        <span
                          className={`text-base font-bold font-mono ${
                            alert.soldVolumeKg > alert.processedVolumeKg
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {alert.soldVolumeKg.toFixed(1)} kg
                        </span>
                      </div>
                    </div>

                    {/* Explanation & Context */}
                    <div className="pt-3.5 space-y-2.5">
                      <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 text-xs text-foreground leading-relaxed">
                        <strong className="text-foreground block mb-1">
                          Plausibility Analysis & Mass Balance Findings:
                        </strong>
                        {alert.explanation}
                      </div>

                      {alert.reviewNotes && (
                        <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-lg text-xs text-muted-foreground">
                          <strong className="text-amber-800 block mb-0.5">Auditor Review Notes:</strong>
                          {alert.reviewNotes}
                        </div>
                      )}

                      {/* Linked Entities */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground font-medium">Associated Batches:</span>
                          {alert.relatedBatches.map((b) => (
                            <Link
                              key={b.id}
                              href={`/batches/${b.id}`}
                              className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-primary font-mono text-[11px] inline-flex items-center gap-1 transition-colors border border-border/60"
                            >
                              <span>{b.id}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>

                        {alert.relatedOrders.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-muted-foreground font-medium">Orders:</span>
                            {alert.relatedOrders.map((o) => (
                              <Link
                                key={o.id}
                                href={`/marketplace/orders/${o.id}`}
                                className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-foreground font-mono text-[11px] inline-flex items-center gap-1 transition-colors border border-border/60"
                              >
                                <span>{o.id} ({o.quantityKg}kg)</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Review Confirmation Modal */}
        <ConfirmationModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onConfirm={handleConfirmReview}
          title={`Update Plausibility Review Status?`}
          description="Provide justification notes for updating the mass-balance review classification. This decision will be permanently logged to the audit trail."
          confirmText="Confirm Status Update"
          variant={targetStatus === "verified_balanced" ? "success" : "warning"}
          reasonPlaceholder="Enter human review notes and reconciliation findings..."
        />
      </div>
    </AdminRoleGuard>
  );
}
