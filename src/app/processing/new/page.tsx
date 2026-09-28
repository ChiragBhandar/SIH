"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import { ProcessType } from "@/types/processing";
import {
  MOCK_PROCESSING_FACILITIES,
  MOCK_PROCESSING_LINES,
  MOCK_PROCESSING_OPERATORS,
} from "@/data/mock-traceability";
import {
  Layers,
  ArrowLeft,
  Wheat,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowDown,
  Sparkles,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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

interface SelectedInputBatchState {
  batchId: string;
  selectedWeight: number;
}

function CreateProcessingJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batchId");
  const { tr } = useLanguage();

  const { getEligibleProcessingBatches, addProcessingJob, processingJobs, batches, isLoaded } =
    useTraceability();
  const { selectedOrg, user } = useAuthSession();

  const eligibleBatches = React.useMemo(() => {
    return getEligibleProcessingBatches(selectedOrg?.id);
  }, [getEligibleProcessingBatches, selectedOrg?.id]);

  // Initial Form Values
  const initialBatch = React.useMemo(() => {
    if (!eligibleBatches.length) return null;
    if (preselectedBatchId) {
      const match = eligibleBatches.find(
        (b) => b.id === preselectedBatchId || b.batchNumber === preselectedBatchId
      );
      if (match) return match;
    }
    return eligibleBatches[0];
  }, [eligibleBatches, preselectedBatchId]);

  const [selectedInputs, setSelectedInputs] = React.useState<SelectedInputBatchState[]>([]);
  const [outputHoneyType, setOutputHoneyType] = React.useState("");
  const [outputQuantityKg, setOutputQuantityKg] = React.useState<number | "">("");
  const [processReferenceNumber, setProcessReferenceNumber] = React.useState("");

  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initializedRef.current && initialBatch) {
      initializedRef.current = true;
      const avail = initialBatch.remainingWeightKg !== undefined ? initialBatch.remainingWeightKg : initialBatch.weightKg;
      const defaultQty = initialBatch.batchNumber === "HC-RH-2026-0003" ? Math.min(90.0, avail) : avail;
      setSelectedInputs([{ batchId: initialBatch.batchNumber, selectedWeight: defaultQty }]);
      setOutputHoneyType(initialBatch.honeyType);
      setOutputQuantityKg(Number((defaultQty * 0.9667).toFixed(1)));
      setProcessReferenceNumber(`RUN-${initialBatch.batchNumber.replace("HC-RH-", "")}-01`);
    }
  }, [initialBatch]);

  const [processType, setProcessType] = React.useState<ProcessType>("Filtering");
  const [facility, setFacility] = React.useState(
    MOCK_PROCESSING_FACILITIES[0]?.name || "Golden Hive Processing Plant Unit 4, Solan Industrial Area"
  );
  const [line, setLine] = React.useState(MOCK_PROCESSING_LINES[0]);
  const [operator, setOperator] = React.useState(
    MOCK_PROCESSING_OPERATORS[0]?.name || "Vikram Mehta (Plant Lead)"
  );
  const [startDate, setStartDate] = React.useState(() => {
    const d = new Date();
    return `${d.toISOString().split("T")[0]} ${d.toTimeString().substring(0, 5)}`;
  });
  const [endDate, setEndDate] = React.useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return `${d.toISOString().split("T")[0]} ${d.toTimeString().substring(0, 5)}`;
  });
  const [processNotes, setProcessNotes] = React.useState("");

  // Section C Output State
  const [outputStorageLocation, setOutputStorageLocation] = React.useState(
    "Golden Hive Tank Farm Unit 2, Solan Industrial Area"
  );
  const [outputContainerRef, setOutputContainerRef] = React.useState("TANK-GHF-02");
  const [outputNotes, setOutputNotes] = React.useState("");

  // Review & Confirmation Modal State
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Derived calculations
  const totalInputWeightKg = React.useMemo(() => {
    return selectedInputs.reduce((sum, item) => sum + (Number(item.selectedWeight) || 0), 0);
  }, [selectedInputs]);

  const outputWeightNumber = Number(outputQuantityKg) || 0;

  const yieldPercentage = React.useMemo(() => {
    if (totalInputWeightKg <= 0 || outputWeightNumber <= 0) return 0;
    return Number(((outputWeightNumber / totalInputWeightKg) * 100).toFixed(2));
  }, [totalInputWeightKg, outputWeightNumber]);

  const isOutputExceedingInput = outputWeightNumber > totalInputWeightKg && totalInputWeightKg > 0;

  // Output batch preview ID
  const nextJobId = `PRC-2026-${(processingJobs.length + 1).toString().padStart(4, "0")}`;
  const nextOutputBatchId = `HC-PB-2026-${(
    batches.filter((b) => b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB")).length + 1
  ).toString().padStart(4, "0")}`;

  const handleToggleInputBatch = (batchNumber: string) => {
    const existing = selectedInputs.find((i) => i.batchId === batchNumber);
    if (existing) {
      setSelectedInputs(selectedInputs.filter((i) => i.batchId !== batchNumber));
    } else {
      const b = eligibleBatches.find((item) => item.batchNumber === batchNumber);
      const avail = b ? (b.remainingWeightKg !== undefined ? b.remainingWeightKg : b.weightKg) : 0;
      const defaultQty = b?.batchNumber === "HC-RH-2026-0003" ? Math.min(90.0, avail) : avail;
      const newArr = [...selectedInputs, { batchId: batchNumber, selectedWeight: defaultQty }];
      setSelectedInputs(newArr);
      if (!outputHoneyType && b) {
        setOutputHoneyType(b.honeyType);
      }
    }
  };

  const handleWeightChange = (batchNumber: string, weight: number) => {
    setSelectedInputs(
      selectedInputs.map((i) => (i.batchId === batchNumber ? { ...i, selectedWeight: weight } : i))
    );
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedInputs.length === 0) {
      setErrorMessage(tr("Please select at least one input raw honey batch.", "कृपया कम से कम एक इनपुट कच्चा शहद बैच चुनें।"));
      return;
    }

    for (const item of selectedInputs) {
      const b = eligibleBatches.find((batch) => batch.batchNumber === item.batchId);
      const avail = b ? (b.remainingWeightKg !== undefined ? b.remainingWeightKg : b.weightKg) : 0;
      if (item.selectedWeight <= 0) {
        setErrorMessage(tr(`Input weight for batch ${item.batchId} must be greater than 0 kg.`, `बैच ${item.batchId} के लिए इनपुट वजन 0 किग्रा से अधिक होना चाहिए।`));
        return;
      }
      if (item.selectedWeight > avail + 0.001) {
        setErrorMessage(
          tr(`Selected weight for ${item.batchId} (${item.selectedWeight} kg) exceeds available quantity (${avail} kg).`, `${item.batchId} के लिए चयनित वजन (${item.selectedWeight} किग्रा) उपलब्ध मात्रा (${avail} किग्रा) से अधिक है।`)
        );
        return;
      }
    }

    if (!outputQuantityKg || outputWeightNumber <= 0) {
      setErrorMessage(tr("Please specify a valid output quantity.", "कृपया एक मान्य आउटपुट मात्रा निर्दिष्ट करें।"));
      return;
    }

    if (outputWeightNumber > totalInputWeightKg) {
      setErrorMessage(
        tr(`Output quantity (${outputWeightNumber} kg) cannot be greater than total input quantity (${totalInputWeightKg} kg).`, `आउटपुट मात्रा (${outputWeightNumber} किग्रा) कुल इनपुट मात्रा (${totalInputWeightKg} किग्रा) से अधिक नहीं हो सकती।`)
      );
      return;
    }

    if (!outputHoneyType.trim()) {
      setErrorMessage(tr("Please specify the output honey type.", "कृपया आउटपुट शहद प्रकार निर्दिष्ट करें।"));
      return;
    }

    if (!outputContainerRef.trim()) {
      setErrorMessage(tr("Please specify the output container reference.", "कृपया आउटपुट कंटेनर संदर्भ निर्दिष्ट करें।"));
      return;
    }

    setShowReviewModal(true);
  };

  const handleConfirmCreate = () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = addProcessingJob({
        processType,
        facility,
        line,
        operator,
        startDate,
        endDate,
        processNotes,
        processReferenceNumber,
        inputs: selectedInputs.map((i) => ({
          batchId: i.batchId,
          usedQuantityKg: Number(i.selectedWeight),
        })),
        outputHoneyType,
        outputQuantityKg: outputWeightNumber,
        outputStorageLocation,
        outputContainerRef,
        outputNotes,
        createdBy: user?.fullName || operator,
        orgId: selectedOrg?.id || "org-ghf-02",
        orgName: selectedOrg?.name || "Golden Hive Foods",
      });

      setShowReviewModal(false);
      router.push(`/processing/${result.job.id}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : tr("An error occurred while creating the processing record.", "प्रसंस्करण रिकॉर्ड बनाते समय एक त्रुटि हुई।")
      );
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading processing form configuration...", "प्रसंस्करण फॉर्म कॉन्फ़िगरेशन लोड हो रहा है...")}
        </div>
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
          <Link href="/processing">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Processing & Blending", "प्रसंस्करण एवं मिश्रण पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {tr("Create Processing & Blending Record", "प्रसंस्करण और मिश्रण रिकॉर्ड बनाएं")}
          </h1>
          <Badge variant="outline" className="font-mono text-xs">
            {tr("Step 6 Lineage", "चरण 6 वंशावली")}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {tr("Record a verifiable material transformation event. Original raw batches remain intact while linking forward to the new processed output batch.", "सत्यापन योग्य सामग्री परिवर्तन गतिविधि रिकॉर्ड करें। नए प्रसंस्कृत आउटपुट बैच से जुड़ते हुए मूल कच्चे बैच अक्षुण्ण रहते हैं।")}
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">{tr("Validation Error", "सत्यापन त्रुटि")}</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleOpenReview} className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION A — INPUT MATERIAL */}
        {/* ========================================================================= */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                  A
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {tr("Section A — Input Material", "खंड A — इनपुट सामग्री")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tr("Select one or multiple eligible received batches and specify the quantity to allocate.", "एक या अधिक पात्र प्राप्त बैचों का चयन करें और आवंटित करने के लिए मात्रा निर्दिष्ट करें।")}
                  </CardDescription>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  {tr("Total Input Weight", "कुल इनपुट वजन")}
                </span>
                <span className="text-sm font-mono font-bold text-foreground">
                  {totalInputWeightKg.toFixed(1)} kg
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {eligibleBatches.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg p-4">
                {tr("No received raw honey batches available in the active facility. Inbound honey must be accepted through Receiving before processing.", "सक्रिय सुविधा में कोई प्राप्त कच्चा शहद बैच उपलब्ध नहीं है। प्रसंस्करण से पहले आवक शहद को आवक रसीद के माध्यम से स्वीकार किया जाना चाहिए।")}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {eligibleBatches.map((batch) => {
                    const isSelected = selectedInputs.some((i) => i.batchId === batch.batchNumber);
                    const selectedItem = selectedInputs.find((i) => i.batchId === batch.batchNumber);
                    const availableKg = batch.remainingWeightKg !== undefined ? batch.remainingWeightKg : batch.weightKg;

                    return (
                      <div
                        key={batch.id}
                        className={`rounded-lg border p-3.5 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border/80 bg-muted/10 hover:border-border"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleInputBatch(batch.batchNumber)}
                              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                              id={`check-${batch.id}`}
                            />
                            <label htmlFor={`check-${batch.id}`} className="cursor-pointer space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-foreground text-xs">
                                  {batch.batchNumber}
                                </span>
                                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                                  {batch.honeyType}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {tr("Source:", "स्रोत:")} <strong>{batch.currentCustodyOrgName || batch.sourceApiaryName}</strong> • {tr("Container:", "कंटेनर:")} {batch.containerRef}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {tr("Available in inventory:", "इन्वेंट्री में उपलब्ध:")} <strong className="text-foreground font-mono">{availableKg.toFixed(1)} kg</strong>
                              </p>
                            </label>
                          </div>

                          {isSelected && selectedItem && (
                            <div className="flex items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
                              <label className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                                {tr("Selected Weight (kg):", "चयनित वजन (किग्रा):")}
                              </label>
                              <div className="relative w-32">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  max={availableKg}
                                  value={selectedItem.selectedWeight || ""}
                                  onChange={(e) =>
                                    handleWeightChange(batch.batchNumber, parseFloat(e.target.value) || 0)
                                  }
                                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs font-mono font-bold text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* SECTION B — PROCESS DETAILS */}
        {/* ========================================================================= */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                B
              </span>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {tr("Section B — Process Details", "खंड B — प्रक्रिया विवरण")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tr("Operational parameters, equipment line, and supervisory metadata.", "परिचालन पैरामीटर, उपकरण लाइन और पर्यवेक्षी मेटाडेटा।")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Process Type", "प्रक्रिया का प्रकार")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value as ProcessType)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Filtering">{tr("Filtering (Mesh & Clarification)", "छानना (जाल और स्पष्टीकरण)")}</option>
                  <option value="Settling">{tr("Settling (Gravity Micro-Separation)", "निस्तारण (गुरुत्वाकर्षण सूक्ष्म-पृथक्करण)")}</option>
                  <option value="Blending">{tr("Blending (Multi-origin Homogenization)", "मिश्रण (बहु-स्रोत समरूपीकरण)")}</option>
                  <option value="Heating">{tr("Heating (Controlled Low-Temp Warming)", "गर्म करना (नियंत्रित कम तापमान वार्मिंग)")}</option>
                  <option value="Filling preparation">{tr("Filling preparation", "भरने की तैयारी")}</option>
                  <option value="Other">{tr("Other", "अन्य")}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Process Run Reference Number", "प्रक्रिया रन संदर्भ संख्या")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. RUN-2026-0881"
                  value={processReferenceNumber}
                  onChange={(e) => setProcessReferenceNumber(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Processing Facility", "प्रसंस्करण सुविधा")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Processing Line / Station", "प्रसंस्करण लाइन / स्टेशन")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {MOCK_PROCESSING_LINES.map((ln) => (
                    <option key={ln} value={ln}>
                      {ln}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Start Date & Time", "प्रारंभ तिथि और समय")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("End Date & Time", "समाप्ति तिथि और समय")}
                </label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-foreground">
                  {tr("Plant Operator / Engineer", "संयंत्र संचालक / इंजीनियर")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-foreground">
                  {tr("Process Notes & Temperature Parameters", "प्रक्रिया टिप्पणियाँ और तापमान पैरामीटर")}
                </label>
                <textarea
                  rows={2}
                  placeholder={tr("Specify filter micron rating, warming temperatures (<38°C), settling duration, etc.", "फ़िल्टर माइक्रोन रेटिंग, गर्म करने का तापमान (<38°C), स्थिर करने की अवधि आदि निर्दिष्ट करें।")}
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* SECTION C — OUTPUT */}
        {/* ========================================================================= */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                C
              </span>
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  {tr("Section C — Output Material & Yield Calculation", "खंड C — आउटपुट सामग्री और उत्पादन गणना")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tr("Define the resulting processed honey batch specifications and calculate yield efficiency.", "परिणामी प्रसंस्कृत शहद बैच विनिर्देशों को परिभाषित करें और दक्षता की गणना करें।")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4 text-xs">
            {/* Live Yield Metrics Display Card */}
            <div className="rounded-lg bg-muted/20 border border-border p-4 grid grid-cols-3 gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  {tr("Total Input Weight", "कुल इनपुट वजन")}
                </span>
                <p className="text-base font-mono font-bold text-foreground">
                  {totalInputWeightKg.toFixed(1)} kg
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  {tr("Output Weight", "आउटपुट वजन")}
                </span>
                <p className={`text-base font-mono font-bold ${isOutputExceedingInput ? "text-destructive" : "text-foreground"}`}>
                  {outputWeightNumber.toFixed(1)} kg
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                  {tr("Calculated Yield %", "परिकलित उपज %")}
                </span>
                <p className={`text-base font-mono font-bold ${isOutputExceedingInput ? "text-destructive" : "text-emerald-700"}`}>
                  {yieldPercentage.toFixed(2)}%
                </p>
              </div>
            </div>

            {isOutputExceedingInput && (
              <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/40 text-destructive text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {tr(`Validation Error: Output quantity (${outputWeightNumber} kg) cannot be greater than total input quantity (${totalInputWeightKg} kg).`, `सत्यापन त्रुटि: आउटपुट मात्रा (${outputWeightNumber} किग्रा) कुल इनपुट मात्रा (${totalInputWeightKg} किग्रा) से अधिक नहीं हो सकती।`)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Output Honey Type / Blend", "आउटपुट शहद प्रकार / मिश्रण")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={outputHoneyType}
                  onChange={(e) => setOutputHoneyType(e.target.value)}
                  placeholder={tr("e.g. Himalayan Wild Multifloral (Micro-filtered)", "उदा. हिमालयी वन्य मल्टीफ्लोरल (माइक्रो-फ़िल्टर किया हुआ)")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Output Quantity (kg)", "आउटपुट मात्रा (किग्रा)")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={totalInputWeightKg || undefined}
                  value={outputQuantityKg}
                  onChange={(e) =>
                    setOutputQuantityKg(e.target.value === "" ? "" : parseFloat(e.target.value))
                  }
                  placeholder="e.g. 87.0"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono font-bold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Output Container / Tank Reference", "आउटपुट कंटेनर / टैंक संदर्भ")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={outputContainerRef}
                  onChange={(e) => setOutputContainerRef(e.target.value)}
                  placeholder="e.g. TANK-GHF-02"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {tr("Output Storage Location", "आउटपुट भंडारण स्थान")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={outputStorageLocation}
                  onChange={(e) => setOutputStorageLocation(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-foreground">
                  {tr("Output Quality & Filtration Notes", "आउटपुट गुणवत्ता और निस्पंदन टिप्पणियाँ")}
                </label>
                <textarea
                  rows={2}
                  placeholder={tr("Observations on clarity, aroma retention, viscosity, and tank seal integrity...", "स्पष्टता, सुगंध प्रतिधारण, श्यानता और टैंक सील अखंडता पर अवलोकन...")}
                  value={outputNotes}
                  onChange={(e) => setOutputNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* VISUAL TRACEABILITY PREVIEW */}
        {/* ========================================================================= */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  {tr("Verifiable Material Lineage Preview", "सत्यापन योग्य सामग्री वंशावली पूर्वावलोकन")}
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] text-primary border-primary/40 font-mono">
                {tr("Lineage Guaranteed", "वंशावली गारंटीकृत")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="rounded-lg border border-border/70 bg-muted/15 p-4 space-y-3">
              {/* Top: Input Material */}
              <div className="rounded-md border border-border bg-card p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wheat className="h-3.5 w-3.5 text-primary" />
                    {tr("Input Material (Raw Batch)", "इनपुट सामग्री (कच्चा बैच)")}
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {totalInputWeightKg.toFixed(1)} {tr("kg total", "किग्रा कुल")}
                  </span>
                </div>
                {selectedInputs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">{tr("No input batch selected.", "कोई इनपुट बैच नहीं चुना गया।")}</p>
                ) : (
                  <div className="space-y-1 pt-1">
                    {selectedInputs.map((i) => {
                      const b = eligibleBatches.find((batch) => batch.batchNumber === i.batchId);
                      return (
                        <div key={i.batchId} className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-foreground">
                            {i.batchId}
                          </span>
                          <span className="text-muted-foreground">
                            {i.selectedWeight.toFixed(1)} kg • {b?.currentCustodyOrgName || "Cooperative"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center text-muted-foreground">
                <ArrowDown className="h-4 w-4 animate-bounce text-primary" />
              </div>

              {/* Middle: Processing Event */}
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {tr("Processing Event", "प्रसंस्करण गतिविधि")} ({nextJobId})
                  </span>
                  <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                    {processType}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-foreground">
                  {facility.split(",")[0]} • {line}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tr("Operator:", "ऑपरेटर:")} {operator}
                </p>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center text-muted-foreground">
                <ArrowDown className="h-4 w-4 animate-bounce text-primary" />
              </div>

              {/* Bottom: Output Material */}
              <div className="rounded-md border border-border bg-card p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-emerald-600" />
                    {tr("Output Material (Processed Batch)", "आउटपुट सामग्री (प्रसंस्कृत बैच)")}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {outputWeightNumber.toFixed(1)} kg ({yieldPercentage.toFixed(1)}% {tr("yield", "उपज")})
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-foreground">
                  {nextOutputBatchId}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {outputHoneyType || "Processed Honey"} • {tr("Container:", "कंटेनर:")} {outputContainerRef}
                </p>
              </div>

              {/* Rule Banner */}
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2.5 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-medium">
                  {tr("Output remains linked to source batch. Original input batch records remain unchanged.", "आउटपुट स्रोत बैच से जुड़ा रहता है। मूल इनपुट बैच रिकॉर्ड अपरिवर्तित रहते हैं।")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" asChild size="sm">
            <Link href="/processing">{tr("Cancel", "रद्द करें")}</Link>
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isOutputExceedingInput || selectedInputs.length === 0}
            className="gap-2 shadow-xs font-semibold cursor-pointer"
          >
            <span>{tr("Review & Create Record", "समीक्षा करें और रिकॉर्ड बनाएं")}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* REVIEW & CONFIRM DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>{tr("Review & Confirm Processing Record", "प्रसंस्करण रिकॉर्ड की समीक्षा और पुष्टि करें")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {tr("Verify all material quantities and operational parameters before committing this record to the immutable traceability timeline.", "अपरिवर्तनीय ट्रेसिबिलिटी टाइमलाइन में इस रिकॉर्ड को दर्ज करने से पहले सभी सामग्री मात्राओं और परिचालन मापदंडों को सत्यापित करें।")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {/* Info Message */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-amber-900">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
              <div className="text-[11px] leading-relaxed">
                <strong>{tr("Traceability Guarantee:", "ट्रेसिबिलिटी गारंटी:")}</strong> {tr("Creating this processing record adds a new traceability event. Original input batch records remain unchanged.", "यह प्रसंस्करण रिकॉर्ड बनाने से एक नई ट्रेसिबिलिटी गतिविधि जुड़ती है। मूल इनपुट बैच रिकॉर्ड अपरिवर्तित रहते हैं।")}
              </div>
            </div>

            {/* Spec Summary Table */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-2 font-sans">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/60">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Processing ID", "प्रसंस्करण आईडी")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {nextJobId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Process Type", "प्रक्रिया का प्रकार")}
                  </span>
                  <span className="font-medium text-foreground">
                    {processType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/60">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr(`Input Batches (${selectedInputs.length})`, `इनपुट बैच (${selectedInputs.length})`)}
                  </span>
                  <span className="font-mono text-foreground">
                    {selectedInputs.map((i) => `${i.batchId} (${i.selectedWeight} kg)`).join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Total Input Weight", "कुल इनपुट वजन")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {totalInputWeightKg.toFixed(1)} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/60">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Output Batch ID", "आउटपुट बैच आईडी")}
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {nextOutputBatchId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Output Quantity & Yield", "आउटपुट मात्रा और उपज")}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {outputWeightNumber.toFixed(1)} kg ({yieldPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Facility & Line", "सुविधा और लाइन")}
                  </span>
                  <span className="text-foreground truncate block">
                    {facility.split(",")[0]} • {line}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    {tr("Operator", "ऑपरेटर")}
                  </span>
                  <span className="text-foreground">
                    {operator}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewModal(false)}
              disabled={isSubmitting}
            >
              {tr("Back to Edit", "संपादित करने के लिए वापस जाएं")}
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmCreate}
              disabled={isSubmitting}
              className="gap-1.5 shadow-xs font-semibold"
            >
              {isSubmitting ? tr("Creating Record...", "रिकॉर्ड बनाया जा रहा है...") : tr("Create Processing Record", "प्रसंस्करण रिकॉर्ड बनाएं")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreateProcessingPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Processing & Blending", "प्रसंस्करण एवं मिश्रण"), href: "/processing" },
          { label: tr("New Processing Run", "नया प्रसंस्करण रन"), active: true },
        ]}
        defaultNavId="processing"
      >
        <React.Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-sm text-muted-foreground animate-pulse">
                {tr("Loading processing configuration...", "प्रसंस्करण कॉन्फ़िगरेशन लोड हो रहा है...")}
              </div>
            </div>
          }
        >
          <CreateProcessingJobContent />
        </React.Suspense>
      </AppShell>
    </AuthGuard>
  );
}

