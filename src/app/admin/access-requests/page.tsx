"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
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
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronRight,
} from "lucide-react";

export default function AccessRequestsListPage() {
  const { accessRequests, decideAccessRequest } = useTraceability();
  const { tr, trStatus, trRole } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Deny Modal State
  const [denyModalOpen, setDenyModalOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);

  const activeRequest = accessRequests.find((r) => r.id === selectedRequestId);

  const filteredRequests = React.useMemo(() => {
    return accessRequests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.id.toLowerCase().includes(q) ||
        req.requester.name.toLowerCase().includes(q) ||
        req.organisation.toLowerCase().includes(q) ||
        req.requestedResource.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === "all" || req.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [accessRequests, searchQuery, selectedStatus]);

  const handleQuickApprove = (requestId: string) => {
    decideAccessRequest(
      requestId,
      "approved",
      tr("Standard verifiable research clearance granted.", "मानक सत्यापन योग्य अनुसंधान मंजूरी प्रदान की गई।")
    );
  };

  const handleOpenDeny = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDenyModalOpen(true);
  };

  const handleConfirmDeny = (reason: string) => {
    if (selectedRequestId) {
      decideAccessRequest(selectedRequestId, "denied", reason);
    }
  };

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
              <span className="text-foreground font-semibold">{tr("Access Requests", "एक्सेस अनुरोध")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {tr("Access Requests", "एक्सेस अनुरोध")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {tr(
                "Review requests for restricted traceability information and administrative access.",
                "प्रतिबंधित ट्रेसेबिलिटी जानकारी और प्रशासनिक पहुंच के अनुरोधों की समीक्षा करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              {tr("Total:", "कुल:")} {accessRequests.length} {tr("Requests Logged", "अनुरोध दर्ज")}
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
                placeholder={tr("Search requester, resource, or org...", "अनुरोधकर्ता, संसाधन, या संगठन से खोजें...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>{tr("Status:", "स्थिति:")}</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Statuses", "सभी स्थितियां")}</option>
                  <option value="pending">{trStatus("Pending Review")}</option>
                  <option value="approved">{trStatus("Approved")}</option>
                  <option value="denied">{trStatus("Denied") || tr("Denied", "अस्वीकृत")}</option>
                  <option value="expired">{trStatus("Expired")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Requests Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Request ID", "अनुरोध आईडी")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Requester", "अनुरोधकर्ता")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Organisation", "संगठन")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Requested Resource", "अनुरोधित संसाधन")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Reason", "कारण")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Requested At", "अनुरोध समय")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{tr("Status", "स्थिति")}</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">{tr("Action", "कार्रवाई")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    {tr("No access requests found matching the filters.", "फ़िल्टर से मेल खाता कोई एक्सेस अनुरोध नहीं मिला।")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/40 transition-colors">
                    {/* Request ID */}
                    <TableCell className="font-mono font-semibold text-amber-700">
                      <Link
                        href={`/admin/access-requests/${req.id}`}
                        className="hover:underline"
                      >
                        {req.id}
                      </Link>
                    </TableCell>

                    {/* Requester */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {req.requester.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {trRole(req.requester.role)} • {req.requester.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* Organisation */}
                    <TableCell className="text-foreground font-medium">
                      {req.organisation}
                    </TableCell>

                    {/* Requested Resource */}
                    <TableCell className="max-w-xs">
                      <span className="font-medium text-foreground line-clamp-2">
                        {req.requestedResource}
                      </span>
                    </TableCell>

                    {/* Reason */}
                    <TableCell className="max-w-xs">
                      <span className="text-muted-foreground text-[11px] line-clamp-2">
                        {req.reason}
                      </span>
                    </TableCell>

                    {/* Requested At */}
                    <TableCell className="text-muted-foreground font-mono text-[11px]">
                      {new Date(req.requestedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={req.status} variant="accessStatus" />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          asChild
                          size="xs"
                          variant="secondary"
                          className="h-7 text-xs font-medium"
                        >
                          <Link href={`/admin/access-requests/${req.id}`}>
                            <Eye className="w-3.5 h-3.5 mr-1 text-primary" />
                            <span>{tr("Review", "समीक्षा")}</span>
                          </Link>
                        </Button>

                        {req.status === "pending" && (
                          <>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={() => handleQuickApprove(req.id)}
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-7 w-7"
                              title={tr("Approve Request", "अनुरोध स्वीकृत करें")}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={() => handleOpenDeny(req.id)}
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 h-7 w-7"
                              title={tr("Deny Request", "अनुरोध अस्वीकृत करें")}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Deny Confirmation Modal */}
        <ConfirmationModal
          isOpen={denyModalOpen}
          onClose={() => setDenyModalOpen(false)}
          onConfirm={handleConfirmDeny}
          title={tr(`Deny Access Request ${activeRequest?.id}?`, `एक्सेस अनुरोध ${activeRequest?.id} अस्वीकार करें?`)}
          description={tr(
            `Provide the official justification for withholding access to "${activeRequest?.requestedResource}". This refusal decision will be immutably recorded in the Honey Chain audit ledger.`,
            `"${activeRequest?.requestedResource}" तक पहुंच रोकने के लिए आधिकारिक औचित्य प्रदान करें। यह निर्णय हनी चेन ऑडिट लेजर में स्थायी रूप से दर्ज किया जाएगा।`
          )}
          confirmText={tr("Deny Request", "अनुरोध अस्वीकृत करें")}
          variant="danger"
          reasonPlaceholder={tr("Enter compliance reason for access denial...", "पहुंच अस्वीकृति के लिए अनुपालन कारण दर्ज करें...")}
        />
      </div>
    </AdminRoleGuard>
  );
}
