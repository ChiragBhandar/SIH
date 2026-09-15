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
          <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Suspended
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
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
          <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Low Severity
          </span>
        );
      case "medium":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Medium
          </span>
        );
      case "high":
        return (
          <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800 ${sizeClasses} ${className}`}>
            <AlertOctagon className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            High Severity
          </span>
        );
      case "critical":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
            CRITICAL
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
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
          <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Open
          </span>
        );
      case "investigating":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <Activity className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-spin" />
            Investigating
          </span>
        );
      case "resolved":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
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
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Approved
          </span>
        );
      case "denied":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}>
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Denied
          </span>
        );
      case "expired":
        return (
          <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
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
          <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "Disabled":
        return (
          <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Disabled
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
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
          <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Verified
          </span>
        );
      case "flagged":
        return (
          <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Flagged
          </span>
        );
      case "corrected":
        return (
          <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800 ${sizeClasses} ${className}`}>
            <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            Correction Event
          </span>
        );
      case "pending_review":
        return (
          <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-muted text-muted-foreground border border-border ${sizeClasses} ${className}`}>
      {status}
    </span>
  );
}

export function EventTypeBadge({ type }: { type: AuditEventType | string }) {
  const getStyle = (t: string) => {
    if (t.includes("Harvest") || t.includes("Batch") || t.includes("Apiary") || t.includes("Hive")) {
      return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    }
    if (t.includes("Custody") || t.includes("Receiving")) {
      return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    }
    if (t.includes("Processing")) {
      return "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    }
    if (t.includes("Laboratory") || t.includes("Certification")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (t.includes("Bottle")) {
      return "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800";
    }
    if (t.includes("Marketplace")) {
      return "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
    }
    if (t.includes("Exception")) {
      return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    }
    if (t.includes("Administrative") || t.includes("Role") || t.includes("Access")) {
      return "bg-amber-100/70 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle(type)}`}>
      {type}
    </span>
  );
}
