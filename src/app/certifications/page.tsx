"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
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
  const { tr, trStatus } = useLanguage();
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
          {tr("Loading issued certifications and purity seals...", "जारी किए गए प्रमाणपत्र व शुद्धता सील लोड हो रहे हैं...")}
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
              {tr("Certificates of Analysis", "विश्लेषण प्रमाणपत्र (CoA)")}
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-emerald-200 text-emerald-800 bg-emerald-50">
              {tr("Quality Approved Records", "गुणवत्ता अनुमोदित रिकॉर्ड")}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tr(
              "Browse cryptographic digital quality certificates issued by accredited testing laboratories.",
              "मान्यता प्राप्त परीक्षण प्रयोगशालाओं द्वारा जारी क्रिप्टोग्राफिक डिजिटल गुणवत्ता प्रमाणपत्र देखें।"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2 text-xs">
            <Link href="/lab">
              <ShieldCheck className="h-4 w-4" />
              <span>{tr("Laboratory Testing Queue", "प्रयोगशाला परीक्षण कतार")}</span>
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
                <Award className="h-4 w-4 text-emerald-600" />
                <span>{tr("Issued Quality Certifications", "जारी गुणवत्ता प्रमाणपत्र")} ({certifications.length})</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {tr(
                  "Each certificate represents a complete, immutable 9-step botanical lineage verification.",
                  "प्रत्येक प्रमाणपत्र पूर्ण, अपरिवर्तनीय 9-चरणीय वानस्पतिक वंशावली सत्यापन का प्रतिनिधित्व करता है।"
                )}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tr("Search Certificate, Batch, or Lab...", "प्रमाणपत्र, बैच या लैब खोजें...")}
                  className="w-full rounded-md border border-input bg-background/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-input bg-background/50 px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              >
                <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
                <option value="Active">{tr("Active Valid", "सक्रिय मान्य")}</option>
                <option value="Suspended">{tr("Suspended", "निलंबित")}</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredCerts.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Award}
                title={tr("No certificates found", "कोई प्रमाणपत्र नहीं मिला")}
                description={
                  searchQuery
                    ? tr("No certificates matched your search criteria.", "खोज से मेल खाता कोई प्रमाणपत्र नहीं मिला।")
                    : tr(
                        "No lab certificates have been issued yet. Approve a laboratory test to issue the first certificate.",
                        "अभी तक कोई लैब प्रमाणपत्र जारी नहीं किया गया है। पहला प्रमाणपत्र जारी करने के लिए परीक्षण स्वीकृत करें।"
                      )
                }
                action={
                  <Button asChild size="sm">
                    <Link href="/lab">{tr("Go to Laboratory Testing", "प्रयोगशाला परीक्षण पर जाएं")}</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Certificate ID", "प्रमाणपत्र आईडी")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Batch ID", "बैच आईडी")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Honey Variety", "शहद किस्म")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Test ID", "परीक्षण आईडी")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Issued Date", "जारी तिथि")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Issuing Laboratory", "जारीकर्ता प्रयोगशाला")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground">{tr("Status", "स्थिति")}</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground text-right">{tr("Action", "कार्रवाई")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-foreground">
                        <Link href={`/certifications/${cert.id}`} className="hover:underline flex items-center gap-1.5 text-emerald-700">
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
                          className="border-emerald-200 text-emerald-800 bg-emerald-50 text-[11px] font-semibold"
                        >
                          {tr("Quality Approved", "गुणवत्ता अनुमोदित")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="xs" variant="success">
                          <Link href={`/certifications/${cert.id}`}>
                            <span>{tr("View Certificate", "प्रमाणपत्र देखें")}</span>
                            <ArrowRight className="h-3 w-3" />
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
  const { tr } = useLanguage();
  return (
    <AuthGuard>
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Certificates of Analysis", "विश्लेषण प्रमाणपत्र"), active: true },
        ]}
        defaultNavId="certifications"
      >
        <CertificationsListContent />
      </AppShell>
    </AuthGuard>
  );
}
