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
} from "lucide-react";

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
          <Building2 className="w-12 h-12 text-stone-600 mb-3" />
          <h2 className="text-xl font-bold text-stone-200">Organisation Not Found</h2>
          <p className="text-stone-400 text-sm mt-1 mb-4">
            The requested organisation identifier ({orgId}) does not exist in the registry.
          </p>
          <Link
            href="/admin/organisations"
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold"
          >
            &larr; Back to Organisations Directory
          </Link>
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
      <div className="space-y-8 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Administration
              </Link>
              <span>/</span>
              <Link href="/admin/organisations" className="hover:text-amber-400 transition-colors">
                Organisations
              </Link>
              <span>/</span>
              <span className="text-stone-300 font-mono">{org.code}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight">{org.name}</h1>
              <StatusBadge status={org.status} variant="org" size="lg" />
            </div>
            <p className="text-stone-400 text-sm mt-1">
              Registered Identifier: <span className="font-mono text-amber-400 font-semibold">{org.id}</span> • Reg No: <span className="font-mono text-stone-300">{org.registrationNumber}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/organisations"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Organisations
            </Link>

            {/* Action Buttons */}
            {org.status === "Pending" && (
              <button
                type="button"
                onClick={() => handleOpenAction("Active")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Organisation
              </button>
            )}

            {org.status === "Suspended" && (
              <button
                type="button"
                onClick={() => handleOpenAction("Active")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Operational Status
              </button>
            )}

            {org.status === "Active" && (
              <button
                type="button"
                onClick={() => handleOpenAction("Suspended")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950 transition-all"
              >
                <Ban className="w-4 h-4" />
                Suspend Organisation
              </button>
            )}
          </div>
        </div>

        {/* Identity & Metadata Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Organisation Profile
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-800/60">
                <span className="text-stone-400">Category / Type:</span>
                <span className="font-semibold text-stone-200">{org.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800/60">
                <span className="text-stone-400">Compliance Rating:</span>
                <span className="font-bold text-emerald-400">{org.complianceRating}% Verified</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800/60">
                <span className="text-stone-400">Last External Audit:</span>
                <span className="font-mono text-stone-300">
                  {new Date(org.lastAuditDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-800/60">
                <span className="text-stone-400">Registry Date:</span>
                <span className="font-mono text-stone-300">
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
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Governance Notes:
                </span>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                  {org.notes}
                </p>
              </div>
            )}
          </div>

          {/* Contact & Location Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Contact & Headquarters
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 text-[11px] block">Headquarters:</span>
                  <span className="font-medium text-stone-200">{org.headquarters}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-stone-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-stone-400 text-[11px] block">Official Email:</span>
                  <span className="font-mono text-stone-200">{org.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-stone-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-stone-400 text-[11px] block">Registry Phone:</span>
                  <span className="font-mono text-stone-200">{org.contactPhone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Assigned Operational Roles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {org.assignedRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium capitalize"
                  >
                    {role.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Facilities Summary */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Associated Facilities ({org.facilities.length})
              </h3>
              <Layers className="w-4 h-4 text-stone-500" />
            </div>

            <div className="space-y-3">
              {org.facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-200">{fac.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        fac.status === "Operational"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between">
                    <span>{fac.type}</span>
                    <span>{fac.location}</span>
                  </div>
                  {fac.capacity && (
                    <div className="text-[10px] text-stone-500 font-mono">
                      Capacity: {fac.capacity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-100">
                Registered Members & Key Personnel ({org.members.length})
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Personnel authorized to sign field activities, custody transfers, and lab certifications for this organisation.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Official Email</th>
                  <th className="py-2.5 px-3">Assigned Roles</th>
                  <th className="py-2.5 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {org.members.map((member) => (
                  <tr key={member.id} className="hover:bg-stone-800/30">
                    <td className="py-3 px-3 font-semibold text-stone-200 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                    </td>
                    <td className="py-3 px-3 text-stone-400 font-mono">{member.email}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {member.roles.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-400 font-mono">{member.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Organisation Activity / Audit Trail */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                Immutable Audit History for {org.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Every administrative status change, role update, and custody event is permanently linked to the Honey Chain ledger.
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-800/60">
            {orgAuditEvents.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs">
                No audit events recorded for this organisation yet.
              </div>
            ) : (
              orgAuditEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <EventTypeBadge type={evt.eventType} />
                    </div>
                    <div>
                      <div className="font-semibold text-stone-200">{evt.action}</div>
                      <div className="text-stone-400 mt-0.5">
                        Actor: {evt.actor.name} ({evt.actor.role}) • Source: {evt.source}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-stone-400">
                      {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Link
                      href={`/admin/audit/${evt.id}`}
                      className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 hover:text-amber-400 hover:bg-stone-700 font-medium"
                    >
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
