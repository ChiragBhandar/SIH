"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export interface SearchFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, value, onChange, onClear, placeholder, ...props }, ref) => {
    const { tr } = useLanguage();
    const hasValue = Boolean(value);
    const effectivePlaceholder = placeholder !== undefined ? placeholder : tr("Search...", "खोजें...");

    return (
      <div className={cn("relative flex items-center w-full max-w-sm", className)}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={effectivePlaceholder}
          className={cn(
            "h-9.5 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-xs sm:text-sm text-foreground shadow-2xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
            aria-label={tr("Clear search", "खोज साफ़ करें")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
SearchField.displayName = "SearchField";

