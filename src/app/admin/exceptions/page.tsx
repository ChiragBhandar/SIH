"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { AdminRoleGuard, StatusBadge } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Eye,
  ChevronRight,
} from "lucide-react";

export default function ExceptionsListPage() {
  const { exceptions } = useTraceability();
  const { tr, trTerm, trStatus } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Summary card counts
  const openCount = exceptions.filter((e) => e.status === "open").length;
  const investigatingCount = exceptions.filter((e) => e.status === "investigating").length;
  const resolvedCount = exceptions.filter((e) => e.status === "resolved").length;
  const criticalCount = exceptions.filter(
    (e) => (e.status === "open" || e.status === "investigating") && e.severity === "critical"
  ).length;

  const translateExceptionType = (t: string) => {
    switch (t) {
      case "Receiving Rejection":
        return tr("Receiving Rejection", "आवक अस्वीकृति");
      case "Quality Rejection":
        return tr("Quality Rejection", "गुणवत्ता अस्वीकृति");
      case "Quantity Mismatch":
        return tr("Quantity Mismatch", "मात्रा बेमेल");
      case "Missing Traceability Link":
        return tr("Missing Traceability Link", "लापता ट्रेसेबिलिटी लिंक");
      case "Suspicious Yield":
        return tr("Suspicious Yield", "संदिग्ध उपज");
      case "Access Issue":
        return tr("Access Issue", "पहुंच समस्या");
      case "Other":
        return tr("Other", "अन्य");
      default:
        return t;
    }
  };

  const filteredExceptions = React.useMemo(() => {
    return exceptions.filter((exc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        exc.id.toLowerCase().includes(q) ||
        exc.type.toLowerCase().includes(q) ||
        exc.description.toLowerCase().includes(q) ||
        exc.reportedBy.name.toLowerCase().includes(q) ||
        exc.reportedBy.organisation.toLowerCase().includes(q) ||
        exc.relatedEntity.id.toLowerCase().includes(q) ||
        exc.relatedEntity.title.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || exc.type === selectedType;
      const matchesSeverity = selectedSeverity === "all" || exc.severity === selectedSeverity;
      const matchesStatus = selectedStatus === "all" || exc.status === selectedStatus;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [exceptions, searchQuery, selectedType, selectedSeverity, selectedStatus]);

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
              <span className="text-foreground font-semibold">{tr("Exceptions", "अपवाद")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {tr("Exceptions", "अपवाद")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {tr(
                "Investigate operational anomalies, rejected records, and traceability issues.",
                "परिचालन विसंगतियों, अस्वीकृत रिकॉर्ड और ट्रेसेबिलिटी समस्याओं की जांच करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              {tr("Total Logged:", "कुल दर्ज:")} {exceptions.length} {tr("Cases", "मामले")}
            </Badge>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Open */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {tr("Open Cases", "सक्रिय मामले")}
                </span>
                <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {openCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Awaiting triage & response", "समीक्षा एवं प्रतिक्रिया की प्रतीक्षा")}
              </p>
            </CardContent>
          </Card>

          {/* Investigating */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {tr("Investigating", "जांच जारी")}
                </span>
                <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {investigatingCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Active root-cause trace in progress", "सक्रिय मूल-कारण ट्रेसिंग प्रगति पर")}
              </p>
            </CardContent>
          </Card>

          {/* Resolved */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {tr("Resolved", "समाधानित")}
                </span>
                <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {resolvedCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tr("Corrective actions completed", "सुधारात्मक कार्रवाई पूर्ण")}
              </p>
            </CardContent>
          </Card>

          {/* Critical */}
          <Card className="border-rose-200 bg-rose-50/30 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                  {tr("Critical Severity", "अति गंभीर")}
                </span>
                <div className="w-7 h-7 rounded-md bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                  <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-700 tracking-tight">
                {criticalCount}
              </div>
              <p className="text-[11px] text-rose-600/90 mt-0.5">
                {tr("Immediate quarantine priority", "तत्काल क्वारंटाइन प्राथमिकता")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tr("Search exception ID, type, batch, actor...", "अपवाद आईडी, प्रकार, बैच, कर्ता से खोजें...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Type */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>{tr("Type:", "प्रकार:")}</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">{tr("All Types", "सभी प्रकार")}</option>
                  <option value="Receiving Rejection">{translateExceptionType("Receiving Rejection")}</option>
                  <option value="Quality Rejection">{translateExceptionType("Quality Rejection")}</option>
                  <option value="Quantity Mismatch">{translateExceptionType("Quantity Mismatch")}</option>
                  <option value="Missing Traceability Link">{translateExceptionType("Missing Traceability Link")}</option>
                  <option value="Suspicious Yield">{translateExceptionType("Suspicious Yield")}</option>
                  <option value="Access Issue">{translateExceptionType("Access Issue")}</option>
                  <option value="Other">{translateExceptionType("Other")}</option>
                </select>
              </div>

              {/* Severity */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{tr("Severity:", "गंभीरता:")}</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">{tr("All Severities", "सभी गंभीरता स्तर")}</option>
                  <option value="low">{tr("Low", "निम्न")}</option>
                  <option value="medium">{tr("Medium", "मध्यम")}</option>
                  <option value="high">{tr("High", "उच्च")}</option>
                  <option value="critical">{tr("Critical", "गंभीर")}</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{tr("Status:", "स्थिति:")}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
                  <option value="open">{trStatus("Open")}</option>
                  <option value="investigating">{trStatus("Investigating")}</option>
                  <option value="resolved">{trStatus("Resolved")}</option>
                  <option value="dismissed">{trStatus("Dismissed")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exceptions Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Exception ID", "अपवाद आईडी")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Type", "प्रकार")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Related Entity", "संबंधित इकाई")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Reported By", "रिपोर्टकर्ता")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Created Date", "दर्ज तिथि")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Severity", "गंभीरता")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Status", "स्थिति")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">{tr("Action", "कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredExceptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    {tr("No compliance exceptions match your filter criteria.", "कोई अनुपालन अपवाद आपके फ़िल्टर मानदंड से मेल नहीं खाता।")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExceptions.map((exc) => (
                  <TableRow key={exc.id} className="hover:bg-muted/40 transition-colors">
                    {/* Exception ID */}
                    <TableCell className="font-mono font-semibold text-rose-600">
                      <Link href={`/admin/exceptions/${exc.id}`} className="hover:underline">
                        {exc.id}
                      </Link>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="font-medium text-foreground">
                      {translateExceptionType(exc.type)}
                    </TableCell>

                    {/* Related Entity */}
                    <TableCell>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-medium text-foreground truncate">
                          {exc.relatedEntity.title}
                        </span>
                        <span className="font-mono text-[10px] text-amber-700 font-medium">
                          {exc.relatedEntity.id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Reported By */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {exc.reportedBy.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {exc.reportedBy.organisation}
                        </span>
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-muted-foreground font-mono text-[11px]">
                      {new Date(exc.createdDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    {/* Severity */}
                    <TableCell>
                      <StatusBadge status={exc.severity} variant="severity" />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={exc.status} variant="exceptionStatus" />
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs gap-1.5 font-medium"
                      >
                        <Link href={`/admin/exceptions/${exc.id}`}>
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>{tr("Investigate", "जांच करें")}</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminRoleGuard>
  );
}
