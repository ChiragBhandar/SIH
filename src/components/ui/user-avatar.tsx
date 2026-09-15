"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconClassName?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
};

const iconSizeClasses = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

export function UserAvatar({
  src,
  alt,
  name,
  size = "md",
  className,
  iconClassName,
  ...props
}: UserAvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const hasValidImage = Boolean(src && !imageError);
  const accessibleLabel = alt || name || "User profile";

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-muted/60 border border-border/80 text-muted-foreground transition-colors overflow-hidden select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {hasValidImage ? (
        <img
          src={src!}
          alt={accessibleLabel}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover rounded-full"
        />
      ) : (
        <User
          className={cn(
            "stroke-[1.75] text-slate-600",
            iconSizeClasses[size],
            iconClassName
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
