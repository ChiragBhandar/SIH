"use client";

import * as React from "react";
import {
  AdminOrgStatus,
  ExceptionStatus,
  AccessRequestStatus,
  AuditEventType,
} from "@/types/admin";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Ban,
  Activity,
  AlertOctagon,
  Sparkles,
} from "lucide-react";

interface StatusBadgeProps {
  status?: AdminOrgStatus | ExceptionStatus | AccessRequestStatus | "verified" | "flagged" | "corrected" | "pending_review" | "Active" | "Disabled" | "Pending" | string;
  variant?: "org" | "severity" | "exceptionStatus" | "accessStatus" | "auditStatus" | "userStatus";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  variant = "org",
  className = "",
  size = "md",
}: StatusBadgeProps) {
  if (!status) return null;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  }[size];

  // Org status
  if (variant === "org") {
    switch (status) {
      case "Active":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-300 border border-stone-700 ${sizeClasses} ${className}`}>
            {status}
          </span>
        );
    }
  }

  // Severity
  if (variant === "severity") {
    switch (status.toLowerCase()) {
      case "low":
        return (
          <span className={`inline-flex items-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Low Severity
          </span>
        );
      case "medium":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3" />
            Medium
          </span>
        );
      case "high":
        return (
          <span className={`inline-flex items-center rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 ${sizeClasses} ${className}`}>
            <AlertOctagon className="w-3 h-3" />
            High Severity
          </span>
        );
      case "critical":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses} font-bold shadow-sm shadow-rose-950 ${className}`}>
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
            CRITICAL
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-300 ${sizeClasses} ${className}`}>
            {status}
          </span>
        );
    }
  }

  // Exception Status
  if (variant === "exceptionStatus") {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Open
          </span>
        );
      case "investigating":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <Activity className="w-3 h-3 animate-spin" />
            Investigating
          </span>
        );
      case "resolved":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}>
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-400 border border-stone-700 ${sizeClasses} ${className}`}>
            <XCircle className="w-3 h-3" />
            Dismissed
          </span>
        );
    }
  }

  // Access Request Status
  if (variant === "accessStatus") {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3" />
            Approved
          </span>
        );
      case "denied":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses} ${className}`}>
            <XCircle className="w-3 h-3" />
            Denied
          </span>
        );
      case "expired":
        return (
          <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-400 border border-stone-700 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Expired
          </span>
        );
    }
  }

  // User Status
  if (variant === "userStatus") {
    switch (status) {
      case "Active":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case "Disabled":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3" />
            Disabled
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  }

  // Audit Status
  if (variant === "auditStatus") {
    switch (status) {
      case "verified":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        );
      case "flagged":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3" />
            Flagged
          </span>
        );
      case "corrected":
        return (
          <span className={`inline-flex items-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 ${sizeClasses} ${className}`}>
            <Sparkles className="w-3 h-3" />
            Correction Event
          </span>
        );
      case "pending_review":
        return (
          <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-400 border border-stone-700 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-stone-800 text-stone-300 border border-stone-700 ${sizeClasses} ${className}`}>
      {status}
    </span>
  );
}

export function EventTypeBadge({ type }: { type: AuditEventType | string }) {
  const getStyle = (t: string) => {
    if (t.includes("Harvest") || t.includes("Batch") || t.includes("Apiary") || t.includes("Hive")) {
      return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    }
    if (t.includes("Custody") || t.includes("Receiving")) {
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    }
    if (t.includes("Processing")) {
      return "bg-purple-500/10 text-purple-300 border-purple-500/20";
    }
    if (t.includes("Laboratory") || t.includes("Certification")) {
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
    }
    if (t.includes("Bottle")) {
      return "bg-teal-500/10 text-teal-300 border-teal-500/20";
    }
    if (t.includes("Marketplace")) {
      return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
    }
    if (t.includes("Exception")) {
      return "bg-rose-500/10 text-rose-300 border-rose-500/20";
    }
    if (t.includes("Administrative") || t.includes("Role") || t.includes("Access")) {
      return "bg-amber-600/15 text-amber-200 border-amber-600/30";
    }
    return "bg-stone-800 text-stone-300 border-stone-700";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle(type)}`}>
      {type}
    </span>
  );
}
