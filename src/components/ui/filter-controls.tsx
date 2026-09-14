import * as React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterControlsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClear?: () => void;
}

export function FilterControls({
  options,
  selectedId,
  onSelect,
  onClear,
  className,
  children,
  ...props
}: FilterControlsProps) {
  const isFiltered = selectedId !== "all" && Boolean(selectedId);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1.5 mr-1 text-xs font-medium text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </div>

        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 rounded px-1 text-[10px]",
                    isSelected
                      ? "bg-black/20 text-white"
                      : "bg-background text-muted-foreground"
                  )}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}

        {isFiltered && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
