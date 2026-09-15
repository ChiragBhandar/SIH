"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, StatusBadge, EventTypeBadge } from "@/components/admin";
import {
  History,
  Lock,
  ArrowLeft,
  ExternalLink,
  Layers,
  Key,
  Database,
  Fingerprint,
} from "lucide-react";

export default function AuditEventDetailPage() {
  const params = useParams();
  const eventId = typeof params?.id === "string" ? params.id : "";

  const { getAuditEvent } = useTraceability();
  const evt = getAuditEvent(eventId);

  if (!evt) {
    return (
      <AdminRoleGuard>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
          <History className="w-12 h-12 text-stone-600 mb-3" />
          <h2 className="text-xl font-bold text-stone-200">Audit Event Not Found</h2>
          <p className="text-stone-400 text-sm mt-1 mb-4">
            The requested audit record identifier ({eventId}) was not found in the immutable store.
          </p>
          <Link
            href="/admin/audit"
            className="px-4 py-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold"
          >
            &larr; Back to Audit History
          </Link>
        </div>
      </AdminRoleGuard>
    );
  }

  return (
    <AdminRoleGuard>
      <div className="space-y-6 pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Administration
              </Link>
              <span>/</span>
              <Link href="/admin/audit" className="hover:text-amber-400 transition-colors">
                Audit History
              </Link>
              <span>/</span>
              <span className="text-stone-300 font-mono">{evt.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-stone-100 tracking-tight font-mono">
                {evt.id}
              </h1>
              <EventTypeBadge type={evt.eventType} />
              <StatusBadge status={evt.status} variant="auditStatus" size="lg" />
            </div>
            <p className="text-stone-300 text-sm mt-1 font-medium">
              {evt.action}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/audit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Audit Events
            </Link>
          </div>
        </div>

        {/* Mandatory Append-Only Immutability Warning Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Append-only event
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Immutable State Proof
                </span>
              </div>
              <p className="text-stone-300 text-sm font-semibold leading-relaxed pt-1">
                This record represents an immutable historical event. Corrections are recorded as new events rather than overwriting history.
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                In strict adherence to the Honey Chain immutability protocol, historical audit events cannot be modified or deleted. Any administrative dispute, recalibration, or status update creates a new sequential cryptographic block linked to this parent hash.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Origin Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-amber-400" />
              Event Provenance & Actors
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Event ID:</span>
                <span className="font-mono font-bold text-amber-400">{evt.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Event Classification:</span>
                <span className="font-semibold text-stone-200">{evt.eventType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">System Source:</span>
                <span className="font-medium text-stone-200 px-2 py-0.5 rounded bg-stone-800">
                  {evt.source}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Recorded Timestamp:</span>
                <span className="font-mono text-stone-300">
                  {new Date(evt.timestamp).toLocaleString("en-GB", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Signing Actor:</span>
                <span className="font-semibold text-stone-200">
                  {evt.actor.name} ({evt.actor.role})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Organisation:</span>
                <Link
                  href={`/admin/organisations/${evt.organisation.id}`}
                  className="font-medium text-amber-400 hover:underline"
                >
                  {evt.organisation.name} ({evt.organisation.code})
                </Link>
              </div>
            </div>
          </div>

          {/* Linked Target Entity Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Associated Target Entity
            </h3>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Entity Type: {evt.entity.type}
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {evt.entity.id}
                </span>
              </div>
              <div className="text-sm font-semibold text-stone-200">
                {evt.entity.title}
              </div>

              {evt.entity.href && (
                <div className="pt-2">
                  <Link
                    href={evt.entity.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>Inspect Target Record in Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Detailed Action Summary
              </span>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                {evt.action}
              </p>
            </div>
          </div>
        </div>

        {/* Cryptographic Hash Chain Card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            Cryptographic Integrity & Hash Chain Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                Previous Block Hash (Parent Reference):
              </span>
              <span className="text-stone-300 break-all select-all font-semibold">
                {evt.previousEventHash}
              </span>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-emerald-500/30 space-y-1 shadow-sm shadow-emerald-950">
              <span className="text-[11px] text-emerald-400 block uppercase tracking-wider font-semibold">
                Current Block Digest (SHA-256):
              </span>
              <span className="text-emerald-300 break-all select-all font-semibold">
                {evt.currentEventHash}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata JSON Viewer */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Event Metadata Payload (Immutable Schema)
            </h3>
            <span className="text-xs font-mono text-stone-500">
              JSON Key-Value Structure
            </span>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 overflow-x-auto">
            <pre className="text-xs font-mono text-amber-300/90 leading-relaxed">
              {JSON.stringify(evt.metadata, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </AdminRoleGuard>
  );
}
