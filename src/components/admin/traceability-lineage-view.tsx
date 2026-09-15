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
        return <Boxes className="w-4 h-4 text-amber-400" />;
      case "transfer":
      case "custody":
        return <ArrowLeftRight className="w-4 h-4 text-blue-400" />;
      case "receiving":
        return <PackageCheck className="w-4 h-4 text-purple-400" />;
      case "processing":
      case "processing_job":
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case "lab_test":
      case "quality":
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case "exception":
      case "plausibility":
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-stone-400" />;
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
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Traceability Context Lineage
        </h4>
        <span className="text-xs font-mono text-stone-400">
          {steps.length} Sequential Provenance Nodes
        </span>
      </div>

      <div className="relative border-l-2 border-stone-800 ml-4 pl-6 space-y-6">
        {steps.map((step, idx) => {
          const href = getEntityHref(step.entityType, step.entityId);
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Step indicator dot */}
              <div
                className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isLast
                    ? "bg-rose-950 border-rose-500 shadow-md shadow-rose-900/40"
                    : "bg-stone-900 border-stone-700"
                }`}
              >
                {getStepIcon(step.entityType)}
              </div>

              {/* Step card */}
              <div
                className={`rounded-xl border p-4 transition-all ${
                  isLast
                    ? "bg-rose-950/20 border-rose-900/40 shadow-sm"
                    : "bg-stone-900/80 border-stone-800 hover:border-stone-700"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300">
                      {step.step}
                    </span>
                    <h5 className="font-semibold text-stone-200 text-sm">{step.title}</h5>
                  </div>
                  <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {new Date(step.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed mb-3">{step.details}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/60 text-xs">
                  <div className="flex items-center gap-4 text-stone-400">
                    {step.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {step.location}
                      </span>
                    )}
                    {step.actor && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-stone-400" />
                        {step.actor}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ID: {step.entityId}
                    </span>
                    {href && (
                      <Link
                        href={href}
                        className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-0.5"
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
