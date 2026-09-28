"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingState({
  message,
  size = "default",
  className,
  ...props
}: LoadingStateProps) {
  const { tr } = useLanguage();
  const effectiveMessage = message !== undefined ? message : tr("Loading...", "लोड हो रहा है...");

  const sizeMap = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-muted-foreground",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {effectiveMessage && <p className="mt-2 text-xs font-medium text-muted-foreground">{effectiveMessage}</p>}
    </div>
  );
}

