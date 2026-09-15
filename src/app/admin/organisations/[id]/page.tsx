"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, EventTypeBadge, ConfirmationModal } from "@/components/admin";
import { AdminOrgStatus } from "@/types/admin";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Ban,
  RotateCcw,
  History,
  ChevronRight,
  ShieldCheck,
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

export default function OrganisationDetailPage() {
  const params = useParams();
  const orgId = typeof params?.id === "string" ? params.id : "";

  const {
    getAdminOrganisation,
    getAuditEventsByOrg,
    updateOrganisationStatus,
  } = useTraceability();

  const org = getAdminOrganisation(orgId);
  const orgAuditEvents = getAuditEventsByOrg(orgId);

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [targetAction, setTargetAction] = React.useState<AdminOrgStatus>("Active");

  if (!org) {
    return (
      <AdminRoleGuard>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
          <Building2 className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h2 className="text-xl font-bold text-foreground">Organisation Not Found</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 mb-4">
            The requested organisation identifier ({orgId}) does not exist in the registry.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/organisations">
              &larr; Back to Organisations Directory
            </Link>
          </Button>
        </div>
      </AdminRoleGuard>
    );
  }

  const handleOpenAction = (action: AdminOrgStatus) => {
    setTargetAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = (reason: string) => {
    updateOrganisationStatus(org.id, targetAction, reason);
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Administration
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Link href="/admin/organisations" className="hover:text-foreground transition-colors">
                Organisations
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-mono font-semibold">{org.code}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{org.name}</h1>
              <StatusBadge status={org.status} variant="org" size="md" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Registered Identifier: <span className="font-mono text-amber-800 font-semibold">{org.id}</span> • Reg No: <span className="font-mono text-foreground font-medium">{org.registrationNumber}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/admin/organisations">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Organisations</span>
              </Link>
            </Button>

            {/* Action Buttons */}
            {org.status === "Pending" && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenAction("Active")}
                className="gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Organisation
              </Button>
            )}

            {org.status === "Suspended" && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenAction("Active")}
                className="gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Operational Status
              </Button>
            )}

            {org.status === "Active" && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleOpenAction("Suspended")}
                className="gap-1.5"
              >
                <Ban className="w-4 h-4" />
                Suspend Organisation
              </Button>
            )}
          </div>
        </div>

        {/* Identity & Metadata Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Identity Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Organisation Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Category / Type:</span>
                  <span className="font-semibold text-foreground">{org.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Compliance Rating:</span>
                  <span className="font-bold text-emerald-700">{org.complianceRating}% Verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Last External Audit:</span>
                  <span className="font-mono text-foreground">
                    {new Date(org.lastAuditDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Registry Date:</span>
                  <span className="font-mono text-foreground">
                    {new Date(org.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {org.notes && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Governance Notes:
                  </span>
                  <p className="text-xs text-foreground/80 mt-1 leading-relaxed bg-muted/40 p-2.5 rounded-lg border border-border">
                    {org.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Location Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact & Headquarters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5 text-foreground">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground text-[11px] block">Headquarters:</span>
                  <span className="font-medium text-foreground">{org.headquarters}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-foreground">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-muted-foreground text-[11px] block">Official Email:</span>
                  <span className="font-mono text-foreground">{org.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-foreground">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-muted-foreground text-[11px] block">Registry Phone:</span>
                  <span className="font-mono text-foreground">{org.contactPhone}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Assigned Operational Roles:
                </span>
                <div className="flex flex-wrap gap-1">
                  {org.assignedRoles.map((role, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[11px] font-medium capitalize py-0.5"
                    >
                      {role.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilities Summary */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Associated Facilities ({org.facilities.length})
                </CardTitle>
                <Layers className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {org.facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-muted/30 p-2.5 rounded-lg border border-border/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{fac.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        fac.status === "Operational"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{fac.type}</span>
                    <span>{fac.location}</span>
                  </div>
                  {fac.capacity && (
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Capacity: {fac.capacity}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Members Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold text-foreground">
              Registered Members & Key Personnel ({org.members.length})
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Personnel authorized to sign field activities, custody transfers, and lab certifications for this organisation.
            </CardDescription>
          </CardHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">Member Name</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">Official Email</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">Assigned Roles</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {org.members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-foreground font-bold text-[11px]">
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">{member.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.roles.map((r, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px] font-medium py-0 px-1.5"
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">{member.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Organisation Activity / Audit Trail */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                Immutable Audit History for {org.name}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Every administrative status change, role update, and custody event is permanently linked to the Honey Chain ledger.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {orgAuditEvents.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground text-xs">
                  No audit events recorded for this organisation yet.
                </div>
              ) : (
                orgAuditEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="py-3 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <EventTypeBadge type={evt.eventType} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{evt.action}</div>
                        <div className="text-muted-foreground mt-0.5 text-[11px]">
                          Actor: <strong className="text-foreground">{evt.actor.name}</strong> ({evt.actor.role}) • Source: {evt.source}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                        <Link href={`/admin/audit/${evt.id}`}>
                          Inspect &rarr;
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmAction}
          title={
            targetAction === "Active"
              ? `Restore/Approve "${org.name}"?`
              : `Suspend "${org.name}"?`
          }
          description={
            targetAction === "Active"
              ? "This administrative approval will be cryptographically logged to the audit ledger and restore active participation."
              : "Suspending will freeze all active batch operations while maintaining immutable history."
          }
          confirmText={targetAction === "Active" ? "Approve Organisation" : "Suspend Organisation"}
          variant={targetAction === "Active" ? "success" : "danger"}
          reasonPlaceholder="Enter reason for this administrative decision..."
        />
      </div>
    </AdminRoleGuard>
  );
}
