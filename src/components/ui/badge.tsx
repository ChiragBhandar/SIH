import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-tight",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow-xs font-medium",
        secondary:
          "border-border/80 bg-secondary text-secondary-foreground font-medium",
        destructive:
          "border-rose-200/90 bg-rose-50 text-rose-800",
        outline:
          "border-border bg-card/60 text-foreground",
        honey:
          "border-amber-200/90 bg-amber-50 text-amber-950",
        success:
          "border-emerald-200/90 bg-emerald-50 text-emerald-800",
        warning:
          "border-amber-200/90 bg-amber-50 text-amber-900",
        quarantine:
          "border-orange-200/90 bg-orange-50 text-orange-900",
        info:
          "border-sky-200/90 bg-sky-50 text-sky-800",
        neutral:
          "border-slate-200 bg-slate-100/80 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
