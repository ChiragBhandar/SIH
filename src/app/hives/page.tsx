"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { QueenStatus, HiveType } from "@/types/traceability";
import {
  Wheat,
  Plus,
  Search,
  Filter,
  MapPin,
  Mountain,
  Flower2,
  Calendar,
  Layers,
  Radio,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useLanguage } from "@/context/language-context";

function HivesAndApiariesContent() {
  const searchParams = useSearchParams();
  const { apiaries, hives, addHive, isLoaded } = useTraceability();
  const { isHindi, tr } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [userSelectedApiaryId, setUserSelectedApiaryId] = React.useState<string>("");
  const [dismissedBanner, setDismissedBanner] = React.useState(false);

  // Register Hive Modal state
  const [isRegisterHiveOpen, setIsRegisterHiveOpen] = React.useState(false);
  const [hiveIdentifier, setHiveIdentifier] = React.useState("");
  const [hiveInternalCode, setHiveInternalCode] = React.useState("");
  const [hiveType, setHiveType] = React.useState<HiveType>("Langstroth");
  const [installationDate, setInstallationDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [queenStatus, setQueenStatus] = React.useState<QueenStatus>("Active & Laying");
  const [locationInApiary, setLocationInApiary] = React.useState("");
  const [nfcRfidId, setNfcRfidId] = React.useState("");
  const [hiveNotes, setHiveNotes] = React.useState("");
  const [registerHiveError, setRegisterHiveError] = React.useState("");
  const [justRegisteredHiveId, setJustRegisteredHiveId] = React.useState<string | null>(null);

  // Derive selection and banner state reactively from search params without setState in effect
  const apiaryParam = searchParams.get("apiary");
  const registeredParam = searchParams.get("registered");
  const showSuccessBanner = !dismissedBanner && Boolean(registeredParam);

  const selectedApiaryId =
    userSelectedApiaryId ||
    (apiaryParam && apiaries.some((a) => a.id === apiaryParam) ? apiaryParam : apiaries[0]?.id ?? "");

  const setSelectedApiaryId = (id: string) => {
    setUserSelectedApiaryId(id);
  };

  // Filter apiaries
  const filteredApiaries = React.useMemo(() => {
    return apiaries.filter((apiary) => {
      const matchesSearch =
        apiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apiary.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apiary.dominantFlora.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || apiary.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apiaries, searchQuery, statusFilter]);

  const selectedApiary = React.useMemo(() => {
    return (
      apiaries.find((a) => a.id === selectedApiaryId) ||
      (apiaries.length > 0 ? apiaries[0] : null)
    );
  }, [apiaries, selectedApiaryId]);

  // Hives for selected apiary
  const apiaryHives = React.useMemo(() => {
    if (!selectedApiary) return [];
    return hives.filter((h) => h.apiaryId === selectedApiary.id);
  }, [hives, selectedApiary]);

  // Total summary statistics
  const totalApiariesCount = apiaries.length;
  const totalHivesCount = hives.length;
  const healthyHivesCount = hives.filter((h) => h.status === "healthy").length;

  const handleOpenRegisterHive = () => {
    if (!selectedApiary) return;
    const count = apiaryHives.length + 1;
    const prefix = selectedApiary.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setHiveIdentifier(`HIVE-${prefix}-${count.toString().padStart(2, "0")}`);
    setHiveInternalCode(`BOX-${new Date().getFullYear()}-${prefix}${count}`);
    setHiveType("Langstroth");
    setInstallationDate(new Date().toISOString().split("T")[0]);
    setQueenStatus("Active & Laying");
    setLocationInApiary(`Row ${Math.ceil(count / 4)}, Stand #${((count - 1) % 4) + 1}`);
    setNfcRfidId(`NFC-${Math.floor(1000 + Math.random() * 9000)}-${prefix}${count}`);
    setHiveNotes("");
    setRegisterHiveError("");
    setIsRegisterHiveOpen(true);
  };

  const handleSaveHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApiary) return;
    if (!hiveIdentifier.trim()) {
      setRegisterHiveError("Hive identifier is required.");
      return;
    }
    if (!hiveInternalCode.trim()) {
      setRegisterHiveError("Internal code is required.");
      return;
    }

    const created = addHive({
      identifier: hiveIdentifier.trim(),
      internalCode: hiveInternalCode.trim(),
      apiaryId: selectedApiary.id,
      hiveType,
      installationDate,
      queenStatus,
      locationInApiary: locationInApiary.trim() || "Yard Stand",
      nfcRfidId: nfcRfidId.trim() || `NFC-${Date.now().toString().slice(-6)}`,
      status: "healthy",
      notes: hiveNotes.trim(),
    });

    setJustRegisteredHiveId(created.id);
    setIsRegisterHiveOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading apiary registry...", "मधुमक्खी फार्म रजिस्ट्री लोड हो रही है...")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Notification */}
      {showSuccessBanner && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/90 p-3.5 text-emerald-800 animate-in fade-in-50">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
            <div className="text-xs">
              <span className="font-semibold">{tr("Apiary registration saved.", "मधुमक्खी फार्म पंजीकरण सहेजा गया।")}</span>{" "}
              {tr("You can now register hives, log field inspections, and link future honey batches.", "अब आप छत्ते पंजीकृत कर सकते हैं, क्षेत्रीय निरीक्षण दर्ज कर सकते हैं और भविष्य के शहद बैचों को लिंक कर सकते हैं।")}
            </div>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDismissedBanner(true)}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            {tr("Dismiss", "खारिज करें")}
          </Button>
        </div>
      )}

      {justRegisteredHiveId && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-emerald-800 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>New hive added successfully to <strong>{selectedApiary?.name}</strong>.</span>
          </div>
          <Button
            variant="outline"
            size="xs"
            asChild
            className="h-7 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100"
          >
            <Link href={`/hives/${justRegisteredHiveId}`}>
              View Hive Details →
            </Link>
          </Button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {tr("Hives & Apiaries", "छत्ते और मधुमक्खी फार्म")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-muted-foreground border-border">
              {tr("Traceability Layer", "ट्रेसेबिलिटी स्तर")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Manage registered apiary locations, monitor colony health, and track hive assets.",
              "पंजीकृत फार्म स्थानों का प्रबंधन करें, कॉलोनी स्वास्थ्य की निगरानी करें और छत्ता संपत्तियों को ट्रैक करें।"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="default">
            <Link href="/hives/new">
              <Plus className="h-4 w-4" />
              <span>{tr("Register Apiary", "फार्म पंजीकृत करें")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Registered Apiaries", "पंजीकृत मधुमक्खी फार्म")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {totalApiariesCount}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Across 2 geographical regions", "2 भौगोलिक क्षेत्रों में")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Wheat className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Total Monitored Hives", "कुल प्रबंधित छत्ते")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {totalHivesCount}
              </h3>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                {isHindi ? `${healthyHivesCount} सत्यापित स्वस्थ कॉलोनियां` : `${healthyHivesCount} verified healthy colonies`}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("NFC / RFID Tagged", "एनएफसी / आरएफआईडी टैगयुक्त")}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                100%
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Physical sensor hardware paired", "भौतिक सेंसर उपकरण लिंक किए गए")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <Radio className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tr("Latest Inspection", "नवीनतम निरीक्षण")}
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground mt-0.5">
                12 Sep 2026
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Highland North Apiary
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tr(
              "Search apiary by name, region, or flora...",
              "फार्म के नाम, क्षेत्र या पुष्प स्रोत से खोजें..."
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9.5 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>{tr("Status:", "स्थिति:")}</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9.5 rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs cursor-pointer"
          >
            <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
            <option value="active">{tr("Active", "सक्रिय")}</option>
            <option value="quarantine">{tr("Quarantine", "क्वारंटाइन")}</option>
            <option value="inactive">{tr("Inactive", "निष्क्रिय")}</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Apiary Selector + Active Apiary Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Registered Apiaries List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tr("Registered Apiaries", "पंजीकृत फार्म")} ({filteredApiaries.length})
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {tr("Click to view detail", "विवरण देखने के लिए क्लिक करें")}
            </span>
          </div>

          {filteredApiaries.length === 0 ? (
            <EmptyState
              icon={Wheat}
              title={tr("No apiaries found", "कोई फार्म नहीं मिला")}
              description={tr("No apiary locations match your current search and filter criteria.", "कोई भी फार्म आपके वर्तमान खोज मानदंडों से मेल नहीं खाता।")}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  {tr("Reset Filters", "फ़िल्टर रीसेट करें")}
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {filteredApiaries.map((apiary) => {
                const isSelected = selectedApiary?.id === apiary.id;
                return (
                  <div
                    key={apiary.id}
                    onClick={() => setSelectedApiaryId(apiary.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-border/90 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {apiary.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                          <span className="truncate">{apiary.location}</span>
                        </div>
                      </div>
                      <StatusBadge
                        status={
                          apiary.status === "active"
                            ? "success"
                            : apiary.status === "quarantine"
                            ? "warning"
                            : "neutral"
                        }
                        size="sm"
                      >
                        {apiary.status}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border/60 text-[11px]">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">
                          {tr("Hive Count", "छत्तों की संख्या")}
                        </span>
                        <span className="font-semibold text-foreground">
                          {isHindi ? `${apiary.hiveCount} छत्ते` : `${apiary.hiveCount} Hives`}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">
                          {tr("Last Inspection", "नवीनतम निरीक्षण")}
                        </span>
                        <span className="font-medium text-foreground">
                          {apiary.lastInspectionDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Apiary Detail & Hives Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedApiary ? (
            <>
              {/* Apiary Detail Identity Card */}
              <Card className="border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-foreground">
                          {selectedApiary.name}
                        </CardTitle>
                        <StatusBadge
                          status={
                            selectedApiary.status === "active"
                              ? "success"
                              : selectedApiary.status === "quarantine"
                              ? "warning"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {selectedApiary.status.toUpperCase()}
                        </StatusBadge>
                      </div>
                      <CardDescription className="text-xs mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{selectedApiary.location}</span>
                        <span>•</span>
                        <Mountain className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{tr("Elevation:", "ऊंचाई:")} {selectedApiary.elevation}</span>
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleOpenRegisterHive}
                        className="text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{tr("Register Hive", "छत्ता पंजीकृत करें")}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3.5 space-y-3.5 text-xs">
                  {/* Floral & Coordinates Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-md bg-muted/25 border border-border/70">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1">
                        <Flower2 className="h-3 w-3 text-amber-500" />
                        {tr("Dominant Floral Region", "प्रमुख वनस्पति / पुष्प क्षेत्र")}
                      </span>
                      <p className="font-medium text-foreground">
                        {selectedApiary.dominantFlora}
                      </p>
                      {selectedApiary.notes && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                          {selectedApiary.notes}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        {tr("Geo-Coordinates & Metadata", "भू-निर्देशांक एवं मेटाडेटा")}
                      </span>
                      <div className="font-mono text-[11px] text-foreground">
                        Lat: {selectedApiary.latitude.toFixed(4)}° N, Long: {selectedApiary.longitude.toFixed(4)}° E
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {tr("Registered by:", "पंजीकृतकर्ता:")} {selectedApiary.registeredBy}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        ID: {selectedApiary.id} • {selectedApiary.hiveCount} {isHindi ? "छत्ते पंजीकृत" : "colonies registered"}
                      </div>
                    </div>
                  </div>

                  {/* Hives Table Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {isHindi
                          ? `${selectedApiary.name} में छत्ते (${apiaryHives.length})`
                          : `Hives in ${selectedApiary.name} (${apiaryHives.length})`}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {tr(
                          "Colonies registered in this yard with hardware identification and health status.",
                          "इस फार्म में पंजीकृत कॉलोनियां, हार्डवेयर पहचान और स्वास्थ्य स्थिति के साथ।"
                        )}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={handleOpenRegisterHive}
                    >
                      <Plus className="h-3 w-3" />
                      <span>{tr("Add Hive", "छत्ता जोड़ें")}</span>
                    </Button>
                  </div>

                  {/* Hives Table */}
                  {apiaryHives.length === 0 ? (
                    <EmptyState
                      icon={Layers}
                      title={tr("No hives registered yet", "अभी तक कोई छत्ता पंजीकृत नहीं है")}
                      description={tr(
                        `There are currently no hives recorded for ${selectedApiary.name}. Add your first hive to start tracking colony health.`,
                        `${selectedApiary.name} के लिए अभी कोई छत्ता दर्ज नहीं है। कॉलोनी स्वास्थ्य ट्रैक करने के लिए पहला छत्ता जोड़ें।`
                      )}
                      action={
                        <Button
                          size="sm"
                          onClick={handleOpenRegisterHive}
                          className="text-xs"
                        >
                          + {tr("Register First Hive", "पहला छत्ता पंजीकृत करें")}
                        </Button>
                      }
                    />
                  ) : (
                    <div className="rounded-md border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-[140px]">{tr("Identifier", "पहचानकर्ता")}</TableHead>
                            <TableHead>{tr("Status", "स्थिति")}</TableHead>
                            <TableHead>{tr("Queen Status", "रानी की स्थिति")}</TableHead>
                            <TableHead>{tr("Last Inspection", "नवीनतम निरीक्षण")}</TableHead>
                            <TableHead className="hidden md:table-cell">{tr("Last Activity", "नवीनतम गतिविधि")}</TableHead>
                            <TableHead className="text-right">{tr("Action", "कार्रवाई")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {apiaryHives.map((hive) => (
                            <TableRow key={hive.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <Link
                                    href={`/hives/${hive.id}`}
                                    className="font-semibold text-primary hover:underline flex items-center gap-1"
                                  >
                                    <span>{hive.identifier}</span>
                                    <ExternalLink className="h-3 w-3 opacity-60" />
                                  </Link>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {hive.internalCode} • {hive.nfcRfidId}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusBadge
                                  status={
                                    hive.status === "healthy"
                                      ? "success"
                                      : hive.status === "monitoring"
                                      ? "warning"
                                      : hive.status === "treated"
                                      ? "info"
                                      : "neutral"
                                  }
                                  size="sm"
                                >
                                  {hive.status}
                                </StatusBadge>
                              </TableCell>
                              <TableCell>
                                <StatusBadge
                                  status={hive.queenStatus}
                                  size="sm"
                                >
                                  {hive.queenStatus}
                                </StatusBadge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {hive.lastInspectionDate}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[220px] truncate">
                                {hive.lastActivity}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  asChild
                                  className="text-primary hover:text-primary hover:bg-amber-50 font-medium"
                                >
                                  <Link href={`/hives/${hive.id}`}>
                                    {tr("View →", "देखें →")}
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={Wheat}
              title={tr("No apiary selected", "कोई मधुमक्खी फार्म चयनित नहीं है")}
              description={tr("Select an apiary on the left or register a new one.", "बाईं ओर से एक मधुमक्खी फार्म चुनें या नया पंजीकृत करें।")}
            />
          )}
        </div>
      </div>

      {/* Register Hive Modal Dialog */}
      <Dialog open={isRegisterHiveOpen} onOpenChange={setIsRegisterHiveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {tr("Register Hive in", "छत्ता पंजीकृत करें -")} {selectedApiary?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {tr("Bind a physical hive box to this apiary location and register hardware identification.", "इस मधुमक्खी फार्म स्थान पर एक भौतिक छत्ता बॉक्स बाइंड करें और हार्डवेयर पहचान पंजीकृत करें।")}
            </DialogDescription>
          </DialogHeader>

          {registerHiveError && (
            <div className="rounded-md bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800 font-medium">
              {registerHiveError}
            </div>
          )}

          <form onSubmit={handleSaveHive} className="space-y-3.5 text-xs pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  {tr("Hive Identifier", "छत्ता पहचानकर्ता")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hiveIdentifier}
                  onChange={(e) => setHiveIdentifier(e.target.value)}
                  placeholder="e.g. HIVE-HN-05"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  {tr("Internal Box Code", "आंतरिक बॉक्स कोड")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hiveInternalCode}
                  onChange={(e) => setHiveInternalCode(e.target.value)}
                  placeholder="e.g. BOX-2026-A05"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">{tr("Hive Type", "छत्ता प्रकार")}</label>
                <select
                  value={hiveType}
                  onChange={(e) => setHiveType(e.target.value as HiveType)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Langstroth">Langstroth</option>
                  <option value="Top-Bar">Top-Bar</option>
                  <option value="Warre">Warre</option>
                  <option value="Traditional Log">{tr("Traditional Log", "पारंपरिक लट्ठ")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">{tr("Queen Status", "रानी मधुमक्खी स्थिति")}</label>
                <select
                  value={queenStatus}
                  onChange={(e) => setQueenStatus(e.target.value as QueenStatus)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Active & Laying">{tr("Active & Laying", "सक्रिय एवं अंडे दे रही")}</option>
                  <option value="Virgin">{tr("Virgin", "कुंवारी रानी")}</option>
                  <option value="Supersedure">{tr("Supersedure", "सुपरसीड्यूर")}</option>
                  <option value="Queenless">{tr("Queenless", "रानी रहित")}</option>
                  <option value="Requeening Needed">{tr("Requeening Needed", "नई रानी की आवश्यकता")}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">{tr("Installation Date", "स्थापना तिथि")}</label>
                <input
                  type="date"
                  value={installationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">{tr("Location in Apiary", "फार्म में स्थान")}</label>
                <input
                  type="text"
                  value={locationInApiary}
                  onChange={(e) => setLocationInApiary(e.target.value)}
                  placeholder="e.g. Row 2, Stand #3"
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">
                {tr("NFC / RFID Identifier", "एनएफसी / आरएफआईडी पहचानकर्ता")}
              </label>
              <input
                type="text"
                value={nfcRfidId}
                onChange={(e) => setNfcRfidId(e.target.value)}
                placeholder="e.g. NFC-9481-HN05"
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-[10px] text-muted-foreground">
                {tr("Scanned from physical hardware tag affixed to the brood chamber.", "ब्रूड कक्ष से जुड़े भौतिक हार्डवेयर टैग से स्कैन किया गया।")}
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">{tr("Notes / Temperament", "टिप्पणियाँ / स्वभाव")}</label>
              <textarea
                rows={2}
                value={hiveNotes}
                onChange={(e) => setHiveNotes(e.target.value)}
                placeholder={tr("Colony notes, bee lineage, or initial conditions...", "कॉलोनी टिप्पणियां, मधुमक्खी वंशावली, या प्रारंभिक स्थितियां...")}
                className="w-full rounded-md border border-input bg-background p-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRegisterHiveOpen(false)}
                className="text-xs"
              >
                {tr("Cancel", "रद्द करें")}
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                {tr("Save Hive", "छत्ता सहेजें")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HivesPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Traceability", "ट्रेसेबिलिटी"), href: "#" },
          { label: tr("Hives & Apiaries", "छत्ते और मधुमक्खी फार्म"), active: true },
        ]}
        defaultNavId="apiary"
      >
        <HivesAndApiariesContent />
      </AppShell>
    </AuthGuard>
  );
}

