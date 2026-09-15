"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, ConfirmationModal } from "@/components/admin";
import { PlausibilityAlert } from "@/types/admin";
import {
  Scale,
  TrendingUp,
  Boxes,
  ShoppingBag,
  Layers,
  ExternalLink,
  Info,
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
      <div className="space-y-8 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Administration
              </Link>
              <span>/</span>
              <span className="text-stone-300">Plausibility</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight">
                Field vs Sales Plausibility
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Scale className="w-3.5 h-3.5" />
                Yield & Mass Balance Sentinel
              </span>
            </div>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              Review relationships between operational production records and commercial activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 font-mono">
              Envelopes Tracked: {plausibilityAlerts.length}
            </span>
          </div>
        </div>

        {/* Mandatory Human Review Guard Notice */}
        <div className="bg-stone-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden bg-gradient-to-r from-amber-950/30 via-stone-900 to-amber-950/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Plausibility alert — requires human review.
                </span>
              </div>
              <p className="text-stone-200 text-sm font-semibold leading-relaxed pt-1">
                Plausibility indicators flag statistical or volume variances across physical apiary yields, extraction logs, and marketplace transactions.
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                An alert is <strong className="text-stone-300">NOT proof of fraud or tampering</strong>. Factors such as weather variations, seasonal blooming shifts, or delayed receiving scans can trigger temporary volume variances. Human review and documentation are mandatory before taking enforcement action.
              </p>
            </div>
          </div>
        </div>

        {/* Mass Balance Aggregate Cards */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
            <span>Ecosystem Mass-Balance Overview (Live Aggregates)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Harvest Volume */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Raw Harvest Total
                </span>
                <Boxes className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-stone-100 font-mono">
                {totalHarvestVolume.toFixed(1)} kg
              </div>
              <p className="text-xs text-stone-400 mt-1">Recorded from registered apiaries</p>
            </div>

            {/* Processed Volume */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Purified & Blended
                </span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold text-stone-100 font-mono">
                {totalProcessedVolume.toFixed(1)} kg
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Yield Ratio: {((totalProcessedVolume / totalHarvestVolume) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Listed Volume */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Wholesale Listed
                </span>
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-stone-100 font-mono">
                {totalListedVolume.toFixed(1)} kg
              </div>
              <p className="text-xs text-stone-400 mt-1">Active lot offers on marketplace</p>
            </div>

            {/* Sold Volume */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Executed Sales
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-stone-100 font-mono">
                {totalSoldVolume.toFixed(1)} kg
              </div>
              <p className="text-xs text-stone-400 mt-1">Escrow contracted purchase volume</p>
            </div>
          </div>
        </div>

        {/* Plausibility Cases & Envelopes */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-stone-100 tracking-tight flex items-center justify-between">
            <span>Plausibility Verification Envelopes</span>
            <span className="text-xs font-mono text-stone-400">
              {plausibilityAlerts.length} Monitored Production Batches
            </span>
          </h2>

          <div className="space-y-4">
            {plausibilityAlerts.map((alert) => {
              const isBalanced = alert.severity === "normal";
              const isAlert = alert.severity === "alert";

              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-6 transition-all ${
                    isBalanced
                      ? "bg-stone-900/80 border-stone-800 hover:border-emerald-500/40"
                      : isAlert
                      ? "bg-rose-950/15 border-rose-900/40 hover:border-rose-500/50"
                      : "bg-amber-950/15 border-amber-900/40 hover:border-amber-500/50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {alert.id}
                        </span>
                        <span className="text-stone-500">•</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isBalanced
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : isAlert
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {alert.alertMessage}
                        </span>
                        {alert.requiresHumanReview && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                            Plausibility alert — requires human review
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-stone-100">{alert.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-stone-400">
                        Status: <strong className="text-stone-200 capitalize">{alert.status.replace("_", " ")}</strong>
                      </span>

                      {alert.status !== "verified_balanced" && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(alert.id, "verified_balanced")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-950"
                        >
                          Mark Balanced
                        </button>
                      )}

                      {alert.status !== "investigation_opened" && alert.requiresHumanReview && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(alert.id, "investigation_opened")}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-sm shadow-amber-950"
                        >
                          Open Review Case
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Volume Ratio Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-stone-800/60 text-xs">
                    <div className="space-y-1">
                      <span className="text-stone-400 block font-medium">Recorded Harvest</span>
                      <span className="text-lg font-bold font-mono text-stone-100">
                        {alert.harvestVolumeKg.toFixed(1)} kg
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-400 block font-medium">Output Processed</span>
                      <span className="text-lg font-bold font-mono text-stone-100">
                        {alert.processedVolumeKg.toFixed(1)} kg
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-400 block font-medium">Marketplace Listed</span>
                      <span className="text-lg font-bold font-mono text-stone-100">
                        {alert.listedVolumeKg.toFixed(1)} kg
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-400 block font-medium">Contracted Sales</span>
                      <span
                        className={`text-lg font-bold font-mono ${
                          alert.soldVolumeKg > alert.processedVolumeKg
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {alert.soldVolumeKg.toFixed(1)} kg
                      </span>
                    </div>
                  </div>

                  {/* Explanation & Context */}
                  <div className="pt-4 space-y-3">
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed">
                      <strong className="text-stone-200 block mb-1">
                        Plausibility Analysis & Mass Balance Findings:
                      </strong>
                      {alert.explanation}
                    </div>

                    {alert.reviewNotes && (
                      <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl text-xs text-stone-300">
                        <strong className="text-amber-300 block mb-0.5">Auditor Review Notes:</strong>
                        {alert.reviewNotes}
                      </div>
                    )}

                    {/* Linked Entities */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-stone-400 font-semibold">Associated Batches:</span>
                        {alert.relatedBatches.map((b) => (
                          <Link
                            key={b.id}
                            href={`/batches/${b.id}`}
                            className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-400 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                          >
                            <span>{b.id}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>

                      {alert.relatedOrders.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-stone-400 font-semibold">Orders:</span>
                          {alert.relatedOrders.map((o) => (
                            <Link
                              key={o.id}
                              href={`/marketplace/orders/${o.id}`}
                              className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <span>{o.id} ({o.quantityKg}kg)</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
