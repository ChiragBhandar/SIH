"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { BOTTLE_SIZE_WEIGHTS } from "@/data/mock-bottles";
import {
  ArrowLeft,
  Package,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { BottleSize } from "@/types/bottle";
import { useLanguage } from "@/context/language-context";

export function CreateBottlesContent() {
  const { tr, trStatus } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batch");

  const {
    getEligibleBottlingBatches,
    getBatch,
    getCertification,
    getCertificationByBatch,
    bottles,
    createPackagingRun,
    isLoaded,
  } = useTraceability();

  const eligibleBatches = getEligibleBottlingBatches();

  // Form State
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    preselectedBatchId || (eligibleBatches.length > 0 ? eligibleBatches[0].id : "")
  );
  const [productName, setProductName] = React.useState("Highland Wild Mountain Raw Honey");
  const [bottleSize, setBottleSize] = React.useState<BottleSize>("500 g");
  const [numberOfBottles, setNumberOfBottles] = React.useState<number>(100);
  const [packagingDate, setPackagingDate] = React.useState("2026-09-14");
  const [packagingFacility, setPackagingFacility] = React.useState(
    "Golden Hive Bottling Plant, Solan Industrial Facility"
  );
  const [packagingLine, setPackagingLine] = React.useState("Line 01 - Automatic Micro-Filler");
  const [lotReferenceCode, setLotReferenceCode] = React.useState("LOT-2026-09-B2");
  const [notes, setNotes] = React.useState(
    "Packaged from verified certified mountain honey batch. Sealed with tamper-evident security foil."
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Auto-sync if batch changes
  const selectedBatch = getBatch(selectedBatchId);
  const cert = selectedBatch
    ? selectedBatch.certificateId
      ? getCertification(selectedBatch.certificateId)
      : getCertificationByBatch(selectedBatch.batchNumber)
    : undefined;

  const availableWeightKg = selectedBatch
    ? selectedBatch.remainingWeightKg !== undefined
      ? selectedBatch.remainingWeightKg
      : selectedBatch.weightKg
    : 0;

  const unitWeightKg = BOTTLE_SIZE_WEIGHTS[bottleSize] || 0.5;
  const totalPackagedKg = Number((numberOfBottles * unitWeightKg).toFixed(2));
  const remainingWeightKg = Number((availableWeightKg - totalPackagedKg).toFixed(2));

  const isOverLimit = totalPackagedKg > availableWeightKg;

  // Next Bottle ID sequence preview
  const nextStartNum = bottles.length + 1;
  const nextEndNum = nextStartNum + Math.max(1, numberOfBottles) - 1;
  const previewStartId = `HC-BTL-2026-${String(nextStartNum).padStart(5, "0")}`;
  const previewEndId = `HC-BTL-2026-${String(nextEndNum).padStart(5, "0")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) {
      setErrorMsg(tr("Please select a quality-approved processed honey batch.", "कृपया गुणवत्ता-अनुमोदित प्रसंस्कृत शहद बैच चुनें।"));
      return;
    }

    if (numberOfBottles <= 0) {
      setErrorMsg(tr("Number of bottles must be greater than 0.", "बोतलों की संख्या 0 से अधिक होनी चाहिए।"));
      return;
    }

    if (isOverLimit) {
      setErrorMsg(
        tr(
          `Total packaged weight (${totalPackagedKg} kg) exceeds available batch weight (${availableWeightKg} kg).`,
          `कुल पैकेज्ड वजन (${totalPackagedKg} किग्रा) उपलब्ध बैच वजन (${availableWeightKg} किग्रा) से अधिक है।`
        )
      );
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = createPackagingRun({
        sourceBatchId: selectedBatch.id,
        productName: productName.trim() || `${selectedBatch.honeyType} Raw Honey`,
        bottleSize,
        numberOfBottles,
        packagingDate,
        packagingFacility,
        packagingLine,
        lotReferenceCode,
        notes,
      });

      // Redirect to the first bottle or bottles list
      if (result.bottles.length > 0) {
        router.push(`/bottles/${result.bottles[0].id}`);
      } else {
        router.push("/bottles");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : tr("Failed to create bottles run.", "बोतलें बनाने में विफल।");
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading batch and quality certificate data...", "बैच और गुणवत्ता प्रमाणपत्र डेटा लोड हो रहा है...")}
        </div>
      </div>
    );
  }

  if (eligibleBatches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={Award}
          title={tr("No Quality-Approved Batches Eligible", "कोई गुणवत्ता-अनुमोदित बैच पात्र नहीं")}
          description={tr(
            "Bottle identities can only be created from processed honey batches that have completed laboratory quality testing and received a valid certification.",
            "बोतल पहचान केवल उन प्रसंस्कृत शहद बैचों से बनाई जा सकती है जिन्होंने प्रयोगशाला गुणवत्ता परीक्षण पूरा कर लिया है और एक वैध प्रमाणीकरण प्राप्त किया है।"
          )}
          action={
            <div className="flex items-center gap-2">
              <Button asChild size="sm">
                <Link href="/lab">{tr("View Laboratory Testing", "प्रयोगशाला परीक्षण देखें")}</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/processing">{tr("Processing Runs", "प्रसंस्करण रन")}</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/bottles">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Bottles & QR Verification", "बोतलें एवं क्यूआर सत्यापन पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span>{tr("Create Bottles & Generate QR Identities", "बोतलें बनाएं एवं क्यूआर पहचान उत्पन्न करें")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {tr(
            "Transform quality-approved bulk processed honey into serialized individual consumer retail bottles.",
            "गुणवत्ता-अनुमोदित थोक प्रसंस्कृत शहद को व्यक्तिगत उपभोक्ता खुदरा बोतलों में रूपांतरित करें।"
          )}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: SOURCE BATCH */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              {tr("Source Processed Batch", "स्रोत प्रसंस्कृत बैच")}
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              {tr("Select Approved Processed Batch", "अनुमोदित प्रसंस्कृत बैच चुनें")}
            </CardTitle>
            <CardDescription className="text-xs">
              {tr(
                "Only batches with verified laboratory certification and positive remaining weight are eligible.",
                "केवल सत्यापित प्रयोगशाला प्रमाणीकरण और सकारात्मक शेष वजन वाले बैच ही पात्र हैं।"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1.5">
              <label htmlFor="sourceBatch" className="text-xs font-medium">
                {tr("Approved Batch Selection *", "अनुमोदित बैच चयन *")}
              </label>
              <Select
                value={selectedBatchId}
                onValueChange={(val) => {
                  setSelectedBatchId(val);
                  setErrorMsg(null);
                }}
              >
                <SelectTrigger id="sourceBatch" className="h-10 text-xs">
                  <SelectValue placeholder={tr("Select quality-approved processed batch", "गुणवत्ता-अनुमोदित प्रसंस्कृत बैच चुनें")} />
                </SelectTrigger>
                <SelectContent>
                  {eligibleBatches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs">
                      <span className="font-mono font-bold text-foreground">{b.batchNumber}</span>
                      <span className="text-muted-foreground"> — {b.honeyType} ({b.remainingWeightKg ?? b.weightKg} {tr("kg available", "किग्रा उपलब्ध")})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Batch Details Callout */}
            {selectedBatch && (
              <div className="rounded-lg border border-primary/20 bg-muted/30 p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {selectedBatch.batchNumber}
                    </span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                      {tr("Quality Approved", "गुणवत्ता अनुमोदित")}
                    </Badge>
                  </div>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>{tr("Eligible for bottle creation", "बोतल निर्माण के लिए पात्र")}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Honey Variety", "शहद की किस्म")}
                    </span>
                    <span className="font-medium text-foreground text-[11px]">
                      {selectedBatch.honeyType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Available Weight", "उपलब्ध वजन")}
                    </span>
                    <span className="font-bold text-foreground font-mono text-[11px]">
                      {availableWeightKg} {tr("kg", "किग्रा")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Processing Date", "प्रसंस्करण तिथि")}
                    </span>
                    <span className="font-mono text-foreground text-[11px]">
                      {selectedBatch.processingDate || "2026-09-14"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block">
                      {tr("Certification ID", "प्रमाणन आईडी")}
                    </span>
                    <span className="font-mono font-medium text-primary text-[11px]">
                      {cert?.id || selectedBatch.certificateId || "CERT-HC-2026-0003"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: PACKAGING SPECIFICATIONS */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-primary" />
              {tr("Packaging Specifications", "पैकेजिंग विनिर्देश")}
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              {tr("Bottle Configuration & Packaging Parameters", "बोतल विन्यास एवं पैकेजिंग पैरामीटर")}
            </CardTitle>
            <CardDescription className="text-xs">
              {tr(
                "Configure product label title, individual bottle size, quantity, and packaging line metadata.",
                "उत्पाद लेबल शीर्षक, व्यक्तिगत बोतल का आकार, मात्रा और पैकेजिंग लाइन मेटाडेटा कॉन्फ़िगर करें।"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label htmlFor="productName" className="text-xs font-medium">
                {tr("Consumer Product Name *", "उपभोक्ता उत्पाद का नाम *")}
              </label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={tr("e.g. Highland Wild Mountain Raw Honey", "उदा. हाइलैंड वाइल्ड माउंटेन कच्चा शहद")}
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Bottle Size & Quantity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="bottleSize" className="text-xs font-medium">
                  {tr("Bottle Size / Unit Volume *", "बोतल का आकार / इकाई मात्रा *")}
                </label>
                <Select
                  value={bottleSize}
                  onValueChange={(val: BottleSize) => setBottleSize(val)}
                >
                  <SelectTrigger id="bottleSize" className="h-9 text-xs">
                    <SelectValue placeholder={tr("Select bottle size", "बोतल का आकार चुनें")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="250 g" className="text-xs">
                      250 g (0.25 {tr("kg net", "किग्रा शुद्ध")})
                    </SelectItem>
                    <SelectItem value="500 g" className="text-xs">
                      500 g (0.50 {tr("kg net", "किग्रा शुद्ध")})
                    </SelectItem>
                    <SelectItem value="750 g" className="text-xs">
                      750 g (0.75 {tr("kg net", "किग्रा शुद्ध")})
                    </SelectItem>
                    <SelectItem value="1 kg" className="text-xs">
                      1 kg (1.00 {tr("kg net", "किग्रा शुद्ध")})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="numberOfBottles" className="text-xs font-medium">
                  {tr("Number of Bottles *", "बोतलों की संख्या *")}
                </label>
                <Input
                  id="numberOfBottles"
                  type="number"
                  min="1"
                  max="10000"
                  value={numberOfBottles}
                  onChange={(e) => setNumberOfBottles(parseInt(e.target.value) || 0)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* Live Calculation Banner */}
            <div
              className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                isOverLimit
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4" />
                  <span>{tr("Batch Weight Allocation Balance", "बैच वजन आवंटन संतुलन")}</span>
                </span>
                {isOverLimit ? (
                  <span className="text-rose-700 font-bold">
                    {tr("Allocation Exceeds Batch Limit!", "आवंटन बैच सीमा से अधिक है!")}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{tr("Valid Allocation", "वैध आवंटन")}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50 text-[11px] font-mono">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Available Batch", "उपलब्ध बैच")}
                  </span>
                  <span className="font-bold text-foreground">
                    {availableWeightKg.toFixed(1)} {tr("kg", "किग्रा")}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Total Packaged", "कुल पैकेज्ड")}
                  </span>
                  <span className="font-bold text-foreground">
                    {numberOfBottles} × {bottleSize} = {totalPackagedKg.toFixed(1)} {tr("kg", "किग्रा")}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Remaining Batch", "शेष बैच")}
                  </span>
                  <span
                    className={`font-bold ${
                      isOverLimit ? "text-rose-700" : "text-emerald-700"
                    }`}
                  >
                    {remainingWeightKg.toFixed(1)} {tr("kg", "किग्रा")}
                  </span>
                </div>
              </div>
            </div>

            {/* Packaging Facility, Line & Lot Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="packagingDate" className="text-xs font-medium">
                  {tr("Packaging Date *", "पैकेजिंग तिथि *")}
                </label>
                <Input
                  id="packagingDate"
                  type="date"
                  value={packagingDate}
                  onChange={(e) => setPackagingDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="packagingFacility" className="text-xs font-medium">
                  {tr("Packaging Facility *", "पैकेजिंग सुविधा *")}
                </label>
                <Input
                  id="packagingFacility"
                  value={packagingFacility}
                  onChange={(e) => setPackagingFacility(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="packagingLine" className="text-xs font-medium">
                  {tr("Packaging Line *", "पैकेजिंग लाइन *")}
                </label>
                <Input
                  id="packagingLine"
                  value={packagingLine}
                  onChange={(e) => setPackagingLine(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lotCode" className="text-xs font-medium">
                {tr("Lot / Reference Code *", "लॉट / संदर्भ कोड *")}
              </label>
              <Input
                id="lotCode"
                value={lotReferenceCode}
                onChange={(e) => setLotReferenceCode(e.target.value)}
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-medium">
                {tr("Packaging Notes & Quality Observations", "पैकेजिंग नोट्स एवं गुणवत्ता अवलोकन")}
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: BOTTLE ID & QR GENERATION PREVIEW */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {tr("Digital Identity & QR Preview", "डिजिटल पहचान एवं क्यूआर पूर्वावलोकन")}
            </span>
            <CardTitle className="text-base font-bold text-foreground">
              {tr("Sequential Bottle & QR Code Generation", "क्रमिक बोतल एवं क्यूआर कोड निर्माण")}
            </CardTitle>
            <CardDescription className="text-xs">
              {tr(
                "Each packaged unit will receive a distinct immutable identifier and public consumer QR code.",
                "प्रत्येक पैकेज्ड इकाई को एक अलग अपरिवर्तनीय पहचानकर्ता और सार्वजनिक उपभोक्ता क्यूआर कोड प्राप्त होगा।"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {tr(`Generated Bottle Range (${numberOfBottles} units)`, `निर्मित बोतल सीमा (${numberOfBottles} इकाइयां)`)}
                </span>
                <span className="font-mono font-bold text-foreground text-xs mt-0.5 block">
                  {previewStartId} {numberOfBottles > 1 ? `→ ${previewEndId}` : ""}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {tr("QR Identifier Format", "क्यूआर पहचानकर्ता प्रारूप")}
                </span>
                <span className="font-mono text-foreground text-xs mt-0.5 block">
                  QR-HC-{String(nextStartNum).padStart(5, "0")} → QR-HC-{String(nextEndNum).padStart(5, "0")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                {tr(
                  "Bottles are created in Created status with generated QR representations. You can inspect the source lineage and publish them for public consumer scanning once labeling is verified.",
                  "बोतलें उत्पन्न क्यूआर निरूपण के साथ 'निर्मित' स्थिति में बनाई जाती हैं। लेबलिंग सत्यापित होने के बाद आप स्रोत वंशावली का निरीक्षण कर सकते हैं और उन्हें सार्वजनिक उपभोक्ता स्कैनिंग के लिए प्रकाशित कर सकते हैं।"
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" asChild type="button" className="cursor-pointer">
            <Link href="/bottles">{tr("Cancel", "रद्द करें")}</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isOverLimit || !selectedBatch}
            className="gap-1.5 min-w-36 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{tr("Generating Bottles...", "बोतलें बनाई जा रही हैं...")}</span>
            ) : (
              <>
                <Package className="h-4 w-4" />
                <span>{tr(`Create ${numberOfBottles} Bottles`, `${numberOfBottles} बोतलें बनाएं`)}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewBottlesPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Product & Market", "उत्पाद एवं बाज़ार"), href: "/bottles" },
          { label: tr("Create Bottles", "बोतलें बनाएं"), active: true },
        ]}
        defaultNavId="bottles"
      >
        <CreateBottlesContent />
      </AppShell>
    </AuthGuard>
  );
}
