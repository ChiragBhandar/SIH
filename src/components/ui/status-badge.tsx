import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium border transition-colors select-none",
  {
    variants: {
      status: {
        success:
          "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300",
        warning:
          "border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300",
        error:
          "border-rose-200/80 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300",
        info:
          "border-sky-200/80 bg-sky-50 text-sky-800 dark:border-sky-800/40 dark:bg-sky-950/30 dark:text-sky-300",
        neutral:
          "border-slate-200 bg-slate-100/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
        honey:
          "border-amber-300/70 bg-amber-100/60 text-amber-950 dark:border-amber-700/50 dark:bg-amber-900/40 dark:text-amber-200",
      },
      size: {
        sm: "text-[11px] px-1.5 py-0.2",
        default: "text-xs px-2 py-0.5",
        lg: "text-sm px-2.5 py-1",
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
  error: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  honey: "bg-amber-600",
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  withDot?: boolean;
  pulse?: boolean;
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
  const activeStatus = status || "neutral";
  return (
    <div
      className={cn(statusBadgeVariants({ status: activeStatus, size }), className)}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dotColors[activeStatus]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[activeStatus]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
