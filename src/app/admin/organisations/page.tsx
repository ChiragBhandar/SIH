"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import { AdminOrgStatus } from "@/types/admin";
import {
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Eye,
  MapPin,
  Users,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOrganisationsPage() {
  const { adminOrganisations, updateOrganisationStatus } = useTraceability();
  const { tr, trOrgType, trStatus } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Confirmation Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [targetOrgId, setTargetOrgId] = React.useState<string | null>(null);
  const [targetAction, setTargetAction] = React.useState<AdminOrgStatus>("Active");

  const targetOrg = adminOrganisations.find((o) => o.id === targetOrgId);

  const filteredOrgs = React.useMemo(() => {
    return adminOrganisations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || org.type === selectedType;
      const matchesStatus = selectedStatus === "all" || org.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [adminOrganisations, searchQuery, selectedType, selectedStatus]);

  const handleOpenAction = (orgId: string, action: AdminOrgStatus) => {
    setTargetOrgId(orgId);
    setTargetAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = (reason: string) => {
    if (targetOrgId) {
      updateOrganisationStatus(targetOrgId, targetAction, reason);
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
              <span className="text-foreground font-semibold">{tr("Organisations", "संगठन")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {tr("Organisations Registry", "संगठन रजिस्ट्री")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {tr(
                "Registry of verified beekeeper cooperatives, manufacturers, laboratories, distributors, and statutory governance authorities.",
                "सत्यापित मधुमक्खी पालन सहकारी समितियों, विनिर्माताओं, प्रयोगशालाओं, वितरकों और वैधानिक शासन प्राधिकरणों की रजिस्ट्री।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs py-1 px-2.5 bg-card">
              {tr("Total:", "कुल:")} <strong className="ml-1 text-foreground">{adminOrganisations.length}</strong> {tr("Entities", "संस्थाएं")}
            </Badge>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tr("Search name, code, ID or reg number...", "नाम, कोड, आईडी या पंजीकरण संख्या से खोजें...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>{tr("Type:", "प्रकार:")}</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Types", "सभी प्रकार")}</option>
                  <option value="Beekeeper Cooperative">{tr("Beekeeper Cooperative", "मधुमक्खी पालन सहकारी समिति")}</option>
                  <option value="Manufacturer">{tr("Manufacturer", "निर्माता")}</option>
                  <option value="Laboratory">{tr("Laboratory", "प्रयोगशाला")}</option>
                  <option value="Buyer">{tr("Buyer / Distributor", "खरीदार / वितरक")}</option>
                  <option value="Administrator">{tr("Administrator / Regulator", "प्रशासक / नियामक")}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tr("Status:", "स्थिति:")}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
                  <option value="Active">{trStatus("Active")}</option>
                  <option value="Pending">{trStatus("Pending")}</option>
                  <option value="Suspended">{trStatus("Suspended")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organisations Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Organisation ID", "संगठन आईडी")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Organisation Name", "संगठन का नाम")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Type", "प्रकार")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Status", "स्थिति")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Members", "सदस्य")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Created Date", "पंजीकरण तिथि")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground text-right">{tr("Actions", "कार्रवाई")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      {tr("No organisations match your search filters.", "आपके खोज फ़िल्टर से कोई संगठन मेल नहीं खाता।")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org) => (
                    <TableRow
                      key={org.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      {/* ID & Code */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-amber-800">
                            {org.id}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                            {tr("CODE:", "कोड:")} {org.code}
                          </span>
                        </div>
                      </TableCell>

                      {/* Name & Location */}
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/organisations/${org.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                          >
                            {org.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            {org.headquarters}
                          </span>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-medium border border-border">
                          {trOrgType(org.type)}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={org.status} variant="org" size="sm" />
                      </TableCell>

                      {/* Members */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{org.membersCount}</span>
                        </div>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="text-muted-foreground font-mono">
                        {new Date(org.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                            title={tr("View Detail", "विवरण देखें")}
                          >
                            <Link href={`/admin/organisations/${org.id}`}>
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>{tr("View", "देखें")}</span>
                            </Link>
                          </Button>

                          {org.status !== "Active" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAction(org.id, "Active")}
                              className="h-7 px-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              title={tr("Approve / Restore Organisation", "संगठन स्वीकृत / बहाल करें")}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              <span>{tr("Approve", "स्वीकृत करें")}</span>
                            </Button>
                          )}

                          {org.status !== "Suspended" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAction(org.id, "Suspended")}
                              className="h-7 px-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                              title={tr("Suspend Organisation", "संगठन निलंबित करें")}
                            >
                              <Ban className="w-3.5 h-3.5 mr-1" />
                              <span>{tr("Suspend", "निलंबित करें")}</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            targetAction === "Active"
              ? tr(`Approve & Activate "${targetOrg?.name}"?`, `"${targetOrg?.name}" को स्वीकृत एवं सक्रिय करें?`)
              : tr(`Suspend "${targetOrg?.name}"?`, `"${targetOrg?.name}" को निलंबित करें?`)
          }
          description={
            targetAction === "Active"
              ? tr(
                  "This will restore full operational participation and custody transfer authorizations for this organisation across the Honey Chain network.",
                  "यह हनी चेन नेटवर्क पर इस संगठन के लिए पूर्ण परिचालन भागीदारी और कस्टडी ट्रांसफर प्राधिकरणों को बहाल करेगा।"
                )
              : tr(
                  "Suspending this organisation will temporarily freeze new batch declarations, custody dispatches, and marketplace listings while preserving all historical traceability data.",
                  "इस संगठन को निलंबित करने से सभी ऐतिहासिक ट्रेसेबिलिटी डेटा को सुरक्षित रखते हुए नए बैच घोषणाओं, कस्टडी प्रेषण और मार्केटप्लेस लिस्टिंग पर अस्थायी रोक लग जाएगी।"
                )
          }
          confirmText={
            targetAction === "Active"
              ? tr("Approve Organisation", "संगठन स्वीकृत करें")
              : tr("Suspend Organisation", "संगठन निलंबित करें")
          }
          variant={targetAction === "Active" ? "success" : "danger"}
          reasonPlaceholder={
            targetAction === "Active"
              ? tr("E.g. Completed on-site compliance audit and verified cleanroom registration.", "उदा. ऑन-साइट अनुपालन ऑडिट पूरा किया और सत्यापन किया।")
              : tr("E.g. Pending investigation into batch discrepancy report EXC-2026-005.", "उदा. बैच विसंगति रिपोर्ट EXC-2026-005 की जांच लंबित है।")
          }
        />
      </div>
    </AdminRoleGuard>
  );
}
