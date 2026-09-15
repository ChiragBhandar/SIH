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
  ChevronRight,
  ShieldCheck,
  Info,
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

export default function AuditEventDetailPage() {
  const params = useParams();
  const eventId = typeof params?.id === "string" ? params.id : "";

  const { getAuditEvent } = useTraceability();
  const evt = getAuditEvent(eventId);

  if (!evt) {
    return (
      <AdminRoleGuard>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
          <History className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h2 className="text-xl font-bold text-foreground">Audit Event Not Found</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 mb-4">
            The requested audit record identifier ({eventId}) was not found in the immutable store.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/audit">
              &larr; Back to Audit History
            </Link>
          </Button>
        </div>
      </AdminRoleGuard>
    );
  }

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
              <Link href="/admin/audit" className="hover:text-foreground transition-colors">
                Audit History
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-mono font-semibold">{evt.id}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
                {evt.id}
              </h1>
              <EventTypeBadge type={evt.eventType} />
              <StatusBadge status={evt.status} variant="auditStatus" size="sm" />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 font-medium">
              {evt.action}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/admin/audit">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Audit Events</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Append-Only Immutability Notice Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700">
                  Append-only event
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Immutable State Proof
                </span>
              </div>
              <p className="text-foreground text-xs sm:text-sm font-semibold leading-relaxed pt-0.5">
                This record represents an immutable historical event. Corrections are recorded as new events rather than overwriting history.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                In strict adherence to the Honey Chain immutability protocol, historical audit events cannot be modified or deleted. Any administrative dispute, recalibration, or status update creates a new sequential cryptographic block linked to this parent hash.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Identity & Origin Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Event Provenance & Actors
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Event ID:</span>
                <span className="font-mono font-bold text-amber-800 dark:text-amber-300">{evt.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Event Classification:</span>
                <span className="font-semibold text-foreground">{evt.eventType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">System Source:</span>
                <span className="font-medium text-foreground px-2 py-0.5 rounded bg-muted">
                  {evt.source}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Recorded Timestamp:</span>
                <span className="font-mono text-foreground">
                  {new Date(evt.timestamp).toLocaleString("en-GB", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Signing Actor:</span>
                <span className="font-semibold text-foreground">
                  {evt.actor.name} ({evt.actor.role})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Organisation:</span>
                <Link
                  href={`/admin/organisations/${evt.organisation.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {evt.organisation.name} ({evt.organisation.code})
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Linked Target Entity Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Associated Target Entity
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="bg-muted/30 p-3.5 rounded-lg border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Entity Type: {evt.entity.type}
                  </span>
                  <span className="font-mono text-xs text-amber-800 dark:text-amber-300 font-bold">
                    {evt.entity.id}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">
                  {evt.entity.title}
                </div>

                {evt.entity.href && (
                  <div className="pt-1.5">
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Link href={evt.entity.href}>
                        <span>Inspect Target Record in Application</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Detailed Action Summary
                </span>
                <p className="text-xs text-foreground/80 leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/60">
                  {evt.action}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cryptographic Hash Chain Card */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Cryptographic Integrity & Hash Chain Links
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-muted/30 p-3 rounded-lg border border-border/80 space-y-1">
                <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-semibold font-sans">
                  Previous Block Hash (Parent Reference):
                </span>
                <span className="text-foreground break-all select-all text-[11px]">
                  {evt.previousEventHash}
                </span>
              </div>

              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider font-semibold font-sans">
                  Current Block Digest (SHA-256):
                </span>
                <span className="text-emerald-800 dark:text-emerald-300 break-all select-all font-semibold text-[11px]">
                  {evt.currentEventHash}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata JSON Viewer */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Event Metadata Payload (Immutable Schema)
            </CardTitle>
            <span className="text-xs font-mono text-muted-foreground">
              JSON Structure
            </span>
          </CardHeader>

          <CardContent className="p-4">
            <div className="bg-muted/40 p-3.5 rounded-lg border border-border overflow-x-auto">
              <pre className="text-xs font-mono text-foreground leading-relaxed">
                {JSON.stringify(evt.metadata, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoleGuard>
  );
}
