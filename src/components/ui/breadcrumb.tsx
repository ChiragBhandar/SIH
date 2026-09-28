"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  const { trNav, trTerm } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const navTranslated = trNav(item.label);
          const displayLabel = navTranslated !== item.label ? navTranslated : trTerm(item.label);

          return (
            <li key={index} className="flex items-center space-x-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              )}
              {item.active || isLast ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px]"
                  aria-current="page"
                >
                  {displayLabel}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[150px]"
                >
                  {displayLabel}
                </a>
              ) : (
                <span className="truncate max-w-[150px]">{displayLabel}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
