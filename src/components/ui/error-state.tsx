import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  compact = false,
  className,
  ...props
}: ErrorStateProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-md border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-6 px-2 text-xs text-rose-900 hover:bg-rose-100 dark:text-rose-200"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50/30 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h4 className="mt-3 text-sm font-semibold text-rose-900 dark:text-rose-200">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-xs text-rose-700/90 dark:text-rose-300/80">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5 border-rose-200 text-rose-900 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
