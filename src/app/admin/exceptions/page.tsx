"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
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
                Administration
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">Exceptions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Exceptions</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Investigate operational anomalies, rejected records, and traceability issues.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              Total Logged: {exceptions.length} Cases
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
                  Open Cases
                </span>
                <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {openCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting triage & response</p>
            </CardContent>
          </Card>

          {/* Investigating */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Investigating
                </span>
                <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {investigatingCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active root-cause trace in progress</p>
            </CardContent>
          </Card>

          {/* Resolved */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resolved
                </span>
                <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {resolvedCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Corrective actions completed</p>
            </CardContent>
          </Card>

          {/* Critical */}
          <Card className="border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Critical Severity
                </span>
                <div className="w-7 h-7 rounded-md bg-rose-100 border border-rose-300 dark:bg-rose-900/50 dark:border-rose-700 flex items-center justify-center text-rose-700 dark:text-rose-300">
                  <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 tracking-tight">
                {criticalCount}
              </div>
              <p className="text-[11px] text-rose-600/90 dark:text-rose-400/90 mt-0.5">Immediate quarantine priority</p>
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
                placeholder="Search exception ID, type, batch, actor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Type */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">All Types</option>
                  <option value="Receiving Rejection">Receiving Rejection</option>
                  <option value="Quality Rejection">Quality Rejection</option>
                  <option value="Quantity Mismatch">Quantity Mismatch</option>
                  <option value="Missing Traceability Link">Missing Traceability Link</option>
                  <option value="Suspicious Yield">Suspicious Yield</option>
                  <option value="Access Issue">Access Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Severity */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
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
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Exception ID</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Related Entity</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Reported By</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Created Date</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Severity</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredExceptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No compliance exceptions match your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExceptions.map((exc) => (
                  <TableRow key={exc.id} className="hover:bg-muted/40 transition-colors">
                    {/* Exception ID */}
                    <TableCell className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                      <Link href={`/admin/exceptions/${exc.id}`} className="hover:underline">
                        {exc.id}
                      </Link>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="font-medium text-foreground">
                      {exc.type}
                    </TableCell>

                    {/* Related Entity */}
                    <TableCell>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-medium text-foreground truncate">
                          {exc.relatedEntity.title}
                        </span>
                        <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
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
                          <span>Investigate</span>
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
