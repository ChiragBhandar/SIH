import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold border transition-colors select-none tracking-tight",
  {
    variants: {
      status: {
        success:
          "border-emerald-200/90 bg-emerald-50 text-emerald-800",
        warning:
          "border-amber-200/90 bg-amber-50 text-amber-900",
        quarantine:
          "border-orange-200/90 bg-orange-50 text-orange-900",
        error:
          "border-rose-200/90 bg-rose-50 text-rose-800",
        info:
          "border-sky-200/90 bg-sky-50 text-sky-800",
        neutral:
          "border-slate-200/90 bg-slate-100/80 text-slate-700",
        honey:
          "border-amber-300/80 bg-amber-100/60 text-amber-950",
        purple:
          "border-purple-200/90 bg-purple-50 text-purple-800",
        teal:
          "border-teal-200/90 bg-teal-50 text-teal-800",
        indigo:
          "border-indigo-200/90 bg-indigo-50 text-indigo-800",
      },
      size: {
        sm: "text-[11px] px-1.5 py-0.25 gap-1",
        default: "text-xs px-2 py-0.5 gap-1.5",
        lg: "text-xs sm:text-sm px-2.5 py-1 gap-2",
      },
    },
    defaultVariants: {
      status: "neutral",
      size: "default",
    },
  }
);

const dotColors = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  quarantine: "bg-orange-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  honey: "bg-amber-600",
  purple: "bg-purple-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
};

export type SemanticStatus =
  | "success"
  | "warning"
  | "quarantine"
  | "error"
  | "info"
  | "neutral"
  | "honey"
  | "purple"
  | "teal"
  | "indigo";

/** Normalize common string states to our semantic status keys */
export function normalizeStatus(rawStatus?: string | null): SemanticStatus {
  if (!rawStatus) return "neutral";
  const s = rawStatus.toLowerCase().trim();

  if (
    s === "active" ||
    s === "healthy" ||
    s === "verified" ||
    s === "approved" ||
    s === "resolved" ||
    s === "passed" ||
    s === "completed" ||
    s === "active & laying" ||
    s === "laying" ||
    s === "ready"
  ) {
    return "success";
  }

  if (
    s === "quarantine" ||
    s === "flagged" ||
    s === "high" ||
    s === "high severity"
  ) {
    return "quarantine";
  }

  if (
    s === "warning" ||
    s === "pending" ||
    s === "pending_review" ||
    s === "monitoring" ||
    s === "investigating" ||
    s === "supersedure" ||
    s === "requeening needed" ||
    s === "medium" ||
    s === "in_qc" ||
    s === "under_review"
  ) {
    return "warning";
  }

  if (
    s === "error" ||
    s === "critical" ||
    s === "failed" ||
    s === "suspended" ||
    s === "denied" ||
    s === "disabled" ||
    s === "rejected" ||
    s === "open" ||
    s === "queenless" ||
    s === "inactive"
  ) {
    return "error";
  }

  if (
    s === "info" ||
    s === "in_transit" ||
    s === "transferred" ||
    s === "virgin" ||
    s === "treated" ||
    s === "low" ||
    s === "correction" ||
    s === "corrected"
  ) {
    return "info";
  }

  if (
    s === "processing" ||
    s === "blended" ||
    s === "filtered" ||
    s === "pasteurized" ||
    s === "homogenized"
  ) {
    return "purple";
  }

  if (s === "bottled" || s === "packaged") {
    return "teal";
  }

  if (s === "listed" || s === "order" || s === "order_placed") {
    return "indigo";
  }

  if (s === "honey" || s === "harvested" || s === "raw" || s === "organic") {
    return "honey";
  }

  return "neutral";
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof statusBadgeVariants>, "status"> {
  withDot?: boolean;
  pulse?: boolean;
  status?: SemanticStatus | string;
  size?: "sm" | "default" | "lg" | null;
}

export function StatusBadge({
  children,
  status = "neutral",
  size = "default",
  withDot = true,
  pulse = false,
  className,
  ...props
}: StatusBadgeProps) {
  const resolvedStatus: SemanticStatus = (
    [
      "success",
      "warning",
      "quarantine",
      "error",
      "info",
      "neutral",
      "honey",
      "purple",
      "teal",
      "indigo",
    ].includes(status as string)
      ? status
      : normalizeStatus(status as string)
  ) as SemanticStatus;

  const dotColorClass = dotColors[resolvedStatus] || dotColors.neutral;

  return (
    <div
      className={cn(statusBadgeVariants({ status: resolvedStatus, size }), className)}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dotColorClass
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColorClass
            )}
          />
        </span>
      )}
      <span className="truncate">{children}</span>
    </div>
  );
}
