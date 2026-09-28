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
import { useLanguage } from "@/context/language-context";

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
  const { trStatus, trTerm } = useLanguage();
  if (!status) return null;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold gap-1",
    md: "px-2.5 py-0.5 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1 text-xs sm:text-sm font-semibold gap-2",
  }[size];

  // Org status
  if (variant === "org") {
    switch (status) {
      case "Active":
        return (
          <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {trStatus("Active")}
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600" />
            {trStatus("Pending")}
          </span>
        );
      case "Suspended":
        return (
          <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/90 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3 text-rose-600" />
            {trStatus("Suspended")}
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
            {trStatus(status)}
          </span>
        );
    }
  }

  // Severity
  if (variant === "severity") {
    switch (status.toLowerCase()) {
      case "low":
        return (
          <span className={`inline-flex items-center rounded-md bg-sky-50 text-sky-800 border border-sky-200/90 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            {trStatus("Low Severity")}
          </span>
        );
      case "medium":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {trStatus("Medium")}
          </span>
        );
      case "high":
        return (
          <span className={`inline-flex items-center rounded-md bg-orange-50 text-orange-900 border border-orange-200/90 ${sizeClasses} ${className}`}>
            <AlertOctagon className="w-3 h-3 text-orange-600" />
            {trStatus("High Severity")}
          </span>
        );
      case "critical":
        return (
          <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/90 font-bold ${sizeClasses} ${className}`}>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            {trStatus("CRITICAL")}
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
            {trStatus(status)}
          </span>
        );
    }
  }

  // Exception Status
  if (variant === "exceptionStatus") {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/90 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            {trStatus("Open")}
          </span>
        );
      case "investigating":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <Activity className="w-3 h-3 text-amber-600 animate-spin" />
            {trStatus("Investigating")}
          </span>
        );
      case "resolved":
        return (
          <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 ${sizeClasses} ${className}`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {trStatus("Resolved")}
          </span>
        );
      case "dismissed":
        return (
          <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
            <XCircle className="w-3 h-3" />
            {trStatus("Dismissed")}
          </span>
        );
    }
  }

  // Access Request Status
  if (variant === "accessStatus") {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600" />
            {trStatus("Pending Review")}
          </span>
        );
      case "approved":
        return (
          <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {trStatus("Approved")}
          </span>
        );
      case "denied":
        return (
          <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/90 ${sizeClasses} ${className}`}>
            <XCircle className="w-3 h-3 text-rose-600" />
            {trStatus("Denied") || trTerm("Denied")}
          </span>
        );
      case "expired":
        return (
          <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            {trStatus("Expired")}
          </span>
        );
    }
  }

  // User Status
  if (variant === "userStatus") {
    switch (status) {
      case "Active":
        return (
          <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {trStatus("Active")}
          </span>
        );
      case "Disabled":
        return (
          <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-200/90 ${sizeClasses} ${className}`}>
            <Ban className="w-3 h-3 text-rose-600" />
            {trStatus("Disabled")}
          </span>
        );
      case "Pending":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3 text-amber-600" />
            {trStatus("Pending")}
          </span>
        );
    }
  }

  // Audit Status
  if (variant === "auditStatus") {
    switch (status) {
      case "verified":
        return (
          <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 ${sizeClasses} ${className}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {trStatus("Verified")}
          </span>
        );
      case "flagged":
        return (
          <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/90 ${sizeClasses} ${className}`}>
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {trStatus("Flagged")}
          </span>
        );
      case "corrected":
        return (
          <span className={`inline-flex items-center rounded-md bg-sky-50 text-sky-800 border border-sky-200/90 ${sizeClasses} ${className}`}>
            <Sparkles className="w-3 h-3 text-sky-600" />
            {trTerm("Correction Event")}
          </span>
        );
      case "pending_review":
        return (
          <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
            <Clock className="w-3 h-3" />
            {trStatus("Pending Review")}
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center rounded-md bg-slate-100/80 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
      {trStatus(status)}
    </span>
  );
}

export function EventTypeBadge({ type }: { type: AuditEventType | string }) {
  const { trEventType } = useLanguage();
  const getStyle = (t: string) => {
    if (t.includes("Harvest") || t.includes("Batch") || t.includes("Apiary") || t.includes("Hive")) {
      return "bg-amber-50 text-amber-900 border-amber-200/90";
    }
    if (t.includes("Custody") || t.includes("Receiving")) {
      return "bg-sky-50 text-sky-800 border-sky-200/90";
    }
    if (t.includes("Processing")) {
      return "bg-purple-50 text-purple-800 border-purple-200/90";
    }
    if (t.includes("Laboratory") || t.includes("Certification")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200/90";
    }
    if (t.includes("Bottle")) {
      return "bg-teal-50 text-teal-800 border-teal-200/90";
    }
    if (t.includes("Marketplace")) {
      return "bg-indigo-50 text-indigo-800 border-indigo-200/90";
    }
    if (t.includes("Exception")) {
      return "bg-rose-50 text-rose-800 border-rose-200/90";
    }
    if (t.includes("Administrative") || t.includes("Role") || t.includes("Access")) {
      return "bg-amber-100/70 text-amber-950 border-amber-300/80";
    }
    return "bg-slate-100/80 text-slate-700 border-slate-200";
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getStyle(type)}`}>
      {trEventType(type)}
    </span>
  );
}
