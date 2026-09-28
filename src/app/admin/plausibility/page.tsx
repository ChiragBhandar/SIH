"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
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
  const { tr } = useLanguage();

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

  const translatePlausibilityStatus = (status: string) => {
    switch (status) {
      case "verified_balanced":
        return tr("Verified Balanced", "सत्यापित संतुलित");
      case "under_review":
        return tr("Under Review", "समीक्षाधीन");
      case "investigation_opened":
        return tr("Investigation Opened", "जांच प्रारंभ");
      default:
        return status;
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
                {tr("Administration", "प्रशासन")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">
                {tr("Plausibility", "उत्पादन बनाम बिक्री विश्लेषण")}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {tr("Field vs Sales Plausibility", "उत्पादन बनाम बिक्री विश्लेषण")}
              </h1>
              <Badge variant="outline" className="gap-1.5 text-xs bg-amber-50 text-amber-800 border-amber-200">
                <Scale className="w-3.5 h-3.5" />
                {tr("Yield & Mass Balance Sentinel", "उपज एवं संतुलन निगरानी")}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {tr(
                "Review relationships between operational production records and commercial activity.",
                "परिचालन उत्पादन रिकॉर्ड और वाणिज्यिक गतिविधि के बीच संबंधों की समीक्षा करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              {tr("Envelopes Tracked:", "ट्रैक किए गए बैच:")} {plausibilityAlerts.length}
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
                  {tr("Plausibility alert — requires human review.", "समीक्षा चेतावनी — मानवीय समीक्षा आवश्यक।")}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed pt-0.5">
                {tr(
                  "Plausibility indicators flag statistical or volume variances across physical apiary yields, extraction logs, and marketplace transactions.",
                  "उत्पादन-बिक्री विश्लेषण संकेतक भौतिक मधुमक्खी फार्म की उपज, निष्कर्षण लॉग और मार्केटप्लेस लेनदेन के बीच सांख्यिकीय या मात्रा विसंगतियों को चिह्नित करते हैं।"
                )}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tr(
                  "An alert is NOT proof of fraud or tampering. Factors such as weather variations, seasonal blooming shifts, or delayed receiving scans can trigger temporary volume variances. Human review and documentation are mandatory before taking enforcement action.",
                  "अलर्ट धोखाधड़ी या छेड़छाड़ का सबूत नहीं है। मौसम परिवर्तन, मौसमी फूलों के बदलाव, या विलंबित स्कैन जैसे कारक अस्थायी विसंगतियों को ट्रिगर कर सकते हैं। कोई भी कार्रवाई करने से पहले मानवीय समीक्षा और दस्तावेज़ीकरण अनिवार्य है।"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Mass Balance Aggregate Cards */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span>{tr("Ecosystem Mass-Balance Overview (Live Aggregates)", "पारिस्थितिकी तंत्र संतुलन अवलोकन (लाइव कुल)")}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Harvest Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Raw Harvest Total", "कुल कच्ची कटाई")}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Boxes className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalHarvestVolume.toFixed(1)} {tr("kg", "किग्रा")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tr("Recorded from registered apiaries", "पंजीकृत फार्मों से दर्ज")}
                </p>
              </CardContent>
            </Card>

            {/* Processed Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Purified & Blended", "शुद्ध एवं मिश्रित")}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalProcessedVolume.toFixed(1)} {tr("kg", "किग्रा")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tr("Yield Ratio:", "उपज अनुपात:")} {((totalProcessedVolume / totalHarvestVolume) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            {/* Listed Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Wholesale Listed", "थोक सूचीबद्ध")}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalListedVolume.toFixed(1)} {tr("kg", "किग्रा")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tr("Active lot offers on marketplace", "मार्केटप्लेस पर सक्रिय लॉट")}
                </p>
              </CardContent>
            </Card>

            {/* Sold Volume */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Executed Sales", "पूर्ण की गई बिक्री")}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-tight">
                  {totalSoldVolume.toFixed(1)} {tr("kg", "किग्रा")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tr("Escrow contracted purchase volume", "अनुबंधित खरीद मात्रा")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Plausibility Cases & Envelopes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {tr("Plausibility Verification Envelopes", "सत्यापन केस एवं लिफाफे")}
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {plausibilityAlerts.length} {tr("Monitored Production Batches", "निगरानीधीन उत्पादन बैच")}
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
                            {tr(alert.alertMessage, alert.alertMessage)}
                          </span>
                          {alert.requiresHumanReview && (
                            <Badge variant="outline" className="text-[10px] font-normal bg-background">
                              {tr("Plausibility alert — requires human review", "समीक्षा चेतावनी — मानवीय समीक्षा आवश्यक")}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-foreground">{alert.title}</h3>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono text-muted-foreground">
                          {tr("Status:", "स्थिति:")} <strong className="text-foreground capitalize">{translatePlausibilityStatus(alert.status)}</strong>
                        </span>

                        {alert.status !== "verified_balanced" && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleOpenReview(alert.id, "verified_balanced")}
                            className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {tr("Mark Balanced", "संतुलित चिह्नित करें")}
                          </Button>
                        )}

                        {alert.status !== "investigation_opened" && alert.requiresHumanReview && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleOpenReview(alert.id, "investigation_opened")}
                            className="h-7 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-amber-950"
                          >
                            {tr("Open Review Case", "समीक्षा केस खोलें")}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Volume Ratio Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-b border-border/60 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">
                          {tr("Recorded Harvest", "दर्ज कटाई")}
                        </span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.harvestVolumeKg.toFixed(1)} {tr("kg", "किग्रा")}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">
                          {tr("Output Processed", "प्रसंस्कृत आउटपुट")}
                        </span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.processedVolumeKg.toFixed(1)} {tr("kg", "किग्रा")}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">
                          {tr("Marketplace Listed", "मार्केटप्लेस सूचीबद्ध")}
                        </span>
                        <span className="text-base font-bold font-mono text-foreground">
                          {alert.listedVolumeKg.toFixed(1)} {tr("kg", "किग्रा")}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block font-medium">
                          {tr("Contracted Sales", "अनुबंधित बिक्री")}
                        </span>
                        <span
                          className={`text-base font-bold font-mono ${
                            alert.soldVolumeKg > alert.processedVolumeKg
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {alert.soldVolumeKg.toFixed(1)} {tr("kg", "किग्रा")}
                        </span>
                      </div>
                    </div>

                    {/* Explanation & Context */}
                    <div className="pt-3.5 space-y-2.5">
                      <div className="bg-muted/30 p-3.5 rounded-lg border border-border/60 text-xs text-foreground leading-relaxed">
                        <strong className="text-foreground block mb-1">
                          {tr("Plausibility Analysis & Mass Balance Findings:", "संतुलन विश्लेषण एवं निष्कर्ष:")}
                        </strong>
                        {alert.explanation}
                      </div>

                      {alert.reviewNotes && (
                        <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-lg text-xs text-muted-foreground">
                          <strong className="text-amber-800 block mb-0.5">{tr("Auditor Review Notes:", "ऑडिटर समीक्षा टिप्पणी:")}</strong>
                          {alert.reviewNotes}
                        </div>
                      )}

                      {/* Linked Entities */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground font-medium">{tr("Associated Batches:", "संबद्ध बैच:")}</span>
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
                            <span className="text-muted-foreground font-medium">{tr("Orders:", "ऑर्डर:")}</span>
                            {alert.relatedOrders.map((o) => (
                              <Link
                                key={o.id}
                                href={`/marketplace/orders/${o.id}`}
                                className="px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-foreground font-mono text-[11px] inline-flex items-center gap-1 transition-colors border border-border/60"
                              >
                                <span>{o.id} ({o.quantityKg}{tr("kg", "किग्रा")})</span>
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
          title={tr("Update Plausibility Review Status?", "समीक्षा स्थिति अद्यतन करें?")}
          description={tr(
            "Provide justification notes for updating the mass-balance review classification. This decision will be permanently logged to the audit trail.",
            "समीक्षा वर्गीकरण को अद्यतन करने के लिए औचित्य टिप्पणी प्रदान करें। यह निर्णय स्थायी रूप से ऑडिट ट्रेल में दर्ज किया जाएगा।"
          )}
          confirmText={tr("Confirm Status Update", "स्थिति अद्यतन की पुष्टि करें")}
          variant={targetStatus === "verified_balanced" ? "success" : "warning"}
          reasonPlaceholder={tr(
            "Enter human review notes and reconciliation findings...",
            "मानवीय समीक्षा टिप्पणी और सुलह निष्कर्ष दर्ज करें..."
          )}
        />
      </div>
    </AdminRoleGuard>
  );
}
