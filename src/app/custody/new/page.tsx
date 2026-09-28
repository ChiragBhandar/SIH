"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import type { CustodyTransfer } from "@/types/custody";
import { useAuthSession } from "@/context/auth-session-context";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Truck,
  Building,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";

const MOCK_FACILITIES: Record<string, string[]> = {
  "org-ghf-02": [
    "Golden Hive Processing Plant Unit 4, Solan Industrial Area, HP",
    "Golden Hive Cold Storage Hub, Chandigarh",
    "Golden Hive Extraction & Packaging Plant 1, Delhi NCR",
  ],
  "org-ptl-03": [
    "PureTrace Analytical Testing Facility, Mohali Science Park",
  ],
  "org-hac-01": [
    "Highland Apiaries Central Storage, Chamoli, Uttarakhand",
  ],
};

function CreateCustodyTransferForm() {
  const { tr, trStatus, trRole, trOrgType } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedBatchId = searchParams.get("batchId") || "";

  const { batches, addCustodyTransfer, isLoaded } = useTraceability();
  const { selectedOrg, selectedRole, user, allOrganisations } = useAuthSession();

  // Filter batches that belong to the active organisation or are available for transfer
  const eligibleBatches = React.useMemo(() => {
    return batches.filter(
      (b) => b.status === "Raw Batch Created" || b.status === "Pending Custody Transfer"
    );
  }, [batches]);

  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    preselectedBatchId && eligibleBatches.some((b) => b.id === preselectedBatchId)
      ? preselectedBatchId
      : eligibleBatches[0]?.id || ""
  );

  const selectedBatch = React.useMemo(() => {
    return batches.find((b) => b.id === selectedBatchId || b.batchNumber === selectedBatchId);
  }, [batches, selectedBatchId]);

  // Destination Org: default to Golden Hive Foods
  const defaultDestOrg = allOrganisations.find((o) => o.id === "org-ghf-02") || allOrganisations[1] || allOrganisations[0];
  const [destinationOrgId, setDestinationOrgId] = React.useState<string>(defaultDestOrg?.id || "org-ghf-02");

  const destinationOrg = React.useMemo(() => {
    return allOrganisations.find((o) => o.id === destinationOrgId) || defaultDestOrg;
  }, [allOrganisations, destinationOrgId, defaultDestOrg]);

  const availableFacilities = MOCK_FACILITIES[destinationOrgId] || [
    "Standard Intake Facility 1",
  ];
  const [destinationFacility, setDestinationFacility] = React.useState<string>(
    availableFacilities[0] || ""
  );

  const handleDestinationOrgChange = (newOrgId: string) => {
    setDestinationOrgId(newOrgId);
    const facilities = MOCK_FACILITIES[newOrgId] || ["Standard Intake Facility 1"];
    setDestinationFacility(facilities[0] || "");
  };

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    const target = batches.find((b) => b.id === batchId || b.batchNumber === batchId);
    if (target) {
      setQuantityKg(target.weightKg.toString());
    }
  };

  // Form Fields
  const [quantityKg, setQuantityKg] = React.useState<string>(
    selectedBatch ? selectedBatch.weightKg.toString() : "95.6"
  );
  const [transferDate, setTransferDate] = React.useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0] || "2026-09-14";
  });
  const [expectedArrivalDate, setExpectedArrivalDate] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0] || "2026-09-15";
  });
  const [transportRef, setTransportRef] = React.useState<string>("LOG-TR-2026-8841");
  const [notes, setNotes] = React.useState<string>(
    "Cold extraction bulk drum sealed with tamper-evident security tags. En route to manufacturing facility for intake testing."
  );

  // Workflow states: "form" | "review" | "success"
  const [step, setStep] = React.useState<"form" | "review" | "success">("form");
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [createdTransfer, setCreatedTransfer] = React.useState<CustodyTransfer | null>(null);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedBatchId || !selectedBatch) {
      setErrorMsg(tr("Please select a valid source honey batch.", "कृपया एक वैध स्रोत शहद बैच चुनें।"));
      return;
    }
    if (!destinationOrgId) {
      setErrorMsg(tr("Please select a receiving destination organisation.", "कृपया प्राप्त करने वाला गंतव्य संगठन चुनें।"));
      return;
    }
    if (!quantityKg || Number(quantityKg) <= 0) {
      setErrorMsg(tr("Please enter a valid transfer quantity.", "कृपया एक मान्य ट्रांसफर मात्रा दर्ज करें।"));
      return;
    }
    if (!transportRef.trim()) {
      setErrorMsg(tr("Please provide a carrier transport reference or vehicle registration.", "कृपया कैरियर परिवहन संदर्भ या वाहन पंजीकरण प्रदान करें।"));
      return;
    }

    setStep("review");
  };

  const handleFinalSubmit = () => {
    if (!selectedBatch) return;

    try {
      const transfer = addCustodyTransfer({
        batchId: selectedBatch.id,
        destinationOrgId,
        destinationFacility,
        quantityKg: Number(quantityKg),
        transferDate,
        expectedArrivalDate,
        transportRef: transportRef.trim(),
        notes: notes.trim(),
        createdBy: `${user?.fullName || "Rajesh Rawat"} (${selectedRole?.name || "Beekeeper"})`,
      });

      setCreatedTransfer(transfer);
      setStep("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : tr("Failed to create custody transfer.", "कस्टडी ट्रांसफर बनाने में विफल।");
      setErrorMsg(message);
      setStep("form");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading batch provenance data...", "बैच उत्पत्ति डेटा लोड हो रहा है...")}
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (step === "success" && createdTransfer) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center space-y-4 shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              {tr("Custody Transfer Dispatched & Logged", "कस्टडी ट्रांसफर प्रेषित एवं दर्ज किया गया")}
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {tr(
                "The physical transfer has been committed to the batch traceability history with status",
                "भौतिक हस्तांतरण को स्थिति के साथ बैच ट्रेसेबिलिटी इतिहास में दर्ज किया गया है:"
              )}{" "}
              <strong className="text-amber-800">{trStatus("Pending Acceptance")}</strong>.
            </p>
          </div>

          {/* Transfer Summary Badge Grid */}
          <div className="rounded-lg border border-border/70 bg-card p-4 text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">{tr("Transfer ID", "ट्रांसफर आईडी")}</span>
              <span className="font-mono text-xs font-bold text-primary">
                {createdTransfer.id}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">{tr("Batch ID", "बैच आईडी")}</span>
              <span className="font-mono text-xs font-bold text-foreground">
                {createdTransfer.batchId}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">{tr("Destination Organisation", "गंतव्य संगठन")}</span>
              <span className="text-xs font-semibold text-foreground">
                {createdTransfer.destinationOrgName}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs text-muted-foreground">{tr("Transferred Weight", "स्थानांतरित वजन")}</span>
              <span className="font-mono text-xs font-bold text-foreground">
                {createdTransfer.quantityKg.toFixed(1)} {tr("kg", "किग्रा")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{tr("Custody Status", "कस्टडी स्थिति")}</span>
              <StatusBadge status="honey" size="sm">
                {trStatus("Pending Acceptance")}
              </StatusBadge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild className="w-full sm:w-auto gap-1.5">
              <Link href={`/custody/${createdTransfer.id}`}>
                <span>{tr("View Custody Transfer Detail", "कस्टडी ट्रांसफर विवरण देखें")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/batches/${createdTransfer.batchId}`}>
                <span>{tr("View Batch Timeline", "बैच समयरेखा देखें")}</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full sm:w-auto text-xs">
              <Link href="/custody">{tr("Back to Transfers List", "ट्रांसफर सूची पर वापस")}</Link>
            </Button>
          </div>
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
          <Link href="/custody">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Custody Transfers", "कस्टडी ट्रांसफर पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {tr("Initiate Custody Transfer", "कस्टडी ट्रांसफर शुरू करें")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {tr(
            "Hand over physical raw honey material to a verified manufacturer or processing partner.",
            "सत्यापित निर्माता या प्रसंस्करण भागीदार को भौतिक कच्चे शहद सामग्री सौंपें।"
          )}
        </p>
      </div>

      {/* PROVENANCE ARCHITECTURE BANNER: SOURCE -> DESTINATION */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Source Box */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {tr("Origin / Dispatcher", "उत्पत्ति / प्रेषक")}
              </span>
              <p className="text-sm font-bold text-foreground">
                {selectedOrg?.name || "Highland Apiaries Cooperative"}
              </p>
              <span className="text-[11px] text-muted-foreground">
                {tr("Role:", "भूमिका:")} {trRole(selectedRole?.name || "Beekeeper")}
              </span>
            </div>
          </div>

          {/* Middle Arrow */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-background border border-border shadow-2xs self-center">
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
              {tr("Transfer Custody", "कस्टडी ट्रांसफर")}
            </span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>

          {/* Destination Box */}
          <div className="flex items-center gap-3 md:justify-end">
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {tr("Recipient / Manufacturer", "प्राप्तकर्ता / निर्माता")}
              </span>
              <p className="text-sm font-bold text-foreground">
                {destinationOrg?.name || "Golden Hive Foods"}
              </p>
              <span className="text-[11px] text-muted-foreground">
                {destinationOrg?.displayType ? trOrgType(destinationOrg.displayType) : trOrgType("Manufacturer")}
              </span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM STEP */}
      {step === "form" && (
        <form onSubmit={handleProceedToReview} className="space-y-6">
          {/* Section 1: Source Material Selection */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                <span>{tr("1. Select Source Harvest Batch", "1. स्रोत कटाई बैच का चयन करें")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {tr(
                  "Select the raw honey batch stored in your cooperative inventory to transfer.",
                  "स्थानांतरित करने के लिए अपने सहकारी इन्वेंट्री में संग्रहीत कच्चे शहद बैच का चयन करें।"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  {tr("Source Raw Batch *", "स्रोत कच्चा बैच *")}
                </label>
                <Select value={selectedBatchId} onValueChange={handleBatchSelect}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder={tr("Select raw batch to transfer...", "स्थानांतरण के लिए कच्चा बैच चुनें...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleBatches.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        <span className="font-mono font-bold mr-2">{b.batchNumber}</span>
                        <span>• {b.honeyType} ({b.weightKg} {tr("kg", "किग्रा")})</span>
                        <span className="text-muted-foreground ml-2">[{b.sourceApiaryName}]</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Source Batch Information Card */}
              {selectedBatch && (
                <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-muted-foreground">
                      {tr("Source Provenance Details", "स्रोत उत्पत्ति विवरण")}
                    </span>
                    <StatusBadge status="honey" size="sm">
                      {trStatus(selectedBatch.status)}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        {tr("Source Apiary", "स्रोत मधुमक्खी फार्म")}
                      </span>
                      <p className="font-semibold text-foreground truncate">
                        {selectedBatch.sourceApiaryName}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        {tr("Harvest Date", "कटाई तिथि")}
                      </span>
                      <p className="font-medium text-foreground">
                        {selectedBatch.harvestDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        {tr("Honey Type", "शहद का प्रकार")}
                      </span>
                      <p className="font-medium text-foreground truncate">
                        {selectedBatch.honeyType}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground block">
                        {tr("Available Weight", "उपलब्ध वजन")}
                      </span>
                      <p className="font-mono font-bold text-foreground">
                        {selectedBatch.weightKg.toFixed(1)} {tr("kg", "किग्रा")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{tr("Origin Container:", "मूल कंटेनर:")} <strong>{selectedBatch.containerRef}</strong></span>
                    <span>{tr("Storage:", "भंडारण:")} <strong>{selectedBatch.storageLocation}</strong></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Destination & Facility Details */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>{tr("2. Receiving Destination & Intake Facility", "2. प्राप्तकर्ता गंतव्य एवं आवक सुविधा")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {tr(
                  "Specify the enterprise partner receiving this raw material shipment.",
                  "इस कच्ची सामग्री खेप को प्राप्त करने वाले उद्यम भागीदार को निर्दिष्ट करें।"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    {tr("Receiving Organisation", "प्राप्तकर्ता संगठन")} <span className="text-rose-500">*</span>
                  </label>
                  <Select value={destinationOrgId} onValueChange={handleDestinationOrgChange}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={tr("Select destination...", "गंतव्य चुनें...")} />
                    </SelectTrigger>
                    <SelectContent>
                      {allOrganisations
                        .filter((o) => o.id !== (selectedOrg?.id || "org-hac-01"))
                        .map((org) => (
                          <SelectItem key={org.id} value={org.id} className="text-xs">
                            {org.name} ({trOrgType(org.displayType)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    {tr("Receiving Facility / Location", "प्राप्ति सुविधा / स्थान")} <span className="text-rose-500">*</span>
                  </label>
                  <Select value={destinationFacility} onValueChange={setDestinationFacility}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={tr("Select facility...", "सुविधा चुनें...")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFacilities.map((fac, idx) => (
                        <SelectItem key={idx} value={fac} className="text-xs">
                          {fac}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Quantity & Logistics Details */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>{tr("3. Transfer Logistics & Transport Data", "3. ट्रांसफर रसद एवं परिवहन डेटा")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {tr(
                  "Enter shipment weight, transport carrier reference, and dispatch dates.",
                  "शिपमेंट वजन, परिवहन वाहक संदर्भ और प्रेषण तिथियां दर्ज करें।"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    {tr("Transfer Quantity (kg)", "ट्रांसफर मात्रा (किग्रा)")} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={selectedBatch?.weightKg || 1000}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    required
                  />
                  {selectedBatch && (
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      {tr("Max available:", "अधिकतम उपलब्ध:")} {selectedBatch.weightKg.toFixed(1)} {tr("kg", "किग्रा")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    {tr("Carrier / Transport Reference", "वाहक / परिवहन संदर्भ")} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={transportRef}
                    onChange={(e) => setTransportRef(e.target.value)}
                    placeholder={tr("e.g. LOG-TR-2026-8841 (Freight Truck #UK-07-TA-9921)", "उदा. LOG-TR-2026-8841 (मालवाहक ट्रक #UK-07-TA-9921)")}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    {tr("Dispatch Date", "प्रेषण तिथि")} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground block">
                    {tr("Expected Intake Arrival", "अपेक्षित आवक आगमन")} <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={expectedArrivalDate}
                    onChange={(e) => setExpectedArrivalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground block">
                  {tr("Dispatch Notes & Handling Instructions", "प्रेषण नोट्स एवं हैंडलिंग निर्देश")}
                </label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr(
                    "Temperature constraints, handling requirements, or handover observations...",
                    "तापमान की सीमाएं, हैंडलिंग आवश्यकताएं या हैंडओवर अवलोकन..."
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" asChild size="default">
                  <Link href="/custody">{tr("Cancel", "रद्द करें")}</Link>
                </Button>
                <Button type="submit" size="default">
                  <span>{tr("Review Transfer →", "ट्रांसफर की समीक्षा करें →")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* REVIEW STEP */}
      {step === "review" && (
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground">
                {tr("Review Custody Transfer Details", "कस्टडी ट्रांसफर विवरण की समीक्षा करें")}
              </CardTitle>
              <CardDescription className="text-xs">
                {tr(
                  "Please verify the handover details before initiating the transfer.",
                  "कृपया ट्रांसफर शुरू करने से पहले हैंडओवर विवरण सत्यापित करें।"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Immutable Provenance Warning */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>{tr("Immutable Traceability Notice", "अपरिवर्तनीय ट्रेसेबिलिटी सूचना")}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {tr(
                    "Once submitted, this transfer becomes part of the batch traceability history. The batch ID",
                    "जमा करने के बाद, यह ट्रांसफर बैच ट्रेसेबिलिटी इतिहास का हिस्सा बन जाता है। बैच आईडी"
                  )}{" "}
                  <strong className="font-mono">{selectedBatch?.batchNumber}</strong>{" "}
                  {tr(
                    "remains unchanged and is preserved through manufacturer receiving.",
                    "अपरिवर्तित रहती है और निर्माता प्राप्ति के माध्यम से संरक्षित रहती है।"
                  )}
                </p>
              </div>

              {/* Review Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border bg-muted/20 p-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Source Batch", "स्रोत बैच")}
                  </span>
                  <p className="font-mono font-bold text-sm text-foreground">
                    {selectedBatch?.batchNumber}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {selectedBatch?.honeyType} • {selectedBatch?.sourceApiaryName}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Transfer Quantity", "ट्रांसफर मात्रा")}
                  </span>
                  <p className="font-mono font-bold text-sm text-foreground">
                    {Number(quantityKg).toFixed(1)} {tr("kg", "किग्रा")}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {tr("Container:", "कंटेनर:")} {selectedBatch?.containerRef}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Source Organisation", "स्रोत संगठन")}
                  </span>
                  <p className="font-semibold text-foreground">
                    {selectedOrg?.name || "Highland Apiaries Cooperative"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {tr("Dispatched by:", "द्वारा प्रेषित:")} {user?.fullName} ({trRole(selectedRole?.name || "")})
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Destination Organisation", "गंतव्य संगठन")}
                  </span>
                  <p className="font-semibold text-foreground">
                    {destinationOrg?.name || "Golden Hive Foods"}
                  </p>
                  <p className="text-muted-foreground text-[11px] truncate">
                    {destinationFacility}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Dates", "तिथियां")}
                  </span>
                  <p className="font-mono text-foreground">
                    {tr("Dispatched:", "प्रेषित:")} {transferDate}
                  </p>
                  <p className="font-mono text-muted-foreground text-[11px]">
                    {tr("Expected Arrival:", "अपेक्षित आगमन:")} {expectedArrivalDate}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {tr("Transport Reference ID", "परिवहन संदर्भ आईडी")}
                  </span>
                  <p className="font-mono font-bold text-foreground">
                    {transportRef}
                  </p>
                </div>
              </div>

              {notes && (
                <div className="rounded-md border border-border/60 p-3 bg-muted/10 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Dispatch Notes", "प्रेषण नोट्स")}
                  </span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("form")}
            >
              {tr("← Edit Details", "← विवरण संपादित करें")}
            </Button>
            <Button
              onClick={handleFinalSubmit}
              size="sm"
              className="gap-1.5 font-bold shadow-xs bg-primary text-primary-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{tr("Confirm & Dispatch Transfer", "पुष्टि करें एवं ट्रांसफर प्रेषित करें")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateCustodyTransferPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Custody Transfers", "कस्टडी ट्रांसफर"), href: "/custody" },
          { label: tr("New Transfer", "नया ट्रांसफर"), active: true },
        ]}
        defaultNavId="custody"
      >
        <React.Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-sm text-muted-foreground animate-pulse">
                {tr("Loading transfer form...", "ट्रांसफर फॉर्म लोड हो रहा है...")}
              </div>
            </div>
          }
        >
          <CreateCustodyTransferForm />
        </React.Suspense>
      </AppShell>
    </AuthGuard>
  );
}
