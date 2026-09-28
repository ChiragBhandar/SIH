"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Boxes,
  ArrowLeft,
  Wheat,
  Layers,
  Scale,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Package,
  Warehouse,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useLanguage } from "@/context/language-context";

function CreateBatchContent() {
  const { tr, trStatus } = useLanguage();
  const { apiaries, hives, batches, addBatch, isLoaded } = useTraceability();

  // Generated Batch ID Preview
  const nextBatchNumber = React.useMemo(() => {
    const nextCount = batches.length + 1;
    return `HC-RH-2026-${nextCount.toString().padStart(4, "0")}`;
  }, [batches]);

  const [userSourceApiaryId, setUserSourceApiaryId] = React.useState<string>("");
  const sourceApiaryId = userSourceApiaryId || (apiaries.length > 0 ? apiaries[0].id : "");

  // Hives available for currently selected apiary
  const availableHives = React.useMemo(() => {
    if (!sourceApiaryId) return [];
    return hives.filter((h) => h.apiaryId === sourceApiaryId);
  }, [hives, sourceApiaryId]);

  const [userSelectedHiveIds, setUserSelectedHiveIds] = React.useState<string[] | null>(null);

  const selectedHiveIds = React.useMemo(() => {
    if (userSelectedHiveIds !== null) {
      const filtered = userSelectedHiveIds.filter((id) => availableHives.some((h) => h.id === id));
      return filtered.length > 0 ? filtered : (availableHives.length > 0 ? [availableHives[0].id] : []);
    }
    return availableHives.length > 0 ? [availableHives[0].id] : [];
  }, [userSelectedHiveIds, availableHives]);

  const [harvestDate, setHarvestDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [honeyType, setHoneyType] = React.useState<string>(
    "Himalayan Wild Multifloral"
  );
  const [weightKg, setWeightKg] = React.useState<string>("120.0");
  const [containerRef, setContainerRef] = React.useState<string>(
    `DRUM-HAC-${(batches.length + 1).toString().padStart(3, "0")}`
  );
  const [storageLocation, setStorageLocation] = React.useState<string>(
    "Chamoli Cooperative Vault Room 1"
  );
  const [notes, setNotes] = React.useState<string>(
    "Cold centrifuged extraction below 35°C. Unpasteurized and unfiltered raw honey."
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [createdBatchId, setCreatedBatchId] = React.useState<string | null>(null);

  const selectedApiary = React.useMemo(() => {
    return apiaries.find((a) => a.id === sourceApiaryId);
  }, [apiaries, sourceApiaryId]);

  const toggleHiveSelection = (id: string) => {
    setUserSelectedHiveIds((prev) => {
      const current = prev !== null ? prev : selectedHiveIds;
      if (current.includes(id)) {
        if (current.length === 1) return current; // At least one hive required
        return current.filter((item) => item !== id);
      } else {
        return [...current, id];
      }
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!sourceApiaryId) errs.apiary = tr("Source Apiary is required.", "स्रोत मधुमक्खी फार्म आवश्यक है।");
    if (selectedHiveIds.length === 0) errs.hives = tr("At least one source hive must be selected.", "कम से कम एक स्रोत छत्ता चुना जाना चाहिए।");
    if (!harvestDate) errs.date = tr("Harvest date is required.", "कटाई तिथि आवश्यक है।");
    if (!honeyType.trim()) errs.honeyType = tr("Honey floral type is required.", "शहद का वानस्पतिक प्रकार आवश्यक है।");
    if (!weightKg.trim() || isNaN(Number(weightKg)) || Number(weightKg) <= 0) {
      errs.weight = tr("Valid harvest weight (kg) is required.", "मान्य कटाई वजन (किग्रा) आवश्यक है।");
    }
    if (!containerRef.trim()) errs.container = tr("Container/drum reference identifier is required.", "कंटेनर/ड्रम संदर्भ पहचानकर्ता आवश्यक है।");
    if (!storageLocation.trim()) errs.storage = tr("Storage location is required.", "भंडारण स्थान आवश्यक है।");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsPreviewOpen(true);
  };

  const handleConfirmCreate = () => {
    const created = addBatch({
      sourceApiaryId,
      sourceHiveIds: selectedHiveIds,
      harvestDate,
      honeyType: honeyType.trim(),
      weightKg: parseFloat(weightKg),
      containerRef: containerRef.trim(),
      storageLocation: storageLocation.trim(),
      notes: notes.trim(),
      createdBy: "Chirag Operator (Beekeeper)",
    });

    setIsPreviewOpen(false);
    setCreatedBatchId(created.id);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Initializing harvest workflow...", "कटाई कार्यप्रवाह प्रारंभ हो रहा है...")}
        </div>
      </div>
    );
  }

  // If successfully created, show confirmation view with required details
  if (createdBatchId) {
    const createdBatch = batches.find((b) => b.id === createdBatchId);
    return (
      <div className="max-w-2xl mx-auto py-8 animate-in fade-in-50 space-y-6">
        <Card className="border-emerald-500/30 bg-card shadow-md">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {tr("Harvest Batch Successfully Created", "कटाई बैच सफलतापूर्वक बनाया गया")}
            </CardTitle>
            <CardDescription className="text-xs">
              {tr(
                "The raw honey batch has been minted and linked to source colony records.",
                "कच्चा शहद बैच तैयार कर लिया गया है और स्रोत कॉलोनी रिकॉर्ड से जोड़ दिया गया है।"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="rounded-lg border border-border/80 bg-muted/25 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">{tr("Batch Identifier", "बैच पहचानकर्ता")}</span>
                <span className="font-mono text-sm font-bold text-primary">
                  {createdBatch?.batchNumber || createdBatchId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">{tr("Source Apiary", "स्रोत मधुमक्खी फार्म")}</span>
                <span className="font-semibold text-foreground">
                  {createdBatch?.sourceApiaryName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">{tr("Linked Source Hives", "जुड़े हुए स्रोत छत्ते")}</span>
                <span className="font-mono text-foreground font-medium">
                  {createdBatch?.sourceHiveIdentifiers?.join(", ") || tr("None", "कोई नहीं")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">{tr("Harvest Date", "कटाई तिथि")}</span>
                <span className="text-foreground">{createdBatch?.harvestDate}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-medium">{tr("Extracted Weight", "निकाला गया वजन")}</span>
                <span className="font-mono font-bold text-foreground">
                  {createdBatch?.weightKg.toFixed(1)} {tr("kg", "किग्रा")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">{tr("Traceability Status", "ट्रेसेबिलिटी स्थिति")}</span>
                <Badge variant="outline" className="gap-1 text-emerald-700 border-emerald-200 bg-emerald-50 text-[11px] py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {createdBatch?.traceabilityStatus || tr("Traceability chain started", "ट्रेसेबिलिटी श्रृंखला प्रारंभ")}
                </Badge>
              </div>
            </div>

            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <span>
                {tr(
                  "Immutable origin metadata recorded. All downstream processing, laboratory testing, and bottle certifications will remain cryptographically bound to this root batch.",
                  "अपरिवर्तनीय उत्पत्ति मेटाडेटा दर्ज किया गया। सभी डाउनस्ट्रीम प्रसंस्करण, प्रयोगशाला परीक्षण और बोतल प्रमाणपत्र इस रूट बैच से क्रिप्टोग्राफ़िक रूप से जुड़े रहेंगे।"
                )}
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-6">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs w-full sm:w-auto"
            >
              <Link href="/batches">{tr("Back to Batches List", "बैच सूची पर वापस")}</Link>
            </Button>

            <Button
              size="sm"
              asChild
              className="text-xs gap-1.5 w-full sm:w-auto shadow-xs cursor-pointer"
            >
              <Link href={`/batches/${createdBatchId}`}>
                <span>{tr("View Batch Details & Timeline", "बैच विवरण एवं समयरेखा देखें")}</span>
                <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/batches">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Batches", "बैच सूची पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Traceability Guarantee Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 text-xs">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-foreground">
            {tr("Traceability Provenance Contract", "ट्रेसेबिलिटी उत्पत्ति अनुबंध")}
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            <strong>{tr("Source information will remain linked to this batch throughout the traceability chain.", "स्रोत जानकारी पूरी ट्रेसेबिलिटी श्रृंखला के दौरान इस बैच से जुड़ी रहेगी।")}</strong>{" "}
            {tr(
              "The selected apiary coordinates, botanical flora, and paired hive identifiers will permanently anchor every downstream custody transfer and consumer verification QR code.",
              "चयनित मधुमक्खी फार्म निर्देशांक, वानस्पतिक वनस्पति और युग्मित छत्ता पहचानकर्ता प्रत्येक डाउनस्ट्रीम कस्टडी हस्तांतरण और उपभोक्ता सत्यापन क्यूआर कोड को स्थायी रूप से जोड़ेंगे।"
            )}
          </p>
        </div>
      </div>

      {/* Main Creation Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {tr("Create Harvest Batch", "कटाई बैच बनाएं")}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {tr(
                    "Register extracted raw bulk honey and establish root origin link.",
                    "निकाले गए कच्चे थोक शहद को पंजीकृत करें और मूल उत्पत्ति लिंक स्थापित करें।"
                  )}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/40 border border-border px-2.5 py-1 rounded-md">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                {tr("Minting Batch ID:", "बैच आईडी निर्माण:")}
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {nextBatchNumber}
              </span>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleOpenPreview}>
          <CardContent className="space-y-4 pt-4 text-xs">
            {/* Source Apiary Selection */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1">
                <Wheat className="h-3.5 w-3.5 text-primary" />
                {tr("Source Apiary", "स्रोत मधुमक्खी फार्म")} <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceApiaryId}
                onChange={(e) => {
                  setUserSourceApiaryId(e.target.value);
                  setUserSelectedHiveIds(null);
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {apiaries.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.location} ({a.dominantFlora})
                  </option>
                ))}
              </select>
              {errors.apiary && (
                <span className="text-[11px] text-rose-500">{errors.apiary}</span>
              )}
            </div>

            {/* Source Hives Selection */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  {tr("Source Hive(s) Extracted", "निकाले गए स्रोत छत्ते")} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {selectedHiveIds.length} {tr("hive(s) selected", "छत्ता चयनित")}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {tr(
                  "Select the specific colony boxes harvested for this raw extraction run.",
                  "इस निष्कर्षण के लिए विशिष्ट कॉलोनियों का चयन करें।"
                )}
              </p>

              {availableHives.length === 0 ? (
                <div className="p-4 rounded-md border border-dashed text-center text-xs text-muted-foreground">
                  {tr("No hives registered for this apiary.", "इस फार्म के लिए कोई छत्ता पंजीकृत नहीं है।")}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md bg-muted/15">
                  {availableHives.map((h) => {
                    const isChecked = selectedHiveIds.includes(h.id);
                    return (
                      <div
                        key={h.id}
                        onClick={() => toggleHiveSelection(h.id)}
                        className={`p-2.5 rounded-md border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          isChecked
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-foreground truncate">
                              {h.identifier}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                              {h.internalCode} • {h.queenStatus}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 shrink-0 font-mono"
                        >
                          {trStatus(h.status)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.hives && (
                <span className="text-[11px] text-rose-500">{errors.hives}</span>
              )}
            </div>

            {/* Harvest Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {tr("Harvest Date", "कटाई तिथि")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.date && (
                  <span className="text-[11px] text-rose-500">{errors.date}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  {tr("Honey Type / Floral Origin", "शहद का प्रकार / वानस्पतिक उत्पत्ति")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={honeyType}
                  onChange={(e) => setHoneyType(e.target.value)}
                  placeholder={tr("e.g. Himalayan Wild Multifloral, White Clover & Acacia", "उदा. हिमालयी जंगली मल्टीफ्लोरल, सफेद तिपतिया घास एवं बबूल")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.honeyType && (
                  <span className="text-[11px] text-rose-500">{errors.honeyType}</span>
                )}
              </div>
            </div>

            {/* Weight and Container Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Scale className="h-3 w-3 text-muted-foreground" />
                  {tr("Raw Honey Weight (kg)", "कच्चे शहद का वजन (किग्रा)")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.weight && (
                  <span className="text-[11px] text-rose-500">{errors.weight}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  {tr("Container / Bulk Drum Reference", "कंटेनर / थोक ड्रम संदर्भ")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={containerRef}
                  onChange={(e) => setContainerRef(e.target.value)}
                  placeholder="e.g. DRUM-HAC-004"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.container && (
                  <span className="text-[11px] text-rose-500">{errors.container}</span>
                )}
              </div>
            </div>

            {/* Storage Location and Field Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Warehouse className="h-3 w-3 text-muted-foreground" />
                  {tr("Storage Facility / Vault Location", "भंडारण सुविधा / वॉल्ट स्थान")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder={tr("e.g. Chamoli Cooperative Secure Storage Unit 1", "उदा. चमोली सहकारी सुरक्षित भंडारण इकाई 1")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-foreground">
                  {tr("Extraction & Batch Notes", "निष्कर्षण एवं बैच नोट्स")}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr("Moisture content field reading, centrifuge speed, visual amber clarity...", "नमी की मात्रा फील्ड रीडिंग, सेंट्रीफ्यूज गति, दृश्यमान स्पष्टता...")}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 pb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <Link href="/batches">{tr("Cancel", "रद्द करें")}</Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              className="text-xs min-w-[140px] shadow-xs cursor-pointer gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{tr("Review Batch", "बैच की समीक्षा करें")}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Review / Preview Modal Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {tr("Review Harvest Batch Details", "कटाई बैच विवरण की समीक्षा करें")}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {tr(
                "Confirm batch origin parameters before committing to the Honey Chain local registry.",
                "हनी चेन स्थानीय रजिस्ट्री में दर्ज करने से पहले बैच उत्पत्ति मापदंडों की पुष्टि करें।"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs pt-1">
            <div className="rounded-md bg-muted/30 border p-3 space-y-2.5">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Batch Number", "बैच संख्या")}</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {nextBatchNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Source Apiary", "स्रोत मधुमक्खी फार्म")}</span>
                <span className="font-medium text-foreground">
                  {selectedApiary?.name}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Extracted Hives", "निकाले गए छत्ते")}</span>
                <span className="font-mono text-foreground font-medium">
                  {availableHives
                    .filter((h) => selectedHiveIds.includes(h.id))
                    .map((h) => h.identifier)
                    .join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Harvest Date", "कटाई तिथि")}</span>
                <span className="text-foreground">{harvestDate}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Honey Variety", "शहद की किस्म")}</span>
                <span className="text-foreground font-medium">{honeyType}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">{tr("Net Weight & Container", "शुद्ध वजन एवं कंटेनर")}</span>
                <span className="font-mono font-bold text-foreground">
                  {parseFloat(weightKg || "0").toFixed(1)} {tr("kg", "किग्रा")} ({containerRef})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">{tr("Vault Storage", "वॉल्ट भंडारण")}</span>
                <span className="text-foreground truncate max-w-[220px]">
                  {storageLocation}
                </span>
              </div>
            </div>

            <div className="rounded-md bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {tr(
                  "Origin linking is permanent. This batch will initialize the immutable digital ledger timeline.",
                  "उत्पत्ति लिंकिंग स्थायी है। यह बैच अपरिवर्तनीय डिजिटल लेज़र समयरेखा को प्रारंभ करेगा।"
                )}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs"
            >
              {tr("Edit Details", "विवरण संपादित करें")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmCreate}
              className="text-xs min-w-[140px]"
            >
              {tr("Confirm & Create Batch", "पुष्टि करें एवं बैच बनाएं")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreateBatchPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Honey Batches", "शहद के बैच"), href: "/batches" },
          { label: tr("Create Harvest Batch", "कटाई बैच बनाएं"), active: true },
        ]}
        defaultNavId="batches"
      >
        <CreateBatchContent />
      </AppShell>
    </AuthGuard>
  );
}
