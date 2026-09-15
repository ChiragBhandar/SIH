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

function HivesAndApiariesContent() {
  const searchParams = useSearchParams();
  const { apiaries, hives, addHive, isLoaded } = useTraceability();

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
          Loading apiary registry...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Notification */}
      {showSuccessBanner && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300 animate-in fade-in-50">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <span className="font-semibold">Apiary registration saved.</span> You can now register hives, log field inspections, and link future honey batches.
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissedBanner(true)}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </Button>
        </div>
      )}

      {justRegisteredHiveId && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>New hive added successfully to <strong>{selectedApiary?.name}</strong>.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-7 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
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
              Hives & Apiaries
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              Traceability Layer
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage registered apiary locations, monitor colony health, and track hive assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="gap-2 shadow-xs cursor-pointer text-xs h-9">
            <Link href="/hives/new">
              <Plus className="h-4 w-4" />
              <span>Register Apiary</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Registered Apiaries
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {totalApiariesCount}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Across 2 geographical regions
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Wheat className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Monitored Hives
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {totalHivesCount}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                {healthyHivesCount} verified healthy colonies
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                NFC / RFID Tagged
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                100%
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Physical sensor hardware paired
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Radio className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card/70 border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Latest Inspection
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground mt-0.5">
                12 Sep 2026
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Highland North Apiary
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apiary by name, region, or flora..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="quarantine">Quarantine</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Apiary Selector + Active Apiary Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Registered Apiaries List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Registered Apiaries ({filteredApiaries.length})
            </h2>
            <span className="text-[11px] text-muted-foreground">Click to view detail</span>
          </div>

          {filteredApiaries.length === 0 ? (
            <EmptyState
              icon={Wheat}
              title="No apiaries found"
              description="No apiary locations match your current search and filter criteria."
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
                  Reset Filters
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
                          Hive Count
                        </span>
                        <span className="font-semibold text-foreground">
                          {apiary.hiveCount} Hives
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">
                          Last Inspection
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
                        <span>Elevation: {selectedApiary.elevation}</span>
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleOpenRegisterHive}
                        className="text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Register Hive</span>
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
                        Dominant Floral Region
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
                        Geo-Coordinates & Metadata
                      </span>
                      <div className="font-mono text-[11px] text-foreground">
                        Lat: {selectedApiary.latitude.toFixed(4)}° N, Long: {selectedApiary.longitude.toFixed(4)}° E
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Registered by: {selectedApiary.registeredBy}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        ID: {selectedApiary.id} • {selectedApiary.hiveCount} colonies registered
                      </div>
                    </div>
                  </div>

                  {/* Hives Table Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Hives in {selectedApiary.name} ({apiaryHives.length})
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Colonies registered in this yard with hardware identification and health status.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenRegisterHive}
                      className="text-xs h-7 gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Hive</span>
                    </Button>
                  </div>

                  {/* Hives Table */}
                  {apiaryHives.length === 0 ? (
                    <EmptyState
                      icon={Layers}
                      title="No hives registered yet"
                      description={`There are currently no hives recorded for ${selectedApiary.name}. Add your first hive to start tracking colony health.`}
                      action={
                        <Button
                          size="sm"
                          onClick={handleOpenRegisterHive}
                          className="text-xs"
                        >
                          + Register First Hive
                        </Button>
                      }
                    />
                  ) : (
                    <div className="rounded-md border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-[140px]">Identifier</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Queen Status</TableHead>
                            <TableHead>Last Inspection</TableHead>
                            <TableHead className="hidden md:table-cell">Last Activity</TableHead>
                            <TableHead className="text-right">Action</TableHead>
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
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] py-0 ${
                                    hive.queenStatus.includes("Active")
                                      ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                                      : hive.queenStatus === "Virgin"
                                      ? "border-sky-500/40 text-sky-600 dark:text-sky-400"
                                      : "border-amber-500/40 text-amber-600 dark:text-amber-400"
                                  }`}
                                >
                                  {hive.queenStatus}
                                </Badge>
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
                                  size="sm"
                                  asChild
                                  className="h-7 text-xs px-2 text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  <Link href={`/hives/${hive.id}`}>
                                    View →
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
              title="No apiary selected"
              description="Select an apiary on the left or register a new one."
            />
          )}
        </div>
      </div>

      {/* Register Hive Modal Dialog */}
      <Dialog open={isRegisterHiveOpen} onOpenChange={setIsRegisterHiveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Register Hive in {selectedApiary?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Bind a physical hive box to this apiary location and register hardware identification.
            </DialogDescription>
          </DialogHeader>

          {registerHiveError && (
            <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-2 text-xs text-rose-600 dark:text-rose-400">
              {registerHiveError}
            </div>
          )}

          <form onSubmit={handleSaveHive} className="space-y-3.5 text-xs pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  Hive Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hiveIdentifier}
                  onChange={(e) => setHiveIdentifier(e.target.value)}
                  placeholder="e.g. HIVE-HN-05"
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  Internal Box Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hiveInternalCode}
                  onChange={(e) => setHiveInternalCode(e.target.value)}
                  placeholder="e.g. BOX-2026-A05"
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Hive Type</label>
                <select
                  value={hiveType}
                  onChange={(e) => setHiveType(e.target.value as HiveType)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Langstroth">Langstroth</option>
                  <option value="Top-Bar">Top-Bar</option>
                  <option value="Warre">Warre</option>
                  <option value="Traditional Log">Traditional Log</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Queen Status</label>
                <select
                  value={queenStatus}
                  onChange={(e) => setQueenStatus(e.target.value as QueenStatus)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Active & Laying">Active & Laying</option>
                  <option value="Virgin">Virgin</option>
                  <option value="Supersedure">Supersedure</option>
                  <option value="Queenless">Queenless</option>
                  <option value="Requeening Needed">Requeening Needed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Installation Date</label>
                <input
                  type="date"
                  value={installationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Location in Apiary</label>
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
                NFC / RFID Identifier
              </label>
              <input
                type="text"
                value={nfcRfidId}
                onChange={(e) => setNfcRfidId(e.target.value)}
                placeholder="e.g. NFC-9481-HN05"
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-[10px] text-muted-foreground">
                Scanned from physical hardware tag affixed to the brood chamber.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Notes / Temperament</label>
              <textarea
                rows={2}
                value={hiveNotes}
                onChange={(e) => setHiveNotes(e.target.value)}
                placeholder="Colony notes, bee lineage, or initial conditions..."
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
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Save Hive
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HivesPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Traceability", href: "#" },
          { label: "Hives & Apiaries", active: true },
        ]}
        defaultNavId="apiary"
      >
        <HivesAndApiariesContent />
      </AppShell>
    </AuthGuard>
  );
}
