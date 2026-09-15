"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
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
    decideAccessRequest(requestId, "approved", "Standard verifiable research clearance granted.");
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
                Administration
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">Access Requests</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Access Requests</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              Review requests for restricted traceability information and administrative access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-normal">
              Total: {accessRequests.length} Requests Logged
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
                placeholder="Search requester, resource, or org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                  <option value="expired">Expired</option>
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
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Request ID</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Requester</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Organisation</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Requested Resource</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Reason</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Requested At</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    No access requests found matching the filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/40 transition-colors">
                    {/* Request ID */}
                    <TableCell className="font-mono font-semibold text-amber-700 dark:text-amber-400">
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
                          {req.requester.role} • {req.requester.email}
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
                            <span>Review</span>
                          </Link>
                        </Button>

                        {req.status === "pending" && (
                          <>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={() => handleQuickApprove(req.id)}
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40 h-7 w-7"
                              title="Approve Request"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={() => handleOpenDeny(req.id)}
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40 h-7 w-7"
                              title="Deny Request"
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
          title={`Deny Access Request ${activeRequest?.id}?`}
          description={`Provide the official justification for withholding access to "${activeRequest?.requestedResource}". This refusal decision will be immutably recorded in the Honey Chain audit ledger.`}
          confirmText="Deny Request"
          variant="danger"
          reasonPlaceholder="Enter compliance reason for access denial..."
        />
      </div>
    </AdminRoleGuard>
  );
}
