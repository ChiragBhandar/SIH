"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import {
  PackageCheck,
  Boxes,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ChevronRight,
  ExternalLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

function ReceivingContent() {
  const { custodyTransfers, isLoaded } = useTraceability();
  const { selectedOrg, switchOrganisation } = useAuthSession();
  const { tr, isHindi, trStatus } = useLanguage();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [tabFilter, setTabFilter] = React.useState<"awaiting" | "all" | "accepted" | "rejected">("awaiting");

  // Inbound transfers targeting the currently selected organisation
  const incomingTransfers = React.useMemo(() => {
    return custodyTransfers.filter((t) => {
      if (!selectedOrg) return true;
      return t.destinationOrgId === selectedOrg.id;
    });
  }, [custodyTransfers, selectedOrg]);

  const filteredTransfers = React.useMemo(() => {
    return incomingTransfers.filter((transfer) => {
      const matchesSearch =
        transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.sourceOrgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.transportRef.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (tabFilter === "awaiting") {
        return transfer.status === "Pending Acceptance";
      }
      if (tabFilter === "accepted") {
        return transfer.status === "Accepted";
      }
      if (tabFilter === "rejected") {
        return transfer.status === "Rejected";
      }
      return true;
    });
  }, [incomingTransfers, searchTerm, tabFilter]);

  const stats = React.useMemo(() => {
    const total = incomingTransfers.length;
    const awaiting = incomingTransfers.filter((t) => t.status === "Pending Acceptance").length;
    const accepted = incomingTransfers.filter((t) => t.status === "Accepted").length;
    const rejected = incomingTransfers.filter((t) => t.status === "Rejected").length;
    const totalWeight = incomingTransfers
      .filter((t) => t.status === "Accepted" || t.status === "Pending Acceptance")
      .reduce((sum, t) => sum + (Number(t.quantityKg) || 0), 0);
    return { total, awaiting, accepted, rejected, totalWeight };
  }, [incomingTransfers]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading manufacturer receiving queue...", "निर्माता प्राप्ति कतार लोड हो रही है...")}
        </div>
      </div>
    );
  }

  const isManufacturer = selectedOrg?.type === "processor" || selectedOrg?.id === "org-ghf-02";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <PackageCheck className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {tr("Manufacturer Receiving", "निर्माता प्राप्ति व आवक")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Intake inspection, physical weight verification, and acceptance of raw honey consignments.",
              "कच्चे शहद की खेपों का आवक निरीक्षण, भौतिक वजन सत्यापन और ब्लॉकचेन स्वीकृति।"
            )}
          </p>
        </div>

        {/* Organisation Context Switcher Tip if not manufacturer */}
        {!isManufacturer && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs">
            <span className="text-amber-800 font-medium">
              {tr("Active Org:", "सक्रिय संस्था:")} {selectedOrg?.name}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-amber-300 text-amber-900 hover:bg-amber-100 bg-white"
              onClick={() => switchOrganisation("org-ghf-02")}
            >
              {tr("Switch to Golden Hive Foods →", "गोल्डन हाइव फूड्स पर जाएं →")}
            </Button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Awaiting Receipt", "प्राप्ति हेतु प्रतीक्षारत")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {stats.awaiting}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Requires intake inspection", "आवक निरीक्षण आवश्यक")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Accepted Into Plant", "संयंत्र में स्वीकृत")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {stats.accepted}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Verified & ready for processing", "सत्यापित और प्रसंस्करण हेतु तैयार")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Rejected / Flagged", "अस्वीकृत / चिह्नित")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {stats.rejected}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Non-compliant shipments", "गैर-अनुपालक खेप")}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {tr("Inbound Raw Volume", "आवक कच्चा आयतन")}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-2">
              {stats.totalWeight.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{tr("kg", "किग्रा")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {tr("Total consignment intake", "कुल खेप आवक")}
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tr("Search incoming batch or supplier...", "आवक बैच या आपूर्तिकर्ता खोजें...")}
            className="pl-8 h-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "awaiting", label: `${tr("Awaiting Receipt", "प्राप्ति प्रतीक्षारत")} (${stats.awaiting})` },
            { id: "all", label: `${tr("All Inbound", "सभी आवक")} (${stats.total})` },
            { id: "accepted", label: `${tr("Accepted", "स्वीकृत")} (${stats.accepted})` },
            { id: "rejected", label: `${tr("Rejected", "अस्वीकृत")} (${stats.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabFilter(tab.id as typeof tabFilter)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                tabFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Incoming Transports Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Incoming Batch ID", "आवक बैच आईडी")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Source Supplier", "स्रोत आपूर्तिकर्ता")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Origin Apiary", "मूल मधुमक्खी शाला")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">{tr("Transferred Weight", "हस्तांतरित वजन")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Carrier / Ref", "वाहक / संदर्भ")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Dispatch Date", "प्रेषण तिथि")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold">{tr("Receiving Status", "प्राप्ति स्थिति")}</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">{tr("Intake Action", "आवक कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <EmptyState
                      icon={PackageCheck}
                      title={tr("No incoming shipments found", "कोई आवक खेप नहीं मिली")}
                      description={
                        !isManufacturer
                          ? tr(
                              `Currently viewing as "${selectedOrg?.name}". Switch active organisation to Golden Hive Foods to review inbound manufacturer shipments.`,
                              `वर्तमान में "${selectedOrg?.name}" के रूप में देख रहे हैं। आवक निर्माता खेपों की समीक्षा के लिए गोल्डन हाइव फूड्स पर स्विच करें।`
                            )
                          : tr("No shipments currently in queue matching your filter criteria.", "आपके फ़िल्टर से मेल खाती कोई खेप कतार में नहीं है।")
                      }
                      action={
                        !isManufacturer ? (
                          <Button
                            size="sm"
                            onClick={() => switchOrganisation("org-ghf-02")}
                          >
                            {tr("Switch to Golden Hive Foods", "गोल्डन हाइव फूड्स पर स्विच करें")}
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => {
                  const isPending = transfer.status === "Pending Acceptance";

                  return (
                    <TableRow key={transfer.id} className="group">
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        <Link
                          href={`/batches/${transfer.batchId}`}
                          className="hover:underline flex items-center gap-1.5 text-primary"
                        >
                          <Boxes className="h-3.5 w-3.5 shrink-0" />
                          <span>{transfer.batchId}</span>
                        </Link>
                        <span className="text-[10px] text-muted-foreground block font-sans font-normal mt-0.5">
                          {transfer.honeyType}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[170px]">
                            {transfer.sourceOrgName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {transfer.sourceApiaryName}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-right font-bold text-foreground">
                        {transfer.quantityKg.toFixed(1)} {tr("kg", "किग्रा")}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {transfer.transportRef}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {transfer.transferDate}
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          status={
                            transfer.status === "Accepted"
                              ? "success"
                              : transfer.status === "Pending Acceptance"
                              ? "honey"
                              : "error"
                          }
                          size="sm"
                        >
                          {transfer.status === "Pending Acceptance"
                            ? tr("Awaiting Receipt", "प्राप्ति प्रतीक्षारत")
                            : trStatus(transfer.status)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="text-right">
                        {isPending ? (
                          <Button
                            asChild
                            size="xs"
                          >
                            <Link href={`/receiving/${transfer.id}`}>
                              <span>{tr("Review & Receive", "समीक्षा और प्राप्त करें")}</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="xs"
                            asChild
                            className="text-primary hover:text-primary font-medium"
                          >
                            <Link href={`/receiving/${transfer.id}`}>
                              <span>{tr("View Intake", "आवक देखें")}</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function ReceivingPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Receiving", "प्राप्ति"), active: true },
        ]}
        defaultNavId="receiving"
      >
        <ReceivingContent />
      </AppShell>
    </AuthGuard>
  );
}
