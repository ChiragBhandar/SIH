import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingState({
  message = "Loading...",
  size = "default",
  className,
  ...props
}: LoadingStateProps) {
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
      {message && <p className="mt-2 text-xs font-medium text-muted-foreground">{message}</p>}
    </div>
  );
}
