"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { AdminRoleGuard, StatusBadge, EventTypeBadge } from "@/components/admin";
import { AuditEventType } from "@/types/admin";
import {
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  Lock,
  ChevronRight,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EVENT_TYPE_OPTIONS: AuditEventType[] = [
  "Apiary Registered",
  "Hive Registered",
  "Activity Recorded",
  "Harvest Created",
  "Batch Created",
  "Custody Transfer",
  "Receiving",
  "Processing",
  "Laboratory Test",
  "Certification",
  "Bottle Created",
  "Bottle Published",
  "Marketplace Listing",
  "Marketplace Order",
  "Access Request",
  "Role Assignment",
  "Exception",
  "Administrative Action",
];

export default function CompleteAuditHistoryPage() {
  const { auditEvents, adminOrganisations } = useTraceability();
  const { tr, trRole, trEventType, trStatus, trTerm } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedOrg, setSelectedOrg] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const filteredEvents = React.useMemo(() => {
    return auditEvents.filter((evt) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        evt.id.toLowerCase().includes(q) ||
        evt.action.toLowerCase().includes(q) ||
        evt.actor.name.toLowerCase().includes(q) ||
        evt.organisation.name.toLowerCase().includes(q) ||
        evt.entity.id.toLowerCase().includes(q) ||
        evt.entity.title.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || evt.eventType === selectedType;
      const matchesOrg = selectedOrg === "all" || evt.organisation.id === selectedOrg;
      const matchesStatus = selectedStatus === "all" || evt.status === selectedStatus;

      return matchesSearch && matchesType && matchesOrg && matchesStatus;
    });
  }, [auditEvents, searchQuery, selectedType, selectedOrg, selectedStatus]);

  const translateSource = (source: string) => {
    switch (source) {
      case "Admin Console":
        return tr("Admin Console", "प्रशासन कंसोल");
      case "System Engine":
        return tr("System Engine", "सिस्टम इंजन");
      case "IoT Device":
        return tr("IoT Device", "IoT उपकरण");
      case "Manual Entry":
        return tr("Manual Entry", "मैन्युअल प्रविष्टि");
      default:
        return source;
    }
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                {tr("Administration", "प्रशासन")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">{tr("Audit History", "ऑडिट इतिहास")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {tr("Complete Audit History", "सम्पूर्ण ऑडिट इतिहास")}
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-emerald-200 text-emerald-800 bg-emerald-50 gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {tr("Append-Only Verified", "केवल-जोड़ने योग्य सत्यापित")}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {tr(
                "Append-only record of operational, custody, quality, commercial, and administrative events.",
                "परिचालन, कस्टडी, गुणवत्ता, वाणिज्यिक और प्रशासनिक घटनाओं का केवल-जोड़ने योग्य रिकॉर्ड।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs py-1 px-2.5 bg-card flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span><strong className="text-foreground">{auditEvents.length}</strong> {tr("Cryptographic Blocks", "क्रिप्टोग्राफिक ब्लॉक")}</span>
            </Badge>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tr("Search event ID, action, actor, entity...", "इवेंट आईडी, कार्रवाई, कर्ता, इकाई से खोजें...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Event Type Filter */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>{tr("Type:", "प्रकार:")}</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Types", "सभी प्रकार")} ({EVENT_TYPE_OPTIONS.length})</option>
                  {EVENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {trEventType(opt)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organisation Filter */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tr("Org:", "संगठन:")}</span>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Organisations", "सभी संगठन")}</option>
                  {adminOrganisations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tr("Status:", "स्थिति:")}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
                  <option value="verified">{trStatus("Verified")}</option>
                  <option value="flagged">{trStatus("Flagged")}</option>
                  <option value="corrected">{trStatus("Corrected")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Events Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Event ID", "इवेंट आईडी")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Event Type", "इवेंट प्रकार")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Actor", "कर्ता")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Organisation", "संगठन")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Entity", "इकाई")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Timestamp", "समय")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Source", "स्रोत")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Status", "स्थिति")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground text-right">{tr("Action", "कार्रवाई")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                      {tr("No audit events match your selected criteria.", "कोई ऑडिट इवेंट आपके चयनित मानदंड से मेल नहीं खाता।")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((evt) => (
                    <TableRow
                      key={evt.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      {/* Event ID */}
                      <TableCell>
                        <Link
                          href={`/admin/audit/${evt.id}`}
                          className="font-mono font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
                        >
                          {evt.id}
                        </Link>
                      </TableCell>

                      {/* Event Type */}
                      <TableCell>
                        <EventTypeBadge type={evt.eventType} />
                      </TableCell>

                      {/* Actor */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {evt.actor.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {trRole(evt.actor.role)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Organisation */}
                      <TableCell>
                        <span className="text-foreground font-medium">
                          {evt.organisation.name}
                        </span>
                      </TableCell>

                      {/* Entity */}
                      <TableCell>
                        <div className="flex flex-col max-w-[200px]">
                          <span className="font-medium text-foreground truncate">
                            {evt.entity.title}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            ID: {evt.entity.id}
                          </span>
                        </div>
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>

                      {/* Source */}
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5">
                          {translateSource(evt.source)}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={evt.status} variant="auditStatus" size="sm" />
                      </TableCell>

                      {/* Action button */}
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Link href={`/admin/audit/${evt.id}`}>
                            <span>{tr("Inspect", "निरीक्षण करें")}</span>
                            <ArrowRight className="w-3 h-3 text-amber-600" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminRoleGuard>
  );
}
