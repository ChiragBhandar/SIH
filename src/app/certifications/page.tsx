"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export function CertificationsListContent() {
  const { certifications, isLoaded } = useTraceability();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredCerts = React.useMemo(() => {
    return certifications.filter((cert) => {
      const matchesSearch =
        cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.testId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.honeyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificationType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || cert.validStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [certifications, searchQuery, statusFilter]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading issued certifications and purity seals...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Certificates of Analysis
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
              Quality Approved Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Browse cryptographic digital quality certificates issued by accredited testing laboratories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
            <Link href="/lab">
              <ShieldCheck className="h-4 w-4" />
              <span>Laboratory Testing Queue</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Certificates Card & Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Issued Quality Certifications ({certifications.length})</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Each certificate represents a complete, immutable 9-step botanical lineage verification.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Certificate, Batch, or Lab..."
                  className="w-full rounded-md border border-input bg-background/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active Valid</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredCerts.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Award}
                title="No certificates found"
                description={
                  searchQuery
                    ? "No certificates matched your search criteria."
                    : "No lab certificates have been issued yet. Approve a laboratory test to issue the first certificate."
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/lab">Go to Laboratory Testing</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-foreground">Certificate ID</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Batch ID</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Honey Variety</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Test ID</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Issued Date</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Issuing Laboratory</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-foreground">
                        <Link href={`/certifications/${cert.id}`} className="hover:underline flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                          <Award className="h-3.5 w-3.5 shrink-0" />
                          <span>{cert.id}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground">
                        <Link href={`/batches/${cert.batchNumber}`} className="hover:underline flex items-center gap-1">
                          <span>{cert.batchNumber}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60" />
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {cert.honeyType}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <Link href={`/lab/${cert.testId}`} className="hover:underline">
                          {cert.testId}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {cert.issuedDate}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="truncate max-w-[200px] block" title={cert.issuedBy}>
                          {cert.issuedBy}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 text-[11px] font-semibold"
                        >
                          Quality Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Link href={`/certifications/${cert.id}`}>
                            <span>View Certificate</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
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
    </div>
  );
}

export default function CertificationsPage() {
  return (
    <AuthGuard>
      <AppShell>
        <CertificationsListContent />
      </AppShell>
    </AuthGuard>
  );
}
