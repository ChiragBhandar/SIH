"use client";

import * as React from "react";
import Link from "next/link";
import { LineageTraceStep } from "@/types/admin";
import {
  Boxes,
  ArrowLeftRight,
  PackageCheck,
  Layers,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  User,
} from "lucide-react";

interface TraceabilityLineageViewProps {
  steps: LineageTraceStep[];
  className?: string;
}

export function TraceabilityLineageView({ steps, className = "" }: TraceabilityLineageViewProps) {
  if (!steps || steps.length === 0) return null;

  const getStepIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case "apiary":
      case "hive":
      case "activity":
      case "batch":
        return <Boxes className="w-3.5 h-3.5 text-amber-600" />;
      case "transfer":
      case "custody":
        return <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />;
      case "receiving":
        return <PackageCheck className="w-3.5 h-3.5 text-purple-600" />;
      case "processing":
      case "processing_job":
        return <Layers className="w-3.5 h-3.5 text-indigo-600" />;
      case "lab_test":
      case "quality":
        return <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />;
      case "exception":
      case "plausibility":
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getEntityHref = (entityType: string, entityId: string) => {
    switch (entityType.toLowerCase()) {
      case "batch":
        return `/batches/${entityId}`;
      case "transfer":
        return `/custody/${entityId}`;
      case "receiving":
        return `/receiving`;
      case "processing_job":
      case "processing":
        return `/processing/${entityId}`;
      case "lab_test":
        return `/lab/${entityId}`;
      case "hive":
        return `/hives/${entityId}`;
      case "apiary":
        return `/hives`;
      default:
        return undefined;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Traceability Context Lineage
        </h4>
        <span className="text-xs font-mono text-muted-foreground">
          {steps.length} Sequential Provenance Nodes
        </span>
      </div>

      <div className="relative border-l-2 border-border ml-3.5 pl-5 space-y-4">
        {steps.map((step, idx) => {
          const href = getEntityHref(step.entityType, step.entityId);
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Step indicator dot */}
              <div
                className={`absolute -left-[29px] top-1.5 w-5 h-5 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isLast
                    ? "bg-rose-50 border-rose-400 shadow-xs"
                    : "bg-card border-border shadow-xs"
                }`}
              >
                {getStepIcon(step.entityType)}
              </div>

              {/* Step card */}
              <div
                className={`rounded-xl border p-3.5 transition-all ${
                  isLast
                    ? "bg-rose-50/40 border-rose-200 shadow-xs"
                    : "bg-card border-border/80 hover:border-border shadow-xs"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                      {step.step}
                    </span>
                    <h5 className="font-semibold text-foreground text-xs sm:text-sm">{step.title}</h5>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {new Date(step.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed mb-2.5">{step.details}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                    {step.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {step.location}
                      </span>
                    )}
                    {step.actor && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {step.actor}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      ID: {step.entityId}
                    </span>
                    {href && (
                      <Link
                        href={href}
                        className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Inspect Record &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
