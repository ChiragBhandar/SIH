"use client";

import * as React from "react";
import { MarketplaceListingStatus, MarketplaceOrderStatus } from "@/types/marketplace";
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, Tag, Ban } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function ListingStatusBadge({
  status,
  className = "",
}: {
  status: MarketplaceListingStatus;
  className?: string;
}) {
  const { trStatus } = useLanguage();
  const base = "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold gap-1.5 transition-colors select-none tracking-tight";

  switch (status) {
    case "Active":
      return (
        <span className={`${base} bg-emerald-50 text-emerald-800 border-emerald-200/90 ${className}`}>
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          {trStatus("Active")}
        </span>
      );
    case "Reserved":
      return (
        <span className={`${base} bg-amber-50 text-amber-900 border-amber-200/90 ${className}`}>
          <Clock className="h-3 w-3 text-amber-600" />
          {trStatus("Reserved")}
        </span>
      );
    case "Draft":
      return (
        <span className={`${base} bg-slate-100/80 text-slate-700 border-slate-200 ${className}`}>
          <Tag className="h-3 w-3 text-slate-500" />
          {trStatus("Draft")}
        </span>
      );
    case "Sold":
      return (
        <span className={`${base} bg-sky-50 text-sky-800 border-sky-200/90 ${className}`}>
          <ShieldCheck className="h-3 w-3 text-sky-600" />
          {trStatus("Sold Out")}
        </span>
      );
    case "Suspended":
      return (
        <span className={`${base} bg-rose-50 text-rose-800 border-rose-200/90 ${className}`}>
          <Ban className="h-3 w-3 text-rose-600" />
          {trStatus("Suspended")}
        </span>
      );
    case "Expired":
      return (
        <span className={`${base} bg-slate-100/80 text-slate-700 border-slate-200 ${className}`}>
          <AlertTriangle className="h-3 w-3 text-slate-500" />
          {trStatus("Expired")}
        </span>
      );
    default:
      return (
        <span className={`${base} bg-slate-100/80 text-slate-700 border-slate-200 ${className}`}>
          {trStatus(status)}
        </span>
      );
  }
}

export function OrderStatusBadge({
  status,
  className = "",
}: {
  status: MarketplaceOrderStatus;
  className?: string;
}) {
  const { trStatus } = useLanguage();
  const base = "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold gap-1.5 transition-colors select-none tracking-tight";

  switch (status) {
    case "Pending":
      return (
        <span className={`${base} bg-amber-50 text-amber-900 border-amber-200/90 ${className}`}>
          <Clock className="h-3 w-3 text-amber-600" />
          {trStatus("Pending")}
        </span>
      );
    case "Accepted":
      return (
        <span className={`${base} bg-emerald-50 text-emerald-800 border-emerald-200/90 ${className}`}>
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          {trStatus("Accepted")}
        </span>
      );
    case "Fulfilled":
      return (
        <span className={`${base} bg-sky-50 text-sky-800 border-sky-200/90 ${className}`}>
          <ShieldCheck className="h-3 w-3 text-sky-600" />
          {trStatus("Fulfilled")}
        </span>
      );
    case "Rejected":
      return (
        <span className={`${base} bg-rose-50 text-rose-800 border-rose-200/90 ${className}`}>
          <XCircle className="h-3 w-3 text-rose-600" />
          {trStatus("Rejected")}
        </span>
      );
    case "Cancelled":
      return (
        <span className={`${base} bg-slate-100/80 text-slate-700 border-slate-200 ${className}`}>
          <Ban className="h-3 w-3 text-slate-500" />
          {trStatus("Cancelled")}
        </span>
      );
    default:
      return (
        <span className={`${base} bg-slate-100/80 text-slate-700 border-slate-200 ${className}`}>
          {trStatus(status)}
        </span>
      );
  }
}
